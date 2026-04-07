// src/app/api/whatsapp/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { canPermission } from '@/utils/permissions/canPermission';
import { getChatbotConfig } from '@/app/(panel)/dashboard/chatbot/_data-access/get-config';
import { createNewOrder } from '@/app/(public)/empresa/[id]/_actions/create-order';
import { getInfoStore } from '@/app/(public)/empresa/[id]/_data-access/get-info-store';
import OpenAI from 'openai';

// Interface ajustada para Delivery
interface GPTResponseDefault {
    reply: string;
    action: null;
}

interface GPTResponseCreateOrder {
    reply: string;
    action: 'create_order';
    data: {
        name: string;
        phone: string;
        address: string;
        items: {
            productId: string;
            quantity: number;
        }[];
    };
}

type GPTResponse = GPTResponseDefault | GPTResponseCreateOrder;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function getGPTResponse(prompt: string, personality: string, context: any): Promise<GPTResponse> {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: `Você é um atendente de delivery com a personalidade: "${personality}". 
                    O cardápio da empresa é: ${JSON.stringify(context.products)}.
                    Sua tarefa é anotar o pedido. Quando o cliente escolher os produtos e fornecer o NOME, TELEFONE e ENDEREÇO DE ENTREGA, retorne um JSON com a ação 'create_order'.
                    Se faltar algo, continue conversando de forma amigável. 
                    Importante: O campo 'items' deve conter o ID do produto e a quantidade.`,
                },
                { role: 'user', content: prompt },
            ],
            response_format: { type: "json_object" },
        });

        return JSON.parse(response.choices[0].message.content as string);
    } catch (err) {
        console.error('Erro GPT:', err);
        return { reply: "Erro técnico, tente novamente.", action: null };
    }
}

// Função de envio (Mantenha sua lógica da Evolution API aqui)
async function sendWhatsAppMessage(number: string, message: string) {
    // ... (sua lógica de fetch para a Evolution API permanece a mesma)
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { instanceName, message, clientNumber, fromMe } = body;

    if (fromMe) return NextResponse.json({ success: true });
    
    const userId = instanceName;
    const permission = await canPermission({ type: 'chatbot' });
    const config = await getChatbotConfig({ userId });
    
    if (!permission.hasPermission || !config?.enabled) {
        return NextResponse.json({ success: false, message: 'Chatbot off.' });
    }

    const empresa = await getInfoStore({ userId });
    if (!empresa) return NextResponse.json({ success: false });

    // Chamada ao GPT enviando os PRODUTOS em vez de horários
    const gptResponse = await getGPTResponse(message, config.personality, {
        products: empresa.products,
        name: empresa.name,
    });
    
    if (gptResponse.action === 'create_order') {
        const { name, phone, address, items } = gptResponse.data;

        // Calcula o preço total no servidor para segurança
        const totalPrice = items.reduce((acc, item) => {
            const product = empresa.products.find(p => p.id === item.productId);
            return acc + (product ? product.price * item.quantity : 0);
        }, 0);

        const newOrder = await createNewOrder({
            empresaId: userId,
            name,
            phone,
            address,
            items,
            totalPrice
        });
        
        if (newOrder.error) {
            await sendWhatsAppMessage(clientNumber, "Houve um problema ao processar seu pedido no sistema.");
        } else {
            await sendWhatsAppMessage(clientNumber, `✅ Pedido confirmado, ${name}! Ele será entregue em: ${address}. Valor total: R$ ${(totalPrice/100).toFixed(2)}`);
        }
    } else {
        await sendWhatsAppMessage(clientNumber, gptResponse.reply);
    }

    return NextResponse.json({ success: true });
}
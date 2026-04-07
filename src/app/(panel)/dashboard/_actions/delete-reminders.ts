"use server"

import prisma from  "@/lib/prisma"
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

// Atualizado para refletir que estamos lidando com uma anotação/lembrete da loja
const formSchema = z.object({
    reminderId: z.string({ 
        errorMap: () => ({ message: "O id da anotação é obrigatório" }) 
    }).min(1, "O id da anotação é obrigatório")
})

type FormSchema = z.infer<typeof formSchema>

export async function deleteReminder(formData: FormSchema) {
    const schema = formSchema.safeParse(formData)

    if (!schema.success) {
        return {
            error: schema.error.issues[0].message
        }
    }

    try {
        // Mantendo o modelo 'reminder' do seu banco de dados atual
        await prisma.reminder.delete({
            where: {
                id: formData.reminderId
            }
        })

        revalidatePath("/dashboard")

        return {
            data: "Anotação removida com sucesso!"
        }

    } catch (err) {
        return {
            error: "Não foi possível remover a anotação."
        }
    }
}
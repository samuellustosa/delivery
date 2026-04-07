"use server"

import prisma from "@/lib/prisma"

/**
 * Busca o horário de funcionamento da loja.
 * No delivery, isso pode ser usado para mostrar ao cliente se a loja está operando.
 */
export async function getStoreOperatingHours({ userId }: { userId: string }) {

  if (!userId) {
    return {
      times: [],
      userId: "",
    }
  }

  try {
    // Busca os dados do usuário (Dono da loja)
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      },
      select: {
        id: true,
        times: true, // Mantemos o campo 'times' para representar o horário de operação
      }
    })

    if (!user) {
      return {
        times: [],
        userId: "",
      }
    }

    return {
      times: user.times, // Retorna a lista de horas em que o delivery aceita pedidos
      userId: user.id
    }

  } catch (err) {
    console.log("Erro ao buscar horários da loja:", err);
    return {
      times: [],
      userId: "",
    }
  }
}
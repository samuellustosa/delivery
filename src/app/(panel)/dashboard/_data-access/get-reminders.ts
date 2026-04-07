"use server"

import prisma from '@/lib/prisma'

/**
 * Busca todas as anotações/lembretes internos de um lojista específico.
 * Mantemos o uso da tabela 'reminder' conforme definido no seu schema.
 */
export async function getReminders({ userId }: { userId: string }) {

  if (!userId) {
    return []
  }

  try {
    const reminders = await prisma.reminder.findMany({
      where: {
        userId: userId
      },
      // Ordena pelas mais recentes primeiro, útil para o lojista se organizar
      orderBy: {
        createdAt: 'desc'
      }
    })

    return reminders;

  } catch (err) {
    console.log("Erro ao buscar anotações da loja:", err);
    return []
  }
}
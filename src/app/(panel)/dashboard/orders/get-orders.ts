import { db } from "@/lib/prisma"

export async function getOrders(companyId: string) {
  return await db.order.findMany({
    where: {
      companyId: companyId,
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}
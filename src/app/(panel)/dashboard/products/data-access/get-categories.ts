import { db } from "@/lib/prisma"

export async function getCategories(companyId: string) {
  return await db.category.findMany({
    where: { companyId },
    orderBy: { name: 'asc' }
  })
}
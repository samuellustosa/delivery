"use server"

import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createProduct(data: {
  name: string
  description?: string
  price: number
  categoryId: string
  companyId: string
}) {
  await db.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
      companyId: data.companyId,
    }
  })

  revalidatePath("/dashboard/products")
}
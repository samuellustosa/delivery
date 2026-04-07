"use server"

import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createCategory(name: string, companyId: string) {
  await db.category.create({
    data: {
      name,
      companyId
    }
  })
  revalidatePath("/dashboard/products")
}
"use server"

import { db } from "@/lib/prisma"
import { OrderStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await db.order.update({
    where: { id: orderId },
    data: { status }
  })

  revalidatePath("/dashboard/orders")
}
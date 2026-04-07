"use server"

import { db } from "@/lib/prisma"

export async function createOrder(data: {
  customerName: string
  customerPhone: string
  address: string
  paymentMethod: string
  companyId: string
  items: { productId: string; quantity: number; price: number }[]
  totalValue: number
}) {
  const order = await db.order.create({
    data: {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      address: data.address,
      paymentMethod: data.paymentMethod,
      totalValue: data.totalValue,
      companyId: data.companyId,
      items: {
        create: data.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    },
    include: { company: true }
  })

  // Gerar link do WhatsApp para o dono da loja
  const itemsSummary = "Novo Pedido!\n" + data.items.map(i => `${i.quantity}x - R$ ${i.price}`).join("\n")
  const message = encodeURIComponent(
    `${itemsSummary}\n\nTotal: R$ ${data.totalValue}\nCliente: ${data.customerName}\nEndereço: ${data.address}`
  )
  const whatsappUrl = `https://wa.me/${order.company.phone}?text=${message}`

  return { success: true, whatsappUrl }
}
"use client"

import { useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createOrder } from "../_actions/create-order"

export function CheckoutDialog({ companyId }: { companyId: string }) {
  const cart = useCart()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    const result = await createOrder({
      customerName: formData.get("name") as string,
      customerPhone: formData.get("phone") as string,
      address: formData.get("address") as string,
      paymentMethod: formData.get("payment") as string,
      companyId,
      totalValue: cart.totalPrice(),
      items: cart.items.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price }))
    })

    if (result.success) {
      cart.clearCart()
      window.open(result.whatsappUrl, "_blank")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <Label>Nome</Label>
        <Input name="name" required placeholder="Seu nome" />
      </div>
      <div>
        <Label>WhatsApp</Label>
        <Input name="phone" required placeholder="(86) 99999-9999" />
      </div>
      <div>
        <Label>Endereço de Entrega</Label>
        <Input name="address" required placeholder="Rua, número, bairro" />
      </div>
      <div>
        <Label>Forma de Pagamento</Label>
        <select name="payment" className="w-full border rounded-md p-2">
          <option value="PIX">Pix</option>
          <option value="CARD">Cartão</option>
          <option value="CASH">Dinheiro</option>
        </select>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Enviando..." : "Finalizar Pedido"}
      </Button>
    </form>
  )
}
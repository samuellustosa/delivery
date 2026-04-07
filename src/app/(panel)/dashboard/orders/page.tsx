import { db } from "@/lib/prisma"
import { OrderList } from "./_components/order-list"
import { ShoppingBag } from "lucide-react"

export default async function OrdersPage() {
  // Buscando os pedidos do banco de dados
  const orders = await db.order.findMany({
    include: {
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <ShoppingBag className="text-orange-500" />
        <h1 className="text-2xl font-bold">Monitor de Pedidos</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-lg border-2 border-dashed">
          <p className="text-slate-500">Nenhum pedido recebido ainda.</p>
        </div>
      ) : (
        <OrderList orders={orders} />
      )}
    </div>
  )
}
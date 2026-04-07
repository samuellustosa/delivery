"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { updateOrderStatus } from "../_actions/update-order-status"

export function OrderList({ orders }: { orders: any[] }) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold">
              Pedido #{order.displayId}
            </CardTitle>
            <Badge variant={order.status === 'PENDING' ? 'destructive' : 'default'}>
              {order.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground mb-4">
              {order.customerName} - {order.customerPhone}
            </div>
            <div className="space-y-1">
              {order.items.map((item: any) => (
                <div key={item.id} className="text-sm flex justify-between">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span>R$ {item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-2 font-bold flex justify-between">
              <span>Total:</span>
              <span>R$ {order.totalValue.toFixed(2)}</span>
            </div>
            <div className="flex gap-2 mt-4">
              {order.status === 'PENDING' && (
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                >
                  Aceitar Pedido
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
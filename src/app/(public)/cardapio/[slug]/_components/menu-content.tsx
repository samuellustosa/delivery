"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { CheckoutDialog } from "./checkout-dialog"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export default function MenuContent({ company }: { company: any }) {
  const cart = useCart()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24">
      {/* Header da Loja */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">{company.name}</h1>
        <p className="text-muted-foreground">{company.description}</p>
        <Badge variant="outline" className="mt-2">
          {company.openTime} - {company.closeTime}
        </Badge>
      </div>

      {/* Categorias e Produtos */}
      {company.categories.map((category: any) => (
        <div key={category.id} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">{category.name}</h2>
          <div className="grid gap-4">
            {category.products.map((product: any) => (
              <Card 
                key={product.id} 
                className="overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => cart.addItem(product)}
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-bold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    <p className="text-primary font-bold mt-2">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                    </p>
                  </div>
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.name} className="w-20 h-20 rounded-md object-cover ml-4" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Botão Flutuante do Carrinho */}
      {cart.items.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
          <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
            <DialogTrigger asChild>
              <button className="w-full bg-primary text-primary-foreground py-4 rounded-full font-bold shadow-lg flex justify-between px-8 animate-in fade-in slide-in-from-bottom-4">
                <span className="flex gap-2 items-center">
                  <Badge variant="secondary" className="rounded-full h-6 w-6 flex items-center justify-center p-0">
                    {cart.totalItems()}
                  </Badge>
                  Ver Sacola
                </span>
                <span>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cart.totalPrice())}
                </span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
                <div className="p-6 bg-primary text-primary-foreground">
                    <h2 className="text-xl font-bold">Finalizar Pedido</h2>
                    <p className="text-sm opacity-90">Preencha os dados abaixo para entregar</p>
                </div>
                <CheckoutDialog companyId={company.id} />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}
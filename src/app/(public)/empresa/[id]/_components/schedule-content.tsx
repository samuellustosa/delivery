"use client"

import { useState } from 'react'
import Image from "next/image"
import imgTest from '../../../../../../public/foto1.jpg'
import { MapPin, ShoppingBag, Plus, Minus } from "lucide-react"
import { Prisma } from "@/generated/prisma"
import { useForm } from "react-hook-form" // Simplificado para o checkout
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { formatPhone } from '@/utils/formatPhone'
import { formatCurrency } from '@/utils/formatCurrency'
import { createNewOrder } from '../_actions/create-order' // Nova action
import { toast } from 'sonner'

type UserWithProducts = Prisma.UserGetPayload<{
  include: {
    products: { include: { category: true } },
  }
}>

interface StoreContentProps {
  empresa: UserWithProducts
}

export function StoreContent({ empresa }: StoreContentProps) {
  const [cart, setCart] = useState<{ productId: string; quantity: number; name: string; price: number }[]>([]);
  const form = useForm({
      defaultValues: { name: "", phone: "", address: "", paymentMethod: "PIX" }
  });

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId: product.id, quantity: 1, name: product.name, price: product.price }];
    });
    toast.success(`${product.name} adicionado!`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const totalCart = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  async function handleFinishOrder(values: any) {
    if (cart.length === 0) {
      toast.error("Seu carrinho está vazio!");
      return;
    }

    const response = await createNewOrder({
      ...values,
      items: cart,
      totalPrice: totalCart,
      empresaId: empresa.id
    });

    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success("Pedido realizado com sucesso!");
    setCart([]);
    form.reset();
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-20">
      <div className="h-32 bg-emerald-500" />

      <section className="container mx-auto px-4 -mt-16">
        <div className="max-w-4xl mx-auto">
          <article className="flex flex-col items-center bg-white p-6 rounded-lg shadow-sm border">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white -mt-20 shadow-md mb-4">
              <Image
                src={empresa.image ? empresa.image : imgTest}
                alt={empresa.name || "Loja"}
                className="object-cover"
                fill
              />
            </div>
            <h1 className="text-2xl font-bold">{empresa.name}</h1>
            <div className="flex items-center gap-1 text-gray-500 mt-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{empresa.address || "Endereço não informado"}</span>
            </div>
          </article>

          {/* Listagem de Produtos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-500" /> Nosso Cardápio
              </h2>
              {empresa.products.map((product) => (
                <div key={product.id} className="bg-white p-4 rounded-lg border flex justify-between items-center shadow-sm">
                  <div>
                    <h3 className="font-bold">{product.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                    <p className="text-emerald-600 font-bold mt-1">{formatCurrency(product.price / 100)}</p>
                  </div>
                  <Button size="sm" onClick={() => addToCart(product)} className="bg-emerald-500">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Carrinho e Checkout */}
            <div className="bg-white p-6 rounded-lg border shadow-sm h-fit sticky top-4">
              <h2 className="text-xl font-bold mb-4">Finalizar Pedido</h2>
              
              {cart.length > 0 ? (
                <div className="mb-6 space-y-2">
                   {cart.map(item => (
                     <div key={item.productId} className="flex justify-between text-sm border-b pb-1">
                       <span>{item.quantity}x {item.name}</span>
                       <div className="flex items-center gap-2">
                         <span>{formatCurrency((item.price * item.quantity) / 100)}</span>
                         <button onClick={() => removeFromCart(item.productId)} className="text-red-500">
                            <Minus className="w-3 h-3" />
                         </button>
                       </div>
                     </div>
                   ))}
                   <div className="pt-2 font-bold flex justify-between text-lg">
                      <span>Total:</span>
                      <span>{formatCurrency(totalCart / 100)}</span>
                   </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">Seu carrinho está vazio.</p>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFinishOrder)} className="space-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><Input placeholder="Seu nome" {...field} /></FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><Input placeholder="Telefone" {...field} onChange={e => field.onChange(formatPhone(e.target.value))} /></FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><Input placeholder="Endereço completo de entrega" {...field} /></FormItem>
                  )} />
                  
                  <Button type="submit" className="w-full bg-emerald-500" disabled={cart.length === 0}>
                    Enviar Pedido
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'

// Novo esquema focado em Delivery
export const orderSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("O email é obrigatório"),
    phone: z.string().min(1, "O telefone é obrigatório"),
    address: z.string().min(5, "O endereço completo é obrigatório"), // Novo campo
    // Substituímos serviceId por uma lista de itens
    items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().min(1),
        price: z.number() // Preço em centavos para o histórico
    })).min(1, "Adicione pelo menos um item ao carrinho"),
})

export type OrderFormData = z.infer<typeof orderSchema>

export function useOrderForm() {
    return useForm<OrderFormData>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
            items: [] 
        }
    })
}
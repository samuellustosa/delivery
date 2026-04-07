"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createProduct } from "../_actions/create-product"

export function ProductForm({ categories, companyId }: { categories: any[], companyId: string }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    await createProduct({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      categoryId: formData.get("categoryId") as string,
      companyId: companyId
    })

    setLoading(false)
    // Aqui você pode adicionar um toast de sucesso ou fechar um modal
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome do Produto</Label>
        <Input id="name" name="name" placeholder="Ex: X-Salada" required />
      </div>
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" name="description" placeholder="O que vem no lanche?" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Preço (R$)</Label>
          <Input id="price" name="price" type="number" step="0.01" placeholder="9.90" required />
        </div>
        <div>
          <Label htmlFor="categoryId">Categoria</Label>
          <select id="categoryId" name="categoryId" className="w-full border rounded-md h-10 px-3 text-sm" required>
            <option value="">Selecione...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Salvando..." : "Cadastrar Produto"}
      </Button>
    </form>
  )
}
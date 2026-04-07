import { db } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { ProductForm } from "./_components/product-form"
import { PlusCircle, UtensilsCrossed } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default async function ProductsDashboard() {
  const products = await db.product.findMany({
    include: { category: true },
    orderBy: { name: 'asc' }
  })

  const categories = await db.category.findMany()

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="text-orange-500" />
          <h1 className="text-2xl font-bold">Gestão de Cardápio</h1>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700 gap-2">
              <PlusCircle size={18} /> Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar ao Cardápio</DialogTitle>
            </DialogHeader>
            <ProductForm categories={categories} companyId="ID_DA_SUA_EMPRESA" />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {products.map(product => (
          <div key={product.id} className="flex justify-between items-center p-4 bg-white border rounded-lg shadow-sm">
            <div>
              <p className="font-bold">{product.name}</p>
              <p className="text-sm text-slate-500">{product.category.name}</p>
            </div>
            <p className="font-semibold text-orange-600">
              R$ {product.price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
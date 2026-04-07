import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBasket, LayoutDashboard } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="bg-orange-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
          <ShoppingBasket className="text-white w-12 h-12" />
        </div>
        
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
          Delivery System
        </h1>
        
        <p className="text-slate-600 text-lg">
          Seu cardápio digital está quase pronto. Use o painel para cadastrar seus primeiros produtos.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/dashboard/products">
            <Button size="lg" className="w-full sm:w-auto gap-2 bg-orange-600 hover:bg-orange-700">
              <LayoutDashboard size={18} />
              Acessar Painel
            </Button>
          </Link>

          <Link href="/cardapio/minha-loja">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-orange-200 text-orange-700 hover:bg-orange-50">
              Ver Cardápio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
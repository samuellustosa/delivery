// src/app/(panel)/dashboard/products/page.tsx

import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { ProductContent } from './_components/service-content' // Importando o componente que adaptamos anteriormente
import { Suspense } from 'react'

export default async function ProductsPage() {

    const session = await getSession()

    if (!session) {
        redirect("/")
    }
    
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Meu Cardápio</h1>
            <p className="text-gray-500 text-sm">
                Gerencie as categorias e produtos disponíveis para seus clientes.
            </p>

            <Suspense fallback={<div className="py-10 text-center">Carregando produtos...</div>}>
                {/* Passamos o ID do lojista para o conteúdo de produtos */}
                <ProductContent userId={session.user?.id!} />
            </Suspense>
        </div>
    )
}
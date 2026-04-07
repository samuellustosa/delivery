// src/app/(public)/empresa/[id]/page.tsx

import { redirect } from 'next/navigation'
import { getInfoStore } from './_data-access/get-info-store' // Renomeado para refletir o nicho
import { StoreContent } from './_components/schedule-content' // O componente que adaptamos com o carrinho

export default async function StorePage({
    params,
}: {
    params: Promise<{id: string}>
}){

    const userId = (await params).id
    
    // Busca os dados da empresa, agora incluindo a nova relação de 'products' e 'categories'
    const user = await getInfoStore({ userId: userId })

    // Se o lojista não existir ou estiver inativo, redireciona para a home
    if (!user) {
        redirect("/")
    }

    return (
        // Renderiza o catálogo de produtos com o sistema de checkout/carrinho que criamos
        <StoreContent empresa={user} />
    )
}
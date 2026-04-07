"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function QueryClientContext({ children }: { children: React.ReactNode }) {
  // Usamos o useState para garantir que o QueryClient seja instanciado apenas UMA vez
  // e permaneça estável durante o ciclo de vida da aplicação.
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Isso evita que as queries tentem rodar no servidor se não houver dados
        staleTime: 60 * 1000,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
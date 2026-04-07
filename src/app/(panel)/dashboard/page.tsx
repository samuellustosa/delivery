import { Button } from '@/components/ui/button'
import getSesion from '@/lib/getSession'
import { ShoppingBag, Store } from 'lucide-react' // Ícones focados em Delivery/Loja
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ButtonCopyLink } from './_components/button-copy-link'
import { Reminders } from './_components/reminder/reminders'
// Você precisará criar o componente Orders futuramente para substituir o Appointments
// import { Orders } from './_components/orders/orders' 
import { checkSubscription } from '@/utils/permissions/checkSubscription'
import { LabelSubscription } from '@/components/ui/label-subscription'

export default async function Dashboard() {
  const session = await getSesion()

  if (!session) {
    redirect("/")
  }

  const subscription = await checkSubscription(session?.user?.id!)

  return (
    <main>
      <div className='space-x-2 flex items-center justify-end'>
        <Link
          href={`/empresa/${session.user?.id}`}
          target='_blank'
        >
          <Button className='bg-emerald-500 hover:bg-emerald-400 flex-1 md:flex-[0]'>
            <Store className='w-5 h-5 mr-2' />
            <span>Ver Minha Loja</span>
          </Button>
        </Link>

        <ButtonCopyLink userId={session.user?.id!} />
      </div>

      {subscription?.subscriptionStatus === "EXPIRED" && (
        <LabelSubscription expired={true} />
      )}

      {subscription?.subscriptionStatus === "TRIAL" && (
        <div className='bg-green-500 text-white text-sm md:text-base px-3 py-2 rounded-md my-2'>
          <p className='font-semibold'>
            {subscription?.message}
          </p>
        </div>
      )}

      {subscription?.subscriptionStatus !== "EXPIRED" && (
        <section className='grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4'>
          {/* Substitua o componente Appointments pelo novo componente de Pedidos que você criar */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold">Pedidos Recentes</h2>
            </div>
            <p className="text-gray-500 text-sm">
              Sua lista de pedidos em tempo real aparecerá aqui.
            </p>
            {/* <Orders userId={session.user?.id!} /> */}
          </div>

          <Reminders userId={session.user?.id!} />
        </section>
      )}
    </main>
  )
}
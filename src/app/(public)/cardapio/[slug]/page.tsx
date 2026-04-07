import { db } from "@/lib/prisma"
import { notFound } from "next/navigation"
import MenuContent from "./_components/menu-content"

export default async function MenuPage({ params }: { params: { slug: string } }) {
  const company = await db.company.findUnique({
    where: { slug: params.slug },
    include: {
      categories: {
        include: { 
          products: { 
            where: { isActive: true },
            orderBy: { name: 'asc' }
          } 
        },
        orderBy: { name: 'asc' }
      }
    }
  })

  if (!company) return notFound()

  return <MenuContent company={company} />
}
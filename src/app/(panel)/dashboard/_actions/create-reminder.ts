"use server"

import prisma from "@/lib/prisma"
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'

const formSchema = z.object({
    description: z.string().min(1, "A descrição da anotação é obrigatória")
})

type FormSchema = z.infer<typeof formSchema>

export async function createStoreNote(formData: FormSchema){
    const session = await auth();

    if(!session?.user?.id){
        return { error: "Usuário não encontrado" }
    }

    const schema = formSchema.safeParse(formData)

    if(!schema.success){
        return { error: schema.error.issues[0].message }
    }

    try {
        await prisma.reminder.create({
            data: {
                description: formData.description,
                userId: session.user.id
            }
        })

        revalidatePath("/dashboard")
        return { data: "Anotação salva com sucesso!" }
    } catch(err) {
        return { error: "Falha ao salvar anotação." }
    }
}
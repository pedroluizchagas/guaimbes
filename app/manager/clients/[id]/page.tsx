import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Header } from "@/components/manager/header"
import { ClientDetail } from "@/components/manager/client-detail"
import type { Client } from "@/lib/types/database"

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  const { data: client, error } = await supabase.from("clients").select("*").eq("id", id).single<Client>()

  if (error || !client) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header title={client.name} description="Dados do cliente" />
      <div className="p-4 lg:p-8">
        <ClientDetail client={client} />
      </div>
    </div>
  )
}

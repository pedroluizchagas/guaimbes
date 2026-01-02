import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Header } from "@/components/manager/header"
import { LeadForm } from "@/components/manager/lead-form"
import type { Lead } from "@/lib/types/database"

export default async function EditLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  const { data: lead, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single<Lead>()

  if (error || !lead) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header title="Editar Lead" description="Atualize os dados do lead" />
      <div className="p-4 lg:p-8">
        <LeadForm lead={lead} />
      </div>
    </div>
  )
}


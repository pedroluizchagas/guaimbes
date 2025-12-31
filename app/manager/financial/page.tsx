import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/manager/header"
import { FinancialDashboard } from "@/components/manager/financial-dashboard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function FinancialPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Financeiro"
        description="Gerencie o fluxo de caixa da empresa"
        actions={
          <Link href="/manager/financial/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Nova Transação
            </Button>
          </Link>
        }
      />
      <div className="p-4 lg:p-8">
        <FinancialDashboard />
      </div>
    </div>
  )
}

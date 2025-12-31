import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/manager/header"
import { QuotesList } from "@/components/manager/quotes-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function QuotesPage() {
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
        title="Orçamentos"
        description="Gerencie seus orçamentos e propostas"
        actions={
          <Link href="/manager/quotes/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Novo Orçamento
            </Button>
          </Link>
        }
      />
      <div className="p-4 lg:p-8">
        <QuotesList />
      </div>
    </div>
  )
}

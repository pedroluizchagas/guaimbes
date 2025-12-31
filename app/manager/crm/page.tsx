import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/manager/header"
import { KanbanBoard } from "@/components/manager/kanban-board"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function CRMPage() {
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
        title="Funil de Vendas"
        description="Gerencie seus leads e oportunidades"
        actions={
          <Link href="/manager/crm/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Novo Lead
            </Button>
          </Link>
        }
      />
      <div className="p-4 lg:p-8">
        <KanbanBoard />
      </div>
    </div>
  )
}

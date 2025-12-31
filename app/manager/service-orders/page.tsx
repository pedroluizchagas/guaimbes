import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/manager/header"
import { ServiceOrdersList } from "@/components/manager/service-orders-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function ServiceOrdersPage() {
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
        title="Ordens de Serviço"
        description="Gerencie as ordens de serviço da equipe"
        actions={
          <Link href="/manager/service-orders/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Nova OS
            </Button>
          </Link>
        }
      />
      <div className="p-4 lg:p-8">
        <ServiceOrdersList />
      </div>
    </div>
  )
}

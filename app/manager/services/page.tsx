import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/manager/header"
import { ServicesCatalog } from "@/components/manager/services-catalog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function ServicesPage() {
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
        title="Catálogo de Serviços"
        description="Gerencie seus serviços para orçamentos"
        actions={
          <Link href="/manager/services/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Novo Serviço
            </Button>
          </Link>
        }
      />
      <div className="p-4 lg:p-8">
        <ServicesCatalog />
      </div>
    </div>
  )
}

import { EquipmentList } from "@/components/manager/equipment-list"
import { Header } from "@/components/manager/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function EquipmentPage() {
  return (
    <div className="min-h-screen">
      <Header
        title="Equipamentos"
        description="Controle de ferramentas e equipamentos"
        actions={
          <Link href="/manager/equipment/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Novo Equipamento
            </Button>
          </Link>
        }
      />
      <div className="p-4 lg:p-8">
        <EquipmentList />
      </div>
    </div>
  )
}

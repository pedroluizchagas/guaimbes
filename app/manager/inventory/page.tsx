import { InventoryDashboard } from "@/components/manager/inventory-dashboard"
import { Header } from "@/components/manager/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { History, Plus } from "lucide-react"

export default function InventoryPage() {
  return (
    <div className="min-h-screen">
      <Header
        title="Estoque"
        description="Gerencie materiais, insumos e equipamentos"
        actions={
          <div className="flex gap-2">
            <Link href="/manager/inventory/movements">
              <Button variant="outline">
                <History className="mr-2 h-4 w-4" />
                Movimentações
              </Button>
            </Link>
            <Link href="/manager/inventory/new">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Novo Item
              </Button>
            </Link>
          </div>
        }
      />
      <div className="p-4 lg:p-8">
        <InventoryDashboard />
      </div>
    </div>
  )
}

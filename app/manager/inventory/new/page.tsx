import { InventoryItemForm } from "@/components/manager/inventory-item-form"
import { Header } from "@/components/manager/header"

export default function NewInventoryItemPage() {
  return (
    <div className="min-h-screen">
      <Header title="Novo Item" description="Adicione um novo item ao estoque" />
      <div className="p-4 lg:p-8">
        <InventoryItemForm />
      </div>
    </div>
  )
}

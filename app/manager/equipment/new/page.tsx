import { EquipmentForm } from "@/components/manager/equipment-form"
import { Header } from "@/components/manager/header"

export default function NewEquipmentPage() {
  return (
    <div className="min-h-screen">
      <Header title="Novo Equipamento" description="Cadastre um novo equipamento ou ferramenta" />
      <div className="p-4 lg:p-8">
        <EquipmentForm />
      </div>
    </div>
  )
}

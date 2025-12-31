import { Header } from "@/components/manager/header"
import { ContractForm } from "@/components/manager/contract-form"

export default function NewContractPage() {
  return (
    <div className="min-h-screen">
      <Header title="Novo Contrato" description="Cadastre um novo contrato de manutenção" />
      <div className="p-4 lg:p-8">
        <ContractForm />
      </div>
    </div>
  )
}

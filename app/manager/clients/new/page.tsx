import { Header } from "@/components/manager/header"
import { ClientForm } from "@/components/manager/client-form"

export default function NewClientPage() {
  return (
    <div className="min-h-screen">
      <Header title="Novo Cliente" description="Cadastre um novo cliente" />
      <div className="p-4 lg:p-8">
        <ClientForm />
      </div>
    </div>
  )
}

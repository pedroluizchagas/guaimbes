import { Header } from "@/components/manager/header"
import { ServiceForm } from "@/components/manager/service-form"

export default function NewServicePage() {
  return (
    <div className="min-h-screen">
      <Header title="Novo Serviço" description="Cadastre um novo serviço no catálogo" />
      <div className="p-4 lg:p-8">
        <ServiceForm />
      </div>
    </div>
  )
}

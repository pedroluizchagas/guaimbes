import { Header } from "@/components/manager/header"
import { ServiceOrderForm } from "@/components/manager/service-order-form"
import { Suspense } from "react"

export default function NewServiceOrderPage() {
  return (
    <div className="min-h-screen">
      <Header title="Nova Ordem de Serviço" description="Crie uma nova OS" />
      <div className="p-4 lg:p-8">
        <Suspense fallback={<p className="text-muted-foreground">Carregando...</p>}>
          <ServiceOrderForm />
        </Suspense>
      </div>
    </div>
  )
}

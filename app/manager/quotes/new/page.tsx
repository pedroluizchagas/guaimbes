import { Header } from "@/components/manager/header"
import { QuoteForm } from "@/components/manager/quote-form"
import { Suspense } from "react"

export default function NewQuotePage() {
  return (
    <div className="min-h-screen">
      <Header title="Novo Orçamento" description="Crie um novo orçamento" />
      <div className="p-4 lg:p-8">
        <Suspense fallback={<p className="text-muted-foreground">Carregando...</p>}>
          <QuoteForm />
        </Suspense>
      </div>
    </div>
  )
}

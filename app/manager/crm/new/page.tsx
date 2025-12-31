import { Header } from "@/components/manager/header"
import { LeadForm } from "@/components/manager/lead-form"

export default function NewLeadPage() {
  return (
    <div className="min-h-screen">
      <Header title="Novo Lead" description="Cadastre uma nova oportunidade" />
      <div className="p-4 lg:p-8">
        <LeadForm />
      </div>
    </div>
  )
}

import { Header } from "@/components/manager/header"
import { TransactionForm } from "@/components/manager/transaction-form"

export default function NewTransactionPage() {
  return (
    <div className="min-h-screen">
      <Header title="Nova Transação" description="Registre uma nova transação financeira" />
      <div className="p-4 lg:p-8">
        <TransactionForm />
      </div>
    </div>
  )
}

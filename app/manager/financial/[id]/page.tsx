import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Header } from "@/components/manager/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default async function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  const { data: transaction, error } = await supabase
    .from("transactions")
    .select(`
      *,
      client:clients(*)
    `)
    .eq("id", id)
    .single()

  if (error || !transaction) {
    notFound()
  }

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: "Pendente", color: "bg-yellow-500" },
    paid: { label: "Pago", color: "bg-green-500" },
    overdue: { label: "Atrasado", color: "bg-red-500" },
    cancelled: { label: "Cancelado", color: "bg-gray-500" },
  }

  const paymentMethodLabels: Record<string, string> = {
    pix: "Pix",
    bank_transfer: "Transferência Bancária",
    credit_card: "Cartão de Crédito",
    boleto: "Boleto",
    cash: "Dinheiro",
  }

  return (
    <div className="min-h-screen">
      <Header title="Transação" description={transaction.description} />
      <div className="p-4 lg:p-8">
        <Card className="border-border/50 max-w-3xl">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Link href="/manager/financial">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <CardTitle>Detalhes da Transação</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Tipo</p>
                <div className="flex items-center gap-2">
                  {transaction.type === "income" ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className="font-medium">{transaction.type === "income" ? "Receita" : "Despesa"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Categoria</p>
                <Badge variant="outline">{transaction.category}</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Cliente</p>
                <span className="font-medium">{transaction.client?.name || "-"}</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Vencimento</p>
                <span className="font-medium">
                  {format(new Date(transaction.due_date), "dd/MM/yyyy", { locale: ptBR })}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Valor</p>
                <span className={transaction.type === "income" ? "font-bold text-green-600" : "font-bold text-red-600"}>
                  {transaction.type === "expense" && "-"}R${" "}
                  {Number(transaction.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={`${statusConfig[transaction.status].color} text-white`}>
                  {statusConfig[transaction.status].label}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Forma de Pagamento</p>
                <span className="font-medium">{paymentMethodLabels[transaction.payment_method] ?? "-"}</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Data de Pagamento</p>
                <span className="font-medium">
                  {transaction.payment_date
                    ? format(new Date(transaction.payment_date), "dd/MM/yyyy", { locale: ptBR })
                    : "-"}
                </span>
              </div>
            </div>
            {transaction.notes && (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground">Observações</p>
                <p className="mt-2 whitespace-pre-wrap">{transaction.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Transaction } from "@/lib/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertCircle,
  Eye,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"

const statusConfig = {
  pending: { label: "Pendente", color: "bg-yellow-500" },
  paid: { label: "Pago", color: "bg-green-500" },
  overdue: { label: "Atrasado", color: "bg-red-500" },
  cancelled: { label: "Cancelado", color: "bg-gray-500" },
}

export function FinancialDashboard() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    pendingIncome: 0,
    overdueIncome: 0,
  })

  useEffect(() => {
    fetchData()
  }, [currentMonth, activeTab])

  const fetchData = async () => {
    const supabase = createClient()
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)

    let query = supabase
      .from("transactions")
      .select(`
        *,
        client:clients(name)
      `)
      .order("due_date", { ascending: true })

    if (activeTab === "income") {
      query = query.eq("type", "income")
    } else if (activeTab === "expenses") {
      query = query.eq("type", "expense")
    }

    // Get transactions for the selected month
    query = query.gte("due_date", start.toISOString().split("T")[0]).lte("due_date", end.toISOString().split("T")[0])

    const { data } = await query

    setTransactions(data || [])

    // Calculate summary
    const allTransactions = data || []
    const incomeTransactions = allTransactions.filter((t) => t.type === "income")
    const expenseTransactions = allTransactions.filter((t) => t.type === "expense")

    setSummary({
      totalIncome: incomeTransactions.filter((t) => t.status === "paid").reduce((sum, t) => sum + t.amount, 0),
      totalExpenses: expenseTransactions.filter((t) => t.status === "paid").reduce((sum, t) => sum + t.amount, 0),
      pendingIncome: incomeTransactions.filter((t) => t.status === "pending").reduce((sum, t) => sum + t.amount, 0),
      overdueIncome: incomeTransactions.filter((t) => t.status === "overdue").reduce((sum, t) => sum + t.amount, 0),
    })

    setLoading(false)
  }

  const markAsPaid = async (transaction: Transaction) => {
    const supabase = createClient()
    const { error } = await supabase
      .from("transactions")
      .update({ status: "paid", payment_date: new Date().toISOString().split("T")[0] })
      .eq("id", transaction.id)

    if (!error) {
      fetchData()
    }
  }

  const balance = summary.totalIncome - summary.totalExpenses

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-semibold capitalize">{format(currentMonth, "MMMM yyyy", { locale: ptBR })}</h2>
          <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Receitas Pagas</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {summary.totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-red-100">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Despesas Pagas</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {summary.totalExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-100">
                <Wallet className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">A Receber</p>
                <p className="text-2xl font-bold text-yellow-600">
                  R$ {summary.pendingIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${balance >= 0 ? "bg-green-100" : "bg-red-100"}`}>
                <AlertCircle className={`w-6 h-6 ${balance >= 0 ? "text-green-600" : "text-red-600"}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo do Mês</p>
                <p className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transações</CardTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="income">Receitas</TabsTrigger>
                <TabsTrigger value="expenses">Despesas</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Carregando...</p>
          ) : transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma transação encontrada</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.description}</TableCell>
                      <TableCell>{transaction.client?.name || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.category}</Badge>
                      </TableCell>
                      <TableCell>{format(new Date(transaction.due_date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                      <TableCell>
                        <span className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                          {transaction.type === "expense" && "-"}R${" "}
                          {transaction.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusConfig[transaction.status].color} text-white`}>
                          {statusConfig[transaction.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {transaction.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => markAsPaid(transaction)}
                              title="Marcar como pago"
                            >
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </Button>
                          )}
                          <Link href={`/manager/financial/${transaction.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"

interface FinancialData {
  income: number
  expenses: number
  pending: number
}

export function FinancialOverview() {
  const [data, setData] = useState<FinancialData>({
    income: 0,
    expenses: 0,
    pending: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

      const [incomeRes, expensesRes, pendingRes] = await Promise.all([
        supabase
          .from("transactions")
          .select("amount")
          .eq("type", "income")
          .eq("status", "paid")
          .gte("payment_date", startOfMonth),
        supabase
          .from("transactions")
          .select("amount")
          .eq("type", "expense")
          .eq("status", "paid")
          .gte("payment_date", startOfMonth),
        supabase.from("transactions").select("amount").eq("type", "income").in("status", ["pending", "overdue"]),
      ])

      setData({
        income: incomeRes.data?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0,
        expenses: expensesRes.data?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0,
        pending: pendingRes.data?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0,
      })
      setLoading(false)
    }

    fetchData()
  }, [])

  const balance = data.income - data.expenses

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Resumo Financeiro do Mês</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-center py-8">Carregando...</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-950/30">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Receitas</span>
              </div>
              <span className="text-lg font-bold text-green-600">
                R$ {data.income.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 dark:bg-red-950/30">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium">Despesas</span>
              </div>
              <span className="text-lg font-bold text-red-600">
                R$ {data.expenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/30">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium">A Receber</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">
                R$ {data.pending.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Saldo do Mês</span>
                <span className={`text-xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

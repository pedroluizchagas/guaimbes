"use client"

import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Users, FileText, Calendar, DollarSign } from "lucide-react"

interface Stats {
  totalClients: number
  pendingQuotes: number
  scheduledServices: number
  monthlyRevenue: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    pendingQuotes: 0,
    scheduledServices: 0,
    monthlyRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()

      const [clientsRes, quotesRes, ordersRes, transactionsRes] = await Promise.all([
        supabase.from("clients").select("id", { count: "exact", head: true }),
        supabase.from("quotes").select("id", { count: "exact", head: true }).eq("status", "sent"),
        supabase.from("service_orders").select("id", { count: "exact", head: true }).eq("status", "scheduled"),
        supabase
          .from("transactions")
          .select("amount")
          .eq("type", "income")
          .eq("status", "paid")
          .gte("payment_date", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
      ])

      const monthlyRevenue = transactionsRes.data?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0

      setStats({
        totalClients: clientsRes.count || 0,
        pendingQuotes: quotesRes.count || 0,
        scheduledServices: ordersRes.count || 0,
        monthlyRevenue,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total de Clientes",
      value: stats.totalClients,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Orçamentos Pendentes",
      value: stats.pendingQuotes,
      icon: FileText,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Serviços Agendados",
      value: stats.scheduledServices,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Receita do Mês",
      value: `R$ ${stats.monthlyRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.title} className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{loading ? "..." : stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

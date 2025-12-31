"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import type { ServiceOrder } from "@/lib/types/database"
import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const priorityColors = {
  low: "bg-gray-500",
  medium: "bg-blue-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
}

const typeLabels = {
  maintenance: "Manutenção",
  implementation: "Implantação",
  emergency: "Emergência",
}

export function UpcomingServices() {
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      const supabase = createClient()
      const today = new Date().toISOString().split("T")[0]

      const { data } = await supabase
        .from("service_orders")
        .select(`
          *,
          client:clients(*)
        `)
        .gte("scheduled_date", today)
        .in("status", ["scheduled", "in_progress"])
        .order("scheduled_date", { ascending: true })
        .limit(5)

      setOrders(data || [])
      setLoading(false)
    }

    fetchOrders()
  }, [])

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Próximos Serviços</CardTitle>
        <Link href="/manager/schedule" className="text-sm text-secondary hover:underline flex items-center gap-1">
          Ver agenda <ArrowRight className="w-4 h-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-center py-8">Carregando...</p>
        ) : orders.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Nenhum serviço agendado</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{order.title}</p>
                    <Badge className={`${priorityColors[order.priority]} text-white text-xs`}>{order.priority}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.client?.name || "Sem cliente"} - {typeLabels[order.service_type]}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {format(new Date(order.scheduled_date), "dd/MM", { locale: ptBR })}
                  </p>
                  {order.scheduled_time && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" />
                      {order.scheduled_time.slice(0, 5)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

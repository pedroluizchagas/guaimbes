"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { ServiceOrder } from "@/lib/types/database"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Pencil, Search, Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const statusConfig = {
  scheduled: { label: "Agendada", color: "bg-blue-500" },
  in_progress: { label: "Em Andamento", color: "bg-yellow-500" },
  completed: { label: "Concluída", color: "bg-green-500" },
  cancelled: { label: "Cancelada", color: "bg-gray-500" },
}

const typeLabels = {
  maintenance: "Manutenção",
  implementation: "Implantação",
  emergency: "Emergência",
}

const priorityConfig = {
  low: { label: "Baixa", color: "bg-gray-400" },
  medium: { label: "Média", color: "bg-blue-400" },
  high: { label: "Alta", color: "bg-orange-500" },
  urgent: { label: "Urgente", color: "bg-red-500" },
}

export function ServiceOrdersList() {
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  useEffect(() => {
    const fetchOrders = async () => {
      const supabase = createClient()
      let query = supabase
        .from("service_orders")
        .select(
          `
          *,
          client:clients(*)
        `,
        )
        .order("scheduled_date", { ascending: false })

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }

      if (typeFilter !== "all") {
        query = query.eq("service_type", typeFilter)
      }

      const { data } = await query
      let filtered = data || []

      if (search) {
        filtered = filtered.filter(
          (o) =>
            o.order_number.toLowerCase().includes(search.toLowerCase()) ||
            o.title.toLowerCase().includes(search.toLowerCase()) ||
            o.client?.name?.toLowerCase().includes(search.toLowerCase()),
        )
      }

      setOrders(filtered)
      setLoading(false)
    }

    fetchOrders()
  }, [search, statusFilter, typeFilter])

  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar OS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-primary/20"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 border-primary/20">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="scheduled">Agendada</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluída</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40 border-primary/20">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Tipos</SelectItem>
              <SelectItem value="maintenance">Manutenção</SelectItem>
              <SelectItem value="implementation">Implantação</SelectItem>
              <SelectItem value="emergency">Emergência</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <p className="text-muted-foreground text-center py-8">Carregando...</p>
        ) : orders.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Nenhuma ordem de serviço encontrada</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Título / Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium line-clamp-1">{order.title}</p>
                        <p className="text-sm text-muted-foreground">{order.client?.name || "Sem cliente"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        {format(new Date(order.scheduled_date), "dd/MM/yy", { locale: ptBR })}
                      </div>
                      {order.neighborhood && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3" />
                          {order.neighborhood}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{typeLabels[order.service_type]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${priorityConfig[order.priority].color} text-white`}>
                        {priorityConfig[order.priority].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusConfig[order.status].color} text-white`}>
                        {statusConfig[order.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/manager/service-orders/${order.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/manager/service-orders/${order.id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="w-4 h-4" />
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
  )
}

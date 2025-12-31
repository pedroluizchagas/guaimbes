"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { Client, Quote, ServiceOrder } from "@/lib/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Phone, Mail, MapPin, FileText, ClipboardList, Plus } from "lucide-react"

const clientTypeLabels = {
  residential: "Residencial",
  commercial: "Comercial",
  condominium: "Condomínio",
}

const clientTypeColors = {
  residential: "bg-blue-100 text-blue-800",
  commercial: "bg-purple-100 text-purple-800",
  condominium: "bg-green-100 text-green-800",
}

interface ClientDetailProps {
  client: Client
}

export function ClientDetail({ client }: ClientDetailProps) {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelated = async () => {
      const supabase = createClient()

      const [quotesRes, ordersRes] = await Promise.all([
        supabase.from("quotes").select("*").eq("client_id", client.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("service_orders").select("*").eq("client_id", client.id).order("created_at", { ascending: false }).limit(5),
      ])

      setQuotes(quotesRes.data || [])
      setOrders(ordersRes.data || [])
      setLoading(false)
    }

    fetchRelated()
  }, [client.id])

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/manager/clients">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <CardTitle>{client.name}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={clientTypeColors[client.client_type]}>{clientTypeLabels[client.client_type]}</Badge>
              <Link href={`/manager/quotes/new?client_id=${client.id}`}>
                <Button className="bg-primary hover:bg-primary/90">
                  <FileText className="w-4 h-4 mr-2" />
                  Novo Orçamento
                </Button>
              </Link>
              <Link href={`/manager/service-orders/new?client_id=${client.id}`}>
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <ClipboardList className="w-4 h-4 mr-2" />
                  Nova OS
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <p className="font-medium">Contato</p>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                {client.phone}
              </div>
              {client.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {client.email}
                </div>
              )}
            </div>
            <div className="space-y-3">
              <p className="font-medium">Endereço</p>
              {client.address ? (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {client.neighborhood ? `${client.neighborhood}, ` : ""}
                    {client.city}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sem endereço cadastrado</p>
              )}
            </div>
            <div className="space-y-3">
              <p className="font-medium">Observações</p>
              {client.notes ? (
                <p className="text-sm">{client.notes}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Sem observações</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Orçamentos Recentes</CardTitle>
            <Link href="/manager/quotes" className="text-sm text-secondary hover:underline flex items-center gap-1">
              Ver todos
              <Plus className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground text-center py-8">Carregando...</p>
            ) : quotes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhum orçamento</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotes.map((q) => (
                      <TableRow key={q.id}>
                        <TableCell className="font-medium">{q.quote_number}</TableCell>
                        <TableCell>R$ {q.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="capitalize">{q.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Ordens de Serviço Recentes</CardTitle>
            <Link href="/manager/service-orders" className="text-sm text-secondary hover:underline flex items-center gap-1">
              Ver todas
              <Plus className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground text-center py-8">Carregando...</p>
            ) : orders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhuma OS</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-medium">{o.order_number}</TableCell>
                        <TableCell>{o.title}</TableCell>
                        <TableCell className="capitalize">{o.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

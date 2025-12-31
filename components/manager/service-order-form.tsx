"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { ServiceOrder, Client, ServiceOrderStatus, ServiceOrderType, Priority, Quote } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

interface ServiceOrderFormProps {
  serviceOrder?: ServiceOrder
}

export function ServiceOrderForm({ serviceOrder }: ServiceOrderFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const prefillClientId = serviceOrder?.client_id || searchParams.get("client_id") || ""
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])

  const [formData, setFormData] = useState({
    title: serviceOrder?.title || "",
    description: serviceOrder?.description || "",
    client_id: prefillClientId,
    quote_id: serviceOrder?.quote_id || "",
    service_type: serviceOrder?.service_type || ("maintenance" as ServiceOrderType),
    status: serviceOrder?.status || ("scheduled" as ServiceOrderStatus),
    priority: serviceOrder?.priority || ("medium" as Priority),
    scheduled_date: serviceOrder?.scheduled_date || new Date().toISOString().split("T")[0],
    scheduled_time: serviceOrder?.scheduled_time || "",
    estimated_duration: serviceOrder?.estimated_duration?.toString() || "",
    address: serviceOrder?.address || "",
    neighborhood: serviceOrder?.neighborhood || "",
    notes: serviceOrder?.notes || "",
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const [clientsRes, quotesRes] = await Promise.all([
        supabase.from("clients").select("*").order("name"),
        supabase
          .from("quotes")
          .select("*, client:clients(*)")
          .eq("status", "approved")
          .order("created_at", { ascending: false }),
      ])
      setClients(clientsRes.data || [])
      setQuotes(quotesRes.data || [])
      if (prefillClientId) {
        const client = (clientsRes.data || []).find((c) => c.id === prefillClientId)
        setFormData((prev) => ({
          ...prev,
          client_id: prefillClientId,
          address: client?.address || prev.address,
          neighborhood: client?.neighborhood || prev.neighborhood,
        }))
      }
    }
    fetchData()
  }, [])

  const handleClientChange = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId)
    setFormData({
      ...formData,
      client_id: clientId,
      address: client?.address || formData.address,
      neighborhood: client?.neighborhood || formData.neighborhood,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const payload = {
      ...formData,
      client_id: formData.client_id || null,
      quote_id: formData.quote_id || null,
      scheduled_time: formData.scheduled_time || null,
      estimated_duration: formData.estimated_duration ? Number.parseInt(formData.estimated_duration) : null,
      created_by: user?.id,
    }

    try {
      if (serviceOrder) {
        const { error } = await supabase.from("service_orders").update(payload).eq("id", serviceOrder.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("service_orders").insert(payload)
        if (error) throw error
      }
      router.push("/manager/service-orders")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar OS")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/50 max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Link href="/manager/service-orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <CardTitle>{serviceOrder ? "Editar OS" : "Nova Ordem de Serviço"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Manutenção mensal - Jardim residencial"
                required
                className="border-primary/20"
              />
            </div>

            <div>
              <Label htmlFor="client_id">Cliente</Label>
              <Select value={formData.client_id} onValueChange={handleClientChange}>
                <SelectTrigger className="border-primary/20">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quote_id">Orçamento Aprovado</Label>
              <Select
                value={formData.quote_id}
                onValueChange={(value) => setFormData({ ...formData, quote_id: value })}
              >
                <SelectTrigger className="border-primary/20">
                  <SelectValue placeholder="Vincular orçamento (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {quotes.map((quote) => (
                    <SelectItem key={quote.id} value={quote.id}>
                      {quote.quote_number} - {quote.client?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="service_type">Tipo de Serviço *</Label>
              <Select
                value={formData.service_type}
                onValueChange={(value: ServiceOrderType) => setFormData({ ...formData, service_type: value })}
              >
                <SelectTrigger className="border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintenance">Manutenção Recorrente</SelectItem>
                  <SelectItem value="implementation">Implantação de Projeto</SelectItem>
                  <SelectItem value="emergency">Emergência</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Priority) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger className="border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ServiceOrderStatus) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Agendada</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="scheduled_date">Data Agendada *</Label>
              <Input
                id="scheduled_date"
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                required
                className="border-primary/20"
              />
            </div>

            <div>
              <Label htmlFor="scheduled_time">Horário</Label>
              <Input
                id="scheduled_time"
                type="time"
                value={formData.scheduled_time}
                onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                className="border-primary/20"
              />
            </div>

            <div>
              <Label htmlFor="estimated_duration">Duração Estimada (min)</Label>
              <Input
                id="estimated_duration"
                type="number"
                min="0"
                value={formData.estimated_duration}
                onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                className="border-primary/20"
              />
            </div>

            <div>
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                className="border-primary/20"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="border-primary/20"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Descrição do Serviço</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="border-primary/20"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                className="border-primary/20"
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</p>}

          <div className="flex justify-end gap-4">
            <Link href="/manager/service-orders">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

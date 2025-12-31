"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Quote, Client, Service, QuoteStatus, Lead } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface QuoteItem {
  id?: string
  service_id?: string
  description: string
  quantity: number
  unit_price: number
  total: number
}

interface QuoteFormProps {
  quote?: Quote
}

export function QuoteForm({ quote }: QuoteFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const prefillClientId = quote?.client_id || searchParams.get("client_id") || ""
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [items, setItems] = useState<QuoteItem[]>(quote?.items || [])

  const [formData, setFormData] = useState({
    client_id: prefillClientId,
    lead_id: quote?.lead_id || "",
    status: quote?.status || ("draft" as QuoteStatus),
    discount_percent: quote?.discount_percent?.toString() || "0",
    valid_until: quote?.valid_until || "",
    notes: quote?.notes || "",
    technical_description: quote?.technical_description || "",
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const [clientsRes, servicesRes, leadsRes] = await Promise.all([
        supabase.from("clients").select("*").order("name"),
        supabase.from("services").select("*").eq("is_active", true).order("name"),
        supabase.from("leads").select("*, client:clients(*)").order("created_at", { ascending: false }),
      ])
      setClients(clientsRes.data || [])
      setServices(servicesRes.data || [])
      setLeads(leadsRes.data || [])
    }
    fetchData()
  }, [])

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unit_price: 0, total: 0 }])
  }

  const updateItem = (index: number, field: keyof QuoteItem, value: string | number) => {
    const newItems = [...items]
    const item = newItems[index]

    if (field === "service_id" && value) {
      const service = services.find((s) => s.id === value)
      if (service) {
        item.service_id = service.id
        item.description = service.name
        item.unit_price = service.unit_price
        item.total = item.quantity * service.unit_price
      }
    } else {
      ;(item as Record<string, string | number>)[field] = value
      if (field === "quantity" || field === "unit_price") {
        item.total = Number(item.quantity) * Number(item.unit_price)
      }
    }

    setItems(newItems)
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const discount = subtotal * (Number(formData.discount_percent) / 100)
  const total = subtotal - discount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const quotePayload = {
        client_id: formData.client_id || null,
        lead_id: formData.lead_id || null,
        status: formData.status,
        discount_percent: Number(formData.discount_percent),
        valid_until: formData.valid_until || null,
        notes: formData.notes || null,
        technical_description: formData.technical_description || null,
        subtotal,
        total,
        created_by: user?.id,
      }

      let quoteId = quote?.id

      if (quote) {
        const { error } = await supabase.from("quotes").update(quotePayload).eq("id", quote.id)
        if (error) throw error

        // Delete existing items and insert new ones
        await supabase.from("quote_items").delete().eq("quote_id", quote.id)
      } else {
        const { data, error } = await supabase.from("quotes").insert(quotePayload).select().single()
        if (error) throw error
        quoteId = data.id
      }

      // Insert items
      if (items.length > 0 && quoteId) {
        const itemsPayload = items.map((item) => ({
          quote_id: quoteId,
          service_id: item.service_id || null,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.total,
        }))

        const { error: itemsError } = await supabase.from("quote_items").insert(itemsPayload)
        if (itemsError) throw itemsError
      }

      router.push("/manager/quotes")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar orçamento")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Link href="/manager/quotes">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <CardTitle>{quote ? "Editar Orçamento" : "Novo Orçamento"}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client_id">Cliente</Label>
                <Select
                  value={formData.client_id}
                  onValueChange={(value) => setFormData({ ...formData, client_id: value })}
                >
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
                <Label htmlFor="lead_id">Lead Relacionado</Label>
                <Select
                  value={formData.lead_id}
                  onValueChange={(value) => setFormData({ ...formData, lead_id: value })}
                >
                  <SelectTrigger className="border-primary/20">
                    <SelectValue placeholder="Selecione um lead (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: QuoteStatus) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="sent">Enviado</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                    <SelectItem value="expired">Expirado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="valid_until">Válido até</Label>
                <Input
                  id="valid_until"
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  className="border-primary/20"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="technical_description">Descrição Técnica</Label>
                <Textarea
                  id="technical_description"
                  value={formData.technical_description}
                  onChange={(e) => setFormData({ ...formData, technical_description: e.target.value })}
                  rows={3}
                  className="border-primary/20"
                  placeholder="Descreva tecnicamente o serviço a ser realizado..."
                />
              </div>
            </div>

            {/* Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Itens do Orçamento</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Item
                </Button>
              </div>

              {items.length > 0 && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-40">Serviço</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="w-24">Qtd</TableHead>
                        <TableHead className="w-32">Valor Unit.</TableHead>
                        <TableHead className="w-32">Total</TableHead>
                        <TableHead className="w-16" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Select
                              value={item.service_id || ""}
                              onValueChange={(value) => updateItem(index, "service_id", value)}
                            >
                              <SelectTrigger className="border-primary/20 text-xs">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                {services.map((service) => (
                                  <SelectItem key={service.id} value={service.id}>
                                    {service.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.description}
                              onChange={(e) => updateItem(index, "description", e.target.value)}
                              className="border-primary/20 text-sm"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, "quantity", Number.parseFloat(e.target.value) || 0)}
                              className="border-primary/20 text-sm"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unit_price}
                              onChange={(e) => updateItem(index, "unit_price", Number.parseFloat(e.target.value) || 0)}
                              className="border-primary/20 text-sm"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            R$ {item.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Desconto:</span>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.discount_percent}
                    onChange={(e) => setFormData({ ...formData, discount_percent: e.target.value })}
                    className="w-20 h-8 text-sm border-primary/20"
                  />
                  <span className="text-sm">%</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span className="text-primary">R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                className="border-primary/20"
              />
            </div>

            {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</p>}

            <div className="flex justify-end gap-4">
              <Link href="/manager/quotes">
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
    </div>
  )
}

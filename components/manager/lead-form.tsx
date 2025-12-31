"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Lead, Client, PipelineStage, LeadSource } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

interface LeadFormProps {
  lead?: Lead
}

export function LeadForm({ lead }: LeadFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [stages, setStages] = useState<PipelineStage[]>([])

  const [formData, setFormData] = useState({
    title: lead?.title || "",
    description: lead?.description || "",
    client_id: lead?.client_id || "",
    stage_id: lead?.stage_id || "",
    estimated_value: lead?.estimated_value?.toString() || "",
    source: lead?.source || ("" as LeadSource | ""),
    visit_date: lead?.visit_date ? new Date(lead.visit_date).toISOString().slice(0, 16) : "",
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const [clientsRes, stagesRes] = await Promise.all([
        supabase.from("clients").select("*").order("name"),
        supabase.from("pipeline_stages").select("*").order("order"),
      ])
      setClients(clientsRes.data || [])
      setStages(stagesRes.data || [])

      if (!lead && stagesRes.data?.[0]) {
        setFormData((prev) => ({ ...prev, stage_id: stagesRes.data[0].id }))
      }
    }
    fetchData()
  }, [lead])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const payload = {
      ...formData,
      client_id: formData.client_id || null,
      estimated_value: formData.estimated_value ? Number.parseFloat(formData.estimated_value) : null,
      source: formData.source || null,
      visit_date: formData.visit_date || null,
    }

    try {
      if (lead) {
        const { error } = await supabase.from("leads").update(payload).eq("id", lead.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("leads").insert(payload)
        if (error) throw error
      }
      router.push("/manager/crm")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar lead")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/50 max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Link href="/manager/crm">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <CardTitle>{lead ? "Editar Lead" : "Novo Lead"}</CardTitle>
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
                placeholder="Ex: Paisagismo residencial - João Silva"
                required
                className="border-primary/20"
              />
            </div>

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
              <Label htmlFor="stage_id">Etapa *</Label>
              <Select
                value={formData.stage_id}
                onValueChange={(value) => setFormData({ ...formData, stage_id: value })}
              >
                <SelectTrigger className="border-primary/20">
                  <SelectValue placeholder="Selecione a etapa" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                        {stage.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="estimated_value">Valor Estimado (R$)</Label>
              <Input
                id="estimated_value"
                type="number"
                step="0.01"
                value={formData.estimated_value}
                onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
                className="border-primary/20"
              />
            </div>

            <div>
              <Label htmlFor="source">Origem</Label>
              <Select
                value={formData.source}
                onValueChange={(value: LeadSource) => setFormData({ ...formData, source: value })}
              >
                <SelectTrigger className="border-primary/20">
                  <SelectValue placeholder="Como nos encontrou?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Site</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="referral">Indicação</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="visit_date">Data da Visita</Label>
              <Input
                id="visit_date"
                type="datetime-local"
                value={formData.visit_date}
                onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
                className="border-primary/20"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="border-primary/20"
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</p>}

          <div className="flex justify-end gap-4">
            <Link href="/manager/crm">
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

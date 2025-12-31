"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Contract, Client, ContractStatus } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

interface ContractFormProps {
  contract?: Contract
}

export function ContractForm({ contract }: ContractFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clients, setClients] = useState<Client[]>([])

  const [formData, setFormData] = useState({
    client_id: contract?.client_id || "",
    title: contract?.title || "",
    description: contract?.description || "",
    service_type: contract?.service_type || "Manutenção de Jardim",
    monthly_value: contract?.monthly_value?.toString() || "",
    payment_day: contract?.payment_day?.toString() || "10",
    start_date: contract?.start_date || new Date().toISOString().split("T")[0],
    end_date: contract?.end_date || "",
    status: contract?.status || ("active" as ContractStatus),
    auto_renew: contract?.auto_renew ?? true,
  })

  useEffect(() => {
    const fetchClients = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("clients").select("*").order("name")
      setClients(data || [])
    }
    fetchClients()
  }, [])

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
      monthly_value: Number.parseFloat(formData.monthly_value) || 0,
      payment_day: Number.parseInt(formData.payment_day) || 10,
      end_date: formData.end_date || null,
      created_by: user?.id,
    }

    try {
      if (contract) {
        const { error } = await supabase.from("contracts").update(payload).eq("id", contract.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("contracts").insert(payload)
        if (error) throw error
      }
      router.push("/manager/contracts")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar contrato")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/50 max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Link href="/manager/contracts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <CardTitle>{contract ? "Editar Contrato" : "Novo Contrato"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Título do Contrato *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Manutenção mensal - Residência Silva"
                required
                className="border-primary/20"
              />
            </div>

            <div>
              <Label htmlFor="client_id">Cliente *</Label>
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
              <Label htmlFor="service_type">Tipo de Serviço *</Label>
              <Select
                value={formData.service_type}
                onValueChange={(value) => setFormData({ ...formData, service_type: value })}
              >
                <SelectTrigger className="border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manutenção de Jardim">Manutenção de Jardim</SelectItem>
                  <SelectItem value="Manutenção de Gramado">Manutenção de Gramado</SelectItem>
                  <SelectItem value="Irrigação">Irrigação</SelectItem>
                  <SelectItem value="Poda e Limpeza">Poda e Limpeza</SelectItem>
                  <SelectItem value="Completo">Completo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="monthly_value">Valor Mensal (R$) *</Label>
              <Input
                id="monthly_value"
                type="number"
                step="0.01"
                min="0"
                value={formData.monthly_value}
                onChange={(e) => setFormData({ ...formData, monthly_value: e.target.value })}
                required
                className="border-primary/20"
              />
            </div>

            <div>
              <Label htmlFor="payment_day">Dia de Vencimento *</Label>
              <Select
                value={formData.payment_day}
                onValueChange={(value) => setFormData({ ...formData, payment_day: value })}
              >
                <SelectTrigger className="border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 5, 10, 15, 20, 25, 28].map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      Dia {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="start_date">Data de Início *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
                className="border-primary/20"
              />
            </div>

            <div>
              <Label htmlFor="end_date">Data de Término</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="border-primary/20"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ContractStatus) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="suspended">Suspenso</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                  <SelectItem value="expired">Expirado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="auto_renew"
                checked={formData.auto_renew}
                onCheckedChange={(checked) => setFormData({ ...formData, auto_renew: checked })}
              />
              <Label htmlFor="auto_renew">Renovação automática</Label>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Descrição do Contrato</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="border-primary/20"
                placeholder="Descreva os serviços incluídos no contrato..."
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</p>}

          <div className="flex justify-end gap-4">
            <Link href="/manager/contracts">
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

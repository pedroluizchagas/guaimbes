"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Service, ServiceCategory } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

interface ServiceFormProps {
  service?: Service
}

export function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: service?.name || "",
    description: service?.description || "",
    unit: service?.unit || "m²",
    unit_price: service?.unit_price?.toString() || "",
    category: service?.category || ("landscaping" as ServiceCategory),
    is_active: service?.is_active ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const payload = {
      ...formData,
      unit_price: Number.parseFloat(formData.unit_price) || 0,
    }

    try {
      if (service) {
        const { error } = await supabase.from("services").update(payload).eq("id", service.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("services").insert(payload)
        if (error) throw error
      }
      router.push("/manager/services")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar serviço")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/50 max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Link href="/manager/services">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <CardTitle>{service ? "Editar Serviço" : "Novo Serviço"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Plantio de grama esmeralda"
                required
                className="border-primary/20"
              />
            </div>

            <div>
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formData.category}
                onValueChange={(value: ServiceCategory) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="landscaping">Paisagismo</SelectItem>
                  <SelectItem value="maintenance">Manutenção</SelectItem>
                  <SelectItem value="planting">Plantio</SelectItem>
                  <SelectItem value="irrigation">Irrigação</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="unit">Unidade *</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                <SelectTrigger className="border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="m²">m² (metro quadrado)</SelectItem>
                  <SelectItem value="m³">m³ (metro cúbico)</SelectItem>
                  <SelectItem value="m">m (metro linear)</SelectItem>
                  <SelectItem value="hora">hora</SelectItem>
                  <SelectItem value="diária">diária</SelectItem>
                  <SelectItem value="unidade">unidade</SelectItem>
                  <SelectItem value="kg">kg (quilograma)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="unit_price">Valor Unitário (R$) *</Label>
              <Input
                id="unit_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.unit_price}
                onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                required
                className="border-primary/20"
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Serviço ativo</Label>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="border-primary/20"
                placeholder="Descreva o serviço em detalhes..."
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</p>}

          <div className="flex justify-end gap-4">
            <Link href="/manager/services">
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

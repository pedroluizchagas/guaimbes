"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

const EQUIPMENT_TYPES = [
  "Cortador de grama",
  "Roçadeira",
  "Soprador",
  "Motosserra",
  "Aparador de cerca viva",
  "Pulverizador",
  "Carrinho de mão",
  "Escada",
  "Ferramentas manuais",
  "Irrigação",
  "Veículo",
  "Outros",
]

export function EquipmentForm() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    serial_number: "",
    status: "disponivel" as const,
    purchase_date: "",
    last_maintenance: "",
    next_maintenance: "",
    notes: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from("equipment").insert({
      name: formData.name,
      type: formData.type || null,
      serial_number: formData.serial_number || null,
      status: formData.status,
      purchase_date: formData.purchase_date || null,
      last_maintenance: formData.last_maintenance || null,
      next_maintenance: formData.next_maintenance || null,
      notes: formData.notes || null,
    })

    setLoading(false)

    if (!error) {
      router.push("/manager/equipment")
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Equipamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Equipamento *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Cortador de grama Honda"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {EQUIPMENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="serial_number">Número de Série</Label>
                <Input
                  id="serial_number"
                  value={formData.serial_number}
                  onChange={(e) => setFormData((prev) => ({ ...prev, serial_number: e.target.value }))}
                  placeholder="Ex: ABC123456"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "disponivel" | "em_uso" | "manutencao" | "inativo") =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponivel">Disponível</SelectItem>
                    <SelectItem value="em_uso">Em Uso</SelectItem>
                    <SelectItem value="manutencao">Em Manutenção</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="purchase_date">Data de Compra</Label>
                <Input
                  id="purchase_date"
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, purchase_date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_maintenance">Última Manutenção</Label>
                <Input
                  id="last_maintenance"
                  type="date"
                  value={formData.last_maintenance}
                  onChange={(e) => setFormData((prev) => ({ ...prev, last_maintenance: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="next_maintenance">Próxima Manutenção</Label>
                <Input
                  id="next_maintenance"
                  type="date"
                  value={formData.next_maintenance}
                  onChange={(e) => setFormData((prev) => ({ ...prev, next_maintenance: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Informações adicionais sobre o equipamento..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/manager/equipment">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Salvando..." : "Salvar Equipamento"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

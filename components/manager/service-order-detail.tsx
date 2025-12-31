"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { ServiceOrder, ServiceOrderStatus } from "@/lib/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  Pencil,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Camera,
  CheckCircle,
  Play,
  Square,
} from "lucide-react"
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

interface ServiceOrderDetailProps {
  order: ServiceOrder
}

export function ServiceOrderDetail({ order: initialOrder }: ServiceOrderDetailProps) {
  const router = useRouter()
  const [order, setOrder] = useState(initialOrder)
  const [loading, setLoading] = useState(false)
  const [checklistBefore, setChecklistBefore] = useState<{ id: string; text: string; completed: boolean }[]>(
    order.checklist_before || [
      { id: "1", text: "Foto do local antes de começar", completed: false },
      { id: "2", text: "Verificar ferramentas necessárias", completed: false },
      { id: "3", text: "Confirmar escopo com cliente", completed: false },
    ],
  )
  const [checklistAfter, setChecklistAfter] = useState<{ id: string; text: string; completed: boolean }[]>(
    order.checklist_after || [
      { id: "1", text: "Foto do serviço concluído", completed: false },
      { id: "2", text: "Local limpo e organizado", completed: false },
      { id: "3", text: "Assinatura do cliente", completed: false },
    ],
  )
  const [notes, setNotes] = useState(order.notes || "")

  const updateStatus = async (newStatus: ServiceOrderStatus) => {
    setLoading(true)
    const supabase = createClient()

    const updates: Partial<ServiceOrder> = { status: newStatus }
    if (newStatus === "in_progress") {
      updates.actual_start = new Date().toISOString()
    } else if (newStatus === "completed") {
      updates.actual_end = new Date().toISOString()
    }

    const { error } = await supabase.from("service_orders").update(updates).eq("id", order.id)

    if (!error) {
      setOrder({ ...order, ...updates })
    }
    setLoading(false)
  }

  const saveChecklists = async () => {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("service_orders")
      .update({
        checklist_before: checklistBefore,
        checklist_after: checklistAfter,
        notes,
      })
      .eq("id", order.id)

    if (!error) {
      setOrder({ ...order, checklist_before: checklistBefore, checklist_after: checklistAfter, notes })
    }
    setLoading(false)
  }

  const toggleChecklistItem = (type: "before" | "after", id: string) => {
    if (type === "before") {
      setChecklistBefore((prev) =>
        prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)),
      )
    } else {
      setChecklistAfter((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Card */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/manager/service-orders">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <CardTitle>{order.order_number}</CardTitle>
                  <Badge className={`${statusConfig[order.status].color} text-white`}>
                    {statusConfig[order.status].label}
                  </Badge>
                  <Badge className={`${priorityConfig[order.priority].color} text-white`}>
                    {priorityConfig[order.priority].label}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{order.title}</p>
              </div>
            </div>
            <Link href={`/manager/service-orders/${order.id}/edit`}>
              <Button variant="outline" size="sm">
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Data</p>
                <p className="font-medium">{format(new Date(order.scheduled_date), "dd/MM/yyyy", { locale: ptBR })}</p>
              </div>
            </div>
            {order.scheduled_time && (
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Horário</p>
                  <p className="font-medium">{order.scheduled_time.slice(0, 5)}</p>
                </div>
              </div>
            )}
            {order.client && (
              <>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="font-medium">{order.client.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">{order.client.phone}</p>
                  </div>
                </div>
              </>
            )}
            {order.neighborhood && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Local</p>
                  <p className="font-medium">{order.neighborhood}</p>
                </div>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Tipo</p>
              <Badge variant="outline">{typeLabels[order.service_type]}</Badge>
            </div>
          </div>

          {order.description && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Descrição</p>
              <p>{order.description}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            {order.status === "scheduled" && (
              <Button
                onClick={() => updateStatus("in_progress")}
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar Serviço
              </Button>
            )}
            {order.status === "in_progress" && (
              <Button
                onClick={() => updateStatus("completed")}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Finalizar Serviço
              </Button>
            )}
            {(order.status === "scheduled" || order.status === "in_progress") && (
              <Button
                variant="outline"
                onClick={() => updateStatus("cancelled")}
                disabled={loading}
                className="text-destructive border-destructive hover:bg-destructive/10"
              >
                <Square className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Checklists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Checklist de Entrada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {checklistBefore.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <Checkbox
                    id={`before-${item.id}`}
                    checked={item.completed}
                    onCheckedChange={() => toggleChecklistItem("before", item.id)}
                  />
                  <Label
                    htmlFor={`before-${item.id}`}
                    className={item.completed ? "line-through text-muted-foreground" : ""}
                  >
                    {item.text}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Checklist de Saída
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {checklistAfter.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <Checkbox
                    id={`after-${item.id}`}
                    checked={item.completed}
                    onCheckedChange={() => toggleChecklistItem("after", item.id)}
                  />
                  <Label
                    htmlFor={`after-${item.id}`}
                    className={item.completed ? "line-through text-muted-foreground" : ""}
                  >
                    {item.text}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Observações do Serviço</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Registre observações sobre o serviço..."
            rows={4}
            className="border-primary/20"
          />
          <Button onClick={saveChecklists} disabled={loading} className="mt-4 bg-primary hover:bg-primary/90">
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

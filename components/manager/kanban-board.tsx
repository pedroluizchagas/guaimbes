"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Lead, PipelineStage } from "@/lib/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, Calendar, DollarSign, MoreVertical, Eye, Pencil, Trash2, MessageCircle, FileText } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "@/hooks/use-toast"

export function KanbanBoard() {
  const [stages, setStages] = useState<PipelineStage[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null)
  const sourceLabels: Record<string, string> = {
    website: "Site",
    whatsapp: "WhatsApp",
    referral: "Indicação",
    instagram: "Instagram",
    other: "Outro",
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const supabase = createClient()

    const [stagesRes, leadsRes] = await Promise.all([
      supabase.from("pipeline_stages").select("*").order("order", { ascending: true }),
      supabase
        .from("leads")
        .select(
          `
          *,
          client:clients(*),
          stage:pipeline_stages(*)
        `,
        )
        .order("created_at", { ascending: false }),
    ])

    setStages(stagesRes.data || [])
    setLeads(leadsRes.data || [])
    setLoading(false)
  }

  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (stageId: string) => {
    if (!draggedLead || draggedLead.stage_id === stageId) {
      setDraggedLead(null)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.from("leads").update({ stage_id: stageId }).eq("id", draggedLead.id)

    if (!error) {
      setLeads((prev) => prev.map((lead) => (lead.id === draggedLead.id ? { ...lead, stage_id: stageId } : lead)))
      const stageName = stages.find((s) => s.id === stageId)?.name || "Nova etapa"
      toast({
        title: "Lead movido",
        description: `Lead atualizado para "${stageName}".`,
      })
    } else {
      toast({
        title: "Erro ao mover lead",
        description: "Não foi possível atualizar a etapa. Tente novamente.",
        variant: "destructive",
      })
    }

    setDraggedLead(null)
  }

  const handleDelete = async (leadId: string) => {
    if (!confirm("Tem certeza que deseja excluir este lead?")) return

    const supabase = createClient()
    const { error } = await supabase.from("leads").delete().eq("id", leadId)

    if (!error) {
      setLeads((prev) => prev.filter((lead) => lead.id !== leadId))
      toast({
        title: "Lead excluído",
        description: "O lead foi removido com sucesso.",
      })
    } else {
      toast({
        title: "Erro ao excluir lead",
        description: "Não foi possível excluir o lead. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const generateWhatsAppMessage = (lead: Lead, stage: PipelineStage) => {
    const messages: Record<string, string> = {
      "Visita Agendada": `Olá! Aqui é da Guaimbês Paisagismo. Confirmamos sua visita técnica agendada para ${lead.visit_date ? format(new Date(lead.visit_date), "dd/MM 'às' HH:mm", { locale: ptBR }) : "em breve"}. Qualquer dúvida, estamos à disposição!`,
      "Orçamento Enviado": `Olá! Aqui é da Guaimbês Paisagismo. Enviamos o orçamento para o projeto "${lead.title}". Ficamos à disposição para esclarecer qualquer dúvida!`,
    }
    return messages[stage.name] || `Olá! Aqui é da Guaimbês Paisagismo. Entramos em contato sobre "${lead.title}".`
  }

  const openWhatsApp = (lead: Lead, stage: PipelineStage) => {
    if (!lead.client?.phone) return
    const phone = lead.client.phone.replace(/\D/g, "")
    const message = encodeURIComponent(generateWhatsAppMessage(lead, stage))
    window.open(`https://wa.me/55${phone}?text=${message}`, "_blank")
  }

  const getLeadsByStage = (stageId: string) => {
    return leads.filter((lead) => lead.stage_id === stageId)
  }

  if (loading) {
    return <p className="text-muted-foreground text-center py-8">Carregando...</p>
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => (
        <div
          key={stage.id}
          className="flex-shrink-0 w-80"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(stage.id)}
        >
          <Card className="border-border/50 bg-muted/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                  <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {getLeadsByStage(stage.id).length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 min-h-[200px]">
              {getLeadsByStage(stage.id).map((lead) => (
                <Card
                  key={lead.id}
                  draggable
                  onDragStart={() => handleDragStart(lead)}
                  className="cursor-grab active:cursor-grabbing border-border/50 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm line-clamp-2">{lead.title}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-1">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/manager/crm/${lead.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver detalhes
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/manager/crm/${lead.id}/edit`}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          {lead.client_id && (
                            <DropdownMenuItem asChild>
                              <Link href={`/manager/quotes/new?client_id=${lead.client_id}&lead_id=${lead.id}`}>
                                <FileText className="w-4 h-4 mr-2" />
                                Criar Orçamento
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {lead.client?.phone && (
                            <DropdownMenuItem onClick={() => openWhatsApp(lead, stage)}>
                              <MessageCircle className="w-4 h-4 mr-2" />
                              WhatsApp
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(lead.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {lead.client && <p className="text-xs text-muted-foreground mb-3">{lead.client.name}</p>}

                    <div className="space-y-1.5">
                      {lead.estimated_value && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <DollarSign className="w-3 h-3" />
                          R$ {lead.estimated_value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                      )}
                      {lead.visit_date && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(lead.visit_date), "dd/MM 'às' HH:mm", { locale: ptBR })}
                        </div>
                      )}
                      {lead.client?.phone && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {lead.client.phone}
                        </div>
                      )}
                    </div>

                    {lead.source && (
                      <Badge variant="outline" className="mt-3 text-xs">
                        {sourceLabels[lead.source] || lead.source}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}

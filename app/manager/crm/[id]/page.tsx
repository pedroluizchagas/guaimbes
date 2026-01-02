import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Header } from "@/components/manager/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Pencil, FileText, MessageCircle, Calendar, DollarSign, Phone } from "lucide-react"
import type { Lead } from "@/lib/types/database"

const sourceLabels: Record<string, string> = {
  website: "Site",
  whatsapp: "WhatsApp",
  referral: "Indicação",
  instagram: "Instagram",
  other: "Outro",
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  const { data: lead, error } = await supabase
    .from("leads")
    .select(
      `
      *,
      client:clients(*),
      stage:pipeline_stages(*)
    `,
    )
    .eq("id", id)
    .single<Lead & { stage?: { color?: string; name?: string }; client?: { phone?: string; name?: string } }>()

  if (error || !lead) {
    notFound()
  }

  const phoneDigits = lead.client?.phone ? lead.client.phone.replace(/\D/g, "") : ""
  const whatsappUrl =
    phoneDigits.length > 0
      ? `https://wa.me/55${phoneDigits}?text=${encodeURIComponent(
          `Olá! Aqui é da Guaimbês Paisagismo. Sobre "${lead.title}", fico à disposição.`,
        )}`
      : undefined

  return (
    <div className="min-h-screen">
      <Header
        title={lead.title}
        description="Detalhes do lead"
        actions={
          <div className="flex gap-2">
            <Link href={`/manager/crm/${id}/edit`}>
              <Button variant="outline" size="sm">
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </Link>
            <Link
              href={`/manager/quotes/new?client_id=${lead.client_id || ""}&lead_id=${lead.id}`}
              className="inline-flex"
            >
              <Button className="bg-primary hover:bg-primary/90" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Criar Orçamento
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-4 lg:p-8">
        <Card className="border-border/50 max-w-3xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/manager/crm">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <CardTitle>{lead.title}</CardTitle>
              </div>
              {lead.stage?.name && (
                <Badge
                  className="text-white"
                  style={{ backgroundColor: lead.stage?.color || "#6B7280" }}
                >
                  {lead.stage?.name}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-medium">{lead.client?.name || "Não informado"}</p>
                {lead.client?.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {lead.client.phone}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Origem</p>
                <p className="font-medium">{lead.source ? sourceLabels[lead.source] || lead.source : "-"}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Valor Estimado</p>
                <p className="font-medium">
                  {lead.estimated_value != null
                    ? `R$ ${lead.estimated_value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                    : "-"}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Data da Visita</p>
                <p className="font-medium">
                  {lead.visit_date ? (
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(lead.visit_date).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  ) : (
                    "-"
                  )}
                </p>
              </div>
            </div>

            {lead.description && (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-1">Descrição</p>
                <p className="text-sm">{lead.description}</p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </a>
              )}
              {lead.estimated_value != null && (
                <Badge variant="outline" className="inline-flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {`R$ ${lead.estimated_value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


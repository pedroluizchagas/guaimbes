"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import type { Lead } from "@/lib/types/database"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function RecentLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeads = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("leads")
        .select(`
          *,
          client:clients(*),
          stage:pipeline_stages(*)
        `)
        .order("created_at", { ascending: false })
        .limit(5)

      setLeads(data || [])
      setLoading(false)
    }

    fetchLeads()
  }, [])

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Leads Recentes</CardTitle>
        <Link href="/manager/crm" className="text-sm text-secondary hover:underline flex items-center gap-1">
          Ver todos <ArrowRight className="w-4 h-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-center py-8">Carregando...</p>
        ) : leads.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Nenhum lead encontrado</p>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{lead.title}</p>
                  <p className="text-sm text-muted-foreground">{lead.client?.name || "Sem cliente"}</p>
                </div>
                <Badge style={{ backgroundColor: lead.stage?.color || "#6B7280" }} className="text-white">
                  {lead.stage?.name || "Novo"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

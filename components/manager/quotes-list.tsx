"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Quote } from "@/lib/types/database"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Pencil, Search, FileText, Send, CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const statusConfig = {
  draft: { label: "Rascunho", color: "bg-gray-500", icon: FileText },
  sent: { label: "Enviado", color: "bg-blue-500", icon: Send },
  approved: { label: "Aprovado", color: "bg-green-500", icon: CheckCircle },
  rejected: { label: "Rejeitado", color: "bg-red-500", icon: XCircle },
  expired: { label: "Expirado", color: "bg-yellow-500", icon: Clock },
}

export function QuotesList() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    const fetchQuotes = async () => {
      const supabase = createClient()
      let query = supabase
        .from("quotes")
        .select(
          `
          *,
          client:clients(*),
          lead:leads(*)
        `,
        )
        .order("created_at", { ascending: false })

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }

      const { data } = await query
      let filtered = data || []

      if (search) {
        filtered = filtered.filter(
          (q) =>
            q.quote_number.toLowerCase().includes(search.toLowerCase()) ||
            q.client?.name?.toLowerCase().includes(search.toLowerCase()),
        )
      }

      setQuotes(filtered)
      setLoading(false)
    }

    fetchQuotes()
  }, [search, statusFilter])

  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar orçamentos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-primary/20"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 border-primary/20">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="sent">Enviado</SelectItem>
              <SelectItem value="approved">Aprovado</SelectItem>
              <SelectItem value="rejected">Rejeitado</SelectItem>
              <SelectItem value="expired">Expirado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <p className="text-muted-foreground text-center py-8">Carregando...</p>
        ) : quotes.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Nenhum orçamento encontrado</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((quote) => {
                  const config = statusConfig[quote.status]
                  return (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">{quote.quote_number}</TableCell>
                      <TableCell>{quote.client?.name || "Sem cliente"}</TableCell>
                      <TableCell>R$ {quote.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>
                        {quote.valid_until ? format(new Date(quote.valid_until), "dd/MM/yyyy", { locale: ptBR }) : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${config.color} text-white`}>{config.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/manager/quotes/${quote.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/manager/quotes/${quote.id}/edit`}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

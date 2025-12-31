"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Contract } from "@/lib/types/database"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Pencil, Search, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"
import { format, differenceInDays } from "date-fns"
import { ptBR } from "date-fns/locale"

const statusConfig = {
  active: { label: "Ativo", color: "bg-green-500" },
  suspended: { label: "Suspenso", color: "bg-yellow-500" },
  cancelled: { label: "Cancelado", color: "bg-red-500" },
  expired: { label: "Expirado", color: "bg-gray-500" },
}

export function ContractsList() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    const fetchContracts = async () => {
      const supabase = createClient()
      let query = supabase
        .from("contracts")
        .select(`
          *,
          client:clients(*)
        `)
        .order("created_at", { ascending: false })

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }

      const { data } = await query
      let filtered = data || []

      if (search) {
        filtered = filtered.filter(
          (c) =>
            c.contract_number.toLowerCase().includes(search.toLowerCase()) ||
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.client?.name?.toLowerCase().includes(search.toLowerCase()),
        )
      }

      setContracts(filtered)
      setLoading(false)
    }

    fetchContracts()
  }, [search, statusFilter])

  const getDaysUntilExpiry = (endDate: string | null) => {
    if (!endDate) return null
    return differenceInDays(new Date(endDate), new Date())
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar contratos..."
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
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="suspended">Suspenso</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
              <SelectItem value="expired">Expirado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <p className="text-muted-foreground text-center py-8">Carregando...</p>
        ) : contracts.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Nenhum contrato encontrado</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor Mensal</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => {
                  const daysUntilExpiry = getDaysUntilExpiry(contract.end_date)
                  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0

                  return (
                    <TableRow key={contract.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{contract.contract_number}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{contract.title}</p>
                        </div>
                      </TableCell>
                      <TableCell>{contract.client?.name || "Sem cliente"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          R$ {contract.monthly_value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                      </TableCell>
                      <TableCell>
                        {contract.end_date ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p>{format(new Date(contract.end_date), "dd/MM/yyyy", { locale: ptBR })}</p>
                              {isExpiringSoon && (
                                <p className="text-xs text-yellow-600">{daysUntilExpiry} dias restantes</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <Badge variant="outline">Sem prazo</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusConfig[contract.status].color} text-white`}>
                          {statusConfig[contract.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/manager/contracts/${contract.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/manager/contracts/${contract.id}/edit`}>
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

"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Wrench, AlertTriangle, CheckCircle, XCircle, Settings } from "lucide-react"
import Link from "next/link"
import { format, differenceInDays } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Equipment {
  id: string
  name: string
  type: string | null
  serial_number: string | null
  status: "disponivel" | "em_uso" | "manutencao" | "inativo"
  purchase_date: string | null
  last_maintenance: string | null
  next_maintenance: string | null
  notes: string | null
  created_at: string
}

export function EquipmentList() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const supabase = createClient()

  useEffect(() => {
    fetchEquipment()
  }, [])

  async function fetchEquipment() {
    setLoading(true)

    const { data, error } = await supabase.from("equipment").select("*").order("name")

    if (!error && data) {
      setEquipment(data)
    }

    setLoading(false)
  }

  async function updateStatus(id: string, status: Equipment["status"]) {
    const { error } = await supabase.from("equipment").update({ status }).eq("id", id)

    if (!error) {
      fetchEquipment()
    }
  }

  const filteredEquipment = equipment.filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(search.toLowerCase()) ||
      eq.serial_number?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === "all" || eq.status === statusFilter

    return matchesSearch && matchesStatus
  })

  function getStatusBadge(status: Equipment["status"]) {
    switch (status) {
      case "disponivel":
        return <Badge className="bg-primary/80 hover:bg-primary text-primary-foreground">Disponível</Badge>
      case "em_uso":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Em Uso</Badge>
      case "manutencao":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white">Manutenção</Badge>
      case "inativo":
        return <Badge variant="secondary">Inativo</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  function getMaintenanceAlert(nextMaintenance: string | null) {
    if (!nextMaintenance) return null

    const days = differenceInDays(new Date(nextMaintenance), new Date())

    if (days < 0) {
      return (
        <span className="flex items-center gap-1 text-xs text-destructive">
          <XCircle className="h-3 w-3" />
          Atrasada
        </span>
      )
    }
    if (days <= 7) {
      return (
        <span className="flex items-center gap-1 text-xs text-amber-600">
          <AlertTriangle className="h-3 w-3" />
          Em {days} dias
        </span>
      )
    }
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <CheckCircle className="h-3 w-3" />
        Em {days} dias
      </span>
    )
  }

  const stats = {
    total: equipment.length,
    available: equipment.filter((e) => e.status === "disponivel").length,
    inUse: equipment.filter((e) => e.status === "em_uso").length,
    maintenance: equipment.filter((e) => e.status === "manutencao").length,
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.available}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Em Uso</CardTitle>
            <Settings className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inUse}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Manutenção</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.maintenance}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Lista de Equipamentos</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar equipamento..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-full sm:w-[200px]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="em_uso">Em Uso</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : filteredEquipment.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Wrench className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Nenhum equipamento encontrado</h3>
              <p className="text-muted-foreground">
                {equipment.length === 0 ? "Comece cadastrando seus equipamentos" : "Tente ajustar os filtros de busca"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipamento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Última Manutenção</TableHead>
                    <TableHead>Próxima Manutenção</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEquipment.map((eq) => (
                    <TableRow key={eq.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{eq.name}</p>
                          {eq.serial_number && <p className="text-xs text-muted-foreground">S/N: {eq.serial_number}</p>}
                        </div>
                      </TableCell>
                      <TableCell>{eq.type || "-"}</TableCell>
                      <TableCell>{getStatusBadge(eq.status)}</TableCell>
                      <TableCell>
                        {eq.last_maintenance
                          ? format(new Date(eq.last_maintenance), "dd/MM/yyyy", { locale: ptBR })
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          {eq.next_maintenance
                            ? format(new Date(eq.next_maintenance), "dd/MM/yyyy", { locale: ptBR })
                            : "-"}
                          {getMaintenanceAlert(eq.next_maintenance)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={eq.status}
                          onValueChange={(value) => updateStatus(eq.id, value as Equipment["status"])}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="disponivel">Disponível</SelectItem>
                            <SelectItem value="em_uso">Em Uso</SelectItem>
                            <SelectItem value="manutencao">Manutenção</SelectItem>
                            <SelectItem value="inativo">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

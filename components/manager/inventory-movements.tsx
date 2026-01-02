"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Package } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Movement {
  id: string
  item_id: string
  type: "entry" | "exit" | "adjustment" | "loss"
  quantity: number
  reason: string | null
  created_at: string
  item: {
    name: string
    unit: string
  }
}

export function InventoryMovements() {
  const [movements, setMovements] = useState<Movement[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const supabase = createClient()

  useEffect(() => {
    fetchMovements()
  }, [])

  async function fetchMovements() {
    setLoading(true)

    const { data, error } = await supabase
      .from("inventory_movements")
      .select(`
        *,
        item:inventory_items(name, unit)
      `)
      .order("created_at", { ascending: false })
      .limit(100)

    if (!error && data) {
      setMovements(data as Movement[])
    }

    setLoading(false)
  }

  const filteredMovements = movements.filter((m) => {
    if (typeFilter === "all") return true
    if (typeFilter === "entrada") return m.type === "entry"
    if (typeFilter === "saida") return m.type === "exit"
    if (typeFilter === "ajuste") return m.type === "adjustment"
    return true
  })

  function getMovementIcon(type: string) {
    switch (type) {
      case "entry":
        return <ArrowDownLeft className="h-4 w-4 text-primary" />
      case "exit":
        return <ArrowUpRight className="h-4 w-4 text-destructive" />
      case "adjustment":
        return <Package className="h-4 w-4 text-muted-foreground" />
      default:
        return <Package className="h-4 w-4 text-muted-foreground" />
    }
  }

  function getMovementBadge(type: string) {
    switch (type) {
      case "entry":
        return <Badge className="bg-primary/80 hover:bg-primary text-primary-foreground">Entrada</Badge>
      case "exit":
        return <Badge variant="destructive">Saída</Badge>
      case "adjustment":
        return <Badge variant="secondary">Ajuste</Badge>
      default:
        return <Badge variant="destructive">Perda</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/manager/inventory">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Movimentações</h1>
          <p className="text-muted-foreground">Histórico de entradas e saídas do estoque</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Histórico</CardTitle>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="entrada">Entradas</SelectItem>
                <SelectItem value="saida">Saídas</SelectItem>
                <SelectItem value="ajuste">Ajustes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : filteredMovements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Nenhuma movimentação</h3>
              <p className="text-muted-foreground">As movimentações de estoque aparecerão aqui</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-center">Quantidade</TableHead>
                    <TableHead>Observações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(movement.created_at), "dd/MM/yyyy HH:mm", {
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getMovementIcon(movement.type)}
                          <span className="font-medium">{movement.item?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getMovementBadge(movement.type)}</TableCell>
                      <TableCell className="text-center font-medium">
                        {movement.type === "entry" ? "+" : movement.type === "exit" ? "-" : ""}
                        {movement.quantity} {movement.item?.unit}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{movement.reason || "-"}</TableCell>
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

"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, Package, AlertTriangle, TrendingDown, ArrowUpDown, Minus, History } from "lucide-react"
import Link from "next/link"
import type { InventoryItem } from "@/lib/types/database"

interface InventoryStats {
  totalItems: number
  lowStock: number
  outOfStock: number
  totalValue: number
}

export function InventoryDashboard() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [stats, setStats] = useState<InventoryStats>({
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
  })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<string>("all")
  const [movementDialog, setMovementDialog] = useState<{
    open: boolean
    item: InventoryItem | null
    type: "in" | "out"
  }>({ open: false, item: null, type: "in" })
  const [movementQuantity, setMovementQuantity] = useState("")
  const [movementNotes, setMovementNotes] = useState("")

  const supabase = createClient()

  useEffect(() => {
    fetchInventory()
  }, [])

  async function fetchInventory() {
    setLoading(true)

    const { data, error } = await supabase.from("inventory_items").select("*").order("name")

    if (!error && data) {
      setItems(data)

      const lowStockCount = data.filter((item) => item.current_stock <= item.min_stock && item.current_stock > 0).length
      const outOfStockCount = data.filter((item) => item.current_stock === 0).length
      const totalValue = data.reduce((sum, item) => sum + item.current_stock * item.unit_cost, 0)

      setStats({
        totalItems: data.length,
        lowStock: lowStockCount,
        outOfStock: outOfStockCount,
        totalValue,
      })
    }

    setLoading(false)
  }

  async function handleMovement() {
    if (!movementDialog.item || !movementQuantity) return

    const quantity = Number.parseInt(movementQuantity)
    if (isNaN(quantity) || quantity <= 0) return

    const newStock =
      movementDialog.type === "in"
        ? movementDialog.item.current_stock + quantity
        : Math.max(0, movementDialog.item.current_stock - quantity)

    const { error: updateError } = await supabase
      .from("inventory_items")
      .update({ current_stock: newStock })
      .eq("id", movementDialog.item.id)

    if (!updateError) {
      await supabase.from("inventory_movements").insert({
        inventory_item_id: movementDialog.item.id,
        movement_type: movementDialog.type === "in" ? "entrada" : "saida",
        quantity: quantity,
        notes: movementNotes || null,
      })

      fetchInventory()
      setMovementDialog({ open: false, item: null, type: "in" })
      setMovementQuantity("")
      setMovementNotes("")
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) || item.sku?.toLowerCase().includes(search.toLowerCase())

    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && item.current_stock <= item.min_stock && item.current_stock > 0) ||
      (stockFilter === "out" && item.current_stock === 0) ||
      (stockFilter === "ok" && item.current_stock > item.min_stock)

    return matchesSearch && matchesCategory && matchesStock
  })

  const categories = [...new Set(items.map((item) => item.category).filter(Boolean))]

  function getStockStatus(item: InventoryItem) {
    if (item.current_stock === 0) {
      return <Badge variant="destructive">Sem Estoque</Badge>
    }
    if (item.current_stock <= item.min_stock) {
      return <Badge className="bg-amber-500 hover:bg-amber-600 text-white">Estoque Baixo</Badge>
    }
    return <Badge className="bg-primary/80 hover:bg-primary text-primary-foreground">Normal</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">itens cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <TrendingDown className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground">itens abaixo do mínimo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sem Estoque</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.outOfStock}</div>
            <p className="text-xs text-muted-foreground">itens esgotados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Valor em Estoque</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalValue.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <p className="text-xs text-muted-foreground">valor total</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Itens do Estoque</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar item..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-full sm:w-[200px]"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat!}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ok">Normal</SelectItem>
                  <SelectItem value="low">Estoque Baixo</SelectItem>
                  <SelectItem value="out">Sem Estoque</SelectItem>
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
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Nenhum item encontrado</h3>
              <p className="text-muted-foreground">
                {items.length === 0 ? "Comece adicionando itens ao estoque" : "Tente ajustar os filtros de busca"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-center">Estoque</TableHead>
                    <TableHead className="text-center">Mín.</TableHead>
                    <TableHead>Custo Unit.</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.sku && <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>}
                        </div>
                      </TableCell>
                      <TableCell>{item.category || "-"}</TableCell>
                      <TableCell className="text-center font-medium">
                        {item.current_stock} {item.unit}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {item.min_stock} {item.unit}
                      </TableCell>
                      <TableCell>
                        {item.unit_cost.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                      <TableCell>{getStockStatus(item)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setMovementDialog({
                                open: true,
                                item,
                                type: "in",
                              })
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setMovementDialog({
                                open: true,
                                item,
                                type: "out",
                              })
                            }
                            disabled={item.current_stock === 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/manager/inventory/${item.id}`}>
                              <ArrowUpDown className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={movementDialog.open} onOpenChange={(open) => setMovementDialog((prev) => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{movementDialog.type === "in" ? "Entrada" : "Saída"} de Estoque</DialogTitle>
            <DialogDescription>{movementDialog.item?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Quantidade ({movementDialog.item?.unit})</Label>
              <Input
                type="number"
                min="1"
                value={movementQuantity}
                onChange={(e) => setMovementQuantity(e.target.value)}
                placeholder="Digite a quantidade"
              />
            </div>
            <div className="space-y-2">
              <Label>Observações (opcional)</Label>
              <Input
                value={movementNotes}
                onChange={(e) => setMovementNotes(e.target.value)}
                placeholder="Ex: Compra fornecedor X"
              />
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm text-muted-foreground">
                Estoque atual:{" "}
                <strong>
                  {movementDialog.item?.current_stock} {movementDialog.item?.unit}
                </strong>
              </p>
              {movementQuantity && !isNaN(Number.parseInt(movementQuantity)) && (
                <p className="text-sm text-muted-foreground">
                  Novo estoque:{" "}
                  <strong>
                    {movementDialog.type === "in"
                      ? (movementDialog.item?.current_stock || 0) + Number.parseInt(movementQuantity)
                      : Math.max(0, (movementDialog.item?.current_stock || 0) - Number.parseInt(movementQuantity))}{" "}
                    {movementDialog.item?.unit}
                  </strong>
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMovementDialog({ open: false, item: null, type: "in" })}>
              Cancelar
            </Button>
            <Button onClick={handleMovement}>Confirmar {movementDialog.type === "in" ? "Entrada" : "Saída"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

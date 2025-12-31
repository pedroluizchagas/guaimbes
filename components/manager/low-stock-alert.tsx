"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import type { InventoryItem } from "@/lib/types/database"
import Link from "next/link"
import { ArrowRight, AlertTriangle } from "lucide-react"

export function LowStockAlert() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      const supabase = createClient()

      const { data } = await supabase
        .from("inventory_items")
        .select(`
          *,
          category:inventory_categories(*)
        `)
        .eq("is_active", true)
        .order("current_quantity", { ascending: true })
        .limit(5)

      // Filter items where current_quantity <= min_quantity
      const lowStock = (data || []).filter((item) => item.current_quantity <= item.min_quantity)

      setItems(lowStock)
      setLoading(false)
    }

    fetchItems()
  }, [])

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          Estoque Baixo
        </CardTitle>
        <Link href="/manager/inventory" className="text-sm text-secondary hover:underline flex items-center gap-1">
          Ver estoque <ArrowRight className="w-4 h-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-center py-8">Carregando...</p>
        ) : items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-green-600 font-medium">Estoque OK!</p>
            <p className="text-sm text-muted-foreground">Todos os itens estão acima do mínimo</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.category?.name || "Sem categoria"}</p>
                </div>
                <div className="text-right">
                  <Badge variant="destructive" className="mb-1">
                    {item.current_quantity} {item.unit}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Mín: {item.min_quantity} {item.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

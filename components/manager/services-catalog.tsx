"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Service } from "@/lib/types/database"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Pencil, Search } from "lucide-react"
import Link from "next/link"

const categoryLabels = {
  landscaping: "Paisagismo",
  maintenance: "Manutenção",
  planting: "Plantio",
  irrigation: "Irrigação",
  other: "Outro",
}

export function ServicesCatalog() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchServices()
  }, [search])

  const fetchServices = async () => {
    const supabase = createClient()
    let query = supabase.from("services").select("*").order("name")

    if (search) {
      query = query.ilike("name", `%${search}%`)
    }

    const { data } = await query
    setServices(data || [])
    setLoading(false)
  }

  const toggleActive = async (service: Service) => {
    const supabase = createClient()
    const { error } = await supabase.from("services").update({ is_active: !service.is_active }).eq("id", service.id)

    if (!error) {
      setServices((prev) => prev.map((s) => (s.id === service.id ? { ...s, is_active: !s.is_active } : s)))
    }
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar serviços..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-primary/20"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground text-center py-8">Carregando...</p>
        ) : services.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Nenhum serviço encontrado</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Valor Unit.</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        {service.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">{service.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{categoryLabels[service.category]}</Badge>
                    </TableCell>
                    <TableCell>{service.unit}</TableCell>
                    <TableCell>R$ {service.unit_price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <Switch checked={service.is_active} onCheckedChange={() => toggleActive(service)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/manager/services/${service.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

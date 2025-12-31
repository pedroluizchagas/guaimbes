"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Transaction, Client, TransactionType, TransactionStatus, PaymentMethod } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

const incomeCategories = ["Serviço de Paisagismo", "Manutenção Mensal", "Venda de Mudas", "Consultoria", "Outros"]
const expenseCategories = [
  "Insumos",
  "Combustível",
  "Manutenção de Equipamentos",
  "Salários",
  "Aluguel",
  "Energia",
  "Outros",
]

interface TransactionFormProps {
  transaction?: Transaction
}

export function TransactionForm({ transaction }: TransactionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clients, setClients] = useState<Client[]>([])

  const [formData, setFormData] = useState({
    type: transaction?.type || ("income" as TransactionType),
    category: transaction?.category || "",
    description: transaction?.description || "",
    amount: transaction?.amount?.toString() || "",
    due_date: transaction?.due_date || new Date().toISOString().split("T")[0],
    payment_date: transaction?.payment_date || "",
    status: transaction?.status || ("pending" as TransactionStatus),
    payment_method: transaction?.payment_method || ("" as PaymentMethod | ""),
    client_id: transaction?.client_id || "",
    notes: transaction?.notes || "",
  })

  useEffect(() => {
    const fetchClients = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("clients").select("*").order("name")
      setClients(data || [])
    }
    fetchClients()
  }, [])

  const categories = formData.type === "income" ? incomeCategories : expenseCategories

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const payload = {
      ...formData,
      amount: Number.parseFloat(formData.amount) || 0,
      client_id: formData.client_id || null,
      payment_date: formData.payment_date || null,
      payment_method: formData.payment_method || null,
      created_by: user?.id,
    }

    try {
      if (transaction) {
        const { error } = await supabase.from("transactions").update(payload).eq("id", transaction.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("transactions").insert(payload)
        if (error) throw error
      }
      router.push("/manager/financial")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar transação")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/50 max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Link href="/manager/financial">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <CardTitle>{transaction ? "Editar Transação" : "Nova Transação"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: TransactionType) => setFormData({ ...formData, type: value, category: "" })}
              >
                <SelectTrigger className="border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Receita</SelectItem>
                  <SelectItem value="expense">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="border-primary/20">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Descrição *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Serviço de paisagismo - Cliente X"
                required
                className="border-primary/20"
              />
            </div>

            <div>
              <Label htmlFor="amount">Valor (R$) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                className="border-primary/20"
              />
            </div>

            <div>
              <Label htmlFor="client_id">Cliente</Label>
              <Select
                value={formData.client_id}
                onValueChange={(value) => setFormData({ ...formData, client_id: value })}
              >
                <SelectTrigger className="border-primary/20">
                  <SelectValue placeholder="Selecione (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="due_date">Data de Vencimento *</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                required
                className="border-primary/20"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: TransactionStatus) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="overdue">Atrasado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.status === "paid" && (
              <>
                <div>
                  <Label htmlFor="payment_date">Data de Pagamento</Label>
                  <Input
                    id="payment_date"
                    type="date"
                    value={formData.payment_date}
                    onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                    className="border-primary/20"
                  />
                </div>

                <div>
                  <Label htmlFor="payment_method">Forma de Pagamento</Label>
                  <Select
                    value={formData.payment_method}
                    onValueChange={(value: PaymentMethod) => setFormData({ ...formData, payment_method: value })}
                  >
                    <SelectTrigger className="border-primary/20">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="bank_transfer">Transferência</SelectItem>
                      <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                      <SelectItem value="boleto">Boleto</SelectItem>
                      <SelectItem value="cash">Dinheiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                className="border-primary/20"
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</p>}

          <div className="flex justify-end gap-4">
            <Link href="/manager/financial">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

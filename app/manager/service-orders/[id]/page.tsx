import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Header } from "@/components/manager/header"
import { ServiceOrderDetail } from "@/components/manager/service-order-detail"

export default async function ServiceOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  const { data: order, error } = await supabase
    .from("service_orders")
    .select(`
      *,
      client:clients(*),
      quote:quotes(*)
    `)
    .eq("id", id)
    .single()

  if (error || !order) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header title={`OS ${order.order_number}`} description={order.title} />
      <div className="p-4 lg:p-8">
        <ServiceOrderDetail order={order} />
      </div>
    </div>
  )
}

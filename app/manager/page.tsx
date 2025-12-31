import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/manager/header"
import { DashboardStats } from "@/components/manager/dashboard-stats"
import { RecentLeads } from "@/components/manager/recent-leads"
import { UpcomingServices } from "@/components/manager/upcoming-services"
import { FinancialOverview } from "@/components/manager/financial-overview"
import { LowStockAlert } from "@/components/manager/low-stock-alert"

export default async function ManagerDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen">
      <Header title="Dashboard" description="Visão geral do seu negócio" />
      <div className="p-4 lg:p-8 space-y-6">
        <DashboardStats />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentLeads />
          <UpcomingServices />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FinancialOverview />
          <LowStockAlert />
        </div>
      </div>
    </div>
  )
}

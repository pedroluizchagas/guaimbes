import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/manager/header"
import { ScheduleCalendar } from "@/components/manager/schedule-calendar"

export default async function SchedulePage() {
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
      <Header title="Agenda" description="Visualize e gerencie os serviços agendados" />
      <div className="p-4 lg:p-8">
        <ScheduleCalendar />
      </div>
    </div>
  )
}

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/manager/header"
import { ProfileForm } from "@/components/manager/profile-form"

export default async function ProfilePage() {
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
      <Header title="Perfil" description="Atualize seu nome e avatar" />
      <div className="p-4 lg:p-8">
        <ProfileForm />
      </div>
    </div>
  )
}


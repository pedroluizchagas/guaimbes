"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { Save, Upload } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export function ProfileForm() {
  const { user, profile } = useAuth()
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "")
      setPhone(profile.phone || "")
      setAvatarUrl(profile.avatar_url || null)
      setAvatarPreview(profile.avatar_url || null)
    }
  }, [profile])

  async function handleUploadAvatar(file: File) {
    try {
      const fileExt = file.name.split(".").pop()
      const filePath = `${user?.id}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, {
        upsert: true,
      })
      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filePath)
      const publicUrl = publicUrlData.publicUrl
      setAvatarUrl(publicUrl)
      setAvatarPreview(publicUrl)

      toast({
        title: "Avatar atualizado",
        description: "Sua foto de perfil foi enviada com sucesso.",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar avatar")
    }
  }

  const onChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    const localPreview = URL.createObjectURL(file)
    setAvatarPreview(localPreview)
    handleUploadAvatar(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (!user?.id) throw new Error("Usuário não autenticado")
      const payload: { full_name: string; phone?: string; avatar_url?: string } = {
        full_name: fullName,
      }
      if (phone) payload.phone = phone
      if (avatarUrl) payload.avatar_url = avatarUrl

      const { error: updateError } = await supabase.from("profiles").update(payload).eq("id", user.id)
      if (updateError) throw updateError

      toast({
        title: "Perfil salvo",
        description: "Seu perfil foi atualizado com sucesso.",
      })

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar perfil")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/50 max-w-2xl">
      <CardHeader>
        <CardTitle>Editar Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={avatarPreview || ""} alt={fullName || "Avatar"} />
              <AvatarFallback>{fullName?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="avatar">Avatar</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={onChangeAvatar}
                  className="border-primary/20"
                />
                <Button type="button" variant="outline" onClick={() => document.getElementById("avatar")?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Enviar
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="full_name">Nome</Label>
              <Input
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="border-primary/20"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border-primary/20"
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</p>}

          <div className="flex justify-end gap-4">
            <Link href="/manager">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}


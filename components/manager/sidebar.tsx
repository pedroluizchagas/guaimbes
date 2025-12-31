"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/hooks/use-auth"
import Image from "next/image"
import {
  LayoutDashboard,
  Users,
  Kanban,
  FileText,
  Calendar,
  ClipboardList,
  DollarSign,
  FileSignature,
  Package,
  Wrench,
  LogOut,
  Menu,
  X,
  ListChecks,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/manager", icon: LayoutDashboard },
  { name: "Clientes", href: "/manager/clients", icon: Users },
  { name: "Funil de Vendas", href: "/manager/crm", icon: Kanban },
  { name: "Catálogo de Serviços", href: "/manager/services", icon: ListChecks },
  { name: "Orçamentos", href: "/manager/quotes", icon: FileText },
  { name: "Agenda", href: "/manager/schedule", icon: Calendar },
  { name: "Ordens de Serviço", href: "/manager/service-orders", icon: ClipboardList },
  { name: "Financeiro", href: "/manager/financial", icon: DollarSign },
  { name: "Contratos", href: "/manager/contracts", icon: FileSignature },
  { name: "Estoque", href: "/manager/inventory", icon: Package },
  { name: "Equipamentos", href: "/manager/equipment", icon: Wrench },
]

export function Sidebar() {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const NavContent = () => (
    <>
      <div className="flex items-center gap-3 px-4 py-6 border-b border-border">
        <Image src="/images/icon.png" alt="Guaimbês" width={40} height={40} className="w-10 h-10" />
        <div>
          <h1 className="font-bold text-primary text-lg">Guaimbês</h1>
          <p className="text-xs text-muted-foreground">Manager</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/manager" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent",
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.full_name || "Usuário"}</p>
            <p className="text-xs text-muted-foreground capitalize">{profile?.role || "field_team"}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={signOut}
        >
          <LogOut className="w-5 h-5" />
          Sair
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {/* Mobile sidebar */}
      <div className={cn("fixed inset-0 z-40 lg:hidden", mobileOpen ? "block" : "hidden")}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
        <aside className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border flex flex-col">
          <NavContent />
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r border-border">
        <NavContent />
      </aside>
    </>
  )
}

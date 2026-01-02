import type React from "react"
import { Sidebar } from "@/components/manager/sidebar"
import { Toaster } from "@/components/ui/toaster"

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />
      <main className="lg:pl-72">
        {children}
        <Toaster />
      </main>
    </div>
  )
}

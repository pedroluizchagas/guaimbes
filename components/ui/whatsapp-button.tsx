"use client"

import type React from "react"

import { MessageCircle } from "lucide-react"
import { WHATSAPP_URL } from "@/lib/constants"

interface WhatsAppButtonProps {
  className?: string
  variant?: "floating" | "inline"
  children?: React.ReactNode
}

export function WhatsAppButton({ className = "", variant = "inline", children }: WhatsAppButtonProps) {
  const baseStyles = "flex items-center justify-center gap-2 font-medium transition-all duration-300"

  const variantStyles = {
    floating:
      "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 hover:shadow-xl",
    inline: "rounded-lg bg-[#25D366] px-6 py-3 text-white hover:bg-[#20BA5C] hover:shadow-lg",
  }

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      aria-label="Entrar em contato pelo WhatsApp"
    >
      <MessageCircle className={variant === "floating" ? "h-7 w-7" : "h-5 w-5"} />
      {children}
    </a>
  )
}

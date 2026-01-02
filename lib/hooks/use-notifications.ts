'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import type { ServiceOrder } from '@/lib/types/database'

type NotificationType = 'service_order' | 'quote' | 'inventory' | 'contract' | 'system'

interface Notification {
  id: string
  type: NotificationType
  title: string
  description?: string
  created_at: string
  read: boolean
  link?: string
  metadata?: Record<string, unknown>
}

function makeId(prefix = 'notif') {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabaseRef.current = supabase

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'service_orders' },
        (payload) => {
          const row = payload.new as ServiceOrder
          const n: Notification = {
            id: makeId('so-new'),
            type: 'service_order',
            title: 'Nova OS agendada',
            description: `${row.title} para ${row.scheduled_date}`,
            created_at: new Date().toISOString(),
            read: false,
            link: `/manager/service-orders/${row.id}`,
            metadata: { order_number: row.order_number, status: row.status, priority: row.priority },
          }
          setNotifications((prev) => [n, ...prev])
          toast({
            title: n.title,
            description: n.description,
          })
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'service_orders' },
        (payload) => {
          const oldRow = payload.old as ServiceOrder
          const newRow = payload.new as ServiceOrder
          if (oldRow.status !== newRow.status) {
            const statusLabels: Record<ServiceOrder['status'], string> = {
              scheduled: 'Agendada',
              in_progress: 'Em andamento',
              completed: 'Concluída',
              cancelled: 'Cancelada',
            }
            const n: Notification = {
              id: makeId('so-status'),
              type: 'service_order',
              title: `OS ${newRow.order_number} atualizada`,
              description: `Status: ${statusLabels[newRow.status]}`,
              created_at: new Date().toISOString(),
              read: false,
              link: `/manager/service-orders/${newRow.id}`,
              metadata: { from: oldRow.status, to: newRow.status },
            }
            setNotifications((prev) => [n, ...prev])
            toast({
              title: n.title,
              description: n.description,
            })
          }
        },
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  const markAsRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))

  const markAllAsRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))

  const clearNotifications = () => setNotifications([])

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  }
}


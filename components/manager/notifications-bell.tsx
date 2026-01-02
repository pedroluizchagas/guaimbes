'use client'

import { useRouter } from 'next/navigation'
import { Bell, CheckCheck, Trash2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNotifications } from '@/lib/hooks/use-notifications'

export function NotificationsBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications()
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1">
          <DropdownMenuLabel>Notificações</DropdownMenuLabel>
          <div className="text-xs text-muted-foreground">{unreadCount} não lida(s)</div>
        </div>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="px-3 py-4 text-sm text-muted-foreground">Sem notificações</div>
        ) : (
          <>
            {notifications.slice(0, 10).map((n) => (
              <DropdownMenuItem
                key={n.id}
                onClick={() => {
                  markAsRead(n.id)
                  if (n.link) router.push(n.link)
                }}
                className="flex items-start gap-3 cursor-pointer"
              >
                <div className={`mt-1 h-2 w-2 rounded-full ${n.read ? 'bg-border' : 'bg-secondary'}`} />
                <div className="flex-1">
                  <div className="font-medium text-sm">{n.title}</div>
                  {n.description && <div className="text-xs text-muted-foreground">{n.description}</div>}
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <span>{new Date(n.created_at).toLocaleString('pt-BR')}</span>
                    {n.link && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-0.5">
                          Abrir <ChevronRight className="h-3 w-3" />
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            {notifications.length > 10 && (
              <div className="px-3 py-2 text-xs text-muted-foreground">+ {notifications.length - 10} mais</div>
            )}
          </>
        )}
        <DropdownMenuSeparator />
        <div className="flex items-center gap-2 px-2 py-1">
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-1">
            <CheckCheck className="h-4 w-4" />
            Marcar todas como lidas
          </Button>
          <Button variant="ghost" size="sm" onClick={clearNotifications} className="gap-1">
            <Trash2 className="h-4 w-4" />
            Limpar
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { ServiceOrder } from "@/lib/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock, User } from "lucide-react"
import Link from "next/link"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import { ptBR } from "date-fns/locale"

const typeColors = {
  maintenance: "bg-blue-500",
  implementation: "bg-purple-500",
  emergency: "bg-red-500",
}

const typeLabels = {
  maintenance: "Manutenção",
  implementation: "Implantação",
  emergency: "Emergência",
}

export function ScheduleCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [currentMonth])

  const fetchOrders = async () => {
    const supabase = createClient()
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)

    const { data } = await supabase
      .from("service_orders")
      .select(
        `
        *,
        client:clients(*)
      `,
      )
      .gte("scheduled_date", start.toISOString().split("T")[0])
      .lte("scheduled_date", end.toISOString().split("T")[0])
      .order("scheduled_date", { ascending: true })

    setOrders(data || [])
    setLoading(false)
  }

  const getOrdersForDate = (date: Date) => {
    return orders.filter((order) => isSameDay(new Date(order.scheduled_date), date))
  }

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-semibold capitalize">{format(currentMonth, "MMMM yyyy", { locale: ptBR })}</h2>
        <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <Link href="/manager/service-orders/new">
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Nova OS
        </Button>
      </Link>
    </div>
  )

  const renderDays = () => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>
    )
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const rows = []
    let days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day
        const dayOrders = getOrdersForDate(currentDay)
        const isSelected = isSameDay(currentDay, selectedDate)
        const isCurrentMonth = isSameMonth(currentDay, currentMonth)
        const isToday = isSameDay(currentDay, new Date())

        days.push(
          <div
            key={currentDay.toString()}
            className={`min-h-24 border border-border/50 p-1 cursor-pointer transition-colors ${
              !isCurrentMonth ? "bg-muted/30 text-muted-foreground" : ""
            } ${isSelected ? "bg-primary/10 border-primary" : "hover:bg-accent/50"}`}
            onClick={() => setSelectedDate(currentDay)}
          >
            <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary font-bold" : ""}`}>
              {format(currentDay, "d")}
            </div>
            <div className="space-y-1">
              {dayOrders.slice(0, 3).map((order) => (
                <Link key={order.id} href={`/manager/service-orders/${order.id}`} onClick={(e) => e.stopPropagation()}>
                  <div
                    className={`text-xs p-1 rounded truncate text-white ${typeColors[order.service_type]} hover:opacity-80`}
                  >
                    {order.scheduled_time?.slice(0, 5)} {order.client?.name?.split(" ")[0]}
                  </div>
                </Link>
              ))}
              {dayOrders.length > 3 && (
                <div className="text-xs text-muted-foreground text-center">+{dayOrders.length - 3} mais</div>
              )}
            </div>
          </div>,
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>,
      )
      days = []
    }

    return <div>{rows}</div>
  }

  const selectedDateOrders = getOrdersForDate(selectedDate)

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <Card className="border-border/50 xl:col-span-2">
        <CardContent className="p-6">
          {renderHeader()}
          {renderDays()}
          {loading ? <p className="text-center py-8 text-muted-foreground">Carregando...</p> : renderCells()}
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">
            {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            <span className="text-sm font-normal text-muted-foreground ml-2">({selectedDateOrders.length} OS)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum serviço agendado</p>
          ) : (
            <div className="space-y-4">
              {selectedDateOrders.map((order) => (
                <Link key={order.id} href={`/manager/service-orders/${order.id}`}>
                  <Card className="border-border/50 hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium line-clamp-1">{order.title}</h4>
                        <Badge className={`${typeColors[order.service_type]} text-white text-xs`}>
                          {typeLabels[order.service_type]}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {order.client && (
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3" />
                            {order.client.name}
                          </div>
                        )}
                        {order.scheduled_time && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {order.scheduled_time.slice(0, 5)}
                            {order.estimated_duration && ` (${order.estimated_duration} min)`}
                          </div>
                        )}
                        {order.neighborhood && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            {order.neighborhood}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

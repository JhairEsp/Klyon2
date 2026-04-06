"use client"

import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Plus, 
  Scissors,
  User,
  Calendar,
  Clock,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function BarbersPage() {
  const { barbers, appointments, queue, toggleBarberAvailability } = useApp()
  
  const barbershopBarbers = barbers.filter(b => b.business_id === 'barber-1')
  const today = new Date().toISOString().split('T')[0]

  const getBarberStats = (barberId: string) => {
    const todayAppointments = appointments.filter(
      a => a.barber_id === barberId && a.date === today
    )
    const completed = todayAppointments.filter(a => a.status === 'finalizado').length
    const pending = todayAppointments.filter(a => a.status === 'pendiente').length
    const inProgress = todayAppointments.filter(a => a.status === 'en_proceso').length
    const currentQueue = queue.filter(q => q.barber_id === barberId && q.status === 'en_proceso')

    return { total: todayAppointments.length, completed, pending, inProgress, currentQueue }
  }

  const availableCount = barbershopBarbers.filter(b => b.available).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Scissors className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Equipo de Barberos</h2>
            <p className="text-sm text-muted-foreground">
              {availableCount} de {barbershopBarbers.length} disponibles
            </p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Barbero
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{barbershopBarbers.length}</p>
              <p className="text-sm text-muted-foreground">Total Barberos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-success/20 bg-success/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/20">
              <User className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{availableCount}</p>
              <p className="text-sm text-muted-foreground">Disponibles</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-info/20 bg-info/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/20">
              <Calendar className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-info">
                {appointments.filter(a => a.date === today).length}
              </p>
              <p className="text-sm text-muted-foreground">Citas Hoy</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/20">
              <TrendingUp className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">
                {appointments.filter(a => a.date === today && a.status === 'finalizado').length}
              </p>
              <p className="text-sm text-muted-foreground">Completadas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barbers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {barbershopBarbers.map(barber => {
          const stats = getBarberStats(barber.id)
          const initials = barber.name.split(' ').map(n => n[0]).join('').toUpperCase()

          return (
            <Card key={barber.id} className={cn(
              "border-border bg-card transition-all",
              barber.available && "hover:border-primary/50"
            )}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className={cn(
                        "text-lg",
                        barber.available ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base text-foreground">{barber.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">Barbero</p>
                    </div>
                  </div>
                  <Switch
                    checked={barber.available}
                    onCheckedChange={() => toggleBarberAvailability(barber.id)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estado</span>
                  <Badge variant={barber.available ? "default" : "secondary"}>
                    {barber.available ? 'Disponible' : 'No disponible'}
                  </Badge>
                </div>

                {barber.current_client && (
                  <div className="rounded-lg bg-info/10 border border-info/30 p-3">
                    <p className="text-xs text-muted-foreground">Atendiendo a</p>
                    <p className="font-medium text-info">{barber.current_client}</p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-secondary p-2">
                    <p className="text-lg font-bold text-foreground">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Citas</p>
                  </div>
                  <div className="rounded-lg bg-success/10 p-2">
                    <p className="text-lg font-bold text-success">{stats.completed}</p>
                    <p className="text-xs text-muted-foreground">Hechas</p>
                  </div>
                  <div className="rounded-lg bg-warning/10 p-2">
                    <p className="text-lg font-bold text-warning">{stats.pending}</p>
                    <p className="text-xs text-muted-foreground">Pend.</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Ver Agenda
                  </Button>
                  <Button variant="outline" size="sm">
                    <Clock className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

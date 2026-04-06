"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { 
  Plus, 
  Calendar,
  Clock,
  User,
  Phone,
  Scissors,
  Play,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { services, barbers as mockBarbers } from '@/lib/mock-data'
import type { AppointmentStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function AppointmentsPage() {
  const { appointments, barbers, addAppointment, updateAppointmentStatus } = useApp()
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  // Form state
  const [newClientName, setNewClientName] = useState('')
  const [newClientPhone, setNewClientPhone] = useState('')
  const [newBarberId, setNewBarberId] = useState('')
  const [newServiceId, setNewServiceId] = useState('')
  const [newTime, setNewTime] = useState('')

  const getStatusBadge = (status: AppointmentStatus) => {
    const styles = {
      pendiente: 'bg-warning/20 text-warning border-warning/30',
      en_proceso: 'bg-info/20 text-info border-info/30',
      finalizado: 'bg-success/20 text-success border-success/30',
      cancelado: 'bg-destructive/20 text-destructive border-destructive/30'
    }
    return styles[status]
  }

  const todayAppointments = appointments.filter(a => a.date === selectedDate)
  const pendingAppointments = todayAppointments.filter(a => a.status === 'pendiente')
  const inProgressAppointments = todayAppointments.filter(a => a.status === 'en_proceso')
  const completedAppointments = todayAppointments.filter(a => a.status === 'finalizado')

  const handleCreateAppointment = () => {
    if (!newClientName || !newBarberId || !newServiceId || !newTime) return

    const barber = barbers.find(b => b.id === newBarberId)
    const service = services.find(s => s.id === newServiceId)

    if (!barber || !service) return

    addAppointment({
      business_id: 'barber-1',
      barber_id: newBarberId,
      barber_name: barber.name,
      client_name: newClientName,
      client_phone: newClientPhone,
      service_id: newServiceId,
      service_name: service.name,
      date: selectedDate,
      time: newTime,
      status: 'pendiente'
    })

    // Reset form
    setIsNewDialogOpen(false)
    setNewClientName('')
    setNewClientPhone('')
    setNewBarberId('')
    setNewServiceId('')
    setNewTime('')
  }

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto bg-secondary"
          />
          <Badge variant="outline" className="text-muted-foreground">
            {todayAppointments.length} citas
          </Badge>
        </div>
        <Button onClick={() => setIsNewDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Cita
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/20">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{pendingAppointments.length}</p>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-info/20 bg-info/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/20">
              <Scissors className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-info">{inProgressAppointments.length}</p>
              <p className="text-sm text-muted-foreground">En Proceso</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-success/20 bg-success/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/20">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{completedAppointments.length}</p>
              <p className="text-sm text-muted-foreground">Completadas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments by Barber */}
      <div className="grid gap-6 lg:grid-cols-2">
        {barbers.filter(b => b.business_id === 'barber-1').map(barber => {
          const barberAppointments = todayAppointments.filter(a => a.barber_id === barber.id)
          
          return (
            <Card key={barber.id} className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      barber.available ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
                    )}>
                      <Scissors className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-foreground">{barber.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {barberAppointments.length} citas hoy
                      </p>
                    </div>
                  </div>
                  <Badge variant={barber.available ? "default" : "secondary"}>
                    {barber.available ? 'Disponible' : 'No disponible'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {barberAppointments.length === 0 ? (
                  <p className="text-center py-6 text-muted-foreground">Sin citas programadas</p>
                ) : (
                  barberAppointments
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map(appointment => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between rounded-lg bg-secondary p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <p className="text-lg font-bold text-primary">{appointment.time}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{appointment.client_name}</p>
                            <p className="text-sm text-muted-foreground">{appointment.service_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getStatusBadge(appointment.status)}>
                            {appointment.status.replace('_', ' ')}
                          </Badge>
                          {appointment.status === 'pendiente' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateAppointmentStatus(appointment.id, 'en_proceso')}
                            >
                              <Play className="h-4 w-4 text-info" />
                            </Button>
                          )}
                          {appointment.status === 'en_proceso' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateAppointmentStatus(appointment.id, 'finalizado')}
                            >
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* New Appointment Dialog */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Nueva Cita</DialogTitle>
            <DialogDescription>
              Programa una nueva cita para el {selectedDate}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nombre del Cliente</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="clientName"
                  placeholder="Nombre completo"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="pl-9 bg-secondary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientPhone">Teléfono (opcional)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="clientPhone"
                  placeholder="+34 600 000 000"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  className="pl-9 bg-secondary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Barbero</Label>
              <Select value={newBarberId} onValueChange={setNewBarberId}>
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Selecciona barbero" />
                </SelectTrigger>
                <SelectContent>
                  {barbers.filter(b => b.available).map(barber => (
                    <SelectItem key={barber.id} value={barber.id}>
                      {barber.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Servicio</Label>
              <Select value={newServiceId} onValueChange={setNewServiceId}>
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Selecciona servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - ${service.price} ({service.duration} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Hora</Label>
              <Select value={newTime} onValueChange={setNewTime}>
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Selecciona hora" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateAppointment}
              disabled={!newClientName || !newBarberId || !newServiceId || !newTime}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Crear Cita
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

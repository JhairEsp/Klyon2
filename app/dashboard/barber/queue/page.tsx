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
  Clock,
  User,
  Users,
  Play,
  CheckCircle2,
  Trash2,
  Scissors
} from 'lucide-react'
import { services } from '@/lib/mock-data'
import type { QueueStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function QueuePage() {
  const { queue, barbers, addToQueue, updateQueueStatus, removeFromQueue } = useApp()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  
  // Form state
  const [newClientName, setNewClientName] = useState('')
  const [newServiceId, setNewServiceId] = useState('')

  const getStatusBadge = (status: QueueStatus) => {
    const styles = {
      esperando: 'bg-warning/20 text-warning border-warning/30',
      en_proceso: 'bg-info/20 text-info border-info/30',
      finalizado: 'bg-success/20 text-success border-success/30'
    }
    return styles[status]
  }

  const waitingQueue = queue.filter(q => q.status === 'esperando')
  const inProgressQueue = queue.filter(q => q.status === 'en_proceso')

  const handleAddToQueue = () => {
    if (!newClientName) return

    const service = services.find(s => s.id === newServiceId)

    addToQueue({
      business_id: 'barber-1',
      client_name: newClientName,
      service_id: newServiceId || undefined,
      service_name: service?.name || 'Sin especificar',
      status: 'esperando'
    })

    setIsAddDialogOpen(false)
    setNewClientName('')
    setNewServiceId('')
  }

  const getTimeSince = (dateString: string) => {
    const minutes = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000)
    return minutes
  }

  const availableBarbers = barbers.filter(b => b.available && !b.current_client)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Users className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Cola de Espera</h2>
            <p className="text-sm text-muted-foreground">
              {waitingQueue.length} clientes esperando
            </p>
          </div>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Cliente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/20">
              <Users className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{waitingQueue.length}</p>
              <p className="text-sm text-muted-foreground">En Cola</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-info/20 bg-info/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/20">
              <Scissors className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-info">{inProgressQueue.length}</p>
              <p className="text-sm text-muted-foreground">En Atención</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-success/20 bg-success/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/20">
              <User className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{availableBarbers.length}</p>
              <p className="text-sm text-muted-foreground">Barberos Libres</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                ~{waitingQueue.length > 0 ? waitingQueue[waitingQueue.length - 1].estimated_wait : 0} min
              </p>
              <p className="text-sm text-muted-foreground">Espera Estimada</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Queue List */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-warning" />
              Cola de Espera
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {waitingQueue.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No hay clientes en cola</p>
              </div>
            ) : (
              waitingQueue.map(entry => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-lg bg-secondary p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/20 text-xl font-bold text-warning">
                      {entry.position}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{entry.client_name}</p>
                      <p className="text-sm text-muted-foreground">{entry.service_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Esperando {getTimeSince(entry.created_at)} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getStatusBadge(entry.status)}>
                      ~{entry.estimated_wait} min
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateQueueStatus(entry.id, 'en_proceso')}
                      disabled={availableBarbers.length === 0}
                    >
                      <Play className="h-4 w-4 text-info" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromQueue(entry.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Currently Serving */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Scissors className="h-5 w-5 text-info" />
              En Atención
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {inProgressQueue.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Scissors className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nadie en atención</p>
              </div>
            ) : (
              inProgressQueue.map(entry => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-lg bg-info/10 border border-info/30 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-info/20">
                      <Scissors className="h-6 w-6 text-info animate-pulse" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{entry.client_name}</p>
                      <p className="text-sm text-muted-foreground">{entry.service_name}</p>
                      {entry.barber_name && (
                        <p className="text-sm text-info">{entry.barber_name}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQueueStatus(entry.id, 'finalizado')}
                    className="border-success text-success hover:bg-success hover:text-success-foreground"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Finalizar
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Public Display Preview */}
      <Card className="border-primary/50 bg-gradient-to-br from-primary/10 to-background">
        <CardHeader>
          <CardTitle className="text-foreground">Vista Pública</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Turno Actual</p>
              <div className="flex h-24 items-center justify-center rounded-xl bg-primary/20">
                {inProgressQueue.length > 0 ? (
                  <p className="text-3xl font-bold text-primary">
                    {inProgressQueue[0].client_name.split(' ')[0]}
                  </p>
                ) : (
                  <p className="text-muted-foreground">---</p>
                )}
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Siguiente</p>
              <div className="flex h-24 items-center justify-center rounded-xl bg-secondary">
                {waitingQueue.length > 0 ? (
                  <p className="text-2xl font-bold text-foreground">
                    {waitingQueue[0].client_name.split(' ')[0]}
                  </p>
                ) : (
                  <p className="text-muted-foreground">---</p>
                )}
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Tiempo Estimado</p>
              <div className="flex h-24 items-center justify-center rounded-xl bg-secondary">
                <p className="text-2xl font-bold text-foreground">
                  ~{waitingQueue.length > 0 ? waitingQueue[0].estimated_wait : 0} min
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add to Queue Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Agregar a Cola</DialogTitle>
            <DialogDescription>
              Cliente walk-in sin cita previa
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="queueClientName">Nombre del Cliente</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="queueClientName"
                  placeholder="Nombre"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="pl-9 bg-secondary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Servicio (opcional)</Label>
              <Select value={newServiceId} onValueChange={setNewServiceId}>
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Sin especificar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin especificar</SelectItem>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - ${service.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-secondary p-4">
              <p className="text-sm text-muted-foreground">Posición estimada en cola</p>
              <p className="text-2xl font-bold text-foreground">
                #{waitingQueue.length + 1}
              </p>
              <p className="text-sm text-muted-foreground">
                Espera aproximada: ~{(waitingQueue.length + 1) * 30} min
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddToQueue} disabled={!newClientName}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar a Cola
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

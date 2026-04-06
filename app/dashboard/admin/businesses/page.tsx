"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
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
  Search,
  Building2,
  UtensilsCrossed,
  Scissors,
  Activity,
  AlertTriangle,
  Clock,
  TrendingUp,
  Power
} from 'lucide-react'
import type { Business } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function BusinessesPage() {
  const { businesses, orders, appointments, toggleBusinessActive } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)

  const filteredBusinesses = businesses.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeBusinesses = businesses.filter(b => b.active).length
  const restaurants = businesses.filter(b => b.type === 'restaurant')
  const barbershops = businesses.filter(b => b.type === 'barbershop')

  const getLastActivityTime = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return 'Hace menos de 1 hora'
    if (hours < 24) return `Hace ${hours} horas`
    return `Hace ${Math.floor(hours / 24)} días`
  }

  const isInactive = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime()
    const hours = diff / (1000 * 60 * 60)
    return hours > 2
  }

  const getBusinessStats = (business: Business) => {
    if (business.type === 'restaurant') {
      const businessOrders = orders.filter(o => o.business_id === business.id)
      const todayOrders = businessOrders.filter(o => {
        const orderDate = new Date(o.created_at).toDateString()
        return orderDate === new Date().toDateString()
      })
      return {
        total: businessOrders.length,
        today: todayOrders.length,
        revenue: todayOrders.reduce((sum, o) => sum + o.total, 0)
      }
    } else {
      const businessAppointments = appointments.filter(a => a.business_id === business.id)
      const todayAppointments = businessAppointments.filter(a => {
        return a.date === new Date().toISOString().split('T')[0]
      })
      return {
        total: businessAppointments.length,
        today: todayAppointments.length,
        completed: todayAppointments.filter(a => a.status === 'finalizado').length
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar negocios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary"
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Negocio
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{businesses.length}</p>
              <p className="text-sm text-muted-foreground">Total Negocios</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-success/20 bg-success/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/20">
              <Activity className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{activeBusinesses}</p>
              <p className="text-sm text-muted-foreground">Activos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/20">
              <UtensilsCrossed className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{restaurants.length}</p>
              <p className="text-sm text-muted-foreground">Restaurantes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-info/20 bg-info/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/20">
              <Scissors className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-info">{barbershops.length}</p>
              <p className="text-sm text-muted-foreground">Barberías</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {businesses.some(b => b.active && isInactive(b.last_activity)) && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="flex items-center gap-4 p-4">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <div>
              <p className="font-medium text-foreground">Negocios sin actividad reciente</p>
              <p className="text-sm text-muted-foreground">
                {businesses.filter(b => b.active && isInactive(b.last_activity)).length} negocios no han tenido actividad en las últimas 2 horas
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Businesses List */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Todos los Negocios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredBusinesses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No se encontraron negocios</p>
            </div>
          ) : (
            filteredBusinesses.map(business => {
              const stats = getBusinessStats(business)
              const inactive = isInactive(business.last_activity)

              return (
                <div
                  key={business.id}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-4 transition-all cursor-pointer hover:bg-secondary/50",
                    inactive && business.active && "border-destructive/50 bg-destructive/5",
                    !business.active && "opacity-60"
                  )}
                  onClick={() => setSelectedBusiness(business)}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-lg",
                      business.type === 'restaurant' ? "bg-warning/20" : "bg-info/20"
                    )}>
                      {business.type === 'restaurant' ? (
                        <UtensilsCrossed className="h-6 w-6 text-warning" />
                      ) : (
                        <Scissors className="h-6 w-6 text-info" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{business.name}</p>
                        {inactive && business.active && (
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">{business.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-muted-foreground">Hoy</p>
                      <p className="font-medium text-foreground">
                        {business.type === 'restaurant' 
                          ? `${stats.today} pedidos` 
                          : `${stats.today} citas`
                        }
                      </p>
                    </div>

                    <div className="text-right hidden md:block">
                      <p className="text-sm text-muted-foreground">Última actividad</p>
                      <p className={cn(
                        "text-sm",
                        inactive ? "text-destructive font-medium" : "text-muted-foreground"
                      )}>
                        {getLastActivityTime(business.last_activity)}
                      </p>
                    </div>

                    <Badge variant={business.active ? "default" : "secondary"}>
                      {business.active ? 'Activo' : 'Inactivo'}
                    </Badge>

                    <Switch
                      checked={business.active}
                      onCheckedChange={() => toggleBusinessActive(business.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* Business Detail Dialog */}
      <Dialog open={!!selectedBusiness} onOpenChange={() => setSelectedBusiness(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-lg",
                selectedBusiness?.type === 'restaurant' ? "bg-warning/20" : "bg-info/20"
              )}>
                {selectedBusiness?.type === 'restaurant' ? (
                  <UtensilsCrossed className="h-6 w-6 text-warning" />
                ) : (
                  <Scissors className="h-6 w-6 text-info" />
                )}
              </div>
              <div>
                <DialogTitle className="text-foreground">
                  {selectedBusiness?.name}
                </DialogTitle>
                <DialogDescription className="capitalize">
                  {selectedBusiness?.type}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-secondary p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Creado</span>
                </div>
                <p className="text-sm text-foreground">
                  {selectedBusiness && new Date(selectedBusiness.created_at).toLocaleDateString('es-ES')}
                </p>
              </div>
              <div className="rounded-lg bg-secondary p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm">Última Actividad</span>
                </div>
                <p className="text-sm text-foreground">
                  {selectedBusiness && getLastActivityTime(selectedBusiness.last_activity)}
                </p>
              </div>
            </div>

            {selectedBusiness && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Estadísticas de Hoy</p>
                {selectedBusiness.type === 'restaurant' ? (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-secondary p-3 text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {getBusinessStats(selectedBusiness).today}
                      </p>
                      <p className="text-xs text-muted-foreground">Pedidos</p>
                    </div>
                    <div className="rounded-lg bg-success/10 p-3 text-center">
                      <p className="text-2xl font-bold text-success">
                        ${getBusinessStats(selectedBusiness).revenue?.toFixed(0) || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Ingresos</p>
                    </div>
                    <div className="rounded-lg bg-info/10 p-3 text-center">
                      <p className="text-2xl font-bold text-info">
                        {getBusinessStats(selectedBusiness).total}
                      </p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-secondary p-3 text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {getBusinessStats(selectedBusiness).today}
                      </p>
                      <p className="text-xs text-muted-foreground">Citas</p>
                    </div>
                    <div className="rounded-lg bg-success/10 p-3 text-center">
                      <p className="text-2xl font-bold text-success">
                        {getBusinessStats(selectedBusiness).completed || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Completadas</p>
                    </div>
                    <div className="rounded-lg bg-info/10 p-3 text-center">
                      <p className="text-2xl font-bold text-info">
                        {getBusinessStats(selectedBusiness).total}
                      </p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant={selectedBusiness?.active ? "destructive" : "default"}
              onClick={() => {
                if (selectedBusiness) {
                  toggleBusinessActive(selectedBusiness.id)
                  setSelectedBusiness(null)
                }
              }}
            >
              <Power className="mr-2 h-4 w-4" />
              {selectedBusiness?.active ? 'Desactivar' : 'Activar'}
            </Button>
            <Button variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              Ver Métricas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

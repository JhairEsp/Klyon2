"use client"

import { useApp } from '@/lib/app-context'
import { StatsCard } from '@/components/dashboard/stats-card'
import { 
  UtensilsCrossed, 
  ClipboardList, 
  DollarSign, 
  Clock,
  CalendarDays,
  Users,
  Scissors,
  Building2,
  Activity,
  TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function DashboardPage() {
  const { currentUser, currentBusiness, orders, tables, appointments, queue, businesses } = useApp()

  // Restaurant stats
  const activeOrders = orders.filter(o => o.status !== 'entregado').length
  const completedOrders = orders.filter(o => o.status === 'entregado').length
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const occupiedTables = tables.filter(t => t.status !== 'libre').length

  // Barbershop stats
  const todayAppointments = appointments.filter(a => 
    a.date === new Date().toISOString().split('T')[0]
  ).length
  const waitingClients = queue.filter(q => q.status === 'esperando').length

  // Admin stats
  const activeBusinesses = businesses.filter(b => b.active).length

  if (currentUser?.role === 'super_admin') {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Negocios"
            value={businesses.length}
            icon={Building2}
            description={`${activeBusinesses} activos`}
          />
          <StatsCard
            title="Negocios Activos"
            value={activeBusinesses}
            icon={Activity}
            variant="success"
          />
          <StatsCard
            title="Restaurantes"
            value={businesses.filter(b => b.type === 'restaurant').length}
            icon={UtensilsCrossed}
            variant="info"
          />
          <StatsCard
            title="Barberías"
            value={businesses.filter(b => b.type === 'barbershop').length}
            icon={Scissors}
          />
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Negocios Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {businesses.map(business => (
                <div key={business.id} className="flex items-center justify-between rounded-lg bg-secondary p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                      {business.type === 'restaurant' ? (
                        <UtensilsCrossed className="h-5 w-5 text-primary" />
                      ) : (
                        <Scissors className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{business.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{business.type}</p>
                    </div>
                  </div>
                  <Badge variant={business.active ? "default" : "secondary"}>
                    {business.active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentBusiness?.type === 'barbershop') {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Citas de Hoy"
            value={todayAppointments}
            icon={CalendarDays}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="En Cola"
            value={waitingClients}
            icon={Users}
            variant={waitingClients > 5 ? 'warning' : 'info'}
            description={`~${waitingClients * 30} min espera`}
          />
          <StatsCard
            title="Citas Completadas"
            value={appointments.filter(a => a.status === 'finalizado').length}
            icon={Scissors}
            variant="success"
          />
          <StatsCard
            title="Tiempo Promedio"
            value="32 min"
            icon={Clock}
          />
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Próximas Citas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments.filter(a => a.status === 'pendiente').slice(0, 5).map(apt => (
                  <div key={apt.id} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                    <div>
                      <p className="font-medium text-foreground">{apt.client_name}</p>
                      <p className="text-sm text-muted-foreground">{apt.service_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary">{apt.time}</p>
                      <p className="text-sm text-muted-foreground">{apt.barber_name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Cola de Espera</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {queue.filter(q => q.status === 'esperando').map(entry => (
                  <div key={entry.id} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                        {entry.position}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{entry.client_name}</p>
                        <p className="text-sm text-muted-foreground">{entry.service_name}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">~{entry.estimated_wait} min</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Restaurant Dashboard (default)
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pedidos Activos"
          value={activeOrders}
          icon={ClipboardList}
          variant={activeOrders > 10 ? 'warning' : 'info'}
        />
        <StatsCard
          title="Mesas Ocupadas"
          value={`${occupiedTables}/${tables.length}`}
          icon={UtensilsCrossed}
          description={`${tables.length - occupiedTables} disponibles`}
        />
        <StatsCard
          title="Ingresos Hoy"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          variant="success"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Tiempo Promedio"
          value="18 min"
          icon={Clock}
          description="Preparación de pedidos"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground">Pedidos Recientes</CardTitle>
            <TrendingUp className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders.filter(o => o.status !== 'entregado').slice(0, 5).map(order => (
                <div key={order.id} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 font-bold text-primary">
                      {order.table_number}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Mesa {order.table_number}</p>
                      <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      order.status === 'pendiente' ? 'secondary' :
                      order.status === 'en_preparacion' ? 'default' : 'outline'
                    }>
                      {order.status.replace('_', ' ')}
                    </Badge>
                    <p className="mt-1 text-sm font-medium text-foreground">${order.total.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Estado de Mesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {tables.map(table => (
                <div
                  key={table.id}
                  className={`flex aspect-square flex-col items-center justify-center rounded-lg border-2 transition-all ${
                    table.status === 'libre' 
                      ? 'border-success/50 bg-success/10 text-success' 
                      : table.status === 'ocupada'
                      ? 'border-warning/50 bg-warning/10 text-warning'
                      : 'border-info/50 bg-info/10 text-info'
                  }`}
                >
                  <span className="text-2xl font-bold">{table.number}</span>
                  <span className="text-xs capitalize">{table.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { 
  Users, 
  Plus, 
  ClipboardList,
  CreditCard,
  Check
} from 'lucide-react'
import type { Table } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function TablesPage() {
  const { tables, orders, updateTableStatus } = useApp()
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getTableOrder = (tableId: string) => {
    return orders.find(o => o.table_id === tableId && o.status !== 'entregado')
  }

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'libre':
        return 'border-success bg-success/10 text-success'
      case 'ocupada':
        return 'border-warning bg-warning/10 text-warning'
      case 'pagando':
        return 'border-info bg-info/10 text-info'
      default:
        return 'border-border bg-card'
    }
  }

  const handleTableClick = (table: Table) => {
    setSelectedTable(table)
    setIsDialogOpen(true)
  }

  const handleStatusChange = (status: Table['status']) => {
    if (selectedTable) {
      updateTableStatus(selectedTable.id, status)
      setSelectedTable({ ...selectedTable, status })
    }
  }

  const freeTablesCount = tables.filter(t => t.status === 'libre').length
  const occupiedTablesCount = tables.filter(t => t.status === 'ocupada').length
  const payingTablesCount = tables.filter(t => t.status === 'pagando').length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-success/20 bg-success/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/20">
              <Check className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{freeTablesCount}</p>
              <p className="text-sm text-muted-foreground">Mesas Libres</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/20">
              <Users className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{occupiedTablesCount}</p>
              <p className="text-sm text-muted-foreground">Mesas Ocupadas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-info/20 bg-info/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/20">
              <CreditCard className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-info">{payingTablesCount}</p>
              <p className="text-sm text-muted-foreground">Pagando</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Grid */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Mapa de Mesas</CardTitle>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Mesa
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {tables.map(table => {
              const order = getTableOrder(table.id)
              return (
                <button
                  key={table.id}
                  onClick={() => handleTableClick(table)}
                  className={cn(
                    "relative flex aspect-square flex-col items-center justify-center rounded-xl border-2 p-4 transition-all hover:scale-105 hover:shadow-lg",
                    getStatusColor(table.status)
                  )}
                >
                  <span className="text-4xl font-bold">{table.number}</span>
                  <span className="mt-1 text-sm capitalize">{table.status}</span>
                  <div className="mt-2 flex items-center gap-1 text-xs opacity-75">
                    <Users className="h-3 w-3" />
                    {table.capacity}
                  </div>
                  {order && (
                    <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                      {order.items.length}
                    </Badge>
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 border-success bg-success/20" />
              <span className="text-sm text-muted-foreground">Libre</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 border-warning bg-warning/20" />
              <span className="text-sm text-muted-foreground">Ocupada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 border-info bg-info/20" />
              <span className="text-sm text-muted-foreground">Pagando</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Mesa {selectedTable?.number}
            </DialogTitle>
            <DialogDescription>
              Capacidad: {selectedTable?.capacity} personas
              {selectedTable?.waiter_name && ` • Mesero: ${selectedTable.waiter_name}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center">
              <div className={cn(
                "flex h-24 w-24 flex-col items-center justify-center rounded-xl border-2",
                getStatusColor(selectedTable?.status || 'libre')
              )}>
                <span className="text-3xl font-bold">{selectedTable?.number}</span>
                <span className="text-sm capitalize">{selectedTable?.status}</span>
              </div>
            </div>

            {/* Current Order Info */}
            {selectedTable && getTableOrder(selectedTable.id) && (
              <Card className="border-border bg-secondary">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pedido activo</p>
                      <p className="font-medium text-foreground">
                        {getTableOrder(selectedTable.id)?.items.length} items
                      </p>
                    </div>
                    <p className="text-xl font-bold text-primary">
                      ${getTableOrder(selectedTable.id)?.total.toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant={selectedTable?.status === 'libre' ? 'default' : 'outline'}
              onClick={() => handleStatusChange('libre')}
              className="flex-1"
            >
              <Check className="mr-2 h-4 w-4" />
              Libre
            </Button>
            <Button
              variant={selectedTable?.status === 'ocupada' ? 'default' : 'outline'}
              onClick={() => handleStatusChange('ocupada')}
              className="flex-1"
            >
              <Users className="mr-2 h-4 w-4" />
              Ocupada
            </Button>
            <Button
              variant={selectedTable?.status === 'pagando' ? 'default' : 'outline'}
              onClick={() => handleStatusChange('pagando')}
              className="flex-1"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Pagando
            </Button>
          </DialogFooter>

          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" asChild>
              <a href="/dashboard/restaurant/orders">
                <ClipboardList className="mr-2 h-4 w-4" />
                Ver Pedidos
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

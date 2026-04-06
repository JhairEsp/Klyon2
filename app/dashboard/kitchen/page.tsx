"use client"

import { useState, useEffect, useRef } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Clock, 
  ChefHat,
  Volume2,
  VolumeX,
  AlertTriangle,
  CheckCircle2,
  Flame
} from 'lucide-react'
import type { Order, OrderItem, OrderItemStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function KitchenPage() {
  const { orders, updateOrderItemStatus, updateOrderStatus } = useApp()
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [filter, setFilter] = useState<'all' | 'cocina' | 'bar'>('all')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const prevOrderCountRef = useRef(orders.length)

  // Filter active orders (not delivered)
  const activeOrders = orders.filter(o => o.status !== 'entregado')

  // Play sound when new order arrives
  useEffect(() => {
    if (soundEnabled && orders.length > prevOrderCountRef.current) {
      // Create audio notification
      if (typeof window !== 'undefined') {
        const audio = new Audio('/notification.mp3')
        audio.volume = 0.5
        audio.play().catch(() => {
          // Audio play failed (user hasn't interacted yet)
        })
      }
    }
    prevOrderCountRef.current = orders.length
  }, [orders.length, soundEnabled])

  const getTimeSince = (dateString: string) => {
    const minutes = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000)
    return minutes
  }

  const getTimeColor = (minutes: number) => {
    if (minutes <= 10) return 'text-success'
    if (minutes <= 20) return 'text-warning'
    return 'text-destructive'
  }

  const handleItemStatusChange = (orderId: string, itemId: string, currentStatus: OrderItemStatus) => {
    const nextStatus: Record<OrderItemStatus, OrderItemStatus> = {
      'pendiente': 'preparando',
      'preparando': 'listo',
      'listo': 'listo'
    }
    updateOrderItemStatus(orderId, itemId, nextStatus[currentStatus])
  }

  const markOrderReady = (order: Order) => {
    // Mark all items as ready
    order.items.forEach(item => {
      if (item.status !== 'listo') {
        updateOrderItemStatus(order.id, item.id, 'listo')
      }
    })
    updateOrderStatus(order.id, 'listo')
  }

  const filterItems = (items: OrderItem[]) => {
    if (filter === 'all') return items
    return items.filter(item => item.area === filter)
  }

  const KitchenTicket = ({ order }: { order: Order }) => {
    const minutes = getTimeSince(order.created_at)
    const timeColor = getTimeColor(minutes)
    const isLate = minutes > 20
    const filteredItems = filterItems(order.items)
    
    if (filteredItems.length === 0) return null

    const allItemsReady = filteredItems.every(item => item.status === 'listo')
    const pendingCount = filteredItems.filter(i => i.status === 'pendiente').length
    const preparingCount = filteredItems.filter(i => i.status === 'preparando').length

    return (
      <Card className={cn(
        "border-2 transition-all",
        isLate && !allItemsReady && "border-destructive animate-pulse",
        allItemsReady && "border-success/50 bg-success/5",
        !isLate && !allItemsReady && "border-border bg-card"
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-14 w-14 items-center justify-center rounded-xl text-2xl font-bold",
                allItemsReady ? "bg-success/20 text-success" : "bg-primary/20 text-primary"
              )}>
                {order.table_number}
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">Mesa {order.table_number}</p>
                <p className="text-sm text-muted-foreground">{order.waiter_name}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className={cn("flex items-center gap-1 text-lg font-bold", timeColor)}>
                {isLate && <AlertTriangle className="h-5 w-5" />}
                <Clock className="h-5 w-5" />
                {minutes}m
              </div>
              <div className="flex gap-1 mt-1">
                {pendingCount > 0 && (
                  <Badge variant="outline" className="border-warning/30 text-warning text-xs">
                    {pendingCount} pend
                  </Badge>
                )}
                {preparingCount > 0 && (
                  <Badge variant="outline" className="border-info/30 text-info text-xs">
                    {preparingCount} prep
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-2">
          {filteredItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleItemStatusChange(order.id, item.id, item.status)}
              disabled={item.status === 'listo'}
              className={cn(
                "w-full flex items-center justify-between rounded-lg p-3 transition-all",
                item.status === 'pendiente' && "bg-warning/10 border border-warning/30 hover:bg-warning/20",
                item.status === 'preparando' && "bg-info/10 border border-info/30 hover:bg-info/20",
                item.status === 'listo' && "bg-success/10 border border-success/30 opacity-60"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full font-bold",
                  item.status === 'pendiente' && "bg-warning/20 text-warning",
                  item.status === 'preparando' && "bg-info/20 text-info",
                  item.status === 'listo' && "bg-success/20 text-success"
                )}>
                  {item.quantity}
                </div>
                <div className="text-left">
                  <p className={cn(
                    "font-medium",
                    item.status === 'listo' ? "text-muted-foreground line-through" : "text-foreground"
                  )}>
                    {item.product_name}
                  </p>
                  {item.notes && (
                    <p className="text-sm text-warning">{item.notes}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {item.area && (
                  <Badge variant="outline" className="text-xs">
                    {item.area}
                  </Badge>
                )}
                {item.status === 'pendiente' && (
                  <Flame className="h-5 w-5 text-warning" />
                )}
                {item.status === 'preparando' && (
                  <ChefHat className="h-5 w-5 text-info animate-bounce" />
                )}
                {item.status === 'listo' && (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                )}
              </div>
            </button>
          ))}

          {!allItemsReady && (
            <Button 
              className="w-full mt-4" 
              variant="default"
              onClick={() => markOrderReady(order)}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Marcar Todo Listo
            </Button>
          )}

          {allItemsReady && (
            <div className="flex items-center justify-center gap-2 py-2 text-success">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Pedido Listo</span>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const pendingOrders = activeOrders.filter(o => o.status === 'pendiente' || o.status === 'en_preparacion')
  const readyOrders = activeOrders.filter(o => o.status === 'listo')

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <ChefHat className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Sistema de Cocina</h2>
            <p className="text-sm text-muted-foreground">
              {pendingOrders.length} pedidos activos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch
              id="sound"
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
            <Label htmlFor="sound" className="flex items-center gap-2 text-muted-foreground">
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              Sonido
            </Label>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList className="bg-secondary">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="cocina" className="gap-2">
            <ChefHat className="h-4 w-4" />
            Cocina
          </TabsTrigger>
          <TabsTrigger value="bar" className="gap-2">
            Bar
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {pendingOrders.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <ChefHat className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-xl font-medium text-muted-foreground">Sin pedidos pendientes</p>
                <p className="text-sm text-muted-foreground mt-1">Los nuevos pedidos aparecerán aquí</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pendingOrders
                .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                .map(order => (
                  <KitchenTicket key={order.id} order={order} />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Ready Orders */}
      {readyOrders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            Pedidos Listos para Servir
          </h3>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {readyOrders.map(order => (
              <Card key={order.id} className="border-success/50 bg-success/5">
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <div className="text-3xl font-bold text-success">{order.table_number}</div>
                  <p className="text-sm text-muted-foreground">Mesa</p>
                  <Badge className="mt-2 bg-success text-success-foreground">
                    Listo
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

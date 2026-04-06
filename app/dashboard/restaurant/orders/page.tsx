"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  ChefHat,
  Check,
  AlertCircle,
  Search
} from 'lucide-react'
import type { Order, OrderStatus } from '@/lib/types'
import { products } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function OrdersPage() {
  const { orders, tables, updateOrderStatus, addOrder, currentUser } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false)
  const [selectedTableId, setSelectedTableId] = useState<string>('')
  const [selectedProducts, setSelectedProducts] = useState<{id: string, qty: number}[]>([])

  const getStatusBadge = (status: OrderStatus) => {
    const styles = {
      pendiente: 'bg-warning/20 text-warning border-warning/30',
      en_preparacion: 'bg-info/20 text-info border-info/30',
      listo: 'bg-success/20 text-success border-success/30',
      entregado: 'bg-muted text-muted-foreground border-border'
    }
    return styles[status]
  }

  const getTimeSince = (dateString: string) => {
    const minutes = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000)
    if (minutes < 60) return `${minutes} min`
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.table_number.toString().includes(searchQuery) ||
      order.waiter_name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const pendingOrders = filteredOrders.filter(o => o.status === 'pendiente')
  const inProgressOrders = filteredOrders.filter(o => o.status === 'en_preparacion')
  const readyOrders = filteredOrders.filter(o => o.status === 'listo')
  const deliveredOrders = filteredOrders.filter(o => o.status === 'entregado')

  const handleCreateOrder = () => {
    if (!selectedTableId || selectedProducts.length === 0) return

    const table = tables.find(t => t.id === selectedTableId)
    if (!table) return

    const items = selectedProducts.map((sp, idx) => {
      const product = products.find(p => p.id === sp.id)!
      return {
        id: `new-item-${Date.now()}-${idx}`,
        order_id: '',
        product_name: product.name,
        quantity: sp.qty,
        price: product.price,
        status: 'pendiente' as const,
        area: product.area
      }
    })

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    addOrder({
      business_id: 'rest-1',
      table_id: selectedTableId,
      table_number: table.number,
      user_id: currentUser?.id || '',
      waiter_name: currentUser?.name || 'Mesero',
      status: 'pendiente',
      items,
      total
    })

    setIsNewOrderDialogOpen(false)
    setSelectedTableId('')
    setSelectedProducts([])
  }

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.id === productId)
      if (existing) {
        return prev.filter(p => p.id !== productId)
      }
      return [...prev, { id: productId, qty: 1 }]
    })
  }

  const updateProductQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      setSelectedProducts(prev => prev.filter(p => p.id !== productId))
      return
    }
    setSelectedProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, qty } : p
    ))
  }

  const OrderCard = ({ order }: { order: Order }) => {
    const timeSince = getTimeSince(order.created_at)
    const isLate = parseInt(timeSince) > 20

    return (
      <Card 
        className={cn(
          "border-border bg-card cursor-pointer transition-all hover:border-primary/50",
          isLate && order.status !== 'listo' && order.status !== 'entregado' && "border-destructive/50"
        )}
        onClick={() => setSelectedOrder(order)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-xl font-bold text-primary">
                {order.table_number}
              </div>
              <div>
                <CardTitle className="text-base text-foreground">Mesa {order.table_number}</CardTitle>
                <p className="text-sm text-muted-foreground">{order.waiter_name}</p>
              </div>
            </div>
            <Badge variant="outline" className={getStatusBadge(order.status)}>
              {order.status.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {order.items.slice(0, 3).map(item => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.quantity}x {item.product_name}
                </span>
                <Badge variant="outline" className={cn(
                  "text-xs",
                  item.status === 'pendiente' && "border-warning/30 text-warning",
                  item.status === 'preparando' && "border-info/30 text-info",
                  item.status === 'listo' && "border-success/30 text-success"
                )}>
                  {item.status}
                </Badge>
              </div>
            ))}
            {order.items.length > 3 && (
              <p className="text-xs text-muted-foreground">
                +{order.items.length - 3} más...
              </p>
            )}
          </div>
          
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <div className="flex items-center gap-1 text-sm">
              <Clock className={cn(
                "h-4 w-4",
                isLate ? "text-destructive" : "text-muted-foreground"
              )} />
              <span className={isLate ? "text-destructive font-medium" : "text-muted-foreground"}>
                {timeSince}
              </span>
              {isLate && order.status !== 'listo' && order.status !== 'entregado' && (
                <AlertCircle className="h-4 w-4 text-destructive ml-1" />
              )}
            </div>
            <span className="font-bold text-foreground">${order.total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const freeTables = tables.filter(t => t.status === 'libre')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por mesa o mesero..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary"
          />
        </div>
        <Button onClick={() => setIsNewOrderDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Pedido
        </Button>
      </div>

      {/* Orders Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="bg-secondary">
          <TabsTrigger value="active" className="gap-2">
            Activos
            <Badge variant="secondary" className="ml-1">
              {pendingOrders.length + inProgressOrders.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="ready" className="gap-2">
            Listos
            <Badge variant="secondary" className="ml-1">{readyOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="delivered" className="gap-2">
            Entregados
            <Badge variant="secondary" className="ml-1">{deliveredOrders.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {pendingOrders.length === 0 && inProgressOrders.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ChefHat className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No hay pedidos activos</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...pendingOrders, ...inProgressOrders].map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ready" className="space-y-4">
          {readyOrders.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Check className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No hay pedidos listos</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {readyOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4">
          {deliveredOrders.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Check className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No hay pedidos entregados</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {deliveredOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Pedido - Mesa {selectedOrder?.table_number}
            </DialogTitle>
            <DialogDescription>
              Mesero: {selectedOrder?.waiter_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedOrder?.items.map(item => (
              <div key={item.id} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                <div>
                  <p className="font-medium text-foreground">{item.quantity}x {item.product_name}</p>
                  {item.notes && (
                    <p className="text-sm text-muted-foreground">{item.notes}</p>
                  )}
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={cn(
                    item.status === 'pendiente' && "border-warning/30 text-warning",
                    item.status === 'preparando' && "border-info/30 text-info",
                    item.status === 'listo' && "border-success/30 text-success"
                  )}>
                    {item.status}
                  </Badge>
                  <p className="mt-1 text-sm text-muted-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-lg font-medium text-foreground">Total</span>
              <span className="text-2xl font-bold text-primary">
                ${selectedOrder?.total.toFixed(2)}
              </span>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            {selectedOrder?.status === 'pendiente' && (
              <Button onClick={() => {
                updateOrderStatus(selectedOrder.id, 'en_preparacion')
                setSelectedOrder(null)
              }}>
                <ChefHat className="mr-2 h-4 w-4" />
                Enviar a Cocina
              </Button>
            )}
            {selectedOrder?.status === 'listo' && (
              <Button onClick={() => {
                updateOrderStatus(selectedOrder.id, 'entregado')
                setSelectedOrder(null)
              }}>
                <Check className="mr-2 h-4 w-4" />
                Marcar Entregado
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Order Dialog */}
      <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Nuevo Pedido</DialogTitle>
            <DialogDescription>
              Selecciona una mesa y los productos
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Table Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Mesa</label>
              <div className="grid grid-cols-4 gap-2">
                {freeTables.length === 0 ? (
                  <p className="col-span-4 text-center text-muted-foreground py-4">
                    No hay mesas disponibles
                  </p>
                ) : (
                  freeTables.map(table => (
                    <button
                      key={table.id}
                      onClick={() => setSelectedTableId(table.id)}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-lg border-2 p-3 transition-all",
                        selectedTableId === table.id 
                          ? "border-primary bg-primary/20" 
                          : "border-border bg-secondary hover:border-primary/50"
                      )}
                    >
                      <span className="text-xl font-bold">{table.number}</span>
                      <span className="text-xs text-muted-foreground">{table.capacity} pers.</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Products Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Productos</label>
              <div className="grid gap-2 max-h-64 overflow-y-auto">
                {products.map(product => {
                  const selected = selectedProducts.find(p => p.id === product.id)
                  return (
                    <div
                      key={product.id}
                      className={cn(
                        "flex items-center justify-between rounded-lg border p-3 transition-all",
                        selected 
                          ? "border-primary bg-primary/10" 
                          : "border-border bg-secondary"
                      )}
                    >
                      <button
                        onClick={() => toggleProduct(product.id)}
                        className="flex-1 text-left"
                      >
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${product.price.toFixed(2)} • {product.category}
                        </p>
                      </button>
                      {selected && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateProductQty(product.id, selected.qty - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center font-medium">{selected.qty}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateProductQty(product.id, selected.qty + 1)}
                          >
                            +
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Summary */}
            {selectedProducts.length > 0 && (
              <div className="rounded-lg bg-secondary p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">
                    {selectedProducts.reduce((sum, p) => sum + p.qty, 0)} items
                  </span>
                  <span className="text-xl font-bold text-primary">
                    ${selectedProducts.reduce((sum, sp) => {
                      const product = products.find(p => p.id === sp.id)!
                      return sum + (product.price * sp.qty)
                    }, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewOrderDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateOrder}
              disabled={!selectedTableId || selectedProducts.length === 0}
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear Pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

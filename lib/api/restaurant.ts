import { createClient } from '@/lib/supabase/client'
import type { Table, Order, Product } from '@/lib/types'

// ============================================================================
// PRODUCTOS
// ============================================================================

export async function getProducts(businessId: string): Promise<Product[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('business_id', businessId)
      .eq('available', true)
      .order('order_number', { ascending: true })
    
    if (error) throw error
    return (data || []) as Product[]
  } catch (error) {
    console.error('Get products error:', error)
    throw error
  }
}

export async function getProductsByArea(
  businessId: string,
  area: 'cocina' | 'bar'
): Promise<Product[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('business_id', businessId)
      .eq('area', area)
      .eq('available', true)
      .order('order_number', { ascending: true })
    
    if (error) throw error
    return (data || []) as Product[]
  } catch (error) {
    console.error('Get products by area error:', error)
    throw error
  }
}

export async function createProduct(
  businessId: string,
  name: string,
  price: number,
  category: string,
  area: 'cocina' | 'bar',
  description?: string,
  imageUrl?: string
): Promise<Product> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('products')
      .insert({
        business_id: businessId,
        name,
        description,
        price,
        category,
        area,
        image_url: imageUrl,
        available: true
      })
      .select()
      .single()
    
    if (error) throw error
    return data as Product
  } catch (error) {
    console.error('Create product error:', error)
    throw error
  }
}

export async function updateProduct(
  productId: string,
  updates: Partial<Product>
): Promise<Product> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('products')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)
      .select()
      .single()
    
    if (error) throw error
    return data as Product
  } catch (error) {
    console.error('Update product error:', error)
    throw error
  }
}

// ============================================================================
// MESAS
// ============================================================================

export async function getTables(businessId: string): Promise<Table[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('restaurant_tables')
      .select('*')
      .eq('business_id', businessId)
      .order('table_number', { ascending: true })
    
    if (error) throw error
    return (data || []) as Table[]
  } catch (error) {
    console.error('Get tables error:', error)
    throw error
  }
}

export async function getTableById(tableId: string): Promise<Table | null> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('restaurant_tables')
      .select('*')
      .eq('id', tableId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return (data || null) as Table | null
  } catch (error) {
    console.error('Get table by ID error:', error)
    throw error
  }
}

export async function updateTableStatus(
  tableId: string,
  status: 'libre' | 'ocupada' | 'pagando'
): Promise<Table> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('restaurant_tables')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', tableId)
      .select()
      .single()
    
    if (error) throw error
    return data as Table
  } catch (error) {
    console.error('Update table status error:', error)
    throw error
  }
}

export async function assignWaiterToTable(
  tableId: string,
  waiterId: string | null
): Promise<Table> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('restaurant_tables')
      .update({
        waiter_id: waiterId,
        updated_at: new Date().toISOString()
      })
      .eq('id', tableId)
      .select()
      .single()
    
    if (error) throw error
    return data as Table
  } catch (error) {
    console.error('Assign waiter to table error:', error)
    throw error
  }
}

// ============================================================================
// PEDIDOS
// ============================================================================

export async function createOrder(
  businessId: string,
  tableId: string,
  userId: string,
  items: Array<{
    product_id: string
    quantity: number
    notes?: string
  }>,
  notes?: string
): Promise<Order> {
  try {
    const supabase = createClient()
    
    // Calcular total
    let total = 0
    const orderItems = []
    
    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('price, area')
        .eq('id', item.product_id)
        .single()
      
      if (!product) throw new Error(`Product ${item.product_id} not found`)
      
      const itemTotal = product.price * item.quantity
      total += itemTotal
      
      orderItems.push({
        ...item,
        price_at_time: product.price,
        area: product.area
      })
    }
    
    // Crear pedido
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        business_id: businessId,
        table_id: tableId,
        user_id: userId,
        status: 'pendiente',
        total_amount: total,
        notes
      })
      .select()
      .single()
    
    if (orderError) throw orderError
    
    // Crear items del pedido
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(
        orderItems.map(item => ({
          order_id: order.id,
          ...item,
          status: 'pendiente'
        }))
      )
    
    if (itemsError) throw itemsError
    
    return order as Order
  } catch (error) {
    console.error('Create order error:', error)
    throw error
  }
}

export async function getActiveOrders(businessId: string): Promise<Order[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('business_id', businessId)
      .neq('status', 'entregado')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return (data || []) as Order[]
  } catch (error) {
    console.error('Get active orders error:', error)
    throw error
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: 'pendiente' | 'en_preparacion' | 'listo' | 'entregado'
): Promise<Order> {
  try {
    const supabase = createClient()
    
    const updates: any = {
      status,
      updated_at: new Date().toISOString()
    }
    
    if (status === 'entregado') {
      updates.completed_at = new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single()
    
    if (error) throw error
    return data as Order
  } catch (error) {
    console.error('Update order status error:', error)
    throw error
  }
}

export async function updateOrderItemStatus(
  orderItemId: string,
  status: 'pendiente' | 'preparando' | 'listo'
): Promise<void> {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('order_items')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderItemId)
    
    if (error) throw error
  } catch (error) {
    console.error('Update order item status error:', error)
    throw error
  }
}

// ============================================================================
// SUSCRIPCIONES
// ============================================================================

export function subscribeToOrders(
  businessId: string,
  callback: (order: Order) => void
) {
  try {
    const supabase = createClient()
    
    return supabase
      .channel(`orders:${businessId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `business_id=eq.${businessId}`
        },
        (payload) => {
          callback(payload.new as Order)
        }
      )
      .subscribe()
  } catch (error) {
    console.error('Subscribe to orders error:', error)
  }
}

export function subscribeToTables(
  businessId: string,
  callback: (table: Table) => void
) {
  try {
    const supabase = createClient()
    
    return supabase
      .channel(`tables:${businessId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'restaurant_tables',
          filter: `business_id=eq.${businessId}`
        },
        (payload) => {
          callback(payload.new as Table)
        }
      )
      .subscribe()
  } catch (error) {
    console.error('Subscribe to tables error:', error)
  }
}

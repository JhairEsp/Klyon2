// Tipos para el sistema SaaS multi-tenant

export type BusinessType = 'restaurant' | 'barbershop'
export type UserRole = 'super_admin' | 'admin_negocio' | 'mesero' | 'cocina' | 'barbero'

export interface Business {
  id: string
  name: string
  type: BusinessType
  active: boolean
  created_at: string
  last_activity: string
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  business_id: string | null
  avatar?: string
}

// Restaurante
export type TableStatus = 'libre' | 'ocupada' | 'pagando'
export type OrderStatus = 'pendiente' | 'en_preparacion' | 'listo' | 'entregado'
export type OrderItemStatus = 'pendiente' | 'preparando' | 'listo'

export interface Table {
  id: string
  business_id: string
  number: number
  capacity: number
  status: TableStatus
  waiter_id?: string
  waiter_name?: string
}

export interface Order {
  id: string
  business_id: string
  table_id: string
  table_number: number
  user_id: string
  waiter_name: string
  status: OrderStatus
  created_at: string
  items: OrderItem[]
  total: number
}

export interface OrderItem {
  id: string
  order_id: string
  product_name: string
  quantity: number
  price: number
  status: OrderItemStatus
  notes?: string
  area?: 'cocina' | 'bar'
}

export interface Product {
  id: string
  business_id: string
  name: string
  price: number
  category: string
  area: 'cocina' | 'bar'
  available: boolean
}

// Barbería
export type AppointmentStatus = 'pendiente' | 'en_proceso' | 'finalizado' | 'cancelado'
export type QueueStatus = 'esperando' | 'en_proceso' | 'finalizado'

export interface Barber {
  id: string
  business_id: string
  name: string
  avatar?: string
  available: boolean
  current_client?: string
}

export interface Service {
  id: string
  business_id: string
  name: string
  duration: number // minutos
  price: number
}

export interface Appointment {
  id: string
  business_id: string
  barber_id: string
  barber_name: string
  client_name: string
  client_phone?: string
  service_id: string
  service_name: string
  date: string
  time: string
  status: AppointmentStatus
  created_at: string
}

export interface QueueEntry {
  id: string
  business_id: string
  client_name: string
  service_id?: string
  service_name?: string
  barber_id?: string
  barber_name?: string
  status: QueueStatus
  position: number
  estimated_wait: number // minutos
  created_at: string
}

// Dashboard stats
export interface DashboardStats {
  totalOrders: number
  activeOrders: number
  completedOrders: number
  totalRevenue: number
  averageTime: number
}

export interface BarberStats {
  totalAppointments: number
  completedAppointments: number
  queueLength: number
  averageWaitTime: number
}

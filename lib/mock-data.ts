import type {
  Business, User, Table, Order, OrderItem, Product,
  Barber, Service, Appointment, QueueEntry
} from './types'

// Negocios
export const businesses: Business[] = [
  {
    id: 'rest-1',
    name: 'La Trattoria Bella',
    type: 'restaurant',
    active: true,
    created_at: '2024-01-15T10:00:00Z',
    last_activity: new Date().toISOString()
  },
  {
    id: 'barber-1',
    name: 'Classic Cuts Studio',
    type: 'barbershop',
    active: true,
    created_at: '2024-02-20T09:00:00Z',
    last_activity: new Date().toISOString()
  },
  {
    id: 'rest-2',
    name: 'Sushi Palace',
    type: 'restaurant',
    active: false,
    created_at: '2024-03-10T11:00:00Z',
    last_activity: '2024-03-15T18:00:00Z'
  }
]

// Usuarios
export const users: User[] = [
  { id: 'admin-1', email: 'admin@system.com', name: 'Super Admin', role: 'super_admin', business_id: null },
  { id: 'user-1', email: 'carlos@trattoria.com', name: 'Carlos García', role: 'admin_negocio', business_id: 'rest-1' },
  { id: 'user-2', email: 'maria@trattoria.com', name: 'María López', role: 'mesero', business_id: 'rest-1' },
  { id: 'user-3', email: 'jose@trattoria.com', name: 'José Martín', role: 'cocina', business_id: 'rest-1' },
  { id: 'user-4', email: 'pedro@classic.com', name: 'Pedro Sánchez', role: 'admin_negocio', business_id: 'barber-1' },
  { id: 'user-5', email: 'andres@classic.com', name: 'Andrés Ruiz', role: 'barbero', business_id: 'barber-1' }
]

// Mesas
export const tables: Table[] = [
  { id: 'table-1', business_id: 'rest-1', number: 1, capacity: 4, status: 'ocupada', waiter_id: 'user-2', waiter_name: 'María López' },
  { id: 'table-2', business_id: 'rest-1', number: 2, capacity: 2, status: 'libre' },
  { id: 'table-3', business_id: 'rest-1', number: 3, capacity: 6, status: 'ocupada', waiter_id: 'user-2', waiter_name: 'María López' },
  { id: 'table-4', business_id: 'rest-1', number: 4, capacity: 4, status: 'pagando', waiter_id: 'user-2', waiter_name: 'María López' },
  { id: 'table-5', business_id: 'rest-1', number: 5, capacity: 8, status: 'libre' },
  { id: 'table-6', business_id: 'rest-1', number: 6, capacity: 2, status: 'ocupada', waiter_id: 'user-2', waiter_name: 'María López' },
  { id: 'table-7', business_id: 'rest-1', number: 7, capacity: 4, status: 'libre' },
  { id: 'table-8', business_id: 'rest-1', number: 8, capacity: 4, status: 'libre' }
]

// Productos
export const products: Product[] = [
  { id: 'prod-1', business_id: 'rest-1', name: 'Pizza Margherita', price: 12.50, category: 'Pizzas', area: 'cocina', available: true },
  { id: 'prod-2', business_id: 'rest-1', name: 'Pasta Carbonara', price: 14.00, category: 'Pastas', area: 'cocina', available: true },
  { id: 'prod-3', business_id: 'rest-1', name: 'Risotto Funghi', price: 15.50, category: 'Risottos', area: 'cocina', available: true },
  { id: 'prod-4', business_id: 'rest-1', name: 'Tiramisu', price: 7.00, category: 'Postres', area: 'cocina', available: true },
  { id: 'prod-5', business_id: 'rest-1', name: 'Espresso', price: 2.50, category: 'Bebidas', area: 'bar', available: true },
  { id: 'prod-6', business_id: 'rest-1', name: 'Vino de la Casa', price: 18.00, category: 'Vinos', area: 'bar', available: true },
  { id: 'prod-7', business_id: 'rest-1', name: 'Bruschetta', price: 8.00, category: 'Entrantes', area: 'cocina', available: true },
  { id: 'prod-8', business_id: 'rest-1', name: 'Aperol Spritz', price: 9.00, category: 'Cócteles', area: 'bar', available: true }
]

// Pedidos con items
export const orders: Order[] = [
  {
    id: 'order-1',
    business_id: 'rest-1',
    table_id: 'table-1',
    table_number: 1,
    user_id: 'user-2',
    waiter_name: 'María López',
    status: 'en_preparacion',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
    total: 41.50,
    items: [
      { id: 'item-1', order_id: 'order-1', product_name: 'Pizza Margherita', quantity: 2, price: 12.50, status: 'preparando', area: 'cocina' },
      { id: 'item-2', order_id: 'order-1', product_name: 'Pasta Carbonara', quantity: 1, price: 14.00, status: 'pendiente', area: 'cocina' },
      { id: 'item-3', order_id: 'order-1', product_name: 'Vino de la Casa', quantity: 1, price: 18.00, status: 'listo', area: 'bar' }
    ]
  },
  {
    id: 'order-2',
    business_id: 'rest-1',
    table_id: 'table-3',
    table_number: 3,
    user_id: 'user-2',
    waiter_name: 'María López',
    status: 'pendiente',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
    total: 32.50,
    items: [
      { id: 'item-4', order_id: 'order-2', product_name: 'Risotto Funghi', quantity: 2, price: 15.50, status: 'pendiente', area: 'cocina' },
      { id: 'item-5', order_id: 'order-2', product_name: 'Aperol Spritz', quantity: 2, price: 9.00, status: 'pendiente', area: 'bar', notes: 'Sin hielo' }
    ]
  },
  {
    id: 'order-3',
    business_id: 'rest-1',
    table_id: 'table-6',
    table_number: 6,
    user_id: 'user-2',
    waiter_name: 'María López',
    status: 'en_preparacion',
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 min ago
    total: 22.00,
    items: [
      { id: 'item-6', order_id: 'order-3', product_name: 'Bruschetta', quantity: 1, price: 8.00, status: 'listo', area: 'cocina' },
      { id: 'item-7', order_id: 'order-3', product_name: 'Pasta Carbonara', quantity: 1, price: 14.00, status: 'preparando', area: 'cocina' }
    ]
  }
]

// Barberos
export const barbers: Barber[] = [
  { id: 'barber-u-1', business_id: 'barber-1', name: 'Andrés Ruiz', available: true },
  { id: 'barber-u-2', business_id: 'barber-1', name: 'Miguel Torres', available: true, current_client: 'Juan Pérez' },
  { id: 'barber-u-3', business_id: 'barber-1', name: 'Roberto Díaz', available: false }
]

// Servicios de barbería
export const services: Service[] = [
  { id: 'serv-1', business_id: 'barber-1', name: 'Corte Clásico', duration: 30, price: 15.00 },
  { id: 'serv-2', business_id: 'barber-1', name: 'Corte + Barba', duration: 45, price: 25.00 },
  { id: 'serv-3', business_id: 'barber-1', name: 'Afeitado Tradicional', duration: 30, price: 12.00 },
  { id: 'serv-4', business_id: 'barber-1', name: 'Corte Niño', duration: 20, price: 10.00 },
  { id: 'serv-5', business_id: 'barber-1', name: 'Tratamiento Capilar', duration: 60, price: 35.00 }
]

// Citas
export const appointments: Appointment[] = [
  {
    id: 'apt-1',
    business_id: 'barber-1',
    barber_id: 'barber-u-1',
    barber_name: 'Andrés Ruiz',
    client_name: 'Carlos Mendoza',
    client_phone: '+34 612 345 678',
    service_id: 'serv-2',
    service_name: 'Corte + Barba',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    status: 'pendiente',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 'apt-2',
    business_id: 'barber-1',
    barber_id: 'barber-u-1',
    barber_name: 'Andrés Ruiz',
    client_name: 'Luis Fernández',
    service_id: 'serv-1',
    service_name: 'Corte Clásico',
    date: new Date().toISOString().split('T')[0],
    time: '11:00',
    status: 'pendiente',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    id: 'apt-3',
    business_id: 'barber-1',
    barber_id: 'barber-u-2',
    barber_name: 'Miguel Torres',
    client_name: 'Juan Pérez',
    service_id: 'serv-2',
    service_name: 'Corte + Barba',
    date: new Date().toISOString().split('T')[0],
    time: '09:30',
    status: 'en_proceso',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  }
]

// Cola de espera
export const queue: QueueEntry[] = [
  {
    id: 'queue-1',
    business_id: 'barber-1',
    client_name: 'Pablo García',
    service_id: 'serv-1',
    service_name: 'Corte Clásico',
    status: 'esperando',
    position: 1,
    estimated_wait: 15,
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString()
  },
  {
    id: 'queue-2',
    business_id: 'barber-1',
    client_name: 'Diego Martín',
    service_id: 'serv-3',
    service_name: 'Afeitado Tradicional',
    status: 'esperando',
    position: 2,
    estimated_wait: 45,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    id: 'queue-3',
    business_id: 'barber-1',
    client_name: 'Sergio López',
    service_name: 'Sin especificar',
    status: 'esperando',
    position: 3,
    estimated_wait: 75,
    created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString()
  }
]

"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { 
  User, Business, Table, Order, OrderItem, 
  Barber, Appointment, QueueEntry, OrderItemStatus 
} from './types'
import { createClient } from './supabase/client'
import { 
  users as mockUsers, 
  businesses as mockBusinesses, 
  tables as mockTables, 
  orders as mockOrders,
  barbers as mockBarbers,
  appointments as mockAppointments,
  queue as mockQueue
} from './mock-data'

interface AppContextType {
  // Auth
  currentUser: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  
  // Business
  currentBusiness: Business | null
  businesses: Business[]
  setCurrentBusiness: (business: Business | null) => void
  toggleBusinessActive: (businessId: string) => void
  
  // Tables
  tables: Table[]
  updateTableStatus: (tableId: string, status: Table['status']) => void
  
  // Orders
  orders: Order[]
  addOrder: (order: Omit<Order, 'id' | 'created_at'>) => void
  updateOrderStatus: (orderId: string, status: Order['status']) => void
  updateOrderItemStatus: (orderId: string, itemId: string, status: OrderItemStatus) => void
  
  // Barbers
  barbers: Barber[]
  toggleBarberAvailability: (barberId: string) => void
  
  // Appointments
  appointments: Appointment[]
  addAppointment: (appointment: Omit<Appointment, 'id' | 'created_at'>) => void
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => void
  
  // Queue
  queue: QueueEntry[]
  addToQueue: (entry: Omit<QueueEntry, 'id' | 'created_at' | 'position' | 'estimated_wait'>) => void
  updateQueueStatus: (queueId: string, status: QueueEntry['status']) => void
  removeFromQueue: (queueId: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>(mockBusinesses)
  const [tables, setTables] = useState<Table[]>(mockTables)
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [barbers, setBarbers] = useState<Barber[]>(mockBarbers)
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [queue, setQueue] = useState<QueueEntry[]>(mockQueue)

  // Verificar sesión al montar
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Obtener detalles del usuario de la BD
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single()

        if (userData) {
          const mockUser = mockUsers.find(u => u.email === userData.email) || {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            organization_id: userData.organization_id,
            business_id: userData.business_id,
            avatar_url: userData.avatar_url,
            active: userData.active,
            created_at: userData.created_at
          }
          setCurrentUser(mockUser as User)
          
          if (mockUser.business_id) {
            const business = mockBusinesses.find(b => b.id === mockUser.business_id)
            if (business) setCurrentBusiness(business)
          }
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const supabase = createClient()
      
      // Login con Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Login error:', error.message)
        return false
      }

      // Obtener datos del usuario de la BD
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (userData) {
        const mockUser = mockUsers.find(u => u.email === userData.email) || {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          organization_id: userData.organization_id,
          business_id: userData.business_id,
          avatar_url: userData.avatar_url,
          active: userData.active,
          created_at: userData.created_at
        }
        setCurrentUser(mockUser as User)
        
        if (mockUser.business_id) {
          const business = mockBusinesses.find(b => b.id === mockUser.business_id)
          if (business) setCurrentBusiness(business)
        }
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setCurrentUser(null)
      setCurrentBusiness(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [])

  const toggleBusinessActive = useCallback((businessId: string) => {
    setBusinesses(prev => prev.map(b => 
      b.id === businessId ? { ...b, active: !b.active } : b
    ))
  }, [])

  const updateTableStatus = useCallback((tableId: string, status: Table['status']) => {
    setTables(prev => prev.map(t => 
      t.id === tableId ? { ...t, status } : t
    ))
  }, [])

  const addOrder = useCallback((order: Omit<Order, 'id' | 'created_at'>) => {
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    setOrders(prev => [...prev, newOrder])
    updateTableStatus(order.table_id, 'ocupada')
  }, [updateTableStatus])

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status } : o
    ))
  }, [])

  const updateOrderItemStatus = useCallback((orderId: string, itemId: string, status: OrderItemStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedItems = o.items.map(item => 
          item.id === itemId ? { ...item, status } : item
        )
        // Check if all items are ready
        const allReady = updatedItems.every(item => item.status === 'listo')
        return { 
          ...o, 
          items: updatedItems,
          status: allReady ? 'listo' : 'en_preparacion'
        }
      }
      return o
    }))
  }, [])

  const toggleBarberAvailability = useCallback((barberId: string) => {
    setBarbers(prev => prev.map(b => 
      b.id === barberId ? { ...b, available: !b.available } : b
    ))
  }, [])

  const addAppointment = useCallback((appointment: Omit<Appointment, 'id' | 'created_at'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: `apt-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    setAppointments(prev => [...prev, newAppointment])
  }, [])

  const updateAppointmentStatus = useCallback((appointmentId: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => 
      a.id === appointmentId ? { ...a, status } : a
    ))
  }, [])

  const addToQueue = useCallback((entry: Omit<QueueEntry, 'id' | 'created_at' | 'position' | 'estimated_wait'>) => {
    const position = queue.filter(q => q.status === 'esperando').length + 1
    const estimated_wait = position * 30 // 30 min average per client
    const newEntry: QueueEntry = {
      ...entry,
      id: `queue-${Date.now()}`,
      position,
      estimated_wait,
      created_at: new Date().toISOString()
    }
    setQueue(prev => [...prev, newEntry])
  }, [queue])

  const updateQueueStatus = useCallback((queueId: string, status: QueueEntry['status']) => {
    setQueue(prev => {
      const updated = prev.map(q => 
        q.id === queueId ? { ...q, status } : q
      )
      // Recalculate positions
      let position = 1
      return updated.map(q => {
        if (q.status === 'esperando') {
          const newPosition = position++
          return { ...q, position: newPosition, estimated_wait: newPosition * 30 }
        }
        return q
      })
    })
  }, [])

  const removeFromQueue = useCallback((queueId: string) => {
    setQueue(prev => {
      const filtered = prev.filter(q => q.id !== queueId)
      let position = 1
      return filtered.map(q => {
        if (q.status === 'esperando') {
          const newPosition = position++
          return { ...q, position: newPosition, estimated_wait: newPosition * 30 }
        }
        return q
      })
    })
  }, [])

  return (
    <AppContext.Provider value={{
      currentUser,
      login,
      logout,
      checkAuth,
      currentBusiness,
      businesses,
      setCurrentBusiness,
      toggleBusinessActive,
      tables,
      updateTableStatus,
      orders,
      addOrder,
      updateOrderStatus,
      updateOrderItemStatus,
      barbers,
      toggleBarberAvailability,
      appointments,
      addAppointment,
      updateAppointmentStatus,
      queue,
      addToQueue,
      updateQueueStatus,
      removeFromQueue
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

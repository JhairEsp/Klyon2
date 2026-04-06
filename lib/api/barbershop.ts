import { createClient } from '@/lib/supabase/client'
import type { Appointment, QueueEntry } from '@/lib/types'

// ============================================================================
// SERVICIOS
// ============================================================================

export async function getServices(businessId: string) {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('barber_services')
      .select('*')
      .eq('business_id', businessId)
      .eq('active', true)
      .order('order_number', { ascending: true })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Get services error:', error)
    throw error
  }
}

export async function createService(
  businessId: string,
  name: string,
  price: number,
  durationMinutes: number,
  description?: string,
  imageUrl?: string
) {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('barber_services')
      .insert({
        business_id: businessId,
        name,
        price,
        duration_minutes: durationMinutes,
        description,
        image_url: imageUrl,
        active: true
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Create service error:', error)
    throw error
  }
}

// ============================================================================
// BARBEROS
// ============================================================================

export async function getBarbers(businessId: string) {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('barbers')
      .select('*, user_id(*)')
      .eq('business_id', businessId)
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Get barbers error:', error)
    throw error
  }
}

export async function toggleBarberAvailability(barberId: string, available: boolean) {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('barbers')
      .update({
        available,
        updated_at: new Date().toISOString()
      })
      .eq('id', barberId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Toggle barber availability error:', error)
    throw error
  }
}

// ============================================================================
// CITAS
// ============================================================================

export async function createAppointment(
  businessId: string,
  barberId: string,
  serviceId: string,
  clientName: string,
  appointmentDate: string,
  appointmentTime: string,
  clientPhone?: string,
  clientEmail?: string,
  notes?: string
): Promise<Appointment> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        business_id: businessId,
        barber_id: barberId,
        service_id: serviceId,
        client_name: clientName,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        client_phone: clientPhone,
        client_email: clientEmail,
        notes,
        status: 'pendiente'
      })
      .select()
      .single()
    
    if (error) throw error
    return data as Appointment
  } catch (error) {
    console.error('Create appointment error:', error)
    throw error
  }
}

export async function getAppointments(businessId: string, date?: string): Promise<Appointment[]> {
  try {
    const supabase = createClient()
    
    let query = supabase
      .from('appointments')
      .select('*')
      .eq('business_id', businessId)
      .neq('status', 'cancelado')
    
    if (date) {
      query = query.eq('appointment_date', date)
    }
    
    const { data, error } = await query.order('appointment_date', { ascending: true })
    
    if (error) throw error
    return (data || []) as Appointment[]
  } catch (error) {
    console.error('Get appointments error:', error)
    throw error
  }
}

export async function getBarberAppointments(
  barberId: string,
  date?: string
): Promise<Appointment[]> {
  try {
    const supabase = createClient()
    
    let query = supabase
      .from('appointments')
      .select('*')
      .eq('barber_id', barberId)
      .neq('status', 'cancelado')
    
    if (date) {
      query = query.eq('appointment_date', date)
    }
    
    const { data, error } = await query.order('appointment_time', { ascending: true })
    
    if (error) throw error
    return (data || []) as Appointment[]
  } catch (error) {
    console.error('Get barber appointments error:', error)
    throw error
  }
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: 'pendiente' | 'en_proceso' | 'finalizado' | 'cancelado'
): Promise<Appointment> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('appointments')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .select()
      .single()
    
    if (error) throw error
    return data as Appointment
  } catch (error) {
    console.error('Update appointment status error:', error)
    throw error
  }
}

export async function cancelAppointment(appointmentId: string): Promise<Appointment> {
  return updateAppointmentStatus(appointmentId, 'cancelado')
}

// ============================================================================
// COLA DE ESPERA
// ============================================================================

export async function addToQueue(
  businessId: string,
  clientName: string,
  serviceId?: string,
  barberId?: string,
  clientPhone?: string,
  notes?: string
): Promise<QueueEntry> {
  try {
    const supabase = createClient()
    
    // Obtener posición
    const { data: existingQueue, error: countError } = await supabase
      .from('queue')
      .select('position')
      .eq('business_id', businessId)
      .eq('status', 'esperando')
      .order('position', { ascending: false })
      .limit(1)
    
    if (countError) throw countError
    
    const nextPosition = existingQueue && existingQueue.length > 0
      ? (existingQueue[0].position || 0) + 1
      : 1
    
    const estimatedWait = nextPosition * 30 // 30 min por persona
    
    const { data, error } = await supabase
      .from('queue')
      .insert({
        business_id: businessId,
        client_name: clientName,
        service_id: serviceId,
        barber_id: barberId,
        client_phone: clientPhone,
        notes,
        position: nextPosition,
        estimated_wait_minutes: estimatedWait,
        status: 'esperando'
      })
      .select()
      .single()
    
    if (error) throw error
    return data as QueueEntry
  } catch (error) {
    console.error('Add to queue error:', error)
    throw error
  }
}

export async function getQueue(businessId: string): Promise<QueueEntry[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('queue')
      .select('*')
      .eq('business_id', businessId)
      .eq('status', 'esperando')
      .order('position', { ascending: true })
    
    if (error) throw error
    return (data || []) as QueueEntry[]
  } catch (error) {
    console.error('Get queue error:', error)
    throw error
  }
}

export async function updateQueueStatus(
  queueId: string,
  status: 'esperando' | 'en_proceso' | 'finalizado'
): Promise<QueueEntry> {
  try {
    const supabase = createClient()
    
    // Si cambia a en_proceso o finalizado, recalcular posiciones
    if (status !== 'esperando') {
      const { data: entry, error: getError } = await supabase
        .from('queue')
        .select('business_id')
        .eq('id', queueId)
        .single()
      
      if (getError) throw getError
      
      // Actualizar
      const { error: updateError } = await supabase
        .from('queue')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', queueId)
      
      if (updateError) throw updateError
      
      // Recalcular posiciones
      const { data: remaining } = await supabase
        .from('queue')
        .select('*')
        .eq('business_id', entry.business_id)
        .eq('status', 'esperando')
        .order('position', { ascending: true })
      
      if (remaining && remaining.length > 0) {
        for (let i = 0; i < remaining.length; i++) {
          await supabase
            .from('queue')
            .update({
              position: i + 1,
              estimated_wait_minutes: (i + 1) * 30
            })
            .eq('id', remaining[i].id)
        }
      }
    } else {
      const { error } = await supabase
        .from('queue')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', queueId)
      
      if (error) throw error
    }
    
    // Obtener registro actualizado
    const { data, error } = await supabase
      .from('queue')
      .select('*')
      .eq('id', queueId)
      .single()
    
    if (error) throw error
    return data as QueueEntry
  } catch (error) {
    console.error('Update queue status error:', error)
    throw error
  }
}

export async function removeFromQueue(queueId: string): Promise<void> {
  try {
    const supabase = createClient()
    
    // Obtener entry para obtener business_id
    const { data: entry, error: getError } = await supabase
      .from('queue')
      .select('business_id')
      .eq('id', queueId)
      .single()
    
    if (getError) throw getError
    
    // Eliminar
    const { error: deleteError } = await supabase
      .from('queue')
      .delete()
      .eq('id', queueId)
    
    if (deleteError) throw deleteError
    
    // Recalcular posiciones
    const { data: remaining } = await supabase
      .from('queue')
      .select('*')
      .eq('business_id', entry.business_id)
      .eq('status', 'esperando')
      .order('position', { ascending: true })
    
    if (remaining && remaining.length > 0) {
      for (let i = 0; i < remaining.length; i++) {
        await supabase
          .from('queue')
          .update({
            position: i + 1,
            estimated_wait_minutes: (i + 1) * 30
          })
          .eq('id', remaining[i].id)
      }
    }
  } catch (error) {
    console.error('Remove from queue error:', error)
    throw error
  }
}

// ============================================================================
// SUSCRIPCIONES
// ============================================================================

export function subscribeToAppointments(
  businessId: string,
  callback: (appointment: Appointment) => void
) {
  try {
    const supabase = createClient()
    
    return supabase
      .channel(`appointments:${businessId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `business_id=eq.${businessId}`
        },
        (payload) => {
          callback(payload.new as Appointment)
        }
      )
      .subscribe()
  } catch (error) {
    console.error('Subscribe to appointments error:', error)
  }
}

export function subscribeToQueue(
  businessId: string,
  callback: (queue: QueueEntry) => void
) {
  try {
    const supabase = createClient()
    
    return supabase
      .channel(`queue:${businessId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queue',
          filter: `business_id=eq.${businessId}`
        },
        (payload) => {
          callback(payload.new as QueueEntry)
        }
      )
      .subscribe()
  } catch (error) {
    console.error('Subscribe to queue error:', error)
  }
}

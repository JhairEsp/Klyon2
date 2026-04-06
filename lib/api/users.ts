import { createClient } from '@/lib/supabase/client'
import type { User } from '@/lib/types'

/**
 * Crear nuevo usuario (para admin de negocio)
 */
export async function createUser(
  email: string,
  name: string,
  role: 'mesero' | 'cocina' | 'barbero' | 'admin_negocio',
  businessId: string,
  organizationId: string
): Promise<User> {
  try {
    const supabase = createClient()
    
    // Crear usuario con password temporal
    const tempPassword = Math.random().toString(36).slice(-12)
    
    const { data, error } = await supabase
      .from('users')
      .insert({
        email,
        name,
        role,
        business_id: businessId,
        organization_id: organizationId,
        active: true,
        password_hash: tempPassword // Debería ser hasheado
      })
      .select()
      .single()
    
    if (error) throw error
    
    // TODO: Enviar email con contraseña temporal
    
    return data as User
  } catch (error) {
    console.error('Create user error:', error)
    throw error
  }
}

/**
 * Obtener usuarios de un negocio
 */
export async function getBusinessUsers(businessId: string): Promise<User[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('business_id', businessId)
      .eq('active', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return (data || []) as User[]
  } catch (error) {
    console.error('Get business users error:', error)
    throw error
  }
}

/**
 * Obtener usuario por ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      throw error
    }
    
    return (data || null) as User | null
  } catch (error) {
    console.error('Get user by ID error:', error)
    throw error
  }
}

/**
 * Obtener usuario por email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      throw error
    }
    
    return (data || null) as User | null
  } catch (error) {
    console.error('Get user by email error:', error)
    throw error
  }
}

/**
 * Actualizar usuario
 */
export async function updateUser(
  userId: string,
  updates: Partial<User>
): Promise<User> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data as User
  } catch (error) {
    console.error('Update user error:', error)
    throw error
  }
}

/**
 * Desactivar usuario
 */
export async function deactivateUser(userId: string): Promise<User> {
  try {
    return await updateUser(userId, { active: false })
  } catch (error) {
    console.error('Deactivate user error:', error)
    throw error
  }
}

/**
 * Activar usuario
 */
export async function activateUser(userId: string): Promise<User> {
  try {
    return await updateUser(userId, { active: true })
  } catch (error) {
    console.error('Activate user error:', error)
    throw error
  }
}

/**
 * Cambiar rol de usuario
 */
export async function changeUserRole(
  userId: string,
  newRole: string
): Promise<User> {
  try {
    return await updateUser(userId, { role: newRole as any })
  } catch (error) {
    console.error('Change user role error:', error)
    throw error
  }
}

/**
 * Obtener usuarios de una organización (super admin)
 */
export async function getOrganizationUsers(organizationId: string): Promise<User[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return (data || []) as User[]
  } catch (error) {
    console.error('Get organization users error:', error)
    throw error
  }
}

/**
 * Contar usuarios por rol en un negocio
 */
export async function countUsersByRole(
  businessId: string
): Promise<Record<string, number>> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('business_id', businessId)
      .eq('active', true)
    
    if (error) throw error
    
    const counts: Record<string, number> = {}
    data?.forEach((user) => {
      counts[user.role] = (counts[user.role] || 0) + 1
    })
    
    return counts
  } catch (error) {
    console.error('Count users by role error:', error)
    return {}
  }
}

/**
 * Subscribe a cambios de usuarios en tiempo real
 */
export function subscribeToBusinessUsers(
  businessId: string,
  callback: (user: User) => void
) {
  try {
    const supabase = createClient()
    
    return supabase
      .channel(`business_users:${businessId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `business_id=eq.${businessId}`
        },
        (payload) => {
          callback(payload.new as User)
        }
      )
      .subscribe()
  } catch (error) {
    console.error('Subscribe to business users error:', error)
  }
}

/**
 * Verificar si usuario actual es super admin
 */
export async function isCurrentUserSuperAdmin(): Promise<boolean> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return false
    
    const dbUser = await getUserById(user.id)
    return dbUser?.role === 'super_admin'
  } catch (error) {
    console.error('Check super admin error:', error)
    return false
  }
}

/**
 * Verificar si usuario actual es admin del negocio
 */
export async function isCurrentUserBusinessAdmin(businessId: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return false
    
    const dbUser = await getUserById(user.id)
    return dbUser?.role === 'admin_negocio' && dbUser?.business_id === businessId
  } catch (error) {
    console.error('Check business admin error:', error)
    return false
  }
}

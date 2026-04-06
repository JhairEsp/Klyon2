import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'
import type { User as DBUser } from '@/lib/types'

/**
 * Login con email y contraseña
 * Nota: Este es un ejemplo. En producción, necesitarías:
 * 1. Hash de contraseña con bcrypt en backend
 * 2. O usar Supabase Auth nativo
 */
export async function loginUser(email: string, password: string) {
  try {
    const supabase = createBrowserClient()
    
    // Opción 1: Usar Supabase Auth (recomendado)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    
    return {
      user: data.user,
      session: data.session
    }
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

/**
 * Logout
 */
export async function logoutUser() {
  try {
    const supabase = createBrowserClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

/**
 * Obtener sesión actual
 */
export async function getCurrentSession() {
  try {
    const supabase = createBrowserClient()
    const { data: { session } } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Get session error:', error)
    return null
  }
}

/**
 * Obtener usuario actual con detalles de base de datos
 */
export async function getCurrentUserWithDetails() {
  try {
    const supabase = createBrowserClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) return null
    
    // Obtener detalles del usuario de la tabla users
    const { data: dbUser, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()
    
    if (error) throw error
    
    return dbUser as DBUser
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

/**
 * Registrar nuevo usuario (solo super admin)
 */
export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: string,
  organizationId: string,
  businessId?: string
) {
  try {
    const supabase = createBrowserClient()
    
    // 1. Crear usuario en Supabase Auth
    const { data: { user: authUser }, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        }
      }
    })
    
    if (authError) throw authError
    if (!authUser) throw new Error('Failed to create auth user')
    
    // 2. Crear registro en tabla users
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .insert({
        id: authUser.id,
        email,
        name,
        role,
        organization_id: organizationId,
        business_id: businessId || null,
        active: true,
        password_hash: password // Nota: esto debería ser hasheado en servidor
      })
      .select()
      .single()
    
    if (dbError) {
      // Si falla la BD, eliminar el usuario de Auth
      await supabase.auth.admin.deleteUser(authUser.id)
      throw dbError
    }
    
    return dbUser
  } catch (error) {
    console.error('Register user error:', error)
    throw error
  }
}

/**
 * Verificar si email existe
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const supabase = createBrowserClient()
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      throw error
    }
    
    return !!data
  } catch (error) {
    console.error('Check email error:', error)
    return false
  }
}

/**
 * Reset password
 */
export async function resetPassword(email: string) {
  try {
    const supabase = createBrowserClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    
    if (error) throw error
  } catch (error) {
    console.error('Reset password error:', error)
    throw error
  }
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string) {
  try {
    const supabase = createBrowserClient()
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (error) throw error
  } catch (error) {
    console.error('Update password error:', error)
    throw error
  }
}

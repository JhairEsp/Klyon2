import { createClient } from '@/lib/supabase/client'
import type { Business } from '@/lib/types'

/**
 * Crear nuevo negocio
 */
export async function createBusiness(
  organizationId: string,
  name: string,
  type: 'restaurant' | 'barbershop',
  address?: string,
  phone?: string
): Promise<Business> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('businesses')
      .insert({
        organization_id: organizationId,
        name,
        type,
        address,
        phone,
        active: true
      })
      .select()
      .single()
    
    if (error) throw error
    return data as Business
  } catch (error) {
    console.error('Create business error:', error)
    throw error
  }
}

/**
 * Obtener todos los negocios de una organización
 */
export async function getBusinessesByOrganization(orgId: string): Promise<Business[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return (data || []) as Business[]
  } catch (error) {
    console.error('Get businesses error:', error)
    throw error
  }
}

/**
 * Obtener un negocio por ID
 */
export async function getBusinessById(businessId: string): Promise<Business | null> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      throw error
    }
    
    return (data || null) as Business | null
  } catch (error) {
    console.error('Get business by ID error:', error)
    throw error
  }
}

/**
 * Actualizar negocio
 */
export async function updateBusiness(
  businessId: string,
  updates: Partial<Business>
): Promise<Business> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('businesses')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', businessId)
      .select()
      .single()
    
    if (error) throw error
    return data as Business
  } catch (error) {
    console.error('Update business error:', error)
    throw error
  }
}

/**
 * Activar/desactivar negocio
 */
export async function toggleBusinessActive(businessId: string, active: boolean): Promise<Business> {
  try {
    return await updateBusiness(businessId, { active })
  } catch (error) {
    console.error('Toggle business active error:', error)
    throw error
  }
}

/**
 * Eliminar negocio (solo super admin)
 */
export async function deleteBusiness(businessId: string): Promise<void> {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', businessId)
    
    if (error) throw error
  } catch (error) {
    console.error('Delete business error:', error)
    throw error
  }
}

/**
 * Obtener negocios para usuario actual
 */
export async function getUserBusinesses(): Promise<Business[]> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return []
    
    // Obtener datos del usuario
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('business_id, organization_id, role')
      .eq('id', user.id)
      .single()
    
    if (userError) throw userError
    if (!userData) return []
    
    // Si es super admin, obtener todos los negocios de su organización
    if (userData.role === 'super_admin') {
      return await getBusinessesByOrganization(userData.organization_id)
    }
    
    // Si no, obtener solo su negocio
    if (userData.business_id) {
      const business = await getBusinessById(userData.business_id)
      return business ? [business] : []
    }
    
    return []
  } catch (error) {
    console.error('Get user businesses error:', error)
    return []
  }
}

/**
 * Subscribe a cambios de negocios en tiempo real
 */
export function subscribeToBusinesses(
  organizationId: string,
  callback: (business: Business) => void
) {
  try {
    const supabase = createClient()
    
    return supabase
      .channel(`businesses:org_id=${organizationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'businesses',
          filter: `organization_id=eq.${organizationId}`
        },
        (payload) => {
          callback(payload.new as Business)
        }
      )
      .subscribe()
  } catch (error) {
    console.error('Subscribe to businesses error:', error)
  }
}

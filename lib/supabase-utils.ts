import { createClient } from '@/lib/supabase/server'
import { User, Business } from '@/lib/types'

export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) return null

    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    return userData as User
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

export async function getCurrentBusiness(businessId: string): Promise<Business | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single()

    if (error) {
      console.error('Error fetching business:', error)
      return null
    }

    return data as Business
  } catch (error) {
    console.error('Error in getCurrentBusiness:', error)
    return null
  }
}

export async function getUserRole(): Promise<string | null> {
  try {
    const user = await getCurrentUser()
    return user?.role || null
  } catch (error) {
    console.error('Error in getUserRole:', error)
    return null
  }
}

export async function isSuperAdmin(): Promise<boolean> {
  try {
    const role = await getUserRole()
    return role === 'super_admin'
  } catch (error) {
    console.error('Error in isSuperAdmin:', error)
    return false
  }
}

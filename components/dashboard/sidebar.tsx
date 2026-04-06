"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useApp } from '@/lib/app-context'
import {
  LayoutDashboard,
  UtensilsCrossed,
  ChefHat,
  Scissors,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  Building2,
  ClipboardList
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

const restaurantLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/restaurant/tables', label: 'Mesas', icon: UtensilsCrossed },
  { href: '/dashboard/restaurant/orders', label: 'Pedidos', icon: ClipboardList },
  { href: '/dashboard/kitchen', label: 'Cocina (KDS)', icon: ChefHat },
]

const barbershopLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/barber/appointments', label: 'Citas', icon: CalendarDays },
  { href: '/dashboard/barber/queue', label: 'Cola de Espera', icon: Users },
  { href: '/dashboard/barber/barbers', label: 'Barberos', icon: Scissors },
]

const adminLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/admin/businesses', label: 'Negocios', icon: Building2 },
  { href: '/dashboard/admin/users', label: 'Usuarios', icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()
  const { currentUser, currentBusiness, logout } = useApp()

  const getLinks = () => {
    if (currentUser?.role === 'super_admin') return adminLinks
    if (currentBusiness?.type === 'restaurant') return restaurantLinks
    if (currentBusiness?.type === 'barbershop') return barbershopLinks
    return restaurantLinks
  }

  const links = getLinks()
  const initials = currentUser?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Building2 className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-sidebar-foreground">BizManager</h1>
          <p className="text-xs text-muted-foreground">SaaS Platform</p>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Current Business */}
      {currentBusiness && (
        <div className="px-4 py-4">
          <div className="rounded-lg bg-sidebar-accent px-3 py-2">
            <p className="text-xs text-muted-foreground">Negocio actual</p>
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {currentBusiness.name}
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map(link => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* User */}
      <div className="p-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-2.5">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {currentUser?.name || 'Usuario'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {currentUser?.role?.replace('_', ' ')}
            </p>
          </div>
        </div>
        
        <div className="mt-3 flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 justify-start text-muted-foreground hover:text-sidebar-foreground"
          >
            <Settings className="mr-2 h-4 w-4" />
            Ajustes
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={logout}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}

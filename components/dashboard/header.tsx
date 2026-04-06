"use client"

import { usePathname } from 'next/navigation'
import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/restaurant/tables': 'Gestión de Mesas',
  '/dashboard/restaurant/orders': 'Pedidos',
  '/dashboard/kitchen': 'Cocina (KDS)',
  '/dashboard/barber/appointments': 'Citas',
  '/dashboard/barber/queue': 'Cola de Espera',
  '/dashboard/barber/barbers': 'Barberos',
  '/dashboard/admin/businesses': 'Negocios',
  '/dashboard/admin/users': 'Usuarios',
}

export function Header() {
  const pathname = usePathname()
  const title = pageTitles[pathname] || 'Dashboard'

  return (
    <header className="sticky top-0 z-10 flex h-14 sm:h-16 items-center justify-between border-b border-border bg-background/95 px-4 sm:px-6 lg:px-8 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="w-48 lg:w-64 bg-secondary pl-9 text-sm"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative h-8 w-8 sm:h-10 sm:w-10">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px]">
            3
          </Badge>
        </Button>
      </div>
    </header>
  )
}

"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Plus, 
  Search,
  Users,
  Shield,
  UtensilsCrossed,
  ChefHat,
  Scissors,
  UserCog,
  Mail
} from 'lucide-react'
import { users as mockUsers, businesses } from '@/lib/mock-data'
import type { UserRole } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')

  const filteredUsers = mockUsers.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return Shield
      case 'admin_negocio':
        return UserCog
      case 'mesero':
        return UtensilsCrossed
      case 'cocina':
        return ChefHat
      case 'barbero':
        return Scissors
      default:
        return Users
    }
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return 'bg-primary/20 text-primary'
      case 'admin_negocio':
        return 'bg-warning/20 text-warning'
      case 'mesero':
        return 'bg-info/20 text-info'
      case 'cocina':
        return 'bg-success/20 text-success'
      case 'barbero':
        return 'bg-info/20 text-info'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getRoleLabel = (role: UserRole) => {
    const labels: Record<UserRole, string> = {
      super_admin: 'Super Admin',
      admin_negocio: 'Admin Negocio',
      mesero: 'Mesero',
      cocina: 'Cocina',
      barbero: 'Barbero'
    }
    return labels[role]
  }

  const getBusinessName = (businessId: string | null) => {
    if (!businessId) return null
    return businesses.find(b => b.id === businessId)?.name
  }

  const roleOptions: { value: UserRole | 'all', label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin_negocio', label: 'Admin Negocio' },
    { value: 'mesero', label: 'Mesero' },
    { value: 'cocina', label: 'Cocina' },
    { value: 'barbero', label: 'Barbero' }
  ]

  const usersByRole = (role: UserRole) => mockUsers.filter(u => u.role === role).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar usuarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {roleOptions.map(option => (
              <Button
                key={option.value}
                variant={roleFilter === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRoleFilter(option.value)}
                className="whitespace-nowrap"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
              <Users className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{mockUsers.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{usersByRole('super_admin')}</p>
              <p className="text-sm text-muted-foreground">Admins</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/20">
              <UserCog className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{usersByRole('admin_negocio')}</p>
              <p className="text-sm text-muted-foreground">Admins Negocio</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-info/20 bg-info/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/20">
              <UtensilsCrossed className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-info">
                {usersByRole('mesero') + usersByRole('cocina')}
              </p>
              <p className="text-sm text-muted-foreground">Restaurante</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-success/20 bg-success/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/20">
              <Scissors className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{usersByRole('barbero')}</p>
              <p className="text-sm text-muted-foreground">Barberos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">
            Usuarios ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No se encontraron usuarios</p>
            </div>
          ) : (
            filteredUsers.map(user => {
              const RoleIcon = getRoleIcon(user.role)
              const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase()
              const businessName = getBusinessName(user.business_id)

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4 transition-all hover:bg-secondary"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className={cn(
                        "text-sm font-medium",
                        getRoleColor(user.role)
                      )}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                      {businessName && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {businessName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "gap-1",
                        getRoleColor(user.role)
                      )}
                    >
                      <RoleIcon className="h-3 w-3" />
                      {getRoleLabel(user.role)}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}

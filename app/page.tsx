"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, UtensilsCrossed, Scissors, Shield, ArrowRight } from 'lucide-react'

const demoAccounts = [
  { 
    email: 'admin@system.com', 
    label: 'Super Admin', 
    description: 'Control total del sistema',
    icon: Shield,
    color: 'bg-primary'
  },
  { 
    email: 'carlos@trattoria.com', 
    label: 'Admin Restaurante', 
    description: 'La Trattoria Bella',
    icon: UtensilsCrossed,
    color: 'bg-warning'
  },
  { 
    email: 'jose@trattoria.com', 
    label: 'Cocina (KDS)', 
    description: 'Vista de cocina',
    icon: UtensilsCrossed,
    color: 'bg-info'
  },
  { 
    email: 'pedro@classic.com', 
    label: 'Admin Barbería', 
    description: 'Classic Cuts Studio',
    icon: Scissors,
    color: 'bg-success'
  },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useApp()
  const router = useRouter()

  const handleLogin = async (loginEmail: string) => {
    setIsLoading(true)
    setError('')
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const success = login(loginEmail)
    if (success) {
      router.push('/dashboard')
    } else {
      setError('Usuario no encontrado')
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin(email)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-primary/20 via-background to-background p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">BizManager</h1>
            <p className="text-sm text-muted-foreground">SaaS Platform</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-foreground leading-tight text-balance">
            Gestiona tu negocio de forma inteligente
          </h2>
          <p className="text-lg text-muted-foreground max-w-md text-pretty">
            Sistema multi-tenant para restaurantes y barberías. Pedidos en tiempo real, 
            gestión de citas, y analíticas avanzadas.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="rounded-xl border border-border bg-card/50 p-4">
              <UtensilsCrossed className="h-8 w-8 text-warning mb-3" />
              <h3 className="font-semibold text-foreground">Restaurantes</h3>
              <p className="text-sm text-muted-foreground">Mesas, pedidos y cocina KDS</p>
            </div>
            <div className="rounded-xl border border-border bg-card/50 p-4">
              <Scissors className="h-8 w-8 text-success mb-3" />
              <h3 className="font-semibold text-foreground">Barberías</h3>
              <p className="text-sm text-muted-foreground">Citas, cola y barberos</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Hecho con Next.js + Tailwind CSS
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">BizManager</h1>
              <p className="text-sm text-muted-foreground">SaaS Platform</p>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">Iniciar sesión</h2>
            <p className="mt-2 text-muted-foreground">
              Ingresa con tu cuenta o prueba una demo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-secondary"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Ingresando...' : 'Ingresar'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                O prueba con una cuenta demo
              </span>
            </div>
          </div>

          <div className="grid gap-3">
            {demoAccounts.map((account) => (
              <Card 
                key={account.email}
                className="cursor-pointer border-border bg-card hover:border-primary/50 hover:bg-secondary/50 transition-all"
                onClick={() => handleLogin(account.email)}
              >
                <CardHeader className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${account.color}`}>
                      <account.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-sm font-medium text-foreground">
                        {account.label}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {account.description}
                      </CardDescription>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

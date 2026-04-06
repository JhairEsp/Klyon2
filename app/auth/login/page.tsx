'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useApp } from '@/lib/app-context'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useApp()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const success = await login(email, password)
      if (success) {
        router.push('/dashboard')
      } else {
        setError('Usuario o contraseña inválidos')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          {/* Logo y titulo */}
          <div className="text-center space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">BizManager</h1>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground px-2">Gestión inteligente para tu negocio</p>
          </div>

          <Card className="border-border/50 shadow-xl w-full">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="text-xl sm:text-2xl">Iniciar Sesión</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Ingresa tus credenciales para acceder al dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm sm:text-base">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 sm:h-10 text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm sm:text-base">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-9 sm:h-10 text-sm sm:text-base"
                  />
                </div>
                {error && (
                  <div className="p-2 sm:p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                    <p className="text-xs sm:text-sm text-destructive">{error}</p>
                  </div>
                )}
                <Button 
                  type="submit" 
                  className="w-full h-9 sm:h-10 text-sm sm:text-base font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </form>

              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
                <div className="text-center space-y-2 sm:space-y-3">
                  <p className="text-xs text-muted-foreground">Demo - Solo superadmin</p>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <p><span className="font-medium">Email:</span> jhairoswaldo@gmail.com</p>
                    <p><span className="font-medium">Contraseña:</span> Endgamer123_</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

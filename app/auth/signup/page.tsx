'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4 sm:p-6">
      <div className="w-full max-w-md">
        <Card className="border-destructive/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              Acceso Restringido
            </CardTitle>
            <CardDescription>
              Las registraciones no están disponibles en este momento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Este sistema es solo accesible para el administrador superusuario. 
            </p>
            <p className="text-sm text-muted-foreground">
              Si requieres acceso, contacta al administrador del sistema.
            </p>
            <div className="mt-6">
              <a href="/auth/login" className="text-primary text-sm font-medium hover:underline">
                Volver al login
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

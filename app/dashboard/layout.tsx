"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/app-context'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { currentUser } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push('/')
    }
  }, [currentUser, router])

  if (!currentUser) {
    return null
  }

  return (
    <div className="flex h-screen w-full bg-background flex-col lg:flex-row">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden w-full">
        <Header />
        <main className="flex-1 overflow-auto p-4 sm:p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

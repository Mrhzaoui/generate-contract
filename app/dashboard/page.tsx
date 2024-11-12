'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mountain, FileText, CreditCard, Settings, LogOut, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    avatarUrl: 'https://github.com/shadcn.png',
  })

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error fetching user:', error)
        return
      }
      if (data.user) {
        setUser({
          name: data.user.user_metadata?.username || data.user.user_metadata?.full_name || 'User',
          email: data.user.email || 'Email not available',
          avatarUrl: data.user.user_metadata?.avatar_url || 'https://github.com/shadcn.png'
        })
      }
    }
    getUser()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="px-6 lg:px-8 h-20 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <Link className="flex items-center justify-center" href="/">
          <Mountain className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">ContractGPT</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" asChild className="text-lg">
            <Link href="/dashboard/subscription">
              <CreditCard className="mr-2 h-5 w-5" />
              Subscription
            </Link>
          </Button>
          <Button variant="ghost" asChild className="text-lg">
            <Link href="/dashboard/settings">
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Link>
          </Button>
          <Button variant="ghost" asChild className="text-lg text-red-600 hover:text-red-700 hover:bg-red-100">
            <Link href="/">
              <LogOut className="mr-2 h-5 w-5" />
              Log Out
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1 container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-8">Welcome, {user.name}!</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Generate New Contract</CardTitle>
                <CardDescription>Create a new contract using AI</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Start generating a new contract tailored to your needs.</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full text-lg">
                  <Link href="/dashboard/generate">
                    <Plus className="mr-2 h-5 w-5" />
                    New Contract
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Recent Contracts</CardTitle>
                <CardDescription>View and manage your recent contracts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Access and edit your recently created contracts.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full text-lg">
                  <Link href="/dashboard/recent-contracts">
                    <FileText className="mr-2 h-5 w-5" />
                    View Contracts
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Subscription Status</CardTitle>
                <CardDescription>Manage your subscription</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg">View and update your current subscription plan.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full text-lg">
                  <Link href="/dashboard/subscription">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Manage Subscription
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </motion.div>
      </main>
      <footer className="w-full py-6 px-4 md:px-6 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto flex justify-center">
          <p className="text-lg text-gray-600 dark:text-gray-300">© 2024 ContractGPT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { FileText, Download, Eye, Mountain, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { ErrorBoundary } from 'react-error-boundary'

interface Contract {
  id: number
  name: string
  created_at: string
  type: string
  file_url: string
}

interface ErrorFallbackProps {
  error: Error
}

function ErrorFallback({ error }: ErrorFallbackProps) {
  return (
    <div className="text-center py-10">
      <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h2>
      <p className="text-xl">{error.message}</p>
    </div>
  )
}

export default function RecentContracts() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchContracts = async () => {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        try {
          const { data, error } = await supabase
            .from('contracts')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10)

          if (error) {
            throw error
          }

          setContracts(data || [])
        } catch (error) {
          console.error('Error fetching contracts:', error)
        }
      }
      setIsLoading(false)
    }

    fetchContracts()
  }, [])

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, '_blank')
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <header className="px-6 lg:px-8 h-20 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <Link className="flex items-center justify-center" href="/dashboard">
            <Mountain className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">ContractGPT</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" asChild className="text-lg">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild className="text-lg">
              <Link href="/dashboard/generate">Generate Contract</Link>
            </Button>
            <Button variant="ghost" asChild className="text-lg">
              <Link href="/dashboard/subscription">Subscription</Link>
            </Button>
            <Button variant="outline" className="text-lg" asChild>
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
            <h1 className="text-4xl font-bold mb-8">Recent Contracts</h1>

            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-3xl">Your Recent Contracts</CardTitle>
                <CardDescription className="text-xl">Review and manage your recently created contracts</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-10">
                    <p className="text-xl">Loading...</p>
                  </div>
                ) : contracts.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-xl">No contracts found. Create your first contract!</p>
                    <Button asChild className="mt-4 text-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
                      <Link href="/dashboard/generate">
                        <FileText className="mr-2 h-5 w-5" />
                        Create New Contract
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xl">Name</TableHead>
                        <TableHead className="text-xl">Date</TableHead>
                        <TableHead className="text-xl">Type</TableHead>
                        <TableHead className="text-xl">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contracts.map((contract) => (
                        <TableRow key={contract.id}>
                          <TableCell className="text-lg font-medium">{contract.name}</TableCell>
                          <TableCell className="text-lg">{new Date(contract.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-lg">{contract.type}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="lg" className="text-lg px-4 py-2">
                                <Eye className="mr-2 h-5 w-5" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="lg"
                                className="text-lg px-4 py-2"
                                onClick={() => handleDownload(contract.file_url)}
                              >
                                <Download className="mr-2 h-5 w-5" />
                                Download
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button asChild className="text-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
                  <Link href="/dashboard/generate">
                    <FileText className="mr-2 h-5 w-5" />
                    Create New Contract
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </main>

        <footer className="w-full py-6 px-4 md:px-6 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto flex justify-center">
            <p className="text-lg text-gray-600 dark:text-gray-300">© 2024 ContractGPT. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  )
}
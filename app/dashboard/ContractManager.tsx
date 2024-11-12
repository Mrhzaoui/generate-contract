'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import ContractGenerator from './generate/page'
import RecentContracts from './recent-contracts/page'
import { supabase } from '@/lib/supabaseClient'

interface Contract {
  id: number
  name: string
  date: string
  type: string
  content: string
}

export default function ContractManager() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [user, setUser] = useState<{ email: string }>({ email: '' })
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error fetching user:', error)
        router.push('/login')
        return
      }
      if (data.user) {
        setUser({ email: data.user.email || 'Email not available' })
        fetchContracts(data.user.id)
      }
    }

    fetchUser()
  }, [router])

  const fetchContracts = async (userId: string) => {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching contracts:', error)
    } else {
      setContracts(data || [])
    }
  }

  const handleContractGenerated = async (newContract: Omit<Contract, 'id' | 'date'>) => {
    const { data, error } = await supabase
      .from('contracts')
      .insert([
        { 
          name: newContract.name, 
          type: newContract.type, 
          content: newContract.content,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }
      ])
      .select()

    if (error) {
      console.error('Error saving contract:', error)
    } else if (data) {
      setContracts(prevContracts => [data[0], ...prevContracts])
      router.push('/dashboard/recent-contracts')
    }
  }

  const handleContractDownload = (contractId: number) => {
    const contract = contracts.find(c => c.id === contractId)
    if (contract) {
      const blob = new Blob([contract.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${contract.name}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <>
      {pathname === '/dashboard/generate' && (
        <ContractGenerator onContractGenerated={handleContractGenerated} />
      )}
      {pathname === '/dashboard/recent-contracts' && (
        <RecentContracts 
          contracts={contracts} 
          onDownload={handleContractDownload} 
        />
      )}
    </>
  )
}
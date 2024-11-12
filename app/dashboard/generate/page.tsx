'use client'

import { useState, useEffect } from 'react'
import { useChat } from 'ai/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, AlertTriangle, Mountain, LogOut, Lock, Loader2, Save, Eye, EyeOff, Trash2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { toast, Toaster } from 'react-hot-toast'
import { useSupabase } from '@/components/SupabaseProvider'
import { supabase } from '@/lib/supabaseClient'
import { Loader } from 'lucide-react'

const contractTypes = [
  { value: "employment", label: "Employment Contract" },
  { value: "nda", label: "Non-Disclosure Agreement" },
  { value: "service", label: "Service Agreement" },
  { value: "rental", label: "Rental Agreement" },
  { value: "consulting", label: "Consulting Agreement" },
  { value: "partnership", label: "Partnership Agreement" },
]

export default function ContractGenerator() {
  const { user, session } = useSupabase()
  const [userInfo, setUserInfo] = useState({
    name: '',
    company: '',
    email: '',
  })
  const [selectedContractType, setSelectedContractType] = useState('')
  const [contractDescription, setContractDescription] = useState('')
  const [additionalDetails, setAdditionalDetails] = useState('')
  const [roles, setRoles] = useState('')
  const [generatedContract, setGeneratedContract] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const router = useRouter()
  //const supabase = createClientComponentClient()
  //const user = useUser()
  //const session = useSession()

  const { messages, append, isLoading, setMessages } = useChat({
    api: '/api/chat',
    onFinish: (message) => {
      if (message.content.toLowerCase().includes('recipe') || message.content.toLowerCase().includes('ingredients')) {
        setError('Invalid input. This tool is designed to generate legal contracts only. Please provide appropriate contract details.')
        setGeneratedContract('')
      } else {
        setGeneratedContract(message.content)
        toast.success('Contract generated successfully!')
      }
    },
    onError: (error: Error | unknown) => {
      console.error('Chat error:', error)
      setError('An error occurred while generating the contract. Please try again.')
      toast.error('Failed to generate contract. Please try again.')
    }
  })

  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.user_metadata?.full_name || '',
        company: user.user_metadata?.company || '',
        email: user.email || '',
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleContractTypeChange = (value: string) => {
    setSelectedContractType(value)
  }

  const handleGenerateContract = async () => {
    setError(null)
    if (!selectedContractType || !contractDescription) {
      setError('Please select a contract type and provide a description.')
      return
    }

    if (contractDescription.toLowerCase().includes('recipe') || contractDescription.toLowerCase().includes('ingredients')) {
      setError('Invalid input. This tool is designed to generate legal contracts only. Please provide appropriate contract details.')
      return
    }

    const prompt = `Generate a professional ${selectedContractType} contract for ${userInfo.name} from ${userInfo.company}. 
    Email: ${userInfo.email}
    Contract details: ${contractDescription}
    Additional details: ${additionalDetails}
    Roles and responsibilities: ${roles}

    Please format the contract with the following sections:
    1. Parties involved
    2. Effective date
    3. Definitions
    4. Scope of work or agreement
    5. Roles and responsibilities
    6. Payment terms (if applicable)
    7. Duration of the agreement
    8. Termination clauses
    9. Confidentiality
    10. Intellectual property rights
    11. Liability and indemnification
    12. Dispute resolution
    13. Governing law
    14. Amendments
    15. Entire agreement
    16. Signatures

    Ensure the language is clear, concise, and legally sound. Format the output for easy readability and professionalism.
    Do not include any information about previous users or any details not explicitly provided in the prompt.
    This must be a legal contract, not a recipe or any other type of document.`

    await append({ role: 'user', content: prompt })
  }

  const handleDownloadPDF = async () => {
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    let yPosition = margin

    // Add header
    pdf.setFontSize(24)
    pdf.setTextColor(0, 0, 255)
    pdf.text('ContractGPT', margin, yPosition + 10)
    yPosition += 20

    // Add contract type
    pdf.setFontSize(18)
    pdf.setTextColor(0)
    pdf.text(selectedContractType.toUpperCase(), pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 15

    // Add generated content
    pdf.setFontSize(12)
    pdf.setTextColor(0)

    const splitContent = pdf.splitTextToSize(generatedContract, pageWidth - 2 * margin)
    
    splitContent.forEach((line: string) => {
      if (yPosition > pageHeight - margin) {
        pdf.addPage()
        yPosition = margin
      }
      pdf.text(line, margin, yPosition)
      yPosition += 7
    })

    const pageCount = pdf.getNumberOfPages()
    pdf.setFontSize(10)
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' })
    }

    pdf.setTextColor(150)
    pdf.setFontSize(60)
    pdf.text('ContractGPT', pageWidth / 2, pageHeight / 2, {
      align: 'center',
      angle: 45
    })

    const pdfBlob = pdf.output('blob')
    
    try {
      setIsSaving(true)
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Check if the 'contracts' bucket exists
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      if (bucketsError) throw bucketsError

      const contractsBucketExists = buckets.some(bucket => bucket.name === 'contracts')

      if (!contractsBucketExists) {
        // Create the 'contracts' bucket if it doesn't exist
        const { data: newBucket, error: createBucketError } = await supabase.storage.createBucket('contracts', {
          public: false,
          allowedMimeTypes: ['application/pdf'],
          fileSizeLimit: 5242880, // 5MB
        })
        if (createBucketError) throw createBucketError
      }

      const fileName = `${Date.now()}_${selectedContractType}_contract.pdf`
      const { data, error: uploadError } = await supabase.storage
        .from('contracts')
        .upload(`${user.id}/${fileName}`, pdfBlob, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data: urlData, error: urlError } = await supabase.storage
        .from('contracts')
        .createSignedUrl(`${user.id}/${fileName}`, 60 * 60 * 24 * 7) // 7 days expiry

      if (urlError) throw urlError

      const { error: insertError } = await supabase
        .from('contracts')
        .insert({
          name: `${selectedContractType} Contract - ${userInfo.name}`,
          type: selectedContractType,
          content: generatedContract,
          file_url: urlData.signedUrl,
          user_id: user.id
        })

      if (insertError) throw insertError

      pdf.save(`${selectedContractType}_contract.pdf`)
      toast.success('Contract saved and downloaded successfully!')
      router.push('/dashboard/recent-contracts')
    } catch (error) {
      console.error('Error handling contract:', error)
      setError('Failed to save or download the contract. Please try again.')
      toast.error('Failed to save or download the contract. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setSelectedContractType('')
    setContractDescription('')
    setAdditionalDetails('')
    setRoles('')
    setGeneratedContract('')
    setError(null)
    setMessages([])
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access the contract generator.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push('/auth/login')} className="w-full">
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
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
            <Link href="/dashboard/subscription">Subscription</Link>
          </Button>
          <Button variant="ghost" asChild className="text-lg">
            <Link href="/dashboard/recent-contracts">Recent Contracts</Link>
          </Button>
          <Button variant="outline" className="text-lg" onClick={handleLogout}>
            <LogOut className="mr-2 h-5 w-5" />
            Log Out
          </Button>
        </nav>
      </header>
      <main className="flex-1 container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-8">Generate Contract</h1>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contract Details</CardTitle>
                <CardDescription>Enter the information for your contract</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={userInfo.name} onChange={handleInputChange} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" name="company" value={userInfo.company} onChange={handleInputChange} placeholder="Acme Inc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={userInfo.email} onChange={handleInputChange} placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contractType">Contract Type</Label>
                  <Select onValueChange={handleContractTypeChange} value={selectedContractType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a contract type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contractTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Contract Description</Label>
                  <Textarea 
                    id="description" 
                    value={contractDescription} 
                    onChange={(e) => setContractDescription(e.target.value)}
                    placeholder="Describe the specific terms or details for your contract"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalDetails">Additional Details</Label>
                  <Textarea 
                    id="additionalDetails" 
                    value={additionalDetails} 
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    placeholder="Any additional details or clauses you want to include"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roles">Roles and Responsibilities</Label>
                  <Textarea 
                    id="roles" 
                    value={roles} 
                    onChange={(e) => setRoles(e.target.value)}
                    placeholder="Specify the roles and responsibilities of each party"
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={handleReset} variant="outline">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button onClick={handleGenerateContract} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Contract'
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generated Contract</CardTitle>
                <CardDescription>Review and download your contract</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                  <div className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
                    {generatedContract}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={handleDownloadPDF} disabled={!generatedContract || isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </>
                  )}
                </Button>
                <Button onClick={() => setShowPreview(!showPreview)} variant="outline">
                  {showPreview ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Hide Preview
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Show Preview
                    </>
                  )}
                </Button>
                <Alert variant="default" className="ml-4">
                  <Lock className="h-4 w-4" />
                  <AlertTitle>Secure</AlertTitle>
                  <AlertDescription>Your contract is protected</AlertDescription>
                </Alert>
              </CardFooter>
            </Card>
          </div>
        </motion.div>
      </main>
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-auto">
              <h2 className="text-2xl font-bold mb-4">Contract Preview</h2>
              <div className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
                {generatedContract}
              </div>
              <Button onClick={() => setShowPreview(false)} className="mt-4">
                Close Preview
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster />
    </div>
  )
}
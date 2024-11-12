'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CreditCard, AlertTriangle, Mountain, LogOut, Check } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({ selectedPlan, handleSubscribe }: { selectedPlan: string | null, handleSubscribe: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/subscription/success`,
      },
    })

    if (error) {
      setError(error.message ?? 'An unknown error occurred')
    } else {
      handleSubscribe()
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button type="submit" disabled={!stripe || isLoading} className="w-full mt-4">
        {isLoading ? 'Processing...' : 'Subscribe Now'}
      </Button>
      {error && <Alert variant="destructive" className="mt-4"><AlertTriangle className="h-4 w-4" />{error}</Alert>}
    </form>
  )
}

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [user, setUser] = useState<{ email: string }>({ email: '' })
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error fetching user:', error)
        return
      }
      if (data.user) {
        setUser({ email: data.user.email || 'Email not available' })
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {
    if (selectedPlan) {
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
    }
  }, [selectedPlan])

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setError('Please select a plan')
      return
    }
    setError(null)
    setSuccess(true)
    // In a real application, you would update the user's subscription status in your database here
    localStorage.setItem('subscriptionStatus', 'active')
    localStorage.setItem('subscriptionPlan', selectedPlan)
    setTimeout(() => {
      router.push('/dashboard/generate')
    }, 2000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="px-6 lg:px-8 h-20 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <Link className="flex items-center justify-center" href="/">
          <Mountain className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">ContractGPT</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link className="text-lg font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors" href="/dashboard">
            Dashboard
          </Link>
          <Link className="text-lg font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors" href="/dashboard/generate">
            Generate Contract
          </Link>
          <Link className="text-lg font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors" href="/dashboard/recent-contracts">
            Recent Contracts
          </Link>
        </nav>
        <Button variant="outline" className="text-lg" asChild>
          <Link href="/">
            <LogOut className="mr-2 h-5 w-5" />
            Log Out
          </Link>
        </Button>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-8 text-center">Choose Your Subscription Plan</h1>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className={`w-full transition-all duration-300 ${selectedPlan === 'monthly' ? 'ring-2 ring-blue-500' : ''}`}>
              <CardHeader>
                <CardTitle className="text-3xl text-center">Monthly Plan</CardTitle>
                <CardDescription className="text-xl text-center">Perfect for short-term projects</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-4xl font-bold mb-4">$10<span className="text-xl font-normal">/month</span></p>
                <ul className="text-left space-y-2">
                  <li className="flex items-center"><Check className="mr-2 text-green-500" /> Unlimited contract generation</li>
                  <li className="flex items-center"><Check className="mr-2 text-green-500" /> Access to all contract types</li>
                  <li className="flex items-center"><Check className="mr-2 text-green-500" /> 24/7 customer support</li>
                </ul>
              </CardContent>
              <div className="p-6 pt-0">
                <RadioGroup onValueChange={setSelectedPlan} className="space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly" className="text-xl">Select Monthly Plan</Label>
                  </div>
                </RadioGroup>
              </div>
            </Card>

            <Card className={`w-full transition-all duration-300 ${selectedPlan === 'yearly' ? 'ring-2 ring-blue-500' : ''}`}>
              <CardHeader>
                <CardTitle className="text-3xl text-center">Yearly Plan</CardTitle>
                <CardDescription className="text-xl text-center">Best value for long-term use</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-4xl font-bold mb-4">$50<span className="text-xl font-normal">/year</span></p>
                <p className="text-lg text-green-500 font-semibold mb-4">Save $70 compared to monthly!</p>
                <ul className="text-left space-y-2">
                  <li className="flex items-center"><Check className="mr-2 text-green-500" /> All features of Monthly Plan</li>
                  <li className="flex items-center"><Check className="mr-2 text-green-500" /> Priority contract processing</li>
                  <li className="flex items-center"><Check className="mr-2 text-green-500" /> Exclusive yearly subscriber benefits</li>
                </ul>
              </CardContent>
              <div className="p-6 pt-0">
                <RadioGroup onValueChange={setSelectedPlan} className="space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    <RadioGroupItem value="yearly" id="yearly" />
                    <Label htmlFor="yearly" className="text-xl">Select Yearly Plan</Label>
                  </div>
                </RadioGroup>
              </div>
            </Card>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-8">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="text-2xl">Error</AlertTitle>
              <AlertDescription className="text-lg">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-8 bg-green-100 border-green-400 text-green-700">
              <Check className="h-5 w-5" />
              <AlertTitle className="text-2xl">Success!</AlertTitle>
              <AlertDescription className="text-lg">Your subscription has been processed. Redirecting to the dashboard...</AlertDescription>
            </Alert>
          )}

          <Card className="mb-10 w-full">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Complete Your Subscription</CardTitle>
              <CardDescription className="text-xl text-center">Secure payment via Stripe</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedPlan && clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm selectedPlan={selectedPlan} handleSubscribe={handleSubscribe} />
                </Elements>
              ) : (
                <p className="text-xl text-center">Please select a plan to proceed with payment.</p>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button variant="outline" asChild className="text-xl px-10 py-4">
              <Link href="/dashboard">Cancel</Link>
            </Button>
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
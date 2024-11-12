'use client'

import Link from "next/link"
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mountain, Check, LogOut } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="px-6 lg:px-8 h-20 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <Link className="flex items-center justify-center" href="/">
          <Mountain className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">ContractGPT</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link className="text-lg font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors" href="/">
            Home
          </Link>
          <Link className="text-lg font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors" href="/about">
            About
          </Link>
          <Link className="text-lg font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors" href="/contact">
            Contact
          </Link>
        </nav>
        <div className="flex gap-4">
          <Button variant="ghost" asChild className="text-lg">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild className="text-lg bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/auth/register">Sign Up</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-8 text-center">Choose Your Plan</h1>
          
          <div className="grid gap-8 md:grid-cols-3">
            <PricingCard
              title="Free Trial"
              price="$0"
              description="Perfect for trying out ContractGPT"
              features={[
                "10 free contract generations",
                "Access to basic templates",
                "Email support"
              ]}
              buttonText="Start Free Trial"
              buttonLink="/auth/register"
            />
            <PricingCard
              title="Pro"
              price="$49"
              period="/month"
              description="Ideal for small to medium businesses"
              features={[
                "Unlimited contract generations",
                "Access to all templates",
                "Priority email support",
                "Custom clause library"
              ]}
              buttonText="Subscribe Now"
              buttonLink="/auth/register"
              highlighted={true}
            />
            <PricingCard
              title="Enterprise"
              price="Custom"
              description="For large organizations with specific needs"
              features={[
                "All Pro features",
                "Dedicated account manager",
                "Custom AI model training",
                "API access",
                "24/7 phone support"
              ]}
              buttonText="Contact Sales"
              buttonLink="/contact"
            />
          </div>
        </motion.div>
      </main>

      <footer className="w-full py-6 px-4 md:px-6 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-lg text-gray-600 dark:text-gray-300">© 2024 ContractGPT. All rights reserved.</p>
          <nav className="flex gap-6 mt-4 sm:mt-0">
            <Link className="text-lg text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors" href="#">
              Terms of Service
            </Link>
            <Link className="text-lg text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors" href="#">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

function PricingCard({ title, price, period = "", description, features, buttonText, buttonLink, highlighted = false }: {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  highlighted?: boolean;
}) {
  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <Card className={`flex flex-col h-full ${highlighted ? 'border-blue-500 border-2' : ''}`}>
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-xl">
            <span className="text-3xl font-bold">{price}</span>
            {period && <span className="text-xl">{period}</span>}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-lg mb-4">{description}</p>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-lg">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button asChild className={`w-full text-lg ${highlighted ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}>
            <Link href={buttonLink}>{buttonText}</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
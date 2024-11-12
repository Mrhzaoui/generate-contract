'use client'

import Link from "next/link"
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mountain, FileText, Clock, ShieldCheck, LogOut } from "lucide-react"

export default function AboutPage() {
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
          <Link className="text-lg font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors" href="/pricing">
            Pricing
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
          <h1 className="text-4xl font-bold mb-8 text-center">About ContractGPT</h1>
          
          <Card className="mb-10">
            <CardHeader>
              <CardTitle className="text-3xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl">
                At ContractGPT, we're on a mission to revolutionize the way businesses handle contracts. 
                By harnessing the power of artificial intelligence, we aim to make contract creation and 
                management accessible, efficient, and error-free for businesses of all sizes.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-10">
            <FeatureCard
              icon={<FileText className="h-12 w-12 text-blue-600" />}
              title="AI-Powered Contracts"
              description="Generate legally sound contracts tailored to your specific needs using advanced AI technology."
            />
            <FeatureCard
              icon={<Clock className="h-12 w-12 text-blue-600" />}
              title="Save Time"
              description="Create contracts in minutes instead of hours. Focus on growing your business, not paperwork."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-12 w-12 text-blue-600" />}
              title="Legal Compliance"
              description="Ensure your contracts are up-to-date with the latest legal requirements and best practices."
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Our Story</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl mb-4">
                ContractGPT was founded in 2023 by a team of legal professionals and AI experts who 
                recognized the need for a more efficient and accurate way to create legal contracts.
              </p>
              <p className="text-xl mb-4">
                Our founders experienced firsthand the time-consuming and error-prone nature of 
                traditional contract drafting. They envisioned a solution that would leverage the 
                latest advancements in artificial intelligence to streamline the process.
              </p>
              <p className="text-xl">
                Today, ContractGPT is used by thousands of businesses worldwide, from startups to 
                Fortune 500 companies. We're committed to continuous improvement and innovation, 
                ensuring that our platform always provides the best possible service to our users.
              </p>
            </CardContent>
          </Card>
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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center space-y-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
    >
      {icon}
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-lg text-gray-600 dark:text-gray-300 text-center">{description}</p>
    </motion.div>
  )
}
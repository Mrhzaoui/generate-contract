'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import React from 'react'
import { Mountain, FileText, Clock, ShieldCheck } from "lucide-react"
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="px-6 lg:px-8 h-20 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <Link className="flex items-center justify-center" href="/">
          <Mountain className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">ContractGPT</span>
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link className="text-xl font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors" href="/about">
            About
          </Link>
          <Link className="text-xl font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors" href="/pricing">
            Pricing
          </Link>
          <Link className="text-xl font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors" href="/contact">
            Contact
          </Link>
        </nav>
        <div className="flex gap-4 items-center">
          <Button variant="ghost" asChild className="text-xl px-6 py-3">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild className="text-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
            <Link href="/auth/register">Sign Up</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 xl:py-56">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Generate Contracts with AI
                </h1>
                <p className="mx-auto max-w-[800px] text-xl md:text-2xl text-gray-600 dark:text-gray-300">
                  Create professional contracts in minutes using our advanced AI-powered platform. Save time and ensure legal compliance.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button asChild className="text-2xl bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg">
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
        <section className="w-full py-20 md:py-32 lg:py-40 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3"
            >
              <FeatureCard
                icon={<FileText className="h-16 w-16 text-blue-600" />}
                title="AI-Powered Contracts"
                description="Generate legally sound contracts tailored to your specific needs using advanced AI technology."
              />
              <FeatureCard
                icon={<Clock className="h-16 w-16 text-blue-600" />}
                title="Save Time"
                description="Create contracts in minutes instead of hours. Focus on growing your business, not paperwork."
              />
              <FeatureCard
                icon={<ShieldCheck className="h-16 w-16 text-blue-600" />}
                title="Legal Compliance"
                description="Ensure your contracts are up-to-date with the latest legal requirements and best practices."
              />
            </motion.div>
          </div>
        </section>
        <section className="w-full py-20 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center space-y-4 text-center"
            >
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Trusted by Industry Leaders</h2>
              <p className="mx-auto max-w-[800px] text-xl md:text-2xl text-gray-600 dark:text-gray-300">
                See what our customers have to say about ContractGPT
              </p>
            </motion.div>
            <div className="grid gap-8 mt-16 md:grid-cols-2 lg:grid-cols-3">
              <TestimonialCard
                quote="ContractGPT has revolutionized our contract creation process. It's fast, accurate, and incredibly easy to use."
                author="Jane Doe"
                company="Tech Innovators Inc."
              />
              <TestimonialCard
                quote="The AI-powered contract generation has saved us countless hours and improved our legal compliance."
                author="John Smith"
                company="Global Solutions Ltd."
              />
              <TestimonialCard
                quote="I can't imagine going back to traditional contract drafting. ContractGPT is a game-changer."
                author="Emily Johnson"
                company="Startup Ventures"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-8 px-4 md:px-6 border-t border-gray-200 dark:border-gray-700">
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
      className="flex flex-col items-center space-y-4 p-8 bg-white dark:bg-gray-700 rounded-xl shadow-lg"
    >
      {icon}
      <h3 className="text-3xl font-bold">{title}</h3>
      <p className="text-xl text-gray-600 dark:text-gray-300 text-center">{description}</p>
    </motion.div>
  )
}

function TestimonialCard({ quote, author, company }: { quote: string; author: string; company: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex flex-col space-y-6 p-8 bg-white dark:bg-gray-700 rounded-xl shadow-lg"
    >
      <p className="text-xl text-gray-600 dark:text-gray-300 italic">"{quote}"</p>
      <div>
        <p className="text-xl font-semibold">{author}</p>
        <p className="text-lg text-gray-500 dark:text-gray-400">{company}</p>
      </div>
    </motion.div>
  )
}
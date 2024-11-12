'use client'

import { useState } from 'react'
import Link from "next/link"
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Mountain, Mail, Phone, MapPin, LogOut } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, subject: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData)
    // Reset form after submission
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

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
          <Link className="text-lg font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors" href="/pricing">
            Pricing
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
          <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
          
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Get in Touch</CardTitle>
                <CardDescription className="text-lg">Fill out the form and we'll get back to you as soon as possible.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-lg">Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required className="text-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-lg">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className="text-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-lg">Subject</Label>
                    <Select onValueChange={handleSelectChange}>
                      <SelectTrigger className="text-lg">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general" className="text-lg">General Inquiry</SelectItem>
                        <SelectItem value="support" className="text-lg">Technical Support</SelectItem>
                        <SelectItem value="billing" className="text-lg">Billing Question</SelectItem>
                        <SelectItem value="partnership" className="text-lg">Partnership Opportunity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-lg">Message</Label>
                    <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required className="text-lg" />
                  </div>
                  <Button type="submit" className="w-full text-lg bg-blue-600 hover:bg-blue-700 text-white">Send Message</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Contact Information</CardTitle>
                <CardDescription className="text-lg">You can also reach us using the following information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 text-lg">
                  <Mail className="h-6 w-6 text-blue-600" />
                  <span>support@contractgpt.com</span>
                </div>
                <div className="flex items-center space-x-4 text-lg">
                  <Phone className="h-6 w-6 text-blue-600" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-4 text-lg">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  <span>123 AI Street, Tech City, TC 12345</span>
                </div>
              </CardContent>
            </Card>
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
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mountain } from "lucide-react"

export function Navbar() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center justify-between border-b">
      <Link className="flex items-center justify-center" href="/">
        <Mountain className="h-6 w-6" />
        <span className="ml-2 text-lg font-semibold">ContractGPT</span>
      </Link>
      <nav className="hidden md:flex gap-4 sm:gap-6">
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
          Home
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">
          About
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/pricing">
          Pricing
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/contact">
          Contact
        </Link>
      </nav>
      <div className="flex gap-2">
        <Button variant="ghost" asChild>
          <Link href="/auth/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/register">Sign Up</Link>
        </Button>
      </div>
    </header>
  )
}
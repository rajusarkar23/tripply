"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Menu, X, Globe } from "lucide-react"
import TouristProfile from "./TouristProfile"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-sm shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Globe className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold">ACME Travels</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/admin/home" className="hover:text-blue-600 transition-colors">
              Destinations
            </Link>
            <Link href="/packages" className="hover:text-blue-600 transition-colors">
              Packages
            </Link>
            <Link href="/about" className="hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">
              Contact
            </Link>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
              Book Now
            </button>
            <div>
              
            </div>
            <TouristProfile />
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/destinations" className="hover:text-blue-600 transition-colors">
                Destinations
              </Link>
              <Link href="/packages" className="hover:text-blue-600 transition-colors">
                Packages
              </Link>
              <Link href="/about" className="hover:text-blue-600 transition-colors">
                About
              </Link>
              <Link href="/contact" className="hover:text-blue-600 transition-colors">
                Contact
              </Link>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
                Book Now
              </button>
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  )
}


"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Globe } from "lucide-react"

const footerLinks = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Team", href: "/team" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Safety", href: "/safety" },
    { name: "Cancellation", href: "/cancellation" },
    { name: "COVID-19", href: "/covid" },
  ],
  destinations: [
    { name: "Europe", href: "/destinations/europe" },
    { name: "Asia", href: "/destinations/asia" },
    { name: "Africa", href: "/destinations/africa" },
    { name: "Americas", href: "/destinations/americas" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Sitemap", href: "/sitemap" },
  ],
}

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "YouTube", icon: Youtube, href: "#" },
]

export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <Globe className="w-8 h-8" />
              <span className="text-2xl font-bold">ACME Travels</span>
            </Link>
            <p className="text-blue-100 mb-6 max-w-md">
              Discover the world with ACME Travels. We create unforgettable journeys and provide exceptional travel
              experiences for adventurers worldwide.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-blue-100">
                <Phone className="w-5 h-5" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-100">
                <Mail className="w-5 h-5" />
                <span>contact@acmetravels.com</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-100">
                <MapPin className="w-5 h-5" />
                <span>123 Travel Street, Adventure City, AC 12345</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-blue-100 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-blue-100 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Destinations</h3>
            <ul className="space-y-3">
              {footerLinks.destinations.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-blue-100 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-500 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  <social.icon className="w-6 h-6" />
                  <span className="sr-only">{social.name}</span>
                </motion.a>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-100">
              {footerLinks.legal.map((link, index) => (
                <span key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                  {index < footerLinks.legal.length - 1 && <span className="mx-2">·</span>}
                </span>
              ))}
            </div>

            <div className="text-sm text-blue-100">
              © {new Date().getFullYear()} ACME Travels. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


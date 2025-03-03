"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

export default function CTASection() {
    return (
        <section className="relative py-24 overflow-hidden bg-white">
            {/* Decorative Elements */}
            <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="absolute left-12 top-12"
            >
                <div className="w-16 h-16 text-blue-600">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle cx="50" cy="50" r="30" className="stroke-current fill-none stroke-2" />
                        <circle cx="50" cy="50" r="15" className="stroke-current fill-none stroke-2" />
                        <line x1="50" y1="0" x2="50" y2="100" className="stroke-current stroke-2" />
                        <line x1="0" y1="50" x2="100" y2="50" className="stroke-current stroke-2" />
                    </svg>
                </div>
            </motion.div>

            <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="absolute left-24 bottom-24"
            >
                <div className="w-48 h-48">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        {[...Array(24)].map((_, i) => (
                            <line
                                key={i}
                                x1="50"
                                y1="0"
                                x2="50"
                                y2="40"
                                className="stroke-pink-200 stroke-2"
                                transform={`rotate(${i * 15} 50 50)`}
                            />
                        ))}
                    </svg>
                </div>
            </motion.div>

            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                }}
                className="absolute right-12 top-12"
            >
                <Star className="w-6 h-6 text-blue-200" fill="currentColor" />
            </motion.div>

            {/* Main Content */}
            <div className="container mx-auto px-4 text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-6xl font-bold mb-6"
                >
                    Don&apos;t Miss Out on the Fun!
                </motion.h2>

                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-2xl md:text-3xl font-semibold mb-8 text-gray-700"
                >
                    BOOK YOUR SPOT TODAY!
                </motion.h3>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold inline-flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                >
                    <span className="w-6 h-6">
                        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                            <circle cx="12" cy="12" r="10" className="stroke-current" strokeWidth="2" />
                            <path
                                d="M12 8l4 4-4 4M8 12h8"
                                className="stroke-current"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                    <span>Book Your First Class</span>
                </motion.button>
            </div>
        </section>
    )
}


"use client"
import { motion } from "motion/react"
import { Calendar, MapPin, Star } from "lucide-react"

const features = [
    {
        title: "Curated Experiences",
        description: "Hand-picked destinations and exclusive activities for unforgettable memories.",
        icon: <Star size="md" />,
    },
    {
        title: "Expert Local Guides",
        description: "Knowledgeable guides who know every hidden gem of the destination.",
        icon: <MapPin size="md" />,
    },
    {
        title: "Flexible Booking",
        description: "Easy booking process with free cancellation up to 48 hours before departure.",
        icon: <Calendar size="md" />,
    },
]

export default function Features() {
    return (
        <section className="py-20 bg-gray-100">
            <div className="container mx-auto px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
                    <p className="text-gray-600">Experience the difference with our premium travel services</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-white p-6 rounded-lg shadow-lg"
                        >
                            <div className="w-12 h-12 text-blue-600 mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
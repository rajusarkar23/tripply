"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { Star } from "lucide-react"
import type React from "react"

interface Review {
    id: number
    name: string
    location: string
    review: string
    rating: number
    image: string
}

const reviews: Review[] = [
    {
        id: 1,
        name: "Sarah Thompson",
        location: "New York, USA",
        review: "Tripply made our honeymoon absolutely unforgettable. The attention to detail and personalized service was outstanding!",
        rating: 5,
        image: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
    },
    {
        id: 2,
        name: "John Doe",
        location: "London, UK",
        review: "I've traveled with many agencies, but none compare to the experience I had with Tripply. They truly go above and beyond.",
        rating: 5,
        image: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
    },
    {
        id: 3,
        name: "Maria Garcia",
        location: "Barcelona, Spain",
        review: "From start to finish, our family vacation was perfectly planned. The local guides were knowledgeable and friendly. Highly recommend!",
        rating: 4,
        image: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
    },
    {
        id: 4,
        name: "Akira Tanaka",
        location: "Tokyo, Japan",
        review: "Tripply helped me discover hidden gems in my own country. Their local expertise is unmatched!",
        rating: 5,
        image: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
    },
    {
        id: 5,
        name: "Emma Wilson",
        location: "Sydney, Australia",
        review: "The eco-friendly options provided by Tripply allowed us to explore responsibly. A fantastic experience all around!",
        rating: 4,
        image: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
    },
]

const InfiniteReviewCarousel: React.FC = () => {
    const [width, setWidth] = useState(0)
    const carousel = useRef<HTMLDivElement>(null)
    const controls = useAnimation()

    // Calculate width on mount & resize
    useEffect(() => {
        const updateWidth = () => {
            if (carousel.current) {
                const newWidth = carousel.current.scrollWidth - carousel.current.offsetWidth
                setWidth(newWidth)
            }
        }

        updateWidth()
        window.addEventListener("resize", updateWidth)

        return () => window.removeEventListener("resize", updateWidth)
    }, [])

    // Start infinite scroll only when width is ready
    useEffect(() => {
        if (width > 0) {
            let isRunning = true
    
            const infiniteScroll = async () => {
                if (!isRunning) return
                
                await controls.start({
                    x: [-width, 0],  // Animation goes from -width to 0
                    transition: { 
                        duration: 20, 
                        ease: "linear",
                        times: [0, 1],  // Corresponds to the values in the array
                        repeat: Infinity,  // Make it repeat forever
                    }
                })
            }
    
            infiniteScroll()
    
            return () => {
                isRunning = false
                controls.stop()
            }
        }
    }, [controls, width])

    const ReviewCard: React.FC<Review> = ({ name, location, review, rating, image }) => (
        <motion.div className="min-w-[300px] max-w-[300px] bg-white p-6 rounded-lg shadow-lg mx-4">
            <div className="flex items-center mb-4">
                <img src={image || "/placeholder.svg"} alt={name} className="w-12 h-12 rounded-full mr-4" />
                <div>
                    <h3 className="font-semibold">{name}</h3>
                    <p className="text-sm text-gray-600">{location}</p>
                </div>
            </div>
            <p className="text-gray-700 mb-4">{review}</p>
            <div className="flex items-center">
                {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
            </div>
        </motion.div>
    )

    return (
        <div className="mb-4">
            <div className="flex flex-col justify-center py-4">
                <h1 className="text-4xl font-bold text-center mb-4">Reviews from our travelers</h1>
                <p className="text-gray-600 text-center">Generous words from our travelers</p>
            </div>
            <div className="overflow-hidden">
                <motion.div
                    ref={carousel}
                    className="flex"
                    animate={controls}
                    initial={false} // Prevents flicker on load
                >
                    {[...reviews, ...reviews].map((review, index) => (
                        <ReviewCard key={`${review.id}-${index}`} {...review} />
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

export default InfiniteReviewCarousel

"use client";
import { Star } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import { useEffect } from "react";

const destinations = [
  {
    name: "Santorini, Greece",
    image:
      "https://images.pexels.com/photos/1010646/pexels-photo-1010646.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    price: "1,299",
    rating: 4.8,
  },
  {
    name: "Bali, Indonesia",
    image:
      "https://images.pexels.com/photos/695779/pexels-photo-695779.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    price: "899",
    rating: 4.9,
  },
  {
    name: "Maldives",
    image:
      "https://images.pexels.com/photos/1450354/pexels-photo-1450354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    price: "1,599",
    rating: 4.7,
  },
];

export default function PopularDestination() {
  // fetch tours
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("/api/client/tours");

        console.log(await res.json());
      } catch (error) {
        console.log(error);
        
      }
    };

    fetchAll();
  }, []);
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Popular Destinations</h2>
          <p className="text-gray-600">
            Explore our most sought-after vacation spots
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64">
                <Image
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold">{destination.name}</h3>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="ml-1">{destination.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Starting from ${destination.price}
                </p>
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

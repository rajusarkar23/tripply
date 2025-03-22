"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-[90vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://pub-367a5b1b28f9415dae5b51f69d042dff.r2.dev/rest-sunshine-atoll-bungalow-holiday.jpg"
          alt="Beautiful landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl text-white"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Discover Your Next Adventure
          </h1>
          <p className="text-xl mb-8">
            Explore breathtaking destinations and create lasting memories with
            our curated travel experiences.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="text-blue-600" />
                <input
                  type="text"
                  placeholder="Where to? Search place you want to visit"
                  className="w-[590px] focus:outline-none text-gray-800"
                />
              </div>
              <div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full">
                  Search
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

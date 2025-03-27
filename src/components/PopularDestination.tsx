"use client";
import { Loader, Star } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import { useEffect } from "react";
import useTourStore from "@/store/tour-store/tourStore";
import Link from "next/link";

interface Category {
  title: string | null;
  description: string | null;
  price: number | null;
  slotsAvailable: number | null;
  slotsBooked: number | null;
  totalSlots: number | null;
}

interface Rating {
  ratingBy: string | null;
  rating: number | null;
  ratingTexts: string | null;
}

interface Tour {
  name: string | null;
  image: string | null;
  description: string | null;
  overview: string | null;
  slug: string | null;
  tourCategory: {
    standard: Category;
    premium: Category;
  };
  ratings: Rating;
}

export default function PopularDestination() {
  const { fetchTour, tours, isLoading } = useTourStore() as {
    fetchTour: () => void;
    tours: Tour[];
    isLoading: boolean;
  };

  // fetch tours
  useEffect(() => {
    fetchTour();
  }, []);
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 flex justify-center items-center">
            Popular Destinations
            {isLoading && <Loader className="animate-spinner-ease-spin mt-0.5 ml-1" />}
          </h2>
          <p className="text-gray-600">
            Explore our most sought-after vacation spots
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour, index) => (
            <motion.div
              key={tour.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64">
                <Image
                  src={tour.image || "/placeholder.svg"}
                  alt={tour.name!}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold line-clamp-1 w-80">
                      {tour.name}
                    </h3>
                    <p className="text-yellow-500 flex justify-end font-bold items-center">
                      Top Rated
                      <Star size={18} className="ml-1" />
                    </p>
                  </div>
                  <h3 className="font-semibold text-gray-600">
                    Starting from {tour.tourCategory.standard.price}
                  </h3>

                  <div>
                    <Link 
                    className="flex justify-center items-center bg-blue-600 text-white font-bold h-10 rounded-full hover:bg-blue-700 transition-all"
                    href={`/tour/${tour.slug}`}>
                    View details
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";
import { Star } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import { useEffect } from "react";
import useTourStore from "@/store/tour-store/tourStore";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const { fetchTour, tours } = useTourStore() as {
    fetchTour: () => void;
    tours: Tour[];
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
          <h2 className="text-4xl font-bold mb-4">Popular Destinations</h2>
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
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold line-clamp-1 w-80">
                      {tour.name}
                    </h3>
                    <p className="text-yellow-500 flex justify-end font-bold">
                      Top
                      <Star />
                    </p>
                  </div>
                  <h3 className="font-semibold text-gray-600">
                    Starting from {tour.tourCategory.standard.price}
                  </h3>

                  <div>
                   <Link href={`/tour/${tour.slug}`}>
                   view
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

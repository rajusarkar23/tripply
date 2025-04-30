"use client";
import { useTourStore } from "@/store/tour-store/tour-store-v2";
import { useEffect } from "react";
import { motion } from "motion/react";
import { Loader, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DestinationV2() {
  const { fetchTour, isLoading, fetchedTourDatas } = useTourStore();

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
            {isLoading && (
              <Loader className="animate-spinner-ease-spin mt-0.5 ml-1" />
            )}
          </h2>
          <p className="text-gray-600">
            Explore our most sought-after vacation spots
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fetchedTourDatas.map((tour, index) => (
            <motion.div
              key={tour.placeName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-lg  border-medium border-blue-900/30  overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64">
                <Image
                  src={tour.mainBackImage || "/placeholder.svg"}
                  alt={tour.placeName!}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold line-clamp-1 w-80">
                      {tour.placeName}
                    </h3>
                    <p className="text-yellow-500 flex justify-end font-bold items-center">
                      Top Rated
                      <Star size={18} className="ml-1 fill-yellow-500" />
                    </p>
                  </div>
                  <div>
                    <p className="line-clamp-2 text-xs font-semibold">
                    {tour.heroBannerContent.briefParagraph}

                    </p>
                  </div>
                  <div>
                    <Link
                      className="flex justify-center items-center bg-blue-600 text-white font-bold h-10 rounded-full hover:bg-blue-700 transition-all"
                      href={`/tourv2/${tour.slug}`}
                    >
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

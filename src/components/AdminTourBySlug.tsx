"use client";

import useAdminTourStore from "@/store/tour-store/adminTourStore";
import Image from "next/image";
import { useParams } from "next/navigation";

interface Category {
  title: string | null;
  description: string | null;
  price: number | null;
  slotsAvailable: number | null;
  slotsBooked: number | null;
  totalSlots: number | null;
}

interface Tour {
  id: number | number;
  tourName: string | null;
  tourSlug: string | null;
  tourDescription: string | null;
  tourOverview: string | null;
  tourImageUrl: string | null;
  updatedAt: string | null;
  tourCategory: {
    premium: Category;
    standard: Category;
  };
}
export default function AdminTourBySlug() {
  const slug = useParams().tourSlug;
  const { tours } = useAdminTourStore() as { tours: Tour[] };

  const myTour: Tour[] = [];

  for (const tour of tours) {
    if (tour.tourSlug === slug) {
      myTour.push(tour);
    }
  }

  return (
    <div>
      {myTour.map((tour, index) => (
        <div key={index}>
          <div className="relative w-full h-96">
            <Image
              src={tour.tourImageUrl!}
              alt={tour.tourName!}
              fill
              className="object-cover rounded-b-lg"
            />
          </div>
          <div className="max-w-2xl mx-auto flex flex-col justify-center py-4">
            <h2 className="text-4xl font-bold">{tour.tourName}</h2>
            <h4 className="font-semibold text-gray-600">{tour.tourOverview}</h4>

            <div
              dangerouslySetInnerHTML={{
                __html: `${tour.tourDescription}`.replace(
                  /<p>\s*<\/p>/g,
                  "<br>"
                ),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

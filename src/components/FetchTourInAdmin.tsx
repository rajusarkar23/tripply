"use client";
import { Card, CardBody, CardHeader, Chip, Skeleton } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface TourCategory {
  premium: {
    slotsAvailable: number;
    slotsBooked: number;
    totalSlots: number;
  };
  standard: {
    slotsAvailable: number;
    slotsBooked: number;
    totalSlots: number;
  };
}

interface Tours {
  id: number;
  tourName: string;
  tourImageUrl: string;
  tourCategory: TourCategory;
  createdAt: string;
  updatedAt: string;
}

export default function FetchTourInAdmin() {
  const [tours, setTours] = useState<Tours[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchTours = async () => {
      try {
        const res = await fetch("/api/tour", {
          method: "GET",
        });

        const response = await res.json();
        // console.log(response);

        if (response.success === true) {
          setTours(response.tours);
          setLoading(false);
          // setIsLoaded(true)
        } else {
          console.log(response);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) {
    return (
      <div>
        <Skeleton className="rounded-lg">
          <div className="h-24 rounded-lg bg-secondary" />
        </Skeleton>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full flex justify-center mt-8 px-8">
      <div className="grid grid-cols-3 gap-3">
        {tours.map((items) => (
          <Link href={`/admin/tours/${items.id}`} key={items.id}>
            <Card className="py-4 w-96">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start space-y-1">
                <p className="text-lg font-bold">
                  {items.tourName}
                </p>

                <div>
                  <Image
                    src={items.tourImageUrl}
                    alt={items.tourName}
                    width={400}
                    height={400}
                    className="rounded"
                  />
                </div>
              </CardHeader>
              <CardBody className="overflow-visible py-2 space-y-0.5">
                <Chip className="font-bold text-md" color="primary" variant="bordered">
                  Seats are empty for booking:
                  {items.tourCategory.premium.slotsAvailable +
                    items.tourCategory.standard.slotsAvailable}
                </Chip>
                <Chip className="text-md" color="primary" variant="bordered">
                  Booked on premium category:
                  {items.tourCategory.premium.slotsBooked}
                </Chip>
                <Chip className="text-md" color="primary" variant="bordered">
                  Booked on standard category:
                  {items.tourCategory.standard.slotsBooked}
                </Chip>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

// name, imageurl, seatsavailable, booked, id, created at, updated at

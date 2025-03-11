"use client";
import { Button, Card, Spinner } from "@heroui/react";
import { CornerDownRight } from "lucide-react";
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

        if (response.success === true) {
          setTours(response.tours);
          setLoading(false);
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
      <div className="flex justify-center items-center min-h-[90vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-5xl text-center py-3 font-bold">All tours.</h2>
      <div className="grid grid-cols-2 gap-3 mx-auto max-w-7xl w-full py-3">
        {tours.map((tour) => (
          <Link href={`/admin/tours/${tour.id}`} key={tour.id}>
            <Card className="p-4 hover:bg-gray-100">
              <div className="flex gap-3">
                <div className="flex items-center">
                  <Image
                    src={tour.tourImageUrl}
                    alt={tour.tourName}
                    width={600}
                    height={400}
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{tour.tourName}</h2>
                  <div>
                    <div>
                      <h3 className="font-bold text-green-600">
                        Total available seats:
                      </h3>
                      <p className="flex text-blue-600 font-bold items-center">
                        <CornerDownRight size={16} className=" mr-1" />
                        {tour.tourCategory.standard.slotsAvailable +
                          tour.tourCategory.premium.slotsAvailable}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-bold text-green-600">
                        Premium seats booked:
                      </h3>
                      <p className="flex text-blue-600 font-bold items-center">
                        <CornerDownRight size={16} className=" mr-1" />
                        {tour.tourCategory.premium.slotsBooked}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-bold text-green-600">
                        Standard seats booked:
                      </h3>
                      <p className="flex text-blue-600 font-bold items-center">
                        <CornerDownRight size={16} className=" mr-1" />
                        {tour.tourCategory.standard.slotsBooked}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h2>Created on {tour.createdAt}</h2>
                  </div>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Button color="danger" className="font-bold w-full">
                        Delete
                      </Button>
                      <Button color="primary" className="font-bold w-full">
                        Edit
                      </Button>
                    </div>

                    <Button className="w-full font-bold" color="success">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

// name, imageurl, seatsavailable, booked, id, created at, updated at

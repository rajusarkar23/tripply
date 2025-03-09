"use client";

import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Tours {
  id: number;
  tourName: string;
  tourImageUrl: string;
}

export default function ToursById() {
  const id = useParams().toursId;
  const router = useRouter();
  const [tours, setTours] = useState<Tours[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getTourById = async () => {
      try {
        const res = await fetch(`/api/tour/by-id?id=${id}`);
        const response = await res.json();

        if (response.success === true) {
          setTours(response.tourbById);
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

    getTourById();
  }, []);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/tour?id=${id}`, {
        method: "DELETE",
      });

      const response = await res.json();

      if (response.success === true) {
        router.push("/admin/tours");
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[90vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center mt-20">
      <div className="flex justify-center ">
        {tours.map((tour) => (
          <div
            key={tour.id}
            className="bg-blue-100 p-4 rounded space-y-2 shadow-xl"
          >
            <p className="font-semibold text-green-700 text-center text-3xl">
              {tour.tourName}
            </p>
            <div className="flex items-center justify-center">
              <Image
                src={tour.tourImageUrl}
                alt={tour.tourName}
                width={600}
                height={100}
                className="rounded h-96"
              />
            </div>
            <div className="flex gap-3 w-full max-w-xl mx-auto justify-center items-center">
              <Button color="danger" className="w-full" onPress={handleDelete}>
                Delete
              </Button>
              <Button color="success" className="w-full">
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

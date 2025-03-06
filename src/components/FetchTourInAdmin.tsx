"use client";
import { Skeleton } from "@heroui/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Tours {
  id: number;
  tourName: string;
  description: string;
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
    <div className="max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-3 gap-3">
        {tours.map((items) => (
          <Link
            href={`/admin/tours/${items.id}`}
            key={items.id}
            className="bg-gray-300 flex justify-center"
          >
            <p>{items.tourName}</p>
            <p>{items.id}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

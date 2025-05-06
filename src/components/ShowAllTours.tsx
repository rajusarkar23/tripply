"use client";

import { useTours } from "@/store/admin-store/tours";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ShowAllTours() {
  const [loading, setLoading] = useState<boolean>(false);

  const { fetchTours, tours } = useTours();

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchTours();
      setLoading(false);
    })();


    console.log(typeof tours.map(tour => tour.pricing));
    
  }, []);

  return (
    <div>
        <h3 className="text-center text-4xl font-bold bg-blue-400 text-white">All tours</h3>

    <div className="py-10">
      {loading && useTours.getState().tours.length === 0 ? (
          <div className="flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
          <div className="md:grid md:grid-cols-3 flex flex-col justify-center items-center max-w-2xl mx-auto space-y-2">
          {useTours.getState().tours.map((tour, index) => (
              <div className="" key={index}>
              <Card className="w-52" radius="none">
                <CardHeader>
                  <Image
                    src={tour.imageUrl}
                    alt="tour_image"
                    width={200}
                    height={150}
                    className="rounded"
                    />
                </CardHeader>
                <CardBody>
                  <p className="font-semibold text-gray-700 text-lg">
                    {tour.placeName}
                  </p>
                  <div>
                    {typeof tour.pricing === "object"? (
                        <>
                        <p className="text-sm font-semibold">Standard Price: {tour.pricing.standard}</p>
                        <p className="text-sm font-semibold">Standard Price: {tour.pricing.premium}</p>{" "}
                      </>
                    ) : (
                        <>
                        <p>Standard Price: null</p>
                        <p>Standard Price: null</p>{" "}
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
      </div>
  );
}

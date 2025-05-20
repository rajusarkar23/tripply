"use client";

import { useTours } from "@/store/admin-store/tours";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Image,
} from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ShowAllTours() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const { fetchTours, removeTour } = useTours();

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchTours();
      setLoading(false);
    })();
  }, []);

  if (loading && useTours.getState().tours.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[90vh]">
        <Spinner />
      </div>
    );
  }

  const dateFormatter = new Intl.DateTimeFormat("en-us", {
    dateStyle: "full",
  });

  return (
    <div className="bg-default-200 min-h-screen">
      <h3 className="text-center text-4xl font-bold bg-blue-400 text-white">
        All tours
      </h3>

      <div>
        {loading && <Loader className="animate-spin"/>}
      </div>

      <div className="flex gap-4 justify-center p-2">
        {useTours.getState().tours.map((tour, index) => (
          <div className="w-96" key={index}>
            <Card
              isFooterBlurred
              className="w-full h-[300px] col-span-12 sm:col-span-7 shadow-xl"
            >
              <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <p className="text-tiny text-white/60 uppercase font-bold">
                  {(new Date(tour.createdOn)).toLocaleString("en-US", {timeZone: "UTC"})}
                </p>
                <h4 className="text-white/90 font-medium text-xl">
                  {tour.placeName}
                </h4>
              </CardHeader>
              <Image
                removeWrapper
                alt="Relaxing app background"
                className="z-0 w-full h-full object-cover"
                src={tour.imageUrl}
              />
              <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                <div className="flex flex-grow gap-2 items-center">
                  <div className="flex flex-col">
                    <p className="text-tiny text-white/60">
                      Premium Pricing: {tour.pricing.premium}
                    </p>
                    <p className="text-tiny text-white/60">
                      Standard Pricing: {tour.pricing.standard}
                    </p>
                  </div>
                </div>
                <div className="space-x-1">
                  <Button
                    radius="full"
                    size="sm"
                    color="default"
                    className="font-semibold"
                    onPress={() => {
                      router.push(`/tourv2/${tour.slug}`);
                    }}
                  >
                    View
                  </Button>
                  <Button
                    radius="full"
                    size="sm"
                    variant="ghost"
                    color="danger"
                    className="border-none text-default-50 bg-danger-500/70 font-semibold"
                    onPress={() => {
                      const filter = useTours
                        .getState()
                        .tours.filter((_, i) => i !== index);

                      console.log(filter);

                      removeTour({ index: index, slug: tour.slug });
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import useAdminTourStore from "@/store/tour-store/adminTourStore";
import { Button, Card, Spinner } from "@heroui/react";
import { CornerDownRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function FetchTourInAdmin() {
  // const [tours, setTours] = useState<Tours[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { fetchToursForAdmin, tours } = useAdminTourStore() as {
    fetchToursForAdmin: () => void;
    tours: Tour[];
  };

  console.log(tours);

  useEffect(() => {
    // setLoading(true);
    // const fetchTours = async () => {
    //   try {
    //     const res = await fetch("/api/tour", {
    //       method: "GET",
    //     });

    //     const response = await res.json();

    //     if (response.success === true) {
    //       setTours(response.tours);
    //       setLoading(false);
    //     } else {
    //       console.log(response);
    //       setLoading(false);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     setLoading(false);
    //   }
    // };

    fetchToursForAdmin();

    // fetchTours();
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
          <Card className="p-4 hover:bg-gray-100" key={tour.id}>
            <div className="flex gap-3">
              <div className="flex items-center">
                <Image
                  src={tour.tourImageUrl!}
                  alt={tour.tourName!}
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
                      {tour.tourCategory.standard.slotsAvailable! +
                        tour.tourCategory.premium.slotsAvailable!}
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
                  <h2>Updated on {tour.updatedAt}</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Button color="danger" className="font-bold w-full">
                      Delete
                    </Button>
                    <Button color="primary" className="font-bold w-full" onPress={() => router.push(`/admin/edit/${tour.tourSlug}`)}>
                      Edit
                    </Button>
                  </div>

                  <Button
                    className="w-full font-bold"
                    color="success"
                    onPress={() => {
                      router.push(`/admin/tours/${tour.id}`);
                    }}
                  >
                    View
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// name, imageurl, seatsavailable, booked, id, created at, updated at

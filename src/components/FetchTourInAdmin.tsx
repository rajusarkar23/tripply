"use client";
import useAdminTourStore from "@/store/tour-store/adminTourStore";
import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { CornerDownRight, Loader } from "lucide-react";
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

interface DeleteTour {
  title: string;
  imageUrl: string;
}

export default function FetchTourInAdmin() {
  const router = useRouter();
  const [deleteTour, setDeleteTour] = useState<DeleteTour | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // tour id
  const [deleteTourId, setDeleteTourId] = useState<number | null>()

  const { fetchToursForAdmin, tours } = useAdminTourStore() as {
    fetchToursForAdmin: () => void;
    tours: Tour[];
  };

  const { isLoading } = useAdminTourStore();

  useEffect(() => {
    fetchToursForAdmin();
  }, []);

  if (isLoading && tours.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[90vh]">
        <Spinner />
      </div>
    );
  }


  return (
    <div>
      <h2 className="text-5xl text-center py-3 font-bold">All tours.</h2>
      {
        isLoading && ( <div className="flex justify-end pr-20">
        <Loader className="animate-spinner-ease-spin"/>
      </div>)
      }
     
      <div className="grid grid-cols-2 gap-3 mx-auto max-w-7xl w-full py-3">
        {tours.map((tour, index) => (
          <Card className="p-4 hover:bg-gray-100" key={index}>
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
                    <Button
                      onPress={() => {
                        setDeleteTourId(tour.id)
                        
                        setDeleteTour({
                          imageUrl: tour.tourImageUrl!,
                          title: tour.tourName!,
                        });
                      }}
                      color="danger"
                    >
                      Delete
                    </Button>
                    <Modal
                      isOpen={!!deleteTour}
                      onOpenChange={() => setDeleteTour(null)}
                      size="xl"
                    >
                      <ModalContent>
                        {(onClose) => (
                          <>
                            <ModalHeader className="flex flex-col gap-1 text-red-600 text-center">
                              Do you want to delete?
                            </ModalHeader>
                            <ModalBody className="flex justify-center items-center">
                              <p className="text-xl font-bold text-gray-600">
                                {deleteTour!.title}
                              </p>
                              <Image
                                src={deleteTour!.imageUrl}
                                alt={deleteTour!.title}
                                width={400}
                                height={400}
                                className="rounded-lg"
                              />
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                color="success"
                                onPress={onClose}
                                className="font-bold"
                              >
                                Close
                              </Button>
                              <div>
                                {isDeleting ? (
                                  <Button isDisabled>
                                    <Spinner />
                                  </Button>
                                ) : (
                                  <Button
                                    color="danger"
                                    variant="ghost"
                                    onPress={async () => {
                                      try {
                                        setIsDeleting(true)
                                        const res = await fetch(
                                          "/api/tour/by-id",
                                          {
                                            method: "DELETE",
                                            headers: {
                                              "Content-Type":
                                                "application/json",
                                            },
                                            body: JSON.stringify(deleteTourId),
                                          }
                                        );
                                        const response = await res.json();
                                        
                                        if (response.success === true) {
                                          fetchToursForAdmin()
                                          setDeleteTour(null);
                                          setIsDeleting(false)
                                        }
                                      } catch (error) {
                                        console.log(error);
                                      }
                                    }}
                                  >
                                    Delete
                                  </Button>
                                )}
                              </div>
                            </ModalFooter>
                          </>
                        )}
                      </ModalContent>
                    </Modal>
                    <Button
                      color="primary"
                      className="font-bold w-full"
                      onPress={() =>
                        router.push(`/admin/edit/${tour.tourSlug}`)
                      }
                    >
                      Edit
                    </Button>
                  </div>

                  <Button
                    className="w-full font-bold"
                    color="success"
                    onPress={() => {
                      router.push(`/admin/tour/view/${tour.tourSlug}`);
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
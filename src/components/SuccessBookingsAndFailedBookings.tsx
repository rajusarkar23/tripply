"use client";

import { useAdminStore } from "@/store/admin-store/bookings";
import {
  Button,
  Card,
  CardBody,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";

export default function SuccessBookingsAndFailedBookings() {
  const {
    fetchFailedBookings,
    fetchSuccessFullBookings,
    isSuccessFullBookingsFetched,
    isFailedBookingsFetched,
  } = useAdminStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string | number>(
    "Successfull Bookings"
  );

  const [currentFailedBookingPage, setCurrentFailedBookingPage] =
    useState<number>(1);
  const [currentSuccessFullBookingPage, setCurrentSuccessFullBookingPage] =
    useState<number>(1);

  useEffect(() => {
    if (currentTab === "Failed Bookings") {
      (async () => {
        setLoading(true);
        await fetchFailedBookings();
        setLoading(false);
      })();
    }
    (async () => {
      setLoading(true);
      await fetchSuccessFullBookings();
      setLoading(false);
    })();
  }, [currentTab]);

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
  });

  // for failed bookings
  function GetFailedBookingPageNumber() {
    const itemsPerPage = 10;
    const pageNumber: number[] = [];
    const totalPages = Math.ceil(
      useAdminStore.getState().failedBookings.length / itemsPerPage
    );

    for (let i = 1; i <= totalPages; i++) {
      pageNumber.push(i);
    }

    return (
      <div className="space-x-1 flex justify-center py-0.5">
        {pageNumber.map((page, index) => (
          <Button
            key={index}
            onPress={() => {
              setCurrentFailedBookingPage(page);
            }}
            size="sm"
            className={`${
              currentFailedBookingPage === page
                ? "bg-purple-600 font-bold text-white"
                : ""
            }`}
          >
            {page}
          </Button>
        ))}
      </div>
    );
  }

  // for failed bookings
  function getCurrentPageFailedBookings() {
    const itemsPerPage = 10;

    const indexOfLastBooking = currentFailedBookingPage * itemsPerPage; // 2 * 10 => 20
    const indexOfFirstBooking = indexOfLastBooking - itemsPerPage; // 20 - 10 => 10

    const currentBookings = useAdminStore
      .getState()
      .failedBookings.slice(indexOfFirstBooking, indexOfLastBooking);

    return currentBookings;
  }

  // for success bookings
  function GetSuccessBookingsPageNumber() {
    // how many items we are showing in a page, 10
    // what is the length of our items
    const pageNumber: number[] = [];
    const itemsPerPage = 10;
    const totalPages = Math.ceil(
      useAdminStore.getState().successFullBookings.length / itemsPerPage
    );

    for (let i = 1; i <= totalPages; i++) {
      pageNumber.push(i);
    }

    return (
      <div className="flex justify-center space-x-0.5">
        {pageNumber.map((page, index) => (
          <div key={index} className="pt-1">
            <Button
              onPress={() => {
                setCurrentSuccessFullBookingPage(page);
              }}
              size="sm"
              className={`${
                currentSuccessFullBookingPage === page
                  ? "text-white bg-purple-600 font-semibold"
                  : "font-normal"
              }`}
            >
              {page}
            </Button>
          </div>
        ))}
      </div>
    );
  }

  // for success bookings
  function getCurrentSuccessBookings() {
    // index of first page item
    // index of last page item
    const itemsPerPage = 10;
    const indexOfLastBooking = itemsPerPage * currentSuccessFullBookingPage; // => 10
    const indexOfFirstBooking = indexOfLastBooking - itemsPerPage; // 2 => 10 * 20 => 20 - 10 => 10

    const currentBookings = useAdminStore
      .getState()
      .successFullBookings.slice(indexOfFirstBooking, indexOfLastBooking);

    return currentBookings;
  }

  // show booking details modal
  function ShowBookingDetailsModal({
    index,
    tourName,
    date,
    modalTitle,
    category,
    emailUsed,
    paymentId,
    totalCost,
    totalPerson,
    tourEnds,
    tourStarts,
  }: {
    index: number;
    tourName: string;
    date: string;
    modalTitle: string;
    category: string;
    emailUsed: string;
    paymentId: string;
    totalCost: number;
    totalPerson: number;
    tourStarts: string;
    tourEnds: string;
  }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
      <>
        <div
          onClick={() => {
            onOpen();
          }}
          className="flex justify-between hover:bg-gray-200 p-2 transition-all text-lg hover:cursor-pointer"
        >
          <div
            className="flex justify-between w-44"
            onClick={() => {
              onOpen();
            }}
          >
            <p className="font-semibold text-sm">{index}.</p>
            <p className="font-semibold text-sm">{tourName}</p>
          </div>
          <div>
            <p className="font-semibold text-sm">{date}</p>
          </div>
        </div>
        <Modal
          isDismissable={false}
          isKeyboardDismissDisabled={true}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="2xl"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-blue-600">
                  {modalTitle}
                </ModalHeader>
                <ModalBody>
                  <p className="text-orange-600 font-semibold">
                    Tour Name:{" "}
                    <span className="text-gray-700 font-semibold text-sm">
                      {tourName}
                    </span>
                  </p>
                  <p className="text-orange-600 font-semibold">
                    Tour Category:{" "}
                    <span className="text-gray-700 font-semibold text-sm">
                      {category}
                    </span>
                  </p>
                  <p className="text-orange-600 font-semibold">
                    Total Person:{" "}
                    <span className="text-gray-700 font-semibold text-sm">
                      {totalPerson}
                    </span>
                  </p>
                  <p className="text-orange-600 font-semibold">
                    Total Cost:{" "}
                    <span className="text-gray-700 font-semibold text-sm">
                      {totalCost}
                    </span>
                  </p>
                  <p className="text-orange-600 font-semibold">
                    Email Used:{" "}
                    <span className="text-gray-700 font-semibold text-sm">
                      {emailUsed}
                    </span>
                  </p>
                  <p className="text-orange-600 font-semibold">
                    Selected Starting Date:{" "}
                    <span className="text-gray-700 font-semibold text-sm">
                      {tourStarts}
                    </span>
                  </p>
                  <p className="text-orange-600 font-semibold">
                    Selected End Date:{" "}
                    <span className="text-gray-700 font-semibold text-sm">
                      {tourEnds}
                    </span>
                  </p>
                  <p className="text-orange-600 font-semibold">
                    Payment Id:{" "}
                    <span className="text-gray-700 font-semibold text-sm">
                      {typeof paymentId === "string" ? (
                        <>{paymentId}</>
                      ) : (
                        <>Payment not done</>
                      )}
                    </span>
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[90vh]">
      <div className="flex w-[600px] flex-col">
        <Tabs
          aria-label="Dynamic tabs"
          color="secondary"
          className="font-semibold"
          selectedKey={currentTab}
          onSelectionChange={(e) => {
            setCurrentTab(e);
          }}
        >
          <Tab key={"Successfull Bookings"} title={"Successfull Bookings"}>
            <Card>
              <CardBody>
                {loading && !isSuccessFullBookingsFetched ? (
                  <div className="flex justify-center items-center">
                    <Spinner />
                  </div>
                ) : (
                  <div>
                    {getCurrentSuccessBookings().map((booking, index) => (
                      <>
                        <div key={index}>
                          <ShowBookingDetailsModal
                            date={dateFormatter.format(
                              new Date(booking.bookingDate)
                            )}
                            index={booking.index}
                            tourName={booking.tourName}
                            modalTitle="Successfull Booking"
                            category={booking.bookingCategory}
                            emailUsed={booking.emailUsed}
                            paymentId={booking.paymentid}
                            totalCost={booking.totalCost}
                            totalPerson={booking.totalPerson}
                            tourEnds={booking.tourEndsOn}
                            tourStarts={booking.tourStartsOn}
                          />
                        </div>
                        <Divider />
                      </>
                    ))}
                    <GetSuccessBookingsPageNumber />
                  </div>
                )}
              </CardBody>
            </Card>
          </Tab>

          <Tab key={"Failed Bookings"} title={"Failed Bookings"}>
            <Card>
              <CardBody>
                {loading && !isFailedBookingsFetched ? (
                  <div className="flex justify-center items-center">
                    <Spinner />
                  </div>
                ) : (
                  <div>
                    {getCurrentPageFailedBookings().map((booking, index) => (
                      <>
                        <div key={index}>
                          <ShowBookingDetailsModal
                            date={dateFormatter.format(
                              new Date(booking.bookingDate)
                            )}
                            index={booking.index}
                            tourName={booking.tourName}
                            modalTitle="Failed Booking"
                            category={booking.bookingCategory}
                            emailUsed={booking.emailUsed}
                            paymentId={booking.paymentid}
                            totalCost={booking.totalCost}
                            totalPerson={booking.totalPerson}
                            tourEnds={booking.tourEndsOn}
                            tourStarts={booking.tourStartsOn}
                          />
                        </div>
                        <Divider />
                      </>
                    ))}
                    <GetFailedBookingPageNumber />
                  </div>
                )}
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

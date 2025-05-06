"use client";

import { useAdminStore } from "@/store/admin-store/bookings";
import { Button, Card, CardBody, Divider, Spinner, Tab, Tabs } from "@heroui/react";
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

  const [currentFailedBookingPage, setCurrentFailedBookingPage] = useState(1);

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

    for (let i = 1; i < totalPages; i++) {
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
                    {useAdminStore
                      .getState()
                      .successFullBookings.map((booking, index) => (
                        <div key={index} className="flex justify-between">
                          <div className="flex gap-10">
                            <p>{index}</p>
                            <p>{booking.tourName}</p>
                          </div>
                          <div>
                            <p>
                              {dateFormatter.format(
                                new Date(booking.bookingDate)
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
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
                      <div key={index} className="flex justify-between hover:bg-gray-200 p-2 transition-all text-lg hover:cursor-pointer">
                        <div className="flex justify-between w-44">
                          <p className="font-semibold text-sm">{booking.index}.</p>
                          <p className="font-semibold text-sm">{booking.tourName}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{(dateFormatter.format(new Date(booking.bookingDate)))}</p>
                        </div>
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

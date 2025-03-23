"use client";
import useTourStore from "@/store/tour-store/tourStore";
import { useUserStore } from "@/store/user-store/userStore";
import {
  Button,
  Card,
  CardBody,
  DateRangePicker,
  Form,
  NumberInput,
  RangeValue,
  Spinner,
  Tab,
  Tabs,
} from "@heroui/react";
import { DateValue, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Key, useEffect, useState } from "react";
interface Category {
  title: string | null;
  description: string | null;
  price: number | null;
  slotsAvailable: number | null;
  slotsBooked: number | null;
  totalSlots: number | null;
}

interface Rating {
  ratingBy: string | null;
  rating: number | null;
  ratingTexts: string | null;
}

interface Tour {
  id: number | null;
  name: string | null;
  image: string | null;
  description: string | null;
  overview: string | null;
  slug: string | null;
  tourCategory: {
    standard: Category;
    premium: Category;
  };
  ratings: Rating;
}

export default function ToursBySlug() {
  const [date, setDate] = useState<RangeValue<DateValue> | null>();
  const [personCount, setPersonCount] = useState<number>(0);
  const [isPersonCountError, setIsPersonCountError] = useState(false);

  const [selectedTab, setSelectedtab] = useState<string>("standard");

  // router
  const router = useRouter();
  // user store, zustand
  const { isUserLogedIn } = useUserStore() as { isUserLogedIn: boolean };

  // loading states for standard and for premium
  const [standardLoading, setStandardLoading] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(false);

  // for premiun
  const [premiumDate, setPremiumDate] =
    useState<RangeValue<DateValue> | null>();
  const [premiumPersonCount, setPremiumPersonCount] = useState<number>(0);
  const [isPremiumPersonCountError, setIsPremiumPersonCountError] =
    useState(false);
  const [premiumPrices, setPremiumPrices] = useState<number>(0);

  // price
  const [price, setPrice] = useState<number>(0);
  // tourid
  const [tourId, setTourId] = useState<number>(0);

  const formatter = useDateFormatter({ dateStyle: "long" });
  const slug = useParams().tourSlug;
  const { tours } = useTourStore() as { tours: Tour[] };
  const tourSlug: Tour[] = [];

  for (const tour of tours) {
    if (tour.slug === slug) {
      tourSlug.push(tour);
    }
  }

  const standardPrice = tourSlug
    .map((tour) => tour.tourCategory.standard.price)
    .toString();
  const premiumPrice = tourSlug.map((tour) => tour.tourCategory.premium.price);

  const id = tourSlug.map((tour) => tour.id).toString();

  useEffect(() => {
    if (personCount < 1) {
      setIsPersonCountError(true);
    } else {
      setIsPersonCountError(false);
    }

    if (premiumPersonCount < 1) {
      setIsPremiumPersonCountError(true);
    } else {
      setIsPremiumPersonCountError(false);
    }

    if (selectedTab === "standard") {
      setPrice(Number(standardPrice) * personCount);
    }
    if (selectedTab === "premium") {
      setPremiumPrices(Number(premiumPrice) * premiumPersonCount);
    }
    if (tourId === 0) {
      setTourId(Number(id));
    }
  }, [personCount, premiumPersonCount]);

  return (
    <div className="">
      {tourSlug.map((tourslug) => (
        <div key={tourslug.slug}>
          {/* start */}
          <div className="relative w-full h-96">
            <Image
              src={tourslug.image!}
              alt={tourslug.name!}
              fill
              className="object-cover"
            />
          </div>

          <div className="sm:flex justify-between mt-5 px-4">
            {/* start */}
            <div className="max-w-2xl mx-auto space-y-1">
              <h2 className="text-4xl font-bold">{tourslug.name}</h2>
              <h4 className="font-light text-3xl text-gray-900">
                {tourslug.overview}
              </h4>

              <div
                dangerouslySetInnerHTML={{
                  __html: `${tourslug.description}`.replace(
                    /<p>\s*<\/p>/g,
                    "<br>"
                  ),
                }}
              />
            </div>
            {/* end */}
            <div className="flex w-full flex-col max-w-2xl mx-auto sm:mt-0 mt-4">
              <Tabs
              color="primary"
              className="font-bold"
                aria-label="Packeges"
                selectedKey={selectedTab}
                onSelectionChange={(key: Key) => {
                  if (typeof key === "string") {
                    if (selectedTab === "standard") {
                      setSelectedtab("premium");
                    }
                    if (selectedTab === "premium") {
                      setSelectedtab("standard");
                    }
                  }
                }}
              >
                <Tab key="standard" title="Standard">
                  <Card>
                    <CardBody>
                      <div className="mt-4">
                        <h3 className="text-xl font-bold">Book yours </h3>
                        <Form
                          onSubmit={async (e) => {
                            setStandardLoading(true);
                            e.preventDefault();
                            if (!isUserLogedIn) {
                              router.replace("/authentication/signin");
                            }

                            try {
                              const res = await fetch("/api/booking", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  date,
                                  personCount,
                                  category: selectedTab,
                                  price,
                                  tourId,
                                }),
                              });

                              const response = await res.json();
                              if (response.success === true) {
                                router.push(
                                  `/proceed-for-payment/${response.orderId}`
                                );
                                setStandardLoading(false);
                              } else {
                                console.log(response);
                                setStandardLoading(false);
                              }
                            } catch (error) {
                              console.log(error);
                              setStandardLoading(false);
                            }
                          }}
                        >
                          <div>
                            <DateRangePicker
                              label="Date range (controlled)"
                              value={date}
                              onChange={setDate}
                              isRequired
                            />
                            <p className="text-default-500 text-sm">
                              Selected date:
                              {date
                                ? formatter.formatRange(
                                    date.start.toDate(getLocalTimeZone()),
                                    date.end.toDate(getLocalTimeZone())
                                  )
                                : "--"}
                            </p>
                          </div>
                          <div>
                            <NumberInput
                              isRequired
                              label="Person count"
                              placeholder="Total visitor"
                              value={personCount}
                              isInvalid={isPersonCountError}
                              onValueChange={setPersonCount}
                            />
                          </div>
                          <div>
                            {price > 1 && (
                              <p className="text-sm font-bold text-gray-600">
                                Your total cost will be{" "}
                                <span className="text-blue-600">{price}</span>
                              </p>
                            )}
                            {isPersonCountError && (
                              <p className="font-semibold text-green-600 text-sm">
                                Person count should be greater than 0(Zero).
                              </p>
                            )}
                          </div>
                          {standardLoading ? (
                            <Button isDisabled className="w-full font-bold">
                              <Spinner />
                            </Button>
                          ) : (
                            <Button
                              type="submit"
                              className="w-full font-bold"
                              color="primary"
                            >
                              Book now
                            </Button>
                          )}
                        </Form>
                      </div>
                      <p className="font-bold">
                        {tourslug.tourCategory.standard.title}
                      </p>
                      <p className="text-sm font-semibold text-gray-600">
                        {" "}
                        Starting from ${
                          tourslug.tourCategory.standard.price
                        }{" "}
                        per person
                      </p>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: `${tourslug.tourCategory.standard.description}`,
                        }}
                        className="mt-2"
                      />
                    </CardBody>
                  </Card>
                </Tab>
                <Tab key="premium" title="Premium">
                  <Card>
                    <CardBody>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">Book yours </h3>
                        <Form
                          onSubmit={async (e) => {
                            setPremiumLoading(true);
                            e.preventDefault();
                            try {
                              const res = await fetch("/api/booking", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  date: premiumDate,
                                  personCount: premiumPersonCount,
                                  category: selectedTab,
                                  price: premiumPrices,
                                  tourId,
                                }),
                              });
                              const response = await res.json();
                              if (response.success === true) {
                                router.push(
                                  `/proceed-for-payment/${response.orderId}`
                                );
                                setPremiumLoading(false);
                              } else {
                                console.log(response);
                                setPremiumLoading(false);
                              }
                            } catch (error) {
                              console.log(error);
                              setPremiumLoading(false);
                            }
                          }}
                        >
                          <div>
                            <DateRangePicker
                              label="Date range (controlled)"
                              value={date}
                              onChange={setPremiumDate}
                              isRequired
                            />
                            <p className="text-default-500 text-sm">
                              Selected date:
                              {premiumDate
                                ? formatter.formatRange(
                                    premiumDate.start.toDate(
                                      getLocalTimeZone()
                                    ),
                                    premiumDate.end.toDate(getLocalTimeZone())
                                  )
                                : "--"}
                            </p>
                          </div>
                          <div>
                            <NumberInput
                              isRequired
                              label="Person count"
                              placeholder="Total visitor"
                              value={premiumPersonCount}
                              isInvalid={isPremiumPersonCountError}
                              onValueChange={setPremiumPersonCount}
                            />
                          </div>
                          <div>
                            {premiumPrices > 1 && (
                              <p className="text-sm font-bold text-gray-600">
                                Your total cost will be{" "}
                                <span className="text-blue-600">
                                  {premiumPrices}
                                </span>
                              </p>
                            )}
                            {isPremiumPersonCountError && (
                              <p className="font-semibold text-green-600 text-sm">
                                Person count should be greater than 0(Zero).
                              </p>
                            )}
                          </div>
                          {premiumLoading ? (
                            <Button isDisabled className="w-full font-bold">
                              <Spinner />
                            </Button>
                          ) : (
                            <Button
                              type="submit"
                              className="w-full font-bold"
                              color="primary"
                            >
                              Book now
                            </Button>
                          )}
                        </Form>
                      </div>
                      <p className="font-bold">
                        {tourslug.tourCategory.premium.title}
                      </p>
                      <p className="text-sm font-semibold text-gray-600">
                        Starting from ${tourslug.tourCategory.premium.price} per
                        person
                      </p>

                      <div
                        dangerouslySetInnerHTML={{
                          __html: `${tourslug.tourCategory.premium.description}`,
                        }}
                        className="mt-2"
                      />
                    </CardBody>
                  </Card>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

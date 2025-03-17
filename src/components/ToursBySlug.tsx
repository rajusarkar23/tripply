"use client";
import useTourStore from "@/store/tour-store/tourStore";
import {
  Button,
  Card,
  CardBody,
  DateRangePicker,
  Form,
  NumberInput,
  RangeValue,
  Tab,
  Tabs,
} from "@heroui/react";
import { DateValue, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import Image from "next/image";
import { useParams } from "next/navigation";
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
          <div className="relative w-full h-96">
            <Image
              src={tourslug.image!}
              alt={tourslug.name!}
              fill
              className="object-cover"
            />
          </div>
          <div className="max-w-2xl mx-auto flex flex-col justify-center py-4">
            <h2 className="text-4xl font-bold">{tourslug.name}</h2>
            <h4 className="font-semibold text-gray-600">{tourslug.overview}</h4>

            <div
              dangerouslySetInnerHTML={{
                __html: `${tourslug.description}`.replace(
                  /<p>\s*<\/p>/g,
                  "<br>"
                ),
              }}
            />
          </div>

          <div className="flex w-full flex-col max-w-2xl mx-auto">
            <Tabs
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
                    <p className="font-bold">
                      {tourslug.tourCategory.standard.title}
                    </p>
                    <p className="text-sm font-semibold text-gray-600">
                      {" "}
                      Starting from ${tourslug.tourCategory.standard.price} per
                      person
                    </p>

                    <div
                      dangerouslySetInnerHTML={{
                        __html: `${tourslug.tourCategory.standard.description}`,
                      }}
                      className="mt-2"
                    />

                    <div className="mt-4">
                      <h3 className="text-xl font-bold">Book yours </h3>
                      <Form
                        onSubmit={async (e) => {
                          e.preventDefault();
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

                            console.log(await res.json());
                          } catch (error) {
                            console.log(error);
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
                        <Button
                          type="submit"
                          className="w-full font-bold"
                          color="primary"
                        >
                          Book now
                        </Button>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="premium" title="Premium">
                <Card>
                  <CardBody>
                    <p className="font-bold">
                      {tourslug.tourCategory.premium.title}
                    </p>
                    <p className="text-sm font-semibold text-gray-600">
                      {" "}
                      Starting from ${tourslug.tourCategory.premium.price} per
                      person
                    </p>

                    <div
                      dangerouslySetInnerHTML={{
                        __html: `${tourslug.tourCategory.premium.description}`,
                      }}
                      className="mt-2"
                    />

                    <div className="mt-4">
                      <h3 className="text-xl font-bold">Book yours </h3>
                      <Form
                        onSubmit={async (e) => {
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

                            console.log(await res.json());
                          } catch (error) {
                            console.log(error);
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
                                  premiumDate.start.toDate(getLocalTimeZone()),
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
                              <span className="text-blue-600">{premiumPrices}</span>
                            </p>
                          )}
                          {isPremiumPersonCountError && (
                            <p className="font-semibold text-green-600 text-sm">
                              Person count should be greater than 0(Zero).
                            </p>
                          )}
                        </div>
                        <Button
                          type="submit"
                          className="w-full font-bold"
                          color="primary"
                        >
                          Book now
                        </Button>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>
        </div>
      ))}
    </div>
  );
}

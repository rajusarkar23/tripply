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
import {
  DateValue,
  getLocalTimeZone,
} from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
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
  const [value, setValue] = useState<RangeValue<DateValue> | null>();
  const [personCount, setPersonCount] = useState<number>();

  console.log(personCount);

  const formatter = useDateFormatter({ dateStyle: "long" });

  const slug = useParams().tourSlug;

  const { tours } = useTourStore() as { tours: Tour[] };

  const tourSlug: Tour[] = [];

  for (const tour of tours) {
    if (tour.slug === slug) {
      tourSlug.push(tour);
    }
  }

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
            <Tabs aria-label="Packeges">
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
                      <Form>
                        <div>
                          <DateRangePicker
                            label="Date range (controlled)"
                            value={value}
                            onChange={setValue}
                            isRequired
                          />
                          <p className="text-default-500 text-sm">
                            Selected date:
                            {value
                              ? formatter.formatRange(
                                  value.start.toDate(getLocalTimeZone()),
                                  value.end.toDate(getLocalTimeZone())
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
                            onValueChange={setPersonCount}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-600">
                            Your total cost will be{" "}
                           <span className="text-blue-600"> {tourslug.tourCategory.standard.price! *
                              personCount!}</span>
                          </p>
                        </div>
                        <Button
                          type="submit"
                          className="w-full font-bold"
                          color="primary"
                        >
                          Book
                        </Button>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="music" title="Music">
                <Card>
                  <CardBody>
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                    irure dolor in reprehenderit in voluptate velit esse cillum
                    dolore eu fugiat nulla pariatur.
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

"use client";
import { useTourStoreV2 } from "@/store/tour-store/tourStoreV2";
import {
  Accordion,
  AccordionItem,
  Button,
  Checkbox,
  Chip,
  DateRangePicker,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import { Star, TicketsPlane } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CheckoutButtonV2 from "./CheckoutButtonV2";

interface Date {
  day: number;
  month: number;
  year: number;
}

export default function TourV2BySlug() {
  const { fetchTour, tour } = useTourStoreV2();
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const params = useParams();

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchTour({ slug: params.slug!.toString()! });
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (tour!.heroBannerContent.heroBannerImageUrls.length! > 0) {
      setActiveImage(tour!.heroBannerContent.heroBannerImageUrls[0].url!);
    }
  }, [tour]);

  if (loading) {
    return (
      <div className="flex min-h-[100vh] justify-center">
        <Spinner />
      </div>
    );
  }

  function BookNowModal({
    placeName,
    standard_price,
    premium_price,
    tourId,
  }: {
    placeName: string;
    premium_price: number;
    standard_price: number;
    tourId: number;
  }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [totalCost, setTotalCost] = useState<number>(0);
    const [tourists, setTourists] = useState<number>(0);
    const [tourCategory, setTourCategory] = useState<string | number>(
      "premium"
    );

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [canBeAccepted, setCanBeAccepted] = useState(false);
    const [consentProvided, setConsentProvided] = useState(false);

    const [endDate, setEndDate] = useState<Date>({ day: 0, month: 0, year: 0 });
    const [startDate, setStartDate] = useState<Date>({
      day: 0,
      month: 0,
      year: 0,
    });

    useEffect(() => {
      if (
        totalCost !== 0 &&
        name.length !== 0 &&
        email.length !== 0 &&
        startDate.day !== 0 &&
        endDate.day !== 0
      ) {
        setCanBeAccepted(true);
      } else {
        setCanBeAccepted(false);
      }
    }, [name, email, totalCost]);

    useEffect(() => {
      if (endDate.day === 0) {
        return;
      }
      if (tourCategory === "premium") {
        const duration = endDate.day - startDate.day + 1;
        setTotalCost(duration * tourists * premium_price);
      } else {
        const duration = endDate.day - startDate.day + 1;
        setTotalCost(duration * tourists * standard_price);
      }
    }, [endDate, tourists]);

    return (
      <>
        <div className="flex flex-wrap gap-3">
          <Button
            onPress={onOpen}
            color="primary"
            className="rounded-full font-bold flex items-center justify-center"
          >
            Book your spot now <TicketsPlane className="text-yellow-400" />
          </Button>
        </div>
        <Modal isOpen={isOpen} size={"2xl"} onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 font-bold text-blue-600">
                  Book your spot for a vacation in {placeName}
                </ModalHeader>
                <ModalBody>
                  <Tabs
                    color="primary"
                    radius="full"
                    className="font-semibold"
                    aria-label="Book now card tabs"
                    selectedKey={tourCategory}
                    onSelectionChange={(e) => {
                      setTourCategory(e);
                      setTotalCost(0);
                      setTourists(0);
                      setEndDate({ day: 0, month: 0, year: 0 });
                    }}
                  >
                    <Tab key={"premium"} title="Premium">
                      <div className="flex w-full max-w-[670px] mx-auto mt-4">
                        <h4 className="text-blue-700 font-bold">
                          Book premium class at ${premium_price} today!
                        </h4>
                      </div>
                      <div className="md:flex md:flex-row flex flex-col w-full max-w-[670px] mx-auto gap-5 font-semibold text-black/60">
                        <Input
                          label="Person count"
                          labelPlacement="outside"
                          radius="sm"
                          size="sm"
                          onChange={(e) => {
                            setTourists(Number(e.target.value));
                          }}
                        />
                        <Input
                          label="Cost per head per night"
                          labelPlacement="outside"
                          value={premium_price.toString()}
                          radius="sm"
                          size="sm"
                        />
                        <DateRangePicker
                          className="max-w-xs"
                          label="Stay duration"
                          labelPlacement="outside"
                          size="sm"
                          radius="sm"
                          onChange={(e) => {
                            setEndDate(e!.end);
                            setStartDate(e!.start);
                          }}
                        />
                      </div>
                      <div className="w-full max-w-[670px] mx-auto my-4">
                        {totalCost > 0 && (
                          <Chip color="primary" size="md">
                            <span className="font-bold">
                              Book now at{" "}
                              <span className="text-yellow-300">
                                ${totalCost}
                              </span>{" "}
                            </span>
                          </Chip>
                        )}
                      </div>
                      <Divider className="w-full max-w-[670px] mx-auto" />

                      <div className="w-full max-w-[670px] mx-auto mt-4">
                        <h4 className="text-blue-700 font-bold">
                          Your personal details:
                        </h4>
                      </div>
                      <div className="md:flex md:flex-row flex flex-col w-full max-w-[670px] mx-auto gap-5 font-semibold text-black/60">
                        <Input
                          label="Your full name"
                          labelPlacement="outside"
                          type="text"
                          radius="sm"
                          size="sm"
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                        />
                        <Input
                          label="Your email"
                          labelPlacement="outside"
                          type="email"
                          radius="sm"
                          size="sm"
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                        />
                      </div>
                      <div className="mt-6">
                        <Accordion className="font-bold rounded text-green-600 bg-default-100 transition-all">
                          <AccordionItem
                            aria-label="Premium Plan Includes"
                            title="Premium Plan Includes"
                          >
                            <ul className="text-yellow-600/90 font-semibold text-sm">
                              <div>
                                <h4 className="text-blue-700 font-semibold">
                                  <span className="text-emerald-600">
                                    Premium
                                  </span>
                                  plan includes:
                                </h4>
                              </div>
                              <li>Get personal service manager</li>
                              <li>Get personal tour guide 24 x 7</li>
                              <li>
                                Private Transfers (luxury car with chauffeur)
                              </li>
                              <li>Free Room Upgrades (when available)</li>
                              <li>
                                Private Local Guides (expert historians,
                                foodies, or adventure guides)
                              </li>
                            </ul>
                          </AccordionItem>
                        </Accordion>
                      </div>
                      <div className="flex justify-center items-center mt-6">
                        {canBeAccepted && (
                          <Checkbox
                            className="text-xs"
                            onValueChange={() => {
                              setConsentProvided(!consentProvided);
                            }}
                          >
                            I have double checked above data.
                          </Checkbox>
                        )}
                      </div>
                    </Tab>
                    <Tab
                      key={"standard"}
                      title="Standard"
                      onClick={() => {
                        setTourCategory("standard");
                      }}
                    >
                      <div className="flex w-full max-w-[670px] mx-auto mt-4">
                        <h4 className="text-blue-700 font-bold">
                          Book standard class at ${standard_price} today!
                        </h4>
                      </div>
                      <div className="md:flex md:flex-row flex flex-col w-full max-w-[670px] mx-auto gap-5 font-semibold text-black/60">
                        <Input
                          label="Person count"
                          labelPlacement="outside"
                          radius="sm"
                          size="sm"
                          onChange={(e) => {
                            setTourists(Number(e.target.value));
                          }}
                        />
                        <Input
                          label="Cost per head per night"
                          labelPlacement="outside"
                          value={standard_price.toString()}
                          radius="sm"
                          size="sm"
                        />
                        <DateRangePicker
                          className="max-w-xs"
                          label="Stay duration"
                          labelPlacement="outside"
                          size="sm"
                          radius="sm"
                          onChange={(e) => {
                            setEndDate(e!.end);
                            setStartDate(e!.start);
                          }}
                        />
                      </div>
                      <div className="w-full max-w-[670px] mx-auto my-4">
                        {totalCost > 0 && (
                          <Chip color="primary" size="md">
                            <span className="font-bold">
                              Book now at{" "}
                              <span className="text-yellow-300">
                                ${totalCost}
                              </span>{" "}
                            </span>
                          </Chip>
                        )}
                      </div>
                      <Divider className="w-full max-w-[670px] mx-auto" />

                      <div className="w-full max-w-[670px] mx-auto mt-4">
                        <h4 className="text-blue-700 font-bold">
                          Your personal details:
                        </h4>
                      </div>
                      <div className="md:flex md:flex-row flex flex-col w-full max-w-[670px] mx-auto gap-5 font-semibold text-black/60">
                        <Input
                          label="Your full name"
                          labelPlacement="outside"
                          type="text"
                          radius="sm"
                          size="sm"
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                        />
                        <Input
                          label="Your email"
                          labelPlacement="outside"
                          type="email"
                          radius="sm"
                          size="sm"
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                        />
                      </div>

                      <div className="mt-6">
                        <Accordion className="font-bold rounded text-green-600 bg-default-100 transition-all">
                          <AccordionItem
                            aria-label="Standard Plan Include"
                            title="Standard Plan Include"
                          >
                            <ul className="text-yellow-600/90 font-semibold text-sm">
                              <div>
                                <h4 className="text-blue-700 font-semibold">
                                  <span className="text-emerald-600">
                                    Standard
                                  </span>{" "}
                                  plan includes:
                                </h4>
                              </div>
                              <li>
                                Access to customer support during business hours
                              </li>
                              <li>Shared group tours on scheduled dates</li>
                              <li>
                                Standard Transfers (comfortable shared
                                transport)
                              </li>
                              <li>
                                Room Upgrade Offers (subject to availability and
                                promotions)
                              </li>
                              <li>
                                Group Local Guides (knowledgeable guides for
                                popular tours)
                              </li>
                            </ul>
                          </AccordionItem>
                        </Accordion>
                      </div>
                      <div className="flex justify-center items-center mt-6">
                        {canBeAccepted && (
                          <Checkbox
                            className="text-xs font-semibold"
                            onValueChange={() => {
                              setConsentProvided(!consentProvided);
                            }}
                          >
                            I have double checked above data.
                          </Checkbox>
                        )}
                      </div>
                    </Tab>
                  </Tabs>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <CheckoutButtonV2
                    bookingEnd={`${endDate.day}-${endDate.month}-${endDate.year}`}
                    bookingStart={`${startDate.day}-${startDate.month}-${startDate.year}`}
                    bookingFor={tourId}
                    email={email}
                    name={name}
                    totalPrice={totalCost}
                    touristCount={tourists}
                    category={tourCategory.toString()}
                    placeName={placeName}
                    isConsentprovided={consentProvided}
                  />
                </ModalFooter>
                <div className="flex justify-center items-center pb-2">
                  <p className="text-sm text-red-600 font-semibold">
                    All above fields are required.
                  </p>
                </div>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <div>
      <div className="relative min-h-[45vh] flex items-center justify-center">
        {/* SHOW IMAGE */}
        <div className="absolute inset-0 z-0">
          <Image
            src={tour!.mainBackImage!}
            alt="main_back_image"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        </div>
        {/* BANNER CONTENT */}
        <div className="relative z-10 text-center md:flex md:flex-row flex flex-col md:gap-48 gap-6">
          <div className="md:px-0 px-4 md:pt-0 pt-2">
            <p className="w-80 text-left text-4xl font-bold text-white">
              {tour!.heroBannerContent.heading}
            </p>
            <p className="w-80 text-left md:text-white text-white/70 font-semibold">
              {tour!.heroBannerContent.briefParagraph}
            </p>
          </div>
          <div className="md:pb-0 pb-1">
            <div className="md:px-0 px-4">
              <Image
                src={activeImage}
                alt="banner_image"
                width={450}
                height={350}
                className="rounded-t-xl"
              />
            </div>
            <div className="flex bg-stone-800 md:px-0 px-4 md:mx-0 mx-4 py-0.5 rounded-b-lg gap-1">
              {tour!.heroBannerContent.heroBannerImageUrls.map(
                (urls, index) => (
                  <div
                    className="flex flex-col hover:cursor-pointer border border-blue-300 p-0.5 rounded"
                    key={index}
                    onClick={() => {
                      setActiveImage(urls.url);
                    }}
                  >
                    <Image
                      src={urls.url}
                      alt="banner_image"
                      width={60}
                      height={40}
                      className="hover:scale-105 transition-all"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      {/* BELOW OF THE BANNER */}
      <div className="bg-black text-white flex flex-col justify-center items-center">
        <div className="bg-stone-900 w-full max-w-[1300px] mt-8 rounded-xl py-10 px-8">
          <div>
            <div className="flex pb-2">
              <BookNowModal
                placeName={tour!.placeName}
                premium_price={tour!.tourPricing.premium}
                standard_price={tour!.tourPricing.standard}
                tourId={tour!.id}
              />
            </div>
            <div>
              <h3 className="sm:text-4xl text-xl font-semibold pb-4">
                Things to do in{" "}
                <span className="text-blue-600">{tour!.placeName}</span>
              </h3>
            </div>
          </div>
          <div className="md:grid md:grid-cols-3 md:gap-8 flex flex-col space-y-5  justify-center items-center">
            {tour!.thingsToDoArr.map((ttd, index) => (
              <div
                className="bg-neutral-800 py-2 px-4 rounded-xl md:w-[400px] md:h-[500px] w-[340px] h-[400] flex flex-col justify-center"
                key={index}
              >
                <div>
                  <Image
                    src={ttd.imageUrl}
                    alt="todo_image"
                    width={400}
                    height={200}
                    className="rounded-t-xl my-2"
                  />
                  <h2 className="text-2xl font-bold text-white">
                    {ttd.heading}
                  </h2>
                  <p className="text-sm text-yellow-400/80 font-semibold">
                    {ttd.subHeading}
                  </p>
                </div>
                <p className="text-gray-100 text-sm mb-2 line-clamp-4">
                  {ttd.briefParagraph}
                </p>
                <Divider className="bg-yellow-400 " />
                <div className="flex flex-col items-center py-2">
                  <div>
                    <h2 className="text-sm font-semibold text-white/70">
                      Rated by travelers across the world
                    </h2>
                  </div>
                  <div className="flex">
                    {[...Array(ttd.rating)].map((_, index) => (
                      <Star
                        className="text-yellow-400 fill-yellow-400"
                        key={index}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* VISIT TIMINGS */}
        <div className="bg-stone-900 w-full max-w-[1300px] mt-8 mb-8 rounded-xl px-8 py-8 flex justify-center items-center flex-col">
          <div>
            <h3 className="text-4xl">Best time to visit</h3>
            <p className="text-xs">
              Guide to make your travel at the right time
            </p>
          </div>

          <div className="mt-4 bg-neutral-800 rounded-lg px-4 py-2 md:flex md:flex-row flex flex-col justify-center gap-8 md:w-auto md:h-auto w-[340px] h-[400px]">
            <div>
              <h3 className="uppercase font-bold text-yellow-400">
                {tour!.visitTimings.best.start} - {tour!.visitTimings.best.end}
              </h3>
              <p className="w-40 text-green-600 font-semibold text-sm">
                Best time to visit{" "}
                <span className="text-blue-600 text-lg font-semibold">
                  {tour!.placeName}
                </span>
              </p>
            </div>
            <div>
              <h3 className="uppercase font-bold text-yellow-400">
                {tour!.visitTimings.good.start} - {tour!.visitTimings.good.end}
              </h3>
              <p className="w-40 text-neutral-300 font-semibold text-sm">
                Good time to visit{" "}
                <span className="text-blue-600 text-lg font-semibold">
                  {tour!.placeName}
                </span>
              </p>
            </div>

            <div>
              <h3 className="uppercase font-bold text-yellow-400">
                {tour!.visitTimings.notRecomended.start} -{" "}
                {tour!.visitTimings.notRecomended.end}
              </h3>
              <p className="w-40 text-red-600/70 font-semibold text-sm">
                Not recomended{" "}
                <span className="text-blue-600 text-lg font-semibold">
                  {tour!.placeName}
                </span>
              </p>
            </div>
          </div>
        </div>
        {/* booking section */}
        <div className="bg-stone-900 w-full max-w-[1300px] mt-8 mb-8 rounded-xl px-8 py-8 flex justify-center items-center">
          <div className="bg-neutral-800 rounded-lg px-4 py-2  w-[340px] flex justify-center">
            <BookNowModal
              placeName={tour!.placeName}
              premium_price={tour!.tourPricing.premium}
              standard_price={tour!.tourPricing.standard}
              tourId={tour!.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

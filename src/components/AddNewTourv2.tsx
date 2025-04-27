"use client";
import { useAddNewTour } from "@/store/tour-store/addNewTour";
import { Button } from "@heroui/button";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberInput,
  Select,
  SelectItem,
  Spinner,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

interface HeroBannerImageUrl {
  url: string;
}
interface ThingsToDoArr {
  heading: string;
  subHeading: string;
  briefParagraph: string;
  rating: number;
  imageUrl: string;
}

type VisitTimings = {
  best: {
    start: string,
    end: string
  },
  good: {
    start: string,
    end: string
  },
  notRecomended: {
    start: string,
    end: string
  }
}

export default function AddNewTourV2() {
  const {
    mainBackImageUrl,
    placeName,
    heroBannerContent,
    heroBannerImageurls,
    addTourInDB
  } = useAddNewTour();
  const [activeBannerImage, setActiveBannerImage] = useState("");
  console.log(activeBannerImage);
  const router = useRouter()

  useEffect(() => {
    if (useAddNewTour.getState().heroBannerImageurls.length !== 0) {
      setActiveBannerImage(useAddNewTour.getState().heroBannerImageurls[0].url);
    } else {
      return;
    }
  }, []);

  function SetPlaceName() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [place, setPlace] = useState("");
    const { setPlaceName, placeName } = useAddNewTour();
    return (
      <>
        <div className="hover:bg-zinc-200 transition-all w-80 h-10 flex items-center hover:cursor-pointer px-4 rounded">
          {placeName.length !== 0 ? (
            <div
              className=" text-green-600 hover:text-blue-600 font-semibold flex items-center"
              onClick={() => {
                onOpen();
                setPlace(useAddNewTour.getState().placeName);
              }}
            >
              Place Name added <CheckCircle size={18} className="ml-1" />
            </div>
          ) : (
            <div
              onClick={onOpen}
              className="hover:cursor-pointer font-semibold hover:text-blue-600"
            >
              Set place name
            </div>
          )}
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Write Place Name Below
                </ModalHeader>
                <ModalBody>
                  {placeName.length !== 0 ? (
                    <>
                      <Input
                        label="Place name"
                        defaultValue={placeName}
                        onChange={(e) => {
                          setPlace(e.target.value);
                        }}
                      />
                      <p>
                        Place name:{" "}
                        <span className="text-green-600 font-semibold">
                          {placeName}
                        </span>
                      </p>
                    </>
                  ) : (
                    <>
                      <Input
                        label="Place name"
                        onChange={(e) => {
                          setPlace(e.target.value);
                        }}
                      />

                      {placeName.length !== 0 && (
                        <p>
                          Place name:{" "}
                          <span className="text-green-600 font-semibold">
                            {placeName}
                          </span>
                        </p>
                      )}
                    </>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    className="font-semibold"
                    onPress={() => {
                      console.log(place);
                      setPlaceName({ placeName: place });
                    }}
                  >
                    Set Place Name
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
  function SetMainBackgroundImage() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [fileUploading, setFileUploading] = useState(false);
    const [fileUploadingSuccess, setFileUploadingSuccess] = useState(false);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [fileUploadErrorMessage, setFileUploadErrorMessage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const { setMainBackImageUrl, mainBackImageUrl } = useAddNewTour();

    // handle file upload
    const handleFileUplaod = async (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const fileSelected = e.target.files?.[0];
      // check
      if (!fileSelected) {
        return <p>Please select a file</p>;
      }
      // create a new form data
      const formData = new FormData();
      // append it with the selected file
      formData.append("file", fileSelected);

      // send http req
      try {
        setFileUploading(true);
        setFileUploadError(false);
        const res = await fetch("/api/tour/upload-media", {
          method: "POST",
          body: formData,
        });

        const response = await res.json();
        if (response.success) {
          setFileUploading(false);
          // setMainBackImageUrl({ imageUrl: response.url });
          setImageUrl(response.url);
          setFileUploadingSuccess(true);
        } else {
          setFileUploading(false);
          setFileUploadError(true);
          setFileUploadErrorMessage(response.message);
        }
      } catch (error) {
        console.log(error);
        setFileUploading(false);
        setFileUploadError(true);
        setFileUploadErrorMessage("Something went wrong.");
      }
    };
    return (
      <>
        <div className="hover:bg-zinc-200 transition-all w-80 h-10 flex items-center hover:cursor-pointer px-4 rounded">
          {mainBackImageUrl.length !== 0 ? (
            <div
              className="hover:cursor-pointer hover:text-blue-600 text-green-600 font-semibold flex items-center"
              onClick={() => {
                onOpen();
                setImageUrl(useAddNewTour.getState().mainBackImageUrl);
              }}
            >
              Main Background Image Added{" "}
              <CheckCircle size={18} className="ml-1" />
            </div>
          ) : (
            <div
              onClick={onOpen}
              className="hover:cursor-pointer font-semibold hover:text-blue-600"
            >
              Set Main Background Image
            </div>
          )}
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Uplaod main background image
                </ModalHeader>
                <ModalBody>
                  <Input
                    label="Select an image"
                    type="file"
                    onChange={(e) => {
                      handleFileUplaod(e);
                    }}
                  />
                  <div>
                    {fileUploading && (
                      <p className="font-bold flex items-center text-zinc-700 mb-2">
                        Uploading... <Spinner size="sm" color="default" />{" "}
                      </p>
                    )}
                    {fileUploadError && <p>{fileUploadErrorMessage}</p>}
                    {fileUploadingSuccess && imageUrl.length !== 0 && (
                      <>
                        <p className="text-xs font-semibold text-zinc-700">
                          To change this image upload a new image.
                        </p>
                        <Image
                          src={imageUrl}
                          alt="main_background_image"
                          width={400}
                          height={400}
                          className="rounded"
                        />
                      </>
                    )}

                    {mainBackImageUrl.length !== 0 && !fileUploadingSuccess && (
                      <>
                        <p className="text-xs font-semibold text-zinc-700">
                          To change this image upload a new image.
                        </p>
                        <Image
                          src={mainBackImageUrl}
                          alt="main_background_image"
                          width={400}
                          height={400}
                          className="rounded"
                        />
                      </>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      setMainBackImageUrl({ imageUrl });
                    }}
                    className="font-semibold"
                  >
                    Set Image
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
  function HeroBannerContent() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [heading, setHeading] = useState("");
    const [para, setPara] = useState("");
    const [imageUrl, setImageUrl] = useState<HeroBannerImageUrl[]>([]);

    const [fileUploading, setFileUploading] = useState(false);
    const [fileUploadingSuccess, setFileUploadingSuccess] = useState(false);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [fileUploadErrorMessage, setFileUploadErrorMessage] = useState("");
    const [conetntAddError, setContentAddError] = useState(false);
    const [conetntAddErrorMessage, setContentAddErrorMessage] = useState("");
    const {
      setHeroBannerContent,
      heroBannerContent,
      heroBannerImageurls,
      setHeroBannerImages,
    } = useAddNewTour();

    const [activeImage, setActiveImage] = useState("");
    const [activeImageInEmptyBannerData, setActiveImageInEmptyBannerData] =
      useState("");

    useEffect(() => {
      if (heroBannerImageurls.length !== 0) {
        setActiveImage(heroBannerImageurls[0].url);
      } else {
        return;
      }
    }, []);
    const handleFileUplaod = async (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const fileSelected = e.target.files?.[0];
      // check
      if (!fileSelected) {
        return <p>Please select a file</p>;
      }
      // create a new form data
      const formData = new FormData();
      // append it with the selected file
      formData.append("file", fileSelected);

      // send http req
      try {
        setFileUploading(true);
        setFileUploadError(false);
        const res = await fetch("/api/tour/upload-media", {
          method: "POST",
          body: formData,
        });

        const response = await res.json();
        if (response.success) {
          setFileUploading(false);
          setActiveImageInEmptyBannerData(response.url);
          setImageUrl((prev) => [...prev, { url: response.url }]);
          setFileUploadingSuccess(true);
        } else {
          setFileUploading(false);
          setFileUploadError(true);
          setFileUploadErrorMessage(response.message);
        }
      } catch (error) {
        console.log(error);
        setFileUploading(false);
        setFileUploadError(true);
        setFileUploadErrorMessage("Something went wrong.");
      }
    };
    return (
      <>
        <div className="hover:bg-zinc-200 transition-all w-80 h-10 flex items-center hover:cursor-pointer px-4 rounded">
          {heroBannerContent.briefParagraph.length !== 0 &&
          heroBannerContent.heading.length !== 0 &&
          heroBannerImageurls.length !== 0 ? (
            <div
              className="hover:cursor-pointer hover:text-blue-600 text-green-600 font-semibold flex items-center"
              onClick={() => {
                onOpen();
                setHeading(useAddNewTour.getState().heroBannerContent.heading);
                setPara(
                  useAddNewTour.getState().heroBannerContent.briefParagraph
                );
                setImageUrl(useAddNewTour.getState().heroBannerImageurls);
              }}
            >
              Banner content added <CheckCircle size={18} className="ml-1" />
            </div>
          ) : (
            <div
              onClick={onOpen}
              className="hover:cursor-pointer font-semibold hover:text-blue-600"
            >
              Set hero banner contents
            </div>
          )}
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Fill the banner conetnt below
                </ModalHeader>
                <ModalBody>
                  {heroBannerContent.briefParagraph.length !== 0 &&
                  heroBannerContent.heading.length !== 0 &&
                  heroBannerImageurls.length !== 0 ? (
                    <>
                      <Textarea
                        label="Heading"
                        defaultValue={heading}
                        onChange={(e) => {
                          setHeading(e.target.value);
                        }}
                      />

                      <Textarea
                        label="Brief paragraph"
                        defaultValue={para}
                        onChange={(e) => {
                          setPara(e.target.value);
                        }}
                      />
                      <Input
                        type="file"
                        onChange={(e) => {
                          handleFileUplaod(e);
                        }}
                      />
                      {fileUploading && (
                        <p className="flex items-center text-zinc-700">
                          Uploading... <Spinner size="sm" className="mr-1" />
                        </p>
                      )}
                      {fileUploadError && <p>{fileUploadErrorMessage}</p>}
                      {fileUploadingSuccess && <p>FIle uploaded</p>}
                      {conetntAddError && (
                        <p className="text-sm font-semibold text-red-600">
                          {conetntAddErrorMessage}
                        </p>
                      )}

                      <div>
                        <div>
                          <p className="text-center text-xs font-semibold">
                            To change this image or upload a select a new image.
                          </p>
                        </div>
                        {activeImage.length !== 0 && (
                          <div className="flex justify-center">
                            <Image
                              src={activeImage}
                              alt="banner_image"
                              width={400}
                              height={400}
                              className="rounded"
                            />
                          </div>
                        )}

                        {imageUrl.length !== 0 && (
                          <div className="flex py-2 space-x-1 justify-center">
                            {imageUrl.map((urls, index) => (
                              <Image
                                src={urls.url}
                                alt="banner_image"
                                width={60}
                                height={60}
                                onClick={() => {
                                  setActiveImage(urls.url);
                                }}
                                key={index}
                                className="rounded hover:cursor-pointer border p-0.5"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <Textarea
                        label="Heading"
                        onChange={(e) => {
                          setHeading(e.target.value);
                        }}
                      />

                      <Textarea
                        label="Brief paragraph"
                        onChange={(e) => {
                          setPara(e.target.value);
                        }}
                      />
                      <Input
                        type="file"
                        onChange={(e) => {
                          handleFileUplaod(e);
                        }}
                      />
                      {fileUploading && (
                        <p className="flex items-center text-xs text-zinc-700">
                          Uploading... <Spinner size="sm" className="mr-1" />
                        </p>
                      )}
                      {fileUploadError && <p>{fileUploadErrorMessage}</p>}
                      {fileUploadingSuccess && <p>FIle uploaded</p>}
                      {conetntAddError && (
                        <p className="text-sm font-semibold text-red-600">
                          {conetntAddErrorMessage}
                        </p>
                      )}
                      {activeImageInEmptyBannerData.length !== 0 && (
                        <div className="flex py-2 space-x-1 justify-center">
                          <Image
                            src={activeImageInEmptyBannerData}
                            alt="banner_image"
                            height={400}
                            width={400}
                          />
                        </div>
                      )}
                      {imageUrl.length !== 0 && (
                        <div className="flex py-2 space-x-1 justify-center">
                          {imageUrl.map((urls, index) => (
                            <Image
                              src={urls.url}
                              alt="banner_image"
                              width={60}
                              height={60}
                              onClick={() => {
                                setActiveImageInEmptyBannerData(urls.url);
                              }}
                              key={index}
                              className="rounded hover:cursor-pointer border p-0.5"
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    className="font-semibold"
                    onPress={() => {
                      if (
                        para.length === 0 ||
                        heading.length === 0 ||
                        imageUrl.length === 0
                      ) {
                        setContentAddError(true);
                        setContentAddErrorMessage("All fields are required.");
                        return;
                      }
                      setHeroBannerContent({ briefParagraph: para, heading });
                      const newArr = [
                        ...useAddNewTour.getState().heroBannerImageurls,
                        ...imageUrl,
                      ];
                      const imagesUrls = [...new Set(newArr)];
                      setHeroBannerImages({ imageUrl: imagesUrls });
                    }}
                  >
                    Set content
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
  function ThingsToDo() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [heading, setHeading] = useState("");
    const [subHeading, setSubHeading] = useState("");
    const [briefParagraph, setBriefParagraph] = useState("");
    const [rating, setRating] = useState<number>();
    const [imageUrl, setImageUrl] = useState("");
    const { setThingsTodo } = useAddNewTour();

    // local component arr
    const [thingsTodoArr, setThingsToDoArr] = useState<ThingsToDoArr[]>([]);
    const [fileUploading, setFileUploading] = useState(false);
    const [fileUploadingSuccess, setFileUploadingSuccess] = useState(false);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [fileUploadErrorMessage, setFileUploadErrorMessage] = useState("");

    const [thingsTodoArrAddError, setThingsTodoArrAddError] = useState(false);
    const [thingsTodoArrAddErrorMessage, setThingsTodoArrAddErrorMessage] =
      useState("");

    // handle file upload
    const handleFileUplaod = async (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const fileSelected = e.target.files?.[0];
      // check
      if (!fileSelected) {
        return <p>Please select a file</p>;
      }
      // create a new form data
      const formData = new FormData();
      // append it with the selected file
      formData.append("file", fileSelected);

      // send http req
      try {
        setFileUploading(true);
        setFileUploadError(false);
        const res = await fetch("/api/tour/upload-media", {
          method: "POST",
          body: formData,
        });

        const response = await res.json();
        if (response.success) {
          setFileUploading(false);
          setImageUrl(response.url);
          setFileUploadingSuccess(true);
        } else {
          setFileUploading(false);
          setFileUploadError(true);
          setFileUploadErrorMessage(response.message);
        }
      } catch (error) {
        console.log(error);
        setFileUploading(false);
        setFileUploadError(true);
        setFileUploadErrorMessage("Something went wrong.");
      }
    };

    return (
      <>
        <div className="hover:bg-zinc-200 transition-all w-80 h-10 flex items-center hover:cursor-pointer px-4 rounded">
          <div>
            {useAddNewTour.getState().thingsTodoArr.length !== 0 ? (
              <div
                onClick={onOpen}
                className="hover:cursor-pointer hover:text-blue-600 font-semibold text-green-600 flex items-center"
              >
                Things to do added
                <CheckCircle size={18} className="ml-1" />
              </div>
            ) : (
              <div
                onClick={onOpen}
                className="hover:cursor-pointer font-semibold hover:text-blue-600"
              >
                Set Things to do.
              </div>
            )}
          </div>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Write Place Name Below
                </ModalHeader>
                <ModalBody>
                  <Textarea
                    label="Heading"
                    labelPlacement="outside"
                    placeholder="Write heading"
                    value={heading}
                    onChange={(e) => {
                      setHeading(e.target.value);
                    }}
                  />
                  <Textarea
                    label="Sub Heading"
                    labelPlacement="outside"
                    placeholder="Write sub heading"
                    value={subHeading}
                    onChange={(e) => {
                      setSubHeading(e.target.value);
                    }}
                  />
                  <Textarea
                    label="Brief Paragraph"
                    labelPlacement="outside"
                    placeholder="Write a brief paragraph"
                    value={briefParagraph}
                    onChange={(e) => {
                      setBriefParagraph(e.target.value);
                    }}
                  />
                  <NumberInput
                    label="Rating"
                    labelPlacement="outside"
                    placeholder="Give it a rating betweeb 0-5"
                    minValue={0}
                    maxValue={5}
                    hideStepper
                    value={rating}
                    onValueChange={setRating}
                  />
                  <Input
                    label="Select an image"
                    type="file"
                    onChange={(e) => {
                      handleFileUplaod(e);
                    }}
                  />
                  {fileUploading && (
                    <p className="font-bold flex items-center text-zinc-700 mb-2">
                      Uploading... <Spinner size="sm" color="default" />{" "}
                    </p>
                  )}
                  {thingsTodoArrAddError && (
                    <p className="font-semibold text-sm text-red-600">
                      {thingsTodoArrAddErrorMessage}
                    </p>
                  )}
                  {fileUploadError && <p>{fileUploadErrorMessage}</p>}
                  {fileUploadingSuccess && imageUrl.length !== 0 && (
                    <div className="flex justify-center flex-col items-center">
                      <p className="text-xs font-semibold text-zinc-700">
                        To change this image upload a new image.
                      </p>
                      <Image
                        src={imageUrl}
                        alt="main_background_image"
                        width={80}
                        height={80}
                        className="rounded"
                      />
                    </div>
                  )}

                  <div>
                    <Button
                      variant="flat"
                      color="default"
                      className="font-bold"
                      onPress={() => {
                        if (
                          heading.length === 0 ||
                          briefParagraph.length === 0 ||
                          imageUrl.length === 0 ||
                          typeof rating !== "number" ||
                          subHeading.length === 0
                        ) {
                          setThingsTodoArrAddError(true);
                          setThingsTodoArrAddErrorMessage(
                            "All fields are required."
                          );
                          return;
                        }
                        setThingsToDoArr([
                          ...thingsTodoArr,
                          {
                            heading,
                            briefParagraph,
                            imageUrl,
                            rating: rating!,
                            subHeading,
                          },
                        ]);
                      }}
                    >
                      Add
                    </Button>
                  </div>

                  <div>
                    {thingsTodoArr.length !== 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {thingsTodoArr.map((todo, index) => (
                          <div
                            onClick={() => {
                              console.log("clicked");
                              // setHeading(todo.heading)
                              // setSubHeading(todo.subHeading)
                              // setBriefParagraph(todo.briefParagraph)
                            }}
                            className="bg-neutral-600/20 rounded p-2"
                            key={index}
                          >
                            <p className="text-md font-semibold">
                              {todo.heading}
                            </p>
                            <p>{todo.subHeading}</p>
                            <p>{todo.briefParagraph}</p>
                            <p>{todo.rating}</p>
                            <Image
                              src={todo.imageUrl}
                              alt="image"
                              width={80}
                              height={80}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    className="font-semibold"
                    onPress={() => {
                      if (thingsTodoArr.length === 0) {
                        setThingsTodoArrAddError(true);
                        setThingsTodoArrAddErrorMessage(
                          "First add the content"
                        );
                        return;
                      }
                      setThingsTodo({ tta: thingsTodoArr });
                    }}
                  >
                    Set Things to do
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
  function VisitTiming() {
    const months = [
      { key: "january", label: "January" },
      { key: "february", label: "February" },
      { key: "march", label: "March" },
      { key: "april", label: "April" },
      { key: "may", label: "May" },
      { key: "june", label: "June" },
      { key: "july", label: "July" },
      { key: "august", label: "August" },
      { key: "september", label: "September" },
      { key: "october", label: "October" },
      { key: "november", label: "November" },
      { key: "december", label: "December" },
    ];

    const [bestTimeToVisitStart, setBestTimeToVisitStart] = useState("")
    const [bestTimeToVisitEnd, setBestTimeToVisitEnd] = useState("")
    const [goodTimeToVisitStart, setGoodTimeToVisitStart] = useState("")
    const [goodTimeToVisitEnd, setGoodTimeToVisitEnd] = useState("")
    const [notRecomendedTimeToVisitStart, setNotRecomendedTimeToVisitStart] = useState("")
    const [notRecomendedTimeToVisitEnd, setNotRecomendedTimeToVisitEnd] = useState("")
    // final state for visit time
    const [visitTime, setVisitTime] = useState<VisitTimings>()
    const {setVisitTimings} = useAddNewTour()    

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    return (
      <>
        <div className="hover:bg-zinc-200 transition-all w-80 h-10 flex items-center hover:cursor-pointer px-4 rounded">
          <div onClick={onOpen} className="hover:cursor-pointer hover:text-blue-600 font-semibold">
            Set place Visit times
          </div>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 hover:text-blue-600">
                  Write Place Name Below
                </ModalHeader>
                <ModalBody>
                  <>
                    <div>
                      <p className="font-semibold text-sm">
                        Set Best Time To Visit: <span className="text-blue-600/60">Start - End</span>
                      </p>

                      <div className="flex space-x-2 items-center">
                        <Select
                          label="Select Starting month"
                          onChange={(e) => {
                            setBestTimeToVisitStart(e.target.value)
                          }}
                        >
                          {months.map((month) => (
                            <SelectItem key={month.key}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </Select>

                        <Select
                          label="Select Ending month"
                          onChange={(e) => {
                            setBestTimeToVisitEnd(e.target.value)
                          }}
                        >
                          {months.map((month) => (
                            <SelectItem key={month.key}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                      <div>
                        {
                          bestTimeToVisitStart.length !== 0 && bestTimeToVisitEnd.length !== 0 && (
                            <p>Your selection: <span className="capitalize text-orange-600/60 text-sm font-semibold">{`${bestTimeToVisitStart} - ${bestTimeToVisitEnd}`}</span></p>
                          )
                        }
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        Set Good Time To Visit: <span className="text-blue-600/60">Start - End</span>
                      </p>

                      <div className="flex space-x-2 items-center">
                        <Select
                          label="Select Starting month"
                          onChange={(e) => {
                            setGoodTimeToVisitStart(e.target.value)
                          }}
                        >
                          {months.map((month) => (
                            <SelectItem key={month.key}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </Select>

                        <Select
                          label="Select Ending month"
                          onChange={(e) => {
                            setGoodTimeToVisitEnd(e.target.value)
                          }}
                        >
                          {months.map((month) => (
                            <SelectItem key={month.key}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                      {
                          goodTimeToVisitStart.length !== 0 && goodTimeToVisitEnd.length !== 0 && (
                            <p>Your selection: <span className="capitalize text-orange-600/60 text-sm font-semibold">{`${goodTimeToVisitStart} - ${goodTimeToVisitEnd}`}</span></p>
                          )
                        }
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        Not recomemded for Visit: <span className="text-blue-600/60">Start - End</span>
                      </p>

                      <div className="flex space-x-2 items-center">
                        <Select
                          label="Select Starting month"
                          onChange={(e) => {
                            console.log(e.target.value);
                            
                            setNotRecomendedTimeToVisitStart(e.target.value)
                          }}
                        >
                          {months.map((month) => (
                            <SelectItem key={month.key}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </Select>

                        <Select
                          label="Select Ending month"
                          onChange={(e) => {
                            setNotRecomendedTimeToVisitEnd(e.target.value)
                          }}
                        >
                          {months.map((month) => (
                            <SelectItem key={month.key}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                      {
                          notRecomendedTimeToVisitEnd.length !== 0 && notRecomendedTimeToVisitStart.length !== 0 && (
                            <p>Your selection: <span className="capitalize text-orange-600/60 text-sm font-semibold">{`${notRecomendedTimeToVisitStart} - ${notRecomendedTimeToVisitEnd}`}</span></p>
                          )
                        }
                    </div>
                  </>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    className="font-semibold"
                    onPress={() => {
                      setVisitTimings({
                       bestEnd: bestTimeToVisitEnd,
                       bestStart: bestTimeToVisitStart,
                       goodEnd: goodTimeToVisitEnd,
                       goodStart: goodTimeToVisitStart,
                       notRecomendedEnd: notRecomendedTimeToVisitEnd,
                       notRecomendedStart: notRecomendedTimeToVisitStart
                      })
                    }}
                  >
                    Add Timings
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
    <div className="flex justify-between">
      {/* FOR ADDING CONTENT */}
      <div className="p-5">
        <SetPlaceName />
        <SetMainBackgroundImage />
        <HeroBannerContent />
        <ThingsToDo />
        <VisitTiming />
        <div>
          <h4>Final submit</h4>
          <Button
          onPress={async () => {
            addTourInDB({thingsTodo: useAddNewTour.getState().thingsTodoArr, mainBackImageUrl: useAddNewTour.getState().mainBackImageUrl, VisitTiming: useAddNewTour.getState().visitTimings, heroBannerImageurls: useAddNewTour.getState().heroBannerImageurls, heroBannerContentHeadAndPara: useAddNewTour.getState().heroBannerContent, placeName: useAddNewTour.getState().placeName, router})
          }}
          >
            Submit
          </Button>
        </div>
      </div>
      {/* FOR SHOWING CONTENT */}
      <div className="bg-zinc-800 min-h-[100vh] px-0.5">
        <div className="border shadow-md">
          {mainBackImageUrl.length !== 0 && (
            <div className="relative min-h-[30vh] w-[1080px] flex items-center justify-center">
              {/* HERO BACKGROUND IMAGE AND HEADERS */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={mainBackImageUrl}
                  alt="Background image"
                  fill
                  priority
                  className="object-cover"
                />
                {/* Overlay with blur effect */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 text-center px-4 sm:px-6">
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                  {placeName.length !== 0 && <p>{placeName}</p>}
                </div>
                <div className="text-4xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
                  {heroBannerContent.heading.length !== 0 && (
                    <p>{heroBannerContent.heading}</p>
                  )}
                </div>

                <div className="flex flex-col gap-4 justify-center items-center">
                  <div>
                    {heroBannerContent.briefParagraph.length !== 0 && (
                      <p className="text-white">
                        {heroBannerContent.briefParagraph}
                      </p>
                    )}
                  </div>
                  <div>
                    {activeBannerImage.length !== 0 && (
                      <Image
                        src={activeBannerImage}
                        alt="active_banner_image"
                        width={400}
                        height={400}
                        className="rounded"
                      />
                    )}
                  </div>

                  <div className="flex space-x-1 p-1">
                    {heroBannerImageurls.map((image, index) => (
                      <Image
                        src={image.url}
                        alt="dbv"
                        width={60}
                        height={60}
                        key={index}
                        onClick={() => {
                          setActiveBannerImage(image.url);
                        }}
                        className="border p-1 border-zinc-500 rounded hover:cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div> 
          <h2 className="text-5xl font-semibold text-white px-2 py-3">Things To Do</h2>
            <div className="grid grid-cols-2 gap-2 w-[1080px]">
          
            {useAddNewTour.getState().thingsTodoArr.map((things, index) => (
              <div key={index} className="bg-neutral-700 rounded-lg text-white flex justify-center flex-col items-center">
                <h2>{things.heading}</h2>
                <Image
                  src={things.imageUrl}
                  alt="thingstodo_image"
                  width={400}
                  height={400}
                  className="rounded"
                />
                <p>{things.subHeading}</p>
              </div>
            ))}
          </div>
            </div>
           
        </div>
      </div>
    </div>
  );
}

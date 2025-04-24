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
  Spinner,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

export default function AddNewTourV2() {
  // STATES FOR ALL DATA
  const {
    addPlaceName,
    setMainBackImageUrl,
    setHeroBannerContent,
    heroBannerImageurls,
    mainBackImageUrl,
    placeName,
    heroBannerContent,
    setHeroBannerImages,
  } = useAddNewTour();


  // ALL COMPONENT FUNC WILL GO HERE

  // add place name
  function PlaceName() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const handleOpen = () => {
      onOpen();
    };
    const [place, setPlace] = useState("");

    return (
      <div>
        <div>
          <div>
            {placeName.length !== 0 ? (
              <div>
                <div
                  onClick={() => {
                    console.log(placeName.length);

                    handleOpen();
                  }}
                  className="font-semibold underline underline-offset-2 text-green-600 flex items-center hover:cursor-pointer"
                >
                  Add Place Name <CheckCircle size={18} />
                </div>
              </div>
            ) : (
              <div
                onClick={() => {
                  console.log(placeName.length);

                  handleOpen();
                }}
                className="font-semibold underline underline-offset-2 hover:cursor-pointer"
              >
                Add Place Name
              </div>
            )}
          </div>
        </div>
        <Modal isOpen={isOpen} size={"md"} onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Place name
                </ModalHeader>
                <ModalBody>
                  {placeName.length !== 0 ? (
                    <Input
                      label="Place Name"
                      type="text"
                      onChange={(e) => {
                        setPlace(e.target.value);
                      }}
                      defaultValue={placeName}
                    />
                  ) : (
                    <Input
                      label="Place Name"
                      type="text"
                      onChange={(e) => {
                        setPlace(e.target.value);
                      }}
                    />
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      addPlaceName({ placeName: place });
                      onClose();
                    }}
                    className="font-bold"
                  >
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    );
  }
  // set main back image
  function AddMainbackImage() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const handleOpen = () => {
      onOpen();
    };

    const [fileUploading, setFileUploading] = useState(false);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [fileUploadErrorMessage, setFileUploadErrorMessage] = useState("");

    // file upload function
    const handleFileUplaod = async (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      // extract the file
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
          setMainBackImageUrl({ imageUrl: response.url });
        } else {
          setFileUploading(false);
          setFileUploadError(true);
          setFileUploadErrorMessage(response.message);
        }
      } catch (error) {
        setFileUploading(false);
        setFileUploadError(true);
        setFileUploadErrorMessage("Something went wrong.");
      }
    };
    return (
      <div>
        <div>
          <div>
            {mainBackImageUrl.length !== 0 ? (
              <div>
                <div
                  onClick={() => {
                    handleOpen();
                  }}
                  className="font-semibold underline underline-offset-2 text-green-600 flex items-center hover:cursor-pointer"
                >
                  Upload main back image <CheckCircle size={18} />
                </div>
              </div>
            ) : (
              <div
                onClick={() => {
                  handleOpen();
                }}
                className="font-semibold underline underline-offset-2 hover:cursor-pointer"
              >
                Upload main back image
              </div>
            )}
          </div>
        </div>
        <Modal isOpen={isOpen} size={"md"} onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Place name
                </ModalHeader>
                <ModalBody>
                  {mainBackImageUrl.length !== 0 ? (
                    <div>
                      <Input
                        label="Main back image"
                        type="file"
                        onChange={(e) => {
                          handleFileUplaod(e);
                        }}
                      />
                      {fileUploading && <Spinner className="mt-2" />}
                      {fileUploadError && <p>{fileUploadErrorMessage}</p>}
                      <div className="mt-4">
                        <p className="text-sm font-bold">Current image:</p>
                        <Image
                          src={mainBackImageUrl}
                          alt="main_back_image"
                          width={400}
                          height={600}
                          className="rounded"
                        />
                        <p className="mt-2 text-sm font-semibold text-zinc-600">
                          Upload a new file to change this image.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Input
                        label="Main back image"
                        type="file"
                        onChange={(e) => {
                          handleFileUplaod(e);
                        }}
                      />
                      {fileUploading && <Spinner className="mt-2" />}
                      {fileUploadError && <p>{fileUploadErrorMessage}</p>}
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      onClose();
                    }}
                    className="font-bold"
                  >
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    );
  }
  // ADD HERO BANNER CONTENT
  function AddHeroBannerContent() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const handleOpen = () => {
      onOpen();
    };

    const [fileUploading, setFileUploading] = useState(false);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [fileUploadErrorMessage, setFileUploadErrorMessage] = useState("");
    const [heading, setHeading] = useState("");
    const [briefParagraph, setBriefParagraph] = useState("");
    const [imageUrl, setImageUrl] = useState([]);

    // file upload function
    const handleFileUplaod = async (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      // extract the file
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
          setHeroBannerImages({ imageUrl: response.url });
        } else {
          setFileUploading(false);
          setFileUploadError(true);
          setFileUploadErrorMessage(response.message);
        }
      } catch (error) {
        setFileUploading(false);
        setFileUploadError(true);
        setFileUploadErrorMessage("Something went wrong.");
      }
    };
    return (
      <div>
        <div>
          <div>
            {heroBannerContent.briefParagraph.length !== 0 ? (
              <div>
                <div
                  onClick={() => {
                    handleOpen();
                  }}
                  className="font-semibold underline underline-offset-2 text-green-600 flex items-center hover:cursor-pointer"
                >
                  Add Hero banner content <CheckCircle size={18} />
                </div>
              </div>
            ) : (
              <div
                onClick={() => {
                  handleOpen();
                }}
                className="font-semibold underline underline-offset-2 hover:cursor-pointer"
              >
                Add hero banner content
              </div>
            )}
          </div>
        </div>
        <Modal isOpen={isOpen} size={"md"} onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Place name
                </ModalHeader>
                <ModalBody>
                  <Textarea
                    label="Heading"
                    onChange={(e) => {
                      setHeading(e.target.value);
                    }}
                  />
                  <Textarea
                    label="Brief Para"
                    onChange={(e) => {
                      setBriefParagraph(e.target.value);
                    }}
                  />
                  <Input
                    label="Upload banner images"
                    type="file"
                    onChange={(e) => {
                      handleFileUplaod(e);
                    }}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      setHeroBannerContent({ heading, briefParagraph });
                    }}
                    className="font-bold"
                  >
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    );
  }

  // main page return
  return (
    <div className="flex justify-between space-x-2 p-4">
      <div className="">
        <PlaceName />
        <AddMainbackImage />
        <AddHeroBannerContent />
      </div>
      <div>
        <div className="border p-4 shadow-md">
          {placeName.length !== 0 && <h2>{placeName}</h2>}
          {mainBackImageUrl.length !== 0 && (
            <div className="relative min-h-[70vh] flex items-center justify-center">
              {/* HERO NACKGROUND IMAGE AND HEADERS */}
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
              <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">{
                  heroBannerContent.heading.length !== 0 && (<p>{heroBannerContent.heading}</p>)
                  }</div>
                <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Discover amazing features and services that will transform
                  your experience. Join us today and start your journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="#"
                    className="bg-white text-black font-medium px-8 py-3 rounded-lg hover:bg-white/90 transition-colors"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="#"
                    className="bg-transparent border border-white text-white font-medium px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Learn More
                  </Link>
                  <div>
                    {
                      heroBannerImageurls.map((image, index) => (
                        <Image 
                        src={image[0]}
                        alt="dbv"
                        width={400}
                        height={400}
                        key={index}
                        />
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

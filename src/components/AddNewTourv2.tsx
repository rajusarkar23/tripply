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
  Spinner,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";

interface HeroBannerImageUrl {
  url: string;
}

export default function AddNewTourV2() {
  const {
    mainBackImageUrl,
    placeName,
    heroBannerContent,
    heroBannerImageurls,
  } = useAddNewTour();
  const [activeBannerImage, setActiveBannerImage] = useState("");
  console.log(activeBannerImage);

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
              className=" text-green-600 font-semibold flex items-center"
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
              className="hover:cursor-pointer font-semibold"
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
              className="hover:cursor-pointer text-green-600 font-semibold flex items-center"
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
              className="hover:cursor-pointer font-semibold"
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
              className="hover:cursor-pointer text-green-600 font-semibold flex items-center"
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
              className="hover:cursor-pointer font-semibold"
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

  return (
    <div className="flex justify-between">
      {/* FOR ADDING CONTENT */}
      <div className="p-5">
        <SetPlaceName />
        <SetMainBackgroundImage />
        <HeroBannerContent />
      </div>
      {/* FOR SHOWING CONTENT */}
      <div>
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
                    <Image
                      src={activeBannerImage}
                      alt="active_banner_image"
                      width={400}
                      height={400}
                      className="rounded"
                    />
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
        </div>

        <div className="w-48 mt-[-20px] z-50 absolute">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
          laborum ut minima eligendi dolor, ab magnam, voluptates at velit
          labore qui eveniet! Dignissimos laborum ipsa quia atque error aut
          tempora ea, dolore quod impedit quaerat sequi ex possimus officia
          fugit fugiat! Odit, aspernatur vitae quasi enim delectus autem quo
          labore? Tenetur impedit officiis ullam reprehenderit architecto? Vel
          odit magnam similique tempora ipsam qui, suscipit earum aperiam esse
          iste, cum reiciendis debitis eum ullam quibusdam quia hic assumenda
          aliquam dolor illo? Atque ducimus, quos facilis vitae nesciunt dolore
          blanditiis quia ullam temporibus. Doloremque temporibus id facilis sit
          suscipit et sunt itaque repudiandae eligendi, ipsa voluptates, vitae
          tenetur, aperiam illo porro? Delectus laborum sint recusandae incidunt
          illum deserunt sit, iusto expedita explicabo architecto beatae neque,
          ullam saepe odio magni temporibus corporis, nam doloribus est qui
          dolore maxime. Ab dolore sequi maiores blanditiis officiis cumque
          dolores nobis obcaecati. Eum rem eaque quos, accusamus quod ipsa
          laboriosam! Dolores rerum deserunt dolorem ratione accusamus! Eligendi
          provident nemo vel veniam. Ea laboriosam ipsum obcaecati sunt,
          reprehenderit eius porro fuga ducimus! Dolores porro consectetur ipsam
          accusamus animi natus maiores nobis sapiente unde nemo eius, aut sit
          rerum quidem fugit ad quae, voluptatibus dolorem minima non? Voluptate
          error atque veniam temporibus ab unde, illum quos fugiat, deleniti
          blanditiis assumenda inventore eius? Nihil nesciunt nobis ad quae
          libero ipsa architecto quo sed sint asperiores, velit soluta
          laudantium officia eum facilis vel veritatis eligendi ut commodi
          magnam eveniet! Eligendi libero corporis beatae omnis similique.
          Nostrum commodi doloremque ratione culpa, incidunt amet fugit autem
          earum similique repellendus odit explicabo voluptatem cupiditate aut
          laudantium quod dolorem quidem delectus, non quasi dignissimos
          excepturi ut. A quo aut nam quis, beatae sint libero laboriosam sequi
          repellendus qui rerum nulla quas magni laborum! Eos autem, obcaecati
          ea illo necessitatibus sit, illum incidunt optio doloribus possimus,
          praesentium cumque officia quibusdam! Numquam, culpa dignissimos,
          rerum vel veniam quia laborum cupiditate ad aperiam eveniet assumenda
          cum accusamus qui dolorum eligendi? Laboriosam deleniti aspernatur
          corrupti non tenetur quos reprehenderit molestias accusamus neque,
          modi minus amet numquam ratione quam beatae temporibus omnis, pariatur
          obcaecati fugiat explicabo voluptatum? Veritatis eveniet similique
          autem tempore fuga mollitia, deleniti iste temporibus nostrum
          molestias nihil, ullam dolor tempora expedita quaerat repellendus
          dignissimos eos, reprehenderit reiciendis distinctio earum neque
          tenetur explicabo! Ducimus sapiente ipsum doloribus voluptatem
          voluptas ipsa eos totam harum eius dicta, voluptatum quas repudiandae
          praesentium itaque facere impedit aliquid atque excepturi dolorem
          natus neque, consectetur quo obcaecati! Modi, ratione facere
          temporibus iusto exercitationem consequatur mollitia deserunt at
          eaque, et laudantium dolore sequi excepturi aliquam sit vero rerum
          vitae sed provident aperiam. Ipsam laborum quas explicabo odit, eos
          deserunt enim dolorum dolorem aliquam. Ipsum tempora velit iusto,
          architecto magni quasi quisquam voluptatibus animi fugit voluptatem
          aut amet sunt minima excepturi nihil magnam laboriosam hic aliquam! In
          porro facilis expedita laborum praesentium. Velit quos corporis
          quisquam reprehenderit neque molestiae ea, aperiam, possimus earum
          similique nihil consequatur illum est a, repellendus placeat atque
          iusto expedita assumenda dolores dolor quae eum at laudantium? Sed
          mollitia quis laudantium inventore.
        </div>
      </div>
    </div>
  );
}

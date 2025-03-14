"use client";

import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { ChangeEvent, useState } from "react";
import RichTextEditor from "./RichTextEditor";
import { useParams, useRouter } from "next/navigation";
import { Spinner } from "@heroui/spinner";
import { CircleCheckBig, LoaderCircle } from "lucide-react";
import useAdminTourStore from "@/store/tour-store/adminTourStore";

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

export default function AdmineditTour() {
    // replace this
  const [content, setContent] = useState("");
  // with this
  const [editedDescription, setEditedDescription] = useState("")
  // replace this
  const [standardPackageDescription, setStandarPackageDescription] =
    useState("");
  // with this
  const [editedStandarPackageDescription, setEditedPackageDescription] =
    useState("");
  // replace this
  const [premiumPackageDescription, setPremiumPackageDescription] =
    useState("");
  // with this
  const [editedPremiumpackageDescription, setEditedPremiumPackagesDescription] =
    useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // add tour states
  const [isAddError, setIsAddError] = useState(false);
  const [addErrorMessage, setAddErrorMessage] = useState("");

  // file states
  const [imageUrl, setImageUrl] = useState("");
  const [isUploadError, setIsUploadError] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isFileNotAvailable, setIsFileNotAvailable] = useState(false);

  const router = useRouter();

  const slug = useParams().tourSlug;
  //   console.log(slug);

  const adminEditTour: Tour[] = [];

  console.log(adminEditTour);

  const { tours } = useAdminTourStore() as { tours: Tour[] };

  for (const tour of tours) {
    if (tour.tourSlug === slug) {
      adminEditTour.push(tour);
    }
  }

  // slugify the tour name
  function slugify(str: string) {
    str = str.replace(/^\s+|\s+$/g, ""); // trim leading/trailing white space
    str = str.toLowerCase(); // convert string to lowercase
    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .replace(/-+/g, "-"); // remove consecutive hyphens
    return str;
  }
  const onsubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isUploaded) {
      setIsFileNotAvailable(true);
      return;
    }

    setError(false);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (typeof data.tourName !== "string") {
      return;
    }
    const slug = slugify(data.tourName);
    data.slug = slug;

    if (content.length < 20) {
      setError(true);
      setErrorMessage("The description is not siffiecient");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/tour", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
          content,
          imageUrl,
          standardPackageDescription,
          premiumPackageDescription,
        }),
      });

      const response = await res.json();

      if (response.success === true) {
        return router.push("/admin/tours");
      } else {
        setLoading(false);
        console.log(response);
        setIsAddError(true);
        setAddErrorMessage(response.message);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // file uplaod
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setIsUploading(true);
    setIsUploaded(false);
    setIsUploadError(false);
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
      const res = await fetch("/api/tour/upload-media", {
        method: "POST",
        body: formData,
      });

      const response = await res.json();

      if (response.success) {
        setImageUrl(response.url);
        setIsUploaded(true);
        setIsUploading(false);
      } else {
        setIsUploading(false);
        setIsUploadError(true);
        setUploadErrorMessage(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[90vh] space-y-3">
      <h2 className="text-3xl font-bold">Add a new tour</h2>

      <div className="w-full mx-auto max-w-md">
        {adminEditTour.map((editTour) => (
          <Form onSubmit={onsubmit} className="w-full" key={editTour.id}>
            <div className="w-full space-y-3">
              <div>
                <label
                  htmlFor="tourName"
                  className="font-semibold text-green-700"
                >
                  Tour name:
                </label>
                <Input
                  isRequired
                  errorMessage={({ validationDetails }) => {
                    if (validationDetails.valueMissing) {
                      return "Please enter tour name";
                    }
                  }}
                  label="Enter tour name"
                  name="tourName"
                  className="w-full"
                  defaultValue={editTour.tourName!}
                />
              </div>
              <div>
                <label
                  htmlFor="primaryImage"
                  className="font-semibold text-green-700"
                >
                  Upload a new primary image: if you want to change
                </label>
                <div>
                  {isUploading && (
                    <p className="font-semibold text-blue-600 flex text-sm">
                      Uploading....
                      <LoaderCircle className="animate-spin" size={20} />
                    </p>
                  )}
                  {isUploaded && (
                    <p className="font-semibold text-blue-600 flex text-sm  gap-1">
                      Uploaded <CircleCheckBig size={15} />
                    </p>
                  )}
                  {isUploadError && (
                    <p className="font-bold text-sm text-red-600">
                      {uploadErrorMessage}
                    </p>
                  )}
                  {isFileNotAvailable && (
                    <p className="text-sm font-bold text-red-600">
                      Please upload a image.
                    </p>
                  )}
                </div>
                <Input id="file" type="file" onChange={handleFileUpload} />
              </div>
              <div>
                <label
                  htmlFor="tourName"
                  className="font-semibold text-green-700"
                >
                  Overview:
                </label>
                <Input
                  isRequired
                  errorMessage={({ validationDetails }) => {
                    if (validationDetails.valueMissing) {
                      return "Please enter overview";
                    }
                  }}
                  label="Enter overview here"
                  name="overview"
                  className="w-full"
                  defaultValue={editTour.tourOverview!}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="standardPakage"
                  className="font-semibold text-green-700"
                >
                  Standard package:
                </label>
                <Input
                  isRequired
                  errorMessage={({ validationDetails }) => {
                    if (validationDetails.valueMissing) {
                      return "Please enter a package title";
                    }
                  }}
                  label="Please enter package title"
                  name="standardPackageTitle"
                  className="w-full"
                  defaultValue={editTour.tourCategory.standard.title!}
                />
                <Input
                  isRequired
                  errorMessage={({ validationDetails }) => {
                    if (validationDetails.valueMissing) {
                      return "Please enter a price";
                    }
                  }}
                  type="number"
                  label="Please enter price."
                  name="standardPackagePrice"
                  className="w-full"
                  defaultValue={editTour.tourCategory.standard.price!.toString()}
                />
                <Input
                  isRequired
                  errorMessage={({ validationDetails }) => {
                    if (validationDetails.valueMissing) {
                      return "Please enter a Total available slots";
                    }
                  }}
                  type="number"
                  label="Enter total available slots."
                  name="standardPackageSlots"
                  className="w-full"
                  defaultValue={editTour.tourCategory.standard.slotsAvailable!.toString()}
                />

                <div>
                  <div>
                    <label className="font-semibold">
                      Standar package description:
                    </label>
                    {error && (
                      <p className="text-sm text-red-500">{errorMessage}</p>
                    )}
                    <RichTextEditor
                      content={editTour.tourCategory.standard.description!}
                      setContent={setEditedPackageDescription}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="tourName"
                  className="font-semibold text-green-700"
                >
                  Premium package:
                </label>
                <Input
                  isRequired
                  errorMessage={({ validationDetails }) => {
                    if (validationDetails.valueMissing) {
                      return "Please enter a package title";
                    }
                  }}
                  label="Please enter package title"
                  name="premiumPackageTitle"
                  className="w-full"
                  defaultValue={editTour.tourName!}
                />
                <Input
                  isRequired
                  errorMessage={({ validationDetails }) => {
                    if (validationDetails.valueMissing) {
                      return "Please enter a price";
                    }
                  }}
                  type="number"
                  label="Please enter price."
                  name="premiumPackagePrice"
                  className="w-full"
                  defaultValue={editTour.tourCategory.premium.price!.toString()}
                />
                <Input
                  isRequired
                  errorMessage={({ validationDetails }) => {
                    if (validationDetails.valueMissing) {
                      return "Please enter a Total available slots";
                    }
                  }}
                  type="number"
                  label="Enter total available slots."
                  name="premiumPackageSlots"
                  className="w-full"
                  defaultValue={editTour.tourCategory.premium.slotsAvailable!.toString()}
                />

                <div>
                  <div>
                    <label className="font-semibold">
                      Premium package description:
                    </label>
                    {error && (
                      <p className="text-sm text-red-500">{errorMessage}</p>
                    )}
                    <RichTextEditor
                      content={editTour.tourCategory.premium.description!}
                      setContent={setEditedPremiumPackagesDescription}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-green-700">
                  Detailed description:
                </label>
                {error && (
                  <p className="text-sm text-red-500">{errorMessage}</p>
                )}
                <RichTextEditor content={editTour.tourDescription!} setContent={setEditedDescription} />
              </div>
              <div className="text-sm font-bold text-red-600">
                {isAddError && <p>{addErrorMessage}</p>}
              </div>
              <div className="flex justify-center">
                {loading ? (
                  <Button disabled className="w-full">
                    <Spinner color="current" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full font-bold bg-black text-white text-xl"
                  >
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </Form>
        ))}
      </div>
    </div>
  );
}

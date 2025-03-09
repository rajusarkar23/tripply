"use client";

import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useState } from "react";
import RichTextEditor from "./RichTextEditor";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/spinner";

export default function AddNewTour() {
  const [content, setContent] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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

    console.log(data);
    // return

    try {
      setLoading(true);

      const res = await fetch("/api/tour", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data, content }),
      });

      const response = await res.json();

      if (response.success === true) {
        return router.push("/admin/tours");
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[90vh] space-y-3">
      <h2 className="text-3xl font-bold">Add a new tour</h2>

      <div className="w-full mx-auto max-w-md">
        <Form onSubmit={onsubmit} className="w-full">
          <div className="w-full space-y-3">
            <div>
              <label htmlFor="tourName" className="font-semibold">
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
              />
            </div>
            <div>
              <label htmlFor="tourName" className="font-semibold">
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
              />
             
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
              />
             
            </div>

            <div>
              <label className="font-semibold">Detailed description:</label>
              {error && <p className="text-sm text-red-500">{errorMessage}</p>}
              <RichTextEditor content={content} setContent={setContent} />
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
      </div>
    </div>
  );
}

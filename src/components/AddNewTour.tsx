"use client";

import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useState } from "react";
import RichTextEditor from "./RichTextEditor";

export default function AddNewTour() {
  const [content, setContent] = useState("");
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // slugify the tour name
  function slugify(str: any) {
    str = str.replace(/^\s+|\s+$/g, ""); // trim leading/trailing white space
    str = str.toLowerCase(); // convert string to lowercase
    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .replace(/-+/g, "-"); // remove consecutive hyphens
    return str;
  }
  const onsubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setError(false)
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const slug = slugify(data.tourName);
    data.slug = slug;

    if (content.length < 20) {
      setError(true)
      setErrorMessage("The description is not siffiecient")
      return
    }

    await fetch("/api/tour", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data, content }),
    });
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

            <div>
              <label className="font-semibold">Detailed description:</label>
              {error && <p className="text-sm text-red-500">{errorMessage}</p>}
              <RichTextEditor content={content} setContent={setContent} />
            </div>

            <div className="flex justify-center">
              <Button type="submit" color="primary">
                Submit
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useState } from "react";

export default function AddNewTour() {
  //   const [errors, setError] = useState({});

  const onsubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    console.log(data);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[90vh] space-y-3">
      <h2 className="text-3xl font-bold">Add a new tour</h2>

      <div className="w-full mx-auto max-w-md">
        <Form onSubmit={onsubmit} className="w-full">
          <div className="w-full space-y-3">
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
            <Input 
            isRequired
            errorMessage= {({validationDetails}) => {
                if (validationDetails.valueMissing) {
                    return "Please provide slug"
                }
            }}
            label= "Provide a slug value"
            name="slug"
            className="w-full"
            />

            <Input 
            
            isRequired
            errorMessage={({validationDetails}) => {
                if (validationDetails.valueMissing) {
                    return "Please enter overview"
                }
            }}
            label= "Enter overview here"
            name="overview"
            className="w-full"
            />
            <Input 
            isRequired
            errorMessage = {({validationDetails}) => {
                if (validationDetails.valueMissing) {
                    return "Please enter something"
                }
            }}

            label= "Enter what to expect"
            name="whatToExpect"
            className="w-full"
            />

            <Input 
            isRequired

            errorMessage = {({validationDetails}) => {
                if (validationDetails.valueMissing) {
                    return "Plese enter one value atleast"
                }
            }}
            label="Enter activities"
            name="activities"
            className="w-full"
            />


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

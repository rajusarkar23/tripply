"use client";

import { useUserStore } from "@/store/user-store/userStore";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Input,
  InputOtp,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Profile {
  name: string;
  email: string;
}

interface Booking {
  tourName: string | null;
  tourImageUrl: string | null;
  startingDate: string | null;
  endingDate: string | null;
  paid: number | null;
}

function UpdateName({ name }: { name: string }) {
  const [isModalOpen, setIsModaOpen] = useState(false);
  const [nameUpdating, setNameUpdating] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { fetchUserDetails } = useUserStore() as {
    fetchUserDetails: () => void;
  };
  const [newName, setNewName] = useState("");
  const handleUpdate = async () => {
    setIsError(false);
    const validateName = newName.replace(/\s/g, "");
    if (validateName.length === 0) {
      setIsError(true);
      setErrorMessage("Enter a valid name");
      return;
    }
    try {
      setNameUpdating(true);
      const res = await fetch("/api/client/update/name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newName }),
      });
      const response = await res.json();

      if (response.success) {
        setNameUpdating(false);
        fetchUserDetails();
        setIsModaOpen(false);
      } else {
        setIsError(true);
        setErrorMessage(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          onPress={() => setIsModaOpen(!isModalOpen)}
          className="font-bold"
          size="sm"
        >
          Update name
        </Button>
      </div>
      <Modal
        isOpen={isModalOpen}
        size={"2xl"}
        onClose={() => setIsModaOpen(!isModalOpen)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update your name
              </ModalHeader>
              <ModalBody>
                <div>
                  <div className="mx-auto max-w-64">
                    <label className="font-bold text-blue-500">
                      Current name
                    </label>
                    <Input value={name} color="primary" />
                  </div>
                  <div className="mx-auto max-w-64">
                    <label className="font-semibold text-orange-500">
                      Enter your new name
                    </label>
                    <Input
                      color="warning"
                      label="Enter new name"
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-center">
                    {isError && (
                      <p className="text-red-500 font-semibold">
                        {errorMessage}
                      </p>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {nameUpdating ? (
                  <Button isDisabled>
                    <Spinner />
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    onPress={handleUpdate}
                    className="font-bold"
                  >
                    Update
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

function UpdateEmail({ email }: { email: string }) {
  const [isModalOpen, setIsModaOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { fetchUserDetails } = useUserStore() as {
    fetchUserDetails: () => void;
  };

  //email updating
  const [updatingEmail, setUpdatingEmail] = useState(false)

  const [newEmail, setNewEmail] = useState("");

  // email send states
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isEmailSend, setIsEmailSend] = useState(false);
  const [isEamailFieldDisabled, setIsEmailFieldDisabled] = useState(false)

  // otp state
  const [otpValue, setOtpValue] = useState("");

  // send api req to send email to the new email
  const handleEmailSend = async () => {
    setIsError(false);
    const validateEmail = newEmail.replace(/\s/g, "");
    if (validateEmail.length === 0) {
      setIsError(true);
      setErrorMessage("Enter a valid email");
      return;
    }
    try {
      setIsEmailSending(true);
      const res = await fetch("/api/client/update/validate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newEmail }),
      });
      const response = await res.json();
      console.log(response);

      if (response.success) {
        setIsEmailSending(false);
        setIsEmailSend(true);
        setIsEmailFieldDisabled(true)
      } else {
        setIsError(true);
        setIsEmailSending(false)
        setErrorMessage(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // send actual req to update the email
  const handleEmailUpdate = async () => {
    setIsError(false)
    setErrorMessage("")
    setUpdatingEmail(true)
    if (!isEmailSend) {
      setIsError(true)
      setErrorMessage("Please try again later")
      return
    }

    if (otpValue.length < 6) {
      setIsError(true)
      setErrorMessage("Please enter 6 digit otp.")
      return
    }

    try {
      const res = await fetch("/api/client/update/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({newEmail, otpValue})
      })

      const response = await res.json()

      if (response.success) {
        setIsModaOpen(false)
        setUpdatingEmail(false)
        setIsEmailFieldDisabled(false)
        setIsEmailSend(false)
        fetchUserDetails()
      } else{
        setUpdatingEmail(false)
        setIsError(true)
        setIsEmailFieldDisabled(false)
        setIsEmailSend(false)
        setErrorMessage(response.message)
      }
      
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          onPress={() => setIsModaOpen(!isModalOpen)}
          className="font-bold"
          size="sm"
        >
          Update Email
        </Button>
      </div>
      <Modal
        isOpen={isModalOpen}
        size={"2xl"}
        onClose={() => setIsModaOpen(!isModalOpen)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update your email
              </ModalHeader>
              <ModalBody>
                <div>
                  <div className="mx-auto max-w-64">
                    <label className="font-bold text-blue-500">
                      Current email
                    </label>
                    <Input value={email} color="primary" />
                  </div>
                  <div className="mx-auto max-w-64">
                    <label className="font-semibold text-orange-500">
                      Enter your new email
                    </label>
                    <Input
                      color="warning"
                      label="Enter new email"
                      type="email"
                      isDisabled={isEamailFieldDisabled}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />

                    {isEmailSend && (
                      <div className="mt-2">
                        <h3 className="text-xs text-center text-blue-600">
                          Enter the otp sent to your email
                        </h3>

                        <InputOtp
                          length={6}
                          value={otpValue}
                          onValueChange={setOtpValue}
                          color="primary"
                        />
                        <p className="font-semibold">
                          You entered:{" "}
                          <span className="text-blue-600">{otpValue}</span>
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center">
                    {isError && (
                      <p className="text-red-500 font-semibold">
                        {errorMessage}
                      </p>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {/* If email sending */}
                {isEmailSending && (
                  <Button isDisabled>
                    <Spinner />
                  </Button>
                )}
                {/* if email send */}
                {isEmailSend && (
                  <Button color="success" className="font-bold" onPress={handleEmailUpdate}>
                    {
                      updatingEmail ? (<p>Verifying...</p>):(<p>Verify OTP</p>)
                  }
                  </Button>
                )}
                {/* if no email send and email is not sending */}
                {!isEmailSend && !isEmailSending && (
                  <Button
                    onPress={handleEmailSend}
                    color="primary"
                    className="font-bold"
                  >
                    Update
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default function ShowTouristProfileData() {
  const { fetchUserDetails, profile } = useUserStore() as {
    fetchUserDetails: () => void;
    profile: Profile;
    isLoading: boolean;
    bookings: Booking[];
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[90vh]">
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3">
          <Image
            alt="heroui logo"
            height={40}
            radius="sm"
            src="https://pub-367a5b1b28f9415dae5b51f69d042dff.r2.dev/145857007_307ce493-b254-4b2d-8ba4-d12c080d6651.svg"
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md font-semibold">Your profie</p>
            <p className="text-small text-default-500">{profile.email}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p>
            Hey,{" "}
            <span className="font-semibold text-sm text-gray-600">
              {profile.name}
            </span>
          </p>
        </CardBody>
        <Divider />
        <CardFooter className="flex flex-col">
          <div className="space-x-1 flex">
            <UpdateName name={profile.name} />
            <UpdateEmail email={profile.email} />
            <Button size="sm" className="font-semibold">
              Update Password
            </Button>
          </div>
          <div className="mt-2">
            <Link
              href="/bookings"
              className="text-sm font-semibold text-blue-600 underline"
            >
              Looking for booking details?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

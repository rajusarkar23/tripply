"use client";
import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  ModalFooter,
  Spinner,
  InputOtp,
} from "@heroui/react";
import { useUserProfile } from "@/store/user-store/profle/profile";
import Image from "next/image";

export default function UserProfile() {
  const { fetchUserProfile } = useUserProfile();

  useEffect(() => {
    (async () => {
      await fetchUserProfile();
    })();
  }, []);

  // change profile name comp
  function ChangeName() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [newName, setNewName] = useState("");
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [nameUpdating, setNameUpdating] = useState(false);

    return (
      <>
        <div className="py-1">
          <p
            onClick={onOpen}
            className="font-bold text-xs text-blue-600 hover:cursor-pointer hover:underline underline-offset-4 transition-all"
          >
            Change Name
          </p>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 text-blue-600">
                    Change profile name
                  </ModalHeader>
                  <ModalBody>
                    <Input
                      value={useUserProfile.getState().name}
                      label="Present profile name"
                      labelPlacement="outside"
                    />

                    <Input
                      label="New name"
                      labelPlacement="outside"
                      onChange={(e) => {
                        setNewName(e.target.value);
                      }}
                    />

                    <div>
                      {isError && (
                        <p className="text-sm font-semibold text-red-600">
                          {errorMessage}
                        </p>
                      )}
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
                        onPress={async () => {
                          const validateName = newName.replace(/\s/g, "");
                          if (validateName.length === 0) {
                            setIsError(true);
                            setErrorMessage("New name should not be empty");
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
                              fetchUserProfile();
                            } else {
                              setIsError(true);
                              setErrorMessage(response.message);
                            }
                          } catch (error) {
                            console.log(error);
                            setIsError(true);
                            setErrorMessage("Unknow error, try again");
                          }
                        }}
                      >
                        Submit
                      </Button>
                    )}
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </>
    );
  }

  // change registered email
  function ChangeEmail() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [otpValue, setOtpValue] = useState("");

    const [isMailSent, setIsMailSent] = useState(false);
    const [mailSending, setMailSending] = useState(false);

    const [newEmail, setNewEmail] = useState("");
    const [updatingEmail, setUpdatingEmail] = useState(false);
    const [emailUpdateSuccess, setEmailUpdateSuccess] = useState(false);

    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    return (
      <>
        <div className="py-1">
          <p
            onClick={onOpen}
            className="font-bold text-xs text-blue-600 hover:cursor-pointer hover:underline underline-offset-4 transition-all"
          >
            Change Email
          </p>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 text-blue-600">
                    Change Email
                  </ModalHeader>
                  <ModalBody>
                    <Input
                      value={useUserProfile.getState().email}
                      label="Present Email"
                      labelPlacement="outside"
                    />
                    <Input
                      label="New Email"
                      labelPlacement="outside"
                      // type="email"
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <div>
                      {isMailSent && (
                        <div className="flex flex-col justify-center items-center">
                          <InputOtp
                            length={6}
                            value={otpValue}
                            onValueChange={setOtpValue}
                          />
                          <p className="text-green-600 font-semibold text-xs">
                            OTO sent successfully to the new email
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      {isError && (
                        <p className="text-sm text-red-600 font-semibold text-center">
                          {errorMessage}
                        </p>
                      )}

                      {emailUpdateSuccess && (
                        <p className="text-sm text-blue-600 font-semibold">
                          Mail updated successfully
                        </p>
                      )}
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    {isMailSent ? (
                      <Button
                        color="primary"
                        onPress={async () => {
                          setIsError(false);
                          try {
                            setUpdatingEmail(true);
                            const sendReq = await fetch(
                              "/api/client/update/email",
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ newEmail, otpValue }),
                              }
                            );
                            const res = await sendReq.json();
                            if (res.success) {
                              setEmailUpdateSuccess(true);
                              setUpdatingEmail(false);
                              await fetchUserProfile();
                            } else {
                              setEmailUpdateSuccess(false);
                              setIsError(true);
                              setErrorMessage(res.message);
                              setUpdatingEmail(false);
                            }
                          } catch (error) {
                            console.log(error);
                            setIsError(true);
                            setErrorMessage("Unknow error");
                            setUpdatingEmail(false);
                          }
                        }}
                      >
                        {updatingEmail ? (
                          <Spinner color="default" />
                        ) : (
                          <p>Submit OTP</p>
                        )}
                      </Button>
                    ) : (
                      <Button
                        color="primary"
                        isDisabled={mailSending}
                        onPress={async () => {
                          setIsError(false);
                          const validateEmail = newEmail.replace(/\s/g, "");
                          if (validateEmail.length === 0) {
                            setIsError(true);
                            setErrorMessage("Enter a valid email");
                            return;
                          }
                          try {
                            setMailSending(true);
                            const res = await fetch(
                              "/api/client/update/validate-email",
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ newEmail }),
                              }
                            );
                            const response = await res.json();
                            console.log(response);

                            if (response.success) {
                              setMailSending(false);
                              setIsMailSent(true);
                            } else {
                              setIsError(true);
                              setMailSending(false);
                              setErrorMessage(response.message);
                            }
                          } catch (error) {
                            console.log(error);
                          }
                        }}
                      >
                        {mailSending ? (
                          <Spinner color="default" />
                        ) : (
                          <p>Submit</p>
                        )}
                      </Button>
                    )}
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-[100vh] flex justify-center items-center">
      <div className="flex max-w-4xl mx-auto flex-col">
        <Tabs aria-label="Options" color="primary">
          <Tab key="account" title="Account" className="font-semibold">
            <Card className="w-[480px]">
              <CardBody>
                {/* show profile image */}
                <div className="flex items-center">
                  <Image
                    src={
                      "https://pub-367a5b1b28f9415dae5b51f69d042dff.r2.dev/145857007_307ce493-b254-4b2d-8ba4-d12c080d6651.svg"
                    }
                    alt="profile_image"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div className="space-x-2">
                    <Button
                      color="primary"
                      size="sm"
                      className="font-semibold"
                      radius="full"
                    >
                      Change picture
                    </Button>
                    <Button
                      color="danger"
                      variant="flat"
                      size="sm"
                      radius="full"
                    >
                      Delete picture
                    </Button>
                  </div>
                </div>
                {/* show name and email */}
                <div>
                  <Input
                    value={useUserProfile.getState().name}
                    radius="sm"
                    size="sm"
                    label="Profile name"
                    labelPlacement="outside"
                  />
                  {/* update name modal */}

                  <ChangeName />

                  <Input
                    value={useUserProfile.getState().email}
                    radius="sm"
                    size="sm"
                    label="Registered email"
                    labelPlacement="outside"
                  />

                  {/* update email modal */}

                  <ChangeEmail />
                </div>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="bookings" title="Bookings" className="font-semibold">
            <Card>
              <CardBody>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

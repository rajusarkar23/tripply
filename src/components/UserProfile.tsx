"use client";
import React from "react";
import { Tabs, Tab, Card, CardBody, Switch } from "@heroui/react";

export default function UserProfile() {
  return (
    <div className="min-h-[100vh] flex justify-center items-center">
      <div className="flex max-w-4xl mx-auto flex-col">
        <Tabs aria-label="Options" isVertical={true} color="primary">
          <Tab key="account" title="Account" className="font-semibold">
            <Card>
              <CardBody>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
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

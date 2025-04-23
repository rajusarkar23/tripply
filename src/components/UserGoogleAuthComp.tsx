"use client"
import { Button } from "@heroui/button";
import {Icon} from "@iconify/react"

export default function UserGoogleAuth() {
  return (
    <div className="w-full py-2">
      <Button variant="flat" className="w-full" color="default">
        <p className="font-semibold">Continue with Google</p>
        <Icon icon="logos:google-icon" className="text-lg"/>
      </Button>
    </div>
  );
}

"use client";

import { useEffect } from "react";

export default function TouristProfile() {
  useEffect(() => {
    const getUserAuthvalidation = async () => {
      try {
        const res = await fetch("/api/user-auth-validation");

        console.log(await res.json());
        
      } catch (error) {
        console.log(error);
        
      }
    };

    getUserAuthvalidation();
  }, []);
  return (
    <div>
        <h1>User</h1>
    </div>
  )
}

"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function ToursById() {
  const id = useParams().toursId;

  useEffect(() => {
    const getTourById = async () => {
      try {
        const res = await fetch(`/api/tour/by-id?id=${id}`);
        console.log(await res.json());
      } catch (error) {
        console.log(error);
      }
    };

    getTourById();
  }, []);

  return (
    <div>
      <h1>fvjhfvhb</h1>
    </div>
  );
}

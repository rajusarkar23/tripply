"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


interface Tours {
  id: number,
  tourName: string,
  tourOverview: string,
  tourImageUrl: string
}

export default function ToursById() {
  const id = useParams().toursId;


  const [tours, setTourse] = useState<Tours[]>([])

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

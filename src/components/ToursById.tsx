"use client"

import { useParams } from "next/navigation"
import { useEffect } from "react";

export default function ToursById(){
    const toursId = (useParams().toursId)
    console.log(typeof toursId);

    if (typeof toursId !== "string") {
        return
    }

    const params = new URLSearchParams({
        tourId: toursId
    })

    useEffect(() => {

        const getTourById = async () => {
            try {
                const res = await fetch(`/api/tour/by-id?${params.toString()}`, {
                    method: "GET"
                })

                console.log(await res.json());
                
            } catch (error) {
                console.log(error);
                
            }
        }

        getTourById()
    }, [])
    
    return(
        <div>
            <h1>fvjhfvhb</h1>
        </div>
    )
}
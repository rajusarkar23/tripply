import { create } from "zustand";
import { persist } from "zustand/middleware";

// banner content
interface HeroBanner {
    briefParagraph: string,
    heading: string
}

// tour data
interface fetchedTourData {
    placeName: string,
    mainBackImage: string,
    slug: string
    heroBannerContent: HeroBanner
}

// Tour final store data types
interface Tour {
    isLoading: boolean,
    fetchTour: () => Promise<void>
    fetchedTourDatas: fetchedTourData[]
}

const useTourStore = create(persist<Tour>((set) => ({
    isLoading: false,
    fetchedTourDatas: [],
    fetchTour:  async () => {
        set({isLoading: true})

        try {
            const sendReq = await fetch("/api/client/tourV2")
            const res = await sendReq.json()
            
            if (res.success) {
               set({isLoading: false, fetchedTourDatas: res.tours})
            }
        } catch (error) {
            console.log(error);
            
        }
    }
}), {name: "hero-tour-store-v2"}))

export {useTourStore}
import { create } from "zustand";
import { persist } from "zustand/middleware";

// tour interface
interface TourArr {
    imageUrl: string,
    placeName: string,
    pricing: {
        premium: number,
        standard: number
    }
}

// final interface
interface Tour {
    isTourFetched: boolean,
    isTourFetchError: boolean,
    tourFetchErrorMessage: string,

    tours: TourArr[],

    fetchTours: () => Promise<void>
}

const useTours = create(persist<Tour>((set) => ({
    isTourFetched: false,
    isTourFetchError: false,
    tourFetchErrorMessage: "",

    tours: [],

    fetchTours: async () => {
        try {
            const sendReq = await fetch("/api/admin-tours")
            const res = await sendReq.json()
            if (res.success) {
                set({isTourFetched: true,isTourFetchError: false, tourFetchErrorMessage: "", tours: res.tours})
            } else {
                set({isTourFetched: false,isTourFetchError: true, tourFetchErrorMessage: res.message, tours: []})
            }

        } catch (error) {
            console.log(error);
            set({isTourFetched: false,isTourFetchError: true, tourFetchErrorMessage: "Unknown error", tours: []})
            
        }
    }
}), {name: "admin-tours"}))

export {useTours}
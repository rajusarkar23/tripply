import { create } from "zustand";
import { persist } from "zustand/middleware";

// booking types
interface Booking {
    tourName: string,
    tourStartsOn: string,
    tourEndsOn: string,
    totalPerson: number,
    totalCost: number,
    paymentid: string,
    bookingCategory: string,
    emailUsed: string,
    bookingDate: string
}

interface Bookings {
    isBookingsFetched: boolean,
    isBookingDataFetchError: boolean,
    bookingDataFetchErrorMessage: string,

    bookings: Booking[],

    fetchBooking: () => Promise<void>
}

const useBookingStore = create(persist<Bookings>((set) => ({
isBookingsFetched: false,
isBookingDataFetchError: false,
bookingDataFetchErrorMessage: "",

bookings: [],

fetchBooking: async () => {
    try {
        set({isBookingDataFetchError: false, bookingDataFetchErrorMessage: ""})
        const sendReq = await fetch("/api/user/bookings")
        const res = await sendReq.json()
        if (res.success) {
            set({bookings: res.bookings, isBookingsFetched: true})
        } else {
            set({isBookingsFetched: false, isBookingDataFetchError: true, bookingDataFetchErrorMessage: res.message})
        }
    } catch (error) {
        console.log(error);
        set({isBookingsFetched: false, isBookingDataFetchError: true, bookingDataFetchErrorMessage: "Unknown error"})
    }
}
}), {name: "user-bookings"}))

export {useBookingStore}
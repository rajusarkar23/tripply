import { create } from "zustand";
import { persist } from "zustand/middleware";

// booking array interface
interface BookingArrayInterface {
    tourName: string,
    tourStartsOn: string,
    tourEndsOn: string,
    totalPerson: number,
    totalCost: number,
    paymentid: string,
    bookingCategory: string,
    emailUsed: string,
    bookingDate: string,
    index: number
}


// final interface
interface Booking {
    isSuccessFullBookingsFetched: boolean,
    successFullBookingsFetchError: boolean,
    successFullBookingsFetchErrorMessage: string

    isFailedBookingsFetched: boolean,
    failedBookingsFetcheError: boolean,
    failedBookingsFetcheErrorMessage: string,

    successFullBookings: BookingArrayInterface[],
    failedBookings: BookingArrayInterface[]

    fetchSuccessFullBookings: () => Promise<void>
    fetchFailedBookings: () => Promise<void> 
}

const useAdminStore = create(persist<Booking>((set) => ({
    isSuccessFullBookingsFetched: false,
    successFullBookingsFetchError: false,
    successFullBookingsFetchErrorMessage: "",

    isFailedBookingsFetched: false,
    failedBookingsFetcheError: false,
    failedBookingsFetcheErrorMessage: "",

    successFullBookings: [],
    failedBookings: [],

    fetchSuccessFullBookings: async () => {
        try {
            const sendReq = await fetch("/api/admin-bookings/success")
            const res = await sendReq.json()

            if (res.success) {
                const updatedSuccessFullBookings = res.bookings.map((booking: Booking[], index: number) => ({
                    ...booking,
                    index: index + 1
                }))
                set({isSuccessFullBookingsFetched: true, successFullBookingsFetchError: false, successFullBookingsFetchErrorMessage: "", successFullBookings: updatedSuccessFullBookings})
            } else {
                set({isSuccessFullBookingsFetched: false, successFullBookingsFetchError: true, successFullBookingsFetchErrorMessage: res.message, successFullBookings: []})
            }
        } catch (error) {
            console.log(error);
            set({isSuccessFullBookingsFetched: false, successFullBookingsFetchError: true, successFullBookingsFetchErrorMessage: "Unknown error, try again"})
        }
    },
    fetchFailedBookings: async () => {
        try {
            const sendReq = await fetch("/api/admin-bookings/failed")
            const res = await sendReq.json()

            if (res.success) {
                const updatedFailedBookings = res.bookings.map((booking: Booking[], index: number) => ({
                    ...booking,
                    index: index + 1
                }))
                set({isFailedBookingsFetched: true, failedBookingsFetcheError: false, failedBookingsFetcheErrorMessage: "", failedBookings: updatedFailedBookings})
            } else {
                set({isFailedBookingsFetched: false, failedBookingsFetcheError: true, failedBookingsFetcheErrorMessage: res.message, failedBookings: []})
            }
        } catch (error) {
            console.log(error);
            set({isFailedBookingsFetched: false, failedBookingsFetcheError: true, failedBookingsFetcheErrorMessage: "Unknown error, try again"})
        }
    }
}), {name: "failed-success-bookings-admin"}))

export {useAdminStore}
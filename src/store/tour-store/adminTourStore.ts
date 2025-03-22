import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Category {
  title: string | null;
  description: string | null;
  price: number | null;
  slotsAvailable: number | null;
  slotsBooked: number | null;
  totalSlots: number | null;
}

interface Tour {
  id: number | number;
  tourName: string | null;
  tourSlug: string | null;
  tourDescription: string | null;
  tourOverview: string | null;
  tourImageUrl: string | null;
  updatedAt: string | null;
  tourCategory: {
    premium: Category;
    standard: Category;
  };
}

interface Booking {
  id: number | null;
  bookingFor: string | null;
  bookingBy: string | null;
  bookingByPersonEmail: string | null;
  bookingCategory: string | null;
  bookingStartingDate: string | null;
  bookingEndingDate: string | null;
  totalPersonCount: string | null;
  bookingCost: number | null;
  isPaymentDone: boolean | null;
}

interface TourState {
  isLoading: boolean;
  isError: boolean;
  errosMessage: string | null;
  tours: Tour[];
  bookings: Booking[];
  fetchToursForAdmin: () => Promise<void>;
  fetchBookings: () => Promise<void>;
}

const useAdminTourStore = create(
  persist<TourState>(
    (set) => ({
      isLoading: false,
      isError: false,
      errosMessage: null,
      tours: [],
      bookings: [],
      fetchToursForAdmin: async () => {
        set({ isLoading: true, isError: false });

        try {
          const res = await fetch("/api/tour", {
            method: "GET",
          });
          const response = await res.json();

          if (response.success) {
            set({ isLoading: false, isError: false, tours: response.tours });
          } else {
            console.log(response);
            set({
              isLoading: false,
              isError: true,
              errosMessage: response.message,
              tours: [],
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
      fetchBookings: async () => {
        set({ isLoading: true, isError: false, errosMessage: null });
        try {
          const res = await fetch("/api/admin-bookings");
          const response = await res.json();
          if (response.success) {
            set({
              isLoading: false,
              isError: false,
              errosMessage: null,
              bookings: response.getBookings,
            });
          } else {
            set({
              isLoading: false,
              isError: true,
              errosMessage: response.message,
              bookings: [],
            });
          }
        } catch (error) {
          console.log(error);

          set({ isLoading: false, isError: true, bookings: [] });
        }
      },
    }),
    { name: "adminTourState" }
  )
);

export default useAdminTourStore;

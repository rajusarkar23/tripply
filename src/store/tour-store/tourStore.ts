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

interface Rating {
  ratingBy: string | null;
  rating: number | null;
  ratingTexts: string | null;
}

interface Tour {
  name: string | null;
  image: string | null;
  description: string | null;
  overview: string | null;
  slug: string | null;
  tourCategory: {
    standard: Category;
    premium: Category;
  };
  ratings: Rating;
}

interface TourState {
  isLoading: boolean;
  isError: boolean;
  errosMessage: string | null;
  tours: Tour[];
  fetchTour: () => Promise<void>;
}

const useTourStore = create(
  persist<TourState>(
    (set) => ({
      isLoading: false,
      isError: false,
      errosMessage: null,
      tours: [],
      fetchTour: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/client/tours");
          const response = await res.json();
          if (response.success) {
            set({ isLoading: false, tours: response.tours });
          } else {
            console.log(response);
          }
        } catch (error) {
          console.log(error);
          set({ isLoading: false });
        }
      },
    }),
    { name: "useTourStore" }
  )
);

export default useTourStore;

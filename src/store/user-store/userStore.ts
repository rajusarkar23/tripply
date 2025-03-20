import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Profile {
  name: string;
  email: string;
}

interface Booking {
  tourName: string | null;
  tourImageUrl: string | null;
  startingDate: string | null;
  endingDate: string | null;
  paid: number | null;
}

interface UserState {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  profile: Profile | [];
  bookings: Booking[];
  fetchUserDetails: () => Promise<void>;
}

const useUserStore = create(
  persist<UserState>(
    (set) => ({
      isLoading: false,
      isError: false,
      errorMessage: null,
      bookings: [],
      profile: [],
      fetchUserDetails: async () => {
        try {
          set({ isLoading: true, isError: false });
          const res = await fetch("/api/user-auth-validation");
          const response = await res.json();

          if (response.success) {
            set({
              isLoading: false,
              isError: false,
              profile: response.userProfile,
              bookings: response.bookingDetails,
            });
          } else {
            set({
              isLoading: false,
              isError: true,
              errorMessage: response.message,
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),
    { name: "userState" }
  )
);

export { useUserStore };

import { create } from "zustand";
import { persist } from "zustand/middleware";

// final store
interface Profile {
    isProfileDataFetched: boolean,
    isProfileDataFetchError: boolean,
    profileDataFetchErrorMessage: string,

    name: string,
    email: string,
    profileImageUrl: string,
    lastUpdated: string

    fetchUserProfile: () => Promise<void>
}

const useUserProfile = create(persist<Profile>((set) => ({
        isProfileDataFetched: false,
        isProfileDataFetchError: false,
        profileDataFetchErrorMessage: "",

        name: "",
        email: "",
        profileImageUrl: "",
        lastUpdated: "",

        fetchUserProfile: async () => {
            set({isProfileDataFetchError: false, profileDataFetchErrorMessage: ""})

            try {
                const sendReq = await fetch("/api/user/profile")
                const res = await sendReq.json()

                if (res.success) {
                    set({isProfileDataFetched:true, name: res.accountDetails.name, email: res.accountDetails.email, profileImageUrl: res.accountDetails.profileImageUrl, lastUpdated: res.accountDetails.lastUpdated})
                } else {
                    set({isProfileDataFetchError: true, profileDataFetchErrorMessage: res.message, isProfileDataFetched: false})
                }
            } catch (error) {
                console.log(error);
                set({isProfileDataFetchError: true, profileDataFetchErrorMessage: "Unknown error, try again", isProfileDataFetched: false})
            }
        }
}), {name: "user-profile"}))

export {useUserProfile}
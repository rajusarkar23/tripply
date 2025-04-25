import { create } from "zustand";
import { persist } from "zustand/middleware";

// hero banner content
interface HeroBannerContent {
  heading: string;
  briefParagraph: string;
}
// hero banner images
interface HeroBannerImageUrl {
  url: string;
}

// FINAL STORE DATA TYPES
interface AddNewtour {
  placeName: string;
  mainBackImageUrl: string;
  heroBannerContent: HeroBannerContent;
  heroBannerImageurls: HeroBannerImageUrl[];
  setPlaceName: ({ placeName }: { placeName: string }) => Promise<void>;
  setMainBackImageUrl: ({ imageUrl }: { imageUrl: string }) => Promise<void>;
  setHeroBannerContent: ({
    heading,
    briefParagraph,
  }: {
    heading: string;
    briefParagraph: string;
  }) => Promise<void>;
  setHeroBannerImages: ({ imageUrl }: { imageUrl: any }) => void;
}

const useAddNewTour = create(
  persist<AddNewtour>(
    (set) => ({
      placeName: "",
      mainBackImageUrl: "",
      heroBannerContent: {
        heading: "",
        briefParagraph: "",
      },
      heroBannerImageurls: [],
      setPlaceName: async ({ placeName }) => {
        set({ placeName: placeName });
      },
      setMainBackImageUrl: async ({ imageUrl }) => {
        set({ mainBackImageUrl: imageUrl });
      },
      setHeroBannerContent: async ({ heading, briefParagraph }) => {
        set(() => ({
          heroBannerContent: {
            heading: heading,
            briefParagraph: briefParagraph,
          },
        }));
      },
      setHeroBannerImages: ({ imageUrl }) => {
        set((state) => ({
          heroBannerImageurls: [
            ...state.heroBannerImageurls.concat(imageUrl)
          ],
        }));
      },
    }),
    { name: "add-new-tour" }
  )
);

export { useAddNewTour };

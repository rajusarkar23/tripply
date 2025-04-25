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
// things to do arr type
interface ThingsToDoArr {
  heading: string,
  subHeading: string,
  briefParagraph: string,
  rating: number
  imageUrl: string,
}

// FINAL STORE DATA TYPES
interface AddNewtour {
  placeName: string;
  mainBackImageUrl: string;
  heroBannerContent: HeroBannerContent;
  heroBannerImageurls: HeroBannerImageUrl[];
  thingsTodoArr: ThingsToDoArr[]
  setPlaceName: ({ placeName }: { placeName: string }) => Promise<void>;
  setMainBackImageUrl: ({ imageUrl }: { imageUrl: string }) => Promise<void>;
  setHeroBannerContent: ({
    heading,
    briefParagraph,
  }: {
    heading: string;
    briefParagraph: string;
  }) => Promise<void>;
  setHeroBannerImages: ({ imageUrl }: { imageUrl: HeroBannerImageUrl[] }) => void;
  setThingsTodo: ({tta}: {tta: ThingsToDoArr[]}) => void
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
      thingsTodoArr: [],
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
        set({heroBannerImageurls: imageUrl})
      },
      setThingsTodo: ({tta}) => {
        set((state) => ({
          thingsTodoArr: [...state.thingsTodoArr, ...tta]
        }))
      }
    }),
    { name: "add-new-tour" }
  )
);

export { useAddNewTour };

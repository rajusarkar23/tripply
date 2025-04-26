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

// best time to visit
type VisitTimings = {
  best: {
    start: string,
    end: string
  },
  good: {
    start: string,
    end: string
  },
  notRecomended: {
    start: string,
    end: string
  }
}


// FINAL STORE DATA TYPES
interface AddNewtour {
  placeName: string;
  mainBackImageUrl: string;
  heroBannerContent: HeroBannerContent;
  heroBannerImageurls: HeroBannerImageUrl[];
  thingsTodoArr: ThingsToDoArr[]
  visitTimings: VisitTimings
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
  setVisitTimings : ({bestStart, bestEnd, goodStart, goodEnd, notRecomendedStart, notRecomendedEnd}: {bestStart:string, bestEnd:string, goodStart:string, goodEnd:string, notRecomendedStart:string, notRecomendedEnd:string}) => void
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
      visitTimings: {
        best: {
          end: "",
          start: ""
        },
        good: {
          end: "",
          start: ""
        },
        notRecomended: {
          end: "",
          start: ""
        }
      },
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
      },
      setVisitTimings: ({bestEnd,bestStart, goodEnd, goodStart, notRecomendedEnd, notRecomendedStart}) => {
        set({visitTimings: {
          best: {
            end: bestEnd,
            start: bestStart
          },
          good: {
            end: goodEnd,
            start: goodStart
          },
          notRecomended: {
            end: notRecomendedEnd,
            start: notRecomendedStart
          }
        }})
      }
    }),
    { name: "add-new-tour" }
  )
);

export { useAddNewTour };

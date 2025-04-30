import { create } from "zustand";
import { persist } from "zustand/middleware";

// hero banner images
interface HeroBannerImageUrl {
  url: string | string;
}

// things to do
interface ThingsToDo {
  rating: number;
  heading: string;
  imageUrl: string;
  subHeading: string;
  briefParagraph: string;
}

// hero banner content
interface HeroBannerContent {
  heading: string;
  briefParagraph: string;
  heroBannerImageUrls: HeroBannerImageUrl[];
}

interface VisitTimings {
  best: {
    start: string;
    end: string;
  };
  good: {
    start: string;
    end: string;
  };
  notRecomended: {
    start: string;
    end: string;
  };
}
// tour state
interface TourStates {
  placeName: string;
  mainBackImage: string;
  pricing: number,
  slug: string ;
  heroBannerContent: HeroBannerContent;
  thingsToDoArr: ThingsToDo[];
  visitTimings: VisitTimings;
}
// final tour state

interface Tour {
  isLoading: boolean
  tour: TourStates | undefined;
  fetchTour: ({ slug }: { slug: string }) => Promise<void>;
}

const useTourStoreV2 = create(
  persist<Tour>(
    (set) => ({
      isLoading:false,
      tour: {
        placeName: "",
        mainBackImage: "",
        slug: "",
        heroBannerContent: {
          heading: "",
          briefParagraph: "",
          heroBannerImageUrls: [],
        },
        pricing:0,
        thingsToDoArr: [],
        visitTimings: {
          best: {
            end: "",
            start: "",
          },
          good: {
            end: "",
            start: "",
          },
          notRecomended: {
            end: "",
            start: "",
          },
        },
      },
      fetchTour: async ({ slug }) => {
        set({isLoading: true})
        try {
          const sendReq = await fetch(`/api/tour/fetch-tourv2?slug=${slug}`);
          const res = await sendReq.json();

          if (res.success) {
            set({tour:res.tour[0], isLoading: false})
          } else {
            set({tour: undefined})
          }
        } catch (error) {
            console.log(error);
            set({tour: undefined})
        }
      },
    }),
    { name: "tour-store-V2" }
  )
);

export {useTourStoreV2}
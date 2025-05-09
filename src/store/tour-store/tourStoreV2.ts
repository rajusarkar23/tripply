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

// pricing
interface Pricing {
  standard: number,
  premium: number
}
// tour state
interface TourStates {
  id: number,
  placeName: string;
  mainBackImage: string;
  tourPricing: Pricing,
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
        id: 0,
        placeName: "",
        mainBackImage: "",
        slug: "",
        heroBannerContent: {
          heading: "",
          briefParagraph: "",
          heroBannerImageUrls: [],
        },
        tourPricing:{
          premium: 0,
          standard: 0
        },
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
import { useRouter } from "next/navigation";
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

interface Pricing {
  standard: number,
  premium: number
}


// FINAL STORE DATA TYPES
interface AddNewtour {
  isLoading: boolean,
  tourAddingError: boolean,
  tourAddingErrorMessage: string | undefined,
  placeName: string;
  mainBackImageUrl: string;
  heroBannerContent: HeroBannerContent;
  heroBannerImageurls: HeroBannerImageUrl[];
  thingsTodoArr: ThingsToDoArr[]
  visitTimings: VisitTimings,
  pricing: Pricing,
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
  addTourInDB: ({heroBannerContentHeadAndPara, heroBannerImageurls, thingsTodo, VisitTiming, mainBackImageUrl, placeName, router, pricing}: {heroBannerContentHeadAndPara: HeroBannerContent, heroBannerImageurls: HeroBannerImageUrl[], thingsTodo:ThingsToDoArr[], VisitTiming: VisitTimings, mainBackImageUrl: string, placeName: string,pricing: Pricing, router: ReturnType<typeof useRouter>}) => Promise<void>
  setPricing: ({standardPrice, premiumPrice}: {standardPrice: number, premiumPrice: number}) => void,
  reset: () => void
}

const useAddNewTour = create(
  persist<AddNewtour>(
    (set) => ({
      isLoading: false,
      tourAddingError: false,
      tourAddingErrorMessage: undefined,
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
      pricing: {
        premium: 0,
        standard: 0
      },
      reset: () => {
        set({heroBannerContent: {briefParagraph: "",heading: ""}, heroBannerImageurls: [], mainBackImageUrl: "", placeName: "",pricing: {premium: 0, standard: 0}, thingsTodoArr: [], visitTimings: {best: {end: "", start: ""}, good: {end: "", start: ""},notRecomended: {end: "", start: ""}},})
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
      },
      addTourInDB: async ({VisitTiming, heroBannerContentHeadAndPara, heroBannerImageurls, thingsTodo, mainBackImageUrl, placeName, router, pricing}) => {
        set({isLoading: true,tourAddingError: false, tourAddingErrorMessage: undefined})
        try {
          const sendReq = await fetch ("/api/tour/create-tour-v2", {
            method: "POST",
            headers: {
              "Content-Type": "application/sjon"
            },
            body: JSON.stringify({VisitTiming, heroBannerImageurls, heroBannerContentHeadAndPara, thingsTodo, mainBackImageUrl, placeName, pricing})
          })

          
          const res = await sendReq.json()
          
          if (res.success) {
            set ({isLoading: false})
            router.push("/admin/tours")
          } else{
            set({isLoading: false, tourAddingError: true, tourAddingErrorMessage: res.message})
          }
        } catch (error) {
          console.log(error);
          set({isLoading: false, tourAddingError: true, tourAddingErrorMessage: "Something went wrong"})
        }
      },
      setPricing: ({premiumPrice, standardPrice}) => {
        set({pricing: {
          premium: premiumPrice,
          standard: standardPrice
        }})
      }
    }),
    { name: "add-new-tour" }
  )
);

export { useAddNewTour };

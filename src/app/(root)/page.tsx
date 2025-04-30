import CTASection from "@/components/CTASection";
import DestinationV2 from "@/components/DestinationV2";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import InfiniteReviewCarousel from "@/components/InfiniteScrollReviews";

export default function Home() {
  return (
    <div>
      <Hero />
      <DestinationV2 />
      <CTASection />
      <Features />
      <InfiniteReviewCarousel />
    </div>
  );
}

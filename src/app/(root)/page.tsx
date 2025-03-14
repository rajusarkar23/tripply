import CTASection from "@/components/CTASection";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import InfiniteReviewCarousel from "@/components/InfiniteScrollReviews";
import PopularDestination from "@/components/PopularDestination";

export default function Home() {
  return (
    <div>
      <Hero />
      <PopularDestination />
      <CTASection />
      <Features />
      <InfiniteReviewCarousel />
      <Footer />
    </div>
  );
}

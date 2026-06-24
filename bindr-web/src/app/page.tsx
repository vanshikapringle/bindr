import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import Statistics from "@/components/Statistics";
import FeaturedBooks from "@/components/FeaturedBooks";
import Testimonials from "@/components/Testimonials";
import ReadingJourney from "@/components/ReadingJourney";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-accent selection:text-white">
      <Navbar />
      <main className="flex-1 w-full flex flex-col items-center">
        <HeroSection />
        <HowItWorks />
        <Statistics />
        <FeaturedBooks />
        <Testimonials />
        <ReadingJourney />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

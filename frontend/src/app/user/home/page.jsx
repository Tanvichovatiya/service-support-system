
import { homeSliderData } from "@/assets/homeSliderData";
import FeaturesSection from "@/components/FeatureSection";
import HeroSection from "@/components/HeroSection";
import HeroSlider from "@/components/HeroSlide";
import HowItWorksSection from "@/components/HowItWorkSection";
import CategoryList from "@/components/user/CategoryList";


export default function Page() {
  return (
    <main>
      <HeroSlider slides={homeSliderData}
        autoPlay={true}
        interval={5000} />

      <FeaturesSection />


      <CategoryList />

      <HowItWorksSection />


    </main>
  );
}
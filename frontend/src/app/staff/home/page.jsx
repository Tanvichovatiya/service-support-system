
import { homeSliderData } from "@/assets/homeSliderData";
import FeaturesSection from "@/components/FeatureSection";
import HeroSection from "@/components/HeroSection";
import HeroSlider from "@/components/HeroSlide";
import HowItWorksSection from "@/components/HowItWorkSection";
import Slider from "@/components/slider";
import img1 from "@/assets/slider4.png"
import img2 from "@/assets/slider5.png"
import img3 from "@/assets/slider6.png"


export default function Page() {
  
  const heroSlides = [
    {
      image: img2,
      title: "Raise Service Requests",
      description:
        "Submit your service requests quickly, describe your issue clearly, and get the support you need without the hassle.",
    },
    {
      image: img1,
      title: "Stay Connected With Support",
      description:
        "Communicate with support staff in real time, receive updates, and keep track of every conversation in one place.",
    },
    {
      image: img3,
      title: "Track Your Requests",
      description:
        "Follow your request status from submission to completion and stay informed with timely notifications and updates.",
    },
  ];
  return (
    <main>
      <Slider items={heroSlides}/>

      <FeaturesSection />

      <HowItWorksSection />
      
    </main>
  );
}
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpRight,
} from "react-icons/fi";
import {motion} from "motion/react"
import { fadeLeft, fadeUp } from "./ui/Animation";

export default function HeroSlider({
  slides = [],
  autoPlay = true,
  interval = 5000,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = slides.length;

  useEffect(() => {
    if (!autoPlay || totalSlides <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, totalSlides]);

  if (!slides.length) {
    return null;
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const previousSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + totalSlides) % totalSlides
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;

          return (
            <div
              key={slide.id || index}
              className={`
                ${
                  isActive
                    ? "relative opacity-100"
                    : "absolute inset-0 pointer-events-none opacity-0"
                }
                transition-opacity duration-700 ease-in-out
              `}
            >
              <motion.div variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: false,
              amount: 0.2
            }} 
                className="
                  grid
                  grid-cols-1
                  lg:grid-cols-2
                  items-center
                  gap-8
                  lg:gap-12
                  min-h-[500px]
                  lg:min-h-[560px] rounded-admin
                  px-5
                  sm:px-8
                  lg:px-10
                  py-10
                  lg:py-12
                  bg-brand/90
                "
              >
            
                <div className="order-2 lg:order-1 max-w-2xl">
                  {slide.badge && (
                    <span
                      className="
                        inline-flex
                        items-center
                        rounded-full
                        border
                        border-brand/20
                        bg-brand-soft
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        text-brand
                        mb-5
                      "
                    >
                      {slide.badge}
                    </span>
                  )}

                  <h3
                    className="
                      font-admin
                      text-2xl
                      font-bold
                      leading-[1.01]
                      tracking-tight
                      text-text
                    "
                  >
                    {slide.title}
                  </h3>

                  {slide.description && (
                    <p
                      className="
                        mt-6
                        max-w-xl
                        text-base
                        sm:text-lg
                        lg:text-xl
                        leading-8
                        text-text/70
                      "
                    >
                      {slide.description}
                    </p>
                  )}

                  {slide.buttonText && slide.buttonHref && (
                    <div className="mt-8">
                      <a
                        href={slide.buttonHref}
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-xl
                          bg-background-soft
                          px-6
                          py-3.5
                          text-sm
                          font-semibold
                          text-brand
                          shadow-sm
                          transition-all
                          duration-200
                          hover:bg-accent
                          hover:-translate-y-0.5
                        "
                      >
                        {slide.buttonText}

                        <FiArrowUpRight size={18} />
                      </a>
                    </div>
                  )}
                </div>

              
                <div className="order-1 lg:order-2">
                  <div
                    className="
                      relative
                      w-full
                      overflow-hidden
                      rounded-3xl
                      bg-brand-soft
                    "
                  >
                    <div className="relative aspect-[16/10] w-full">
                      <Image
                        src={slide.image}
                        alt={slide.imageAlt || slide.title}
                        fill
                        priority={index === 0}
                        className="
                          object-cover
                          transition-transform
                          duration-700
                          hover:scale-[1.02]
                        "
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

     
      {totalSlides > 1 && (
        <div
          className="
            absolute
            bottom-6
            right-5
            sm:right-8
            lg:right-10
            flex
            items-center
            gap-2
          "
        >
          <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous slide"
            className="
              flex
              h-11 cursor-pointer
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-border
              bg-white/90
              text-text
              shadow-sm
              transition
              hover:bg-brand
              hover:text-white
            "
          >
            <FiArrowLeft size={18} />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="
              flex
              h-11
              w-11 cursor-pointer
              items-center
              justify-center
              rounded-full
              border
              border-border
              bg-white/90
              text-text
              shadow-sm
              transition
              hover:bg-brand
              hover:text-white
            "
          >
            <FiArrowRight size={18} />
          </button>
        </div>
      )}

      {/* ==============================
          DOTS
      =============================== */}
      {totalSlides > 1 && (
        <div
          className="
            absolute
            bottom-8
            left-1/2
            -translate-x-1/2
            flex
            items-center
            gap-2
          "
        >
          {slides.map((slide, index) => (
            <button
              key={slide.id || index}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`
                h-2
                rounded-full
                transition-all
                duration-300
                ${
                  currentSlide === index
                    ? "w-8 bg-brand"
                    : "w-2 bg-text/25 hover:bg-text/50"
                }
              `}
            />
          ))}
        </div>
      )}
    </section>
  );
}
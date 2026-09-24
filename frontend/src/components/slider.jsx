
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import {motion} from "motion/react"
import { fadeLeft } from "./ui/Animation";

export default function Slider({ items = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === items.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length, isPaused]);

  if (!items.length) return null;

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? items.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === items.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <motion.div variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: false,
              amount: 0.2
            }}
      className="group relative mx-auto mb-9 w-full max-w-7xl overflow-hidden rounded-admin-lg shadow-admin"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="relative h-[370px] min-w-full md:h-[450px]"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={1200}
              height={500}
              className="h-full w-full object-cover"
              priority={index === 0}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-brand/90 via-brand-dark/65 to-transparent" />

            <div className="absolute inset-y-0 left-0 z-10 flex max-w-xl items-center px-8 md:px-14">
              <div>
                <span className="mb-3 inline-block rounded-full bg-accent-light/20 px-3 py-1 text-sm font-medium text-accent-light backdrop-blur-sm">
                  Service Support
                </span>

                <h3 className="text-2xl font-bold leading-tight text-white md:text-4xl">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="mt-5 max-w-md text-sm leading-7 text-brand-soft md:text-base">
                    {item.description}
                  </p>
                )}

                <div className="mt-7">
                  <Button
                    // onClick={() => router.push("/profile")}
                    className="flex cursor-pointer items-center gap-2 rounded-admin bg-brand px-6 py-3 font-semibold text-brand-soft shadow-admin-sm transition-all duration-300 hover:bg-brand-deep hover:shadow-admin"
                  >
                    <span>Get Started</span>
                    <FaArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <>
          <Button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-brand/70 p-0 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-brand-deep group-hover:opacity-100 md:left-5"
          >
            <FaChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-brand/70 p-0 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-brand-deep group-hover:opacity-100 md:right-5"
          >
            <FaChevronRight className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "w-7 bg-accent-light"
                    : "w-2 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}

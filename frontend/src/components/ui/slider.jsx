"use client";

import { useState } from "react";
import Image from "next/image";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Button } from "./Button";
import { useRouter } from "next/navigation";

export default function Slider({ items = [] }) {

  const [currentIndex, setCurrentIndex] = useState(0);

  const router = useRouter()

  if (!items.length) return null;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="group relative mb-9 mx-auto w-full max-w-6xl overflow-hidden rounded-xl md:h-full">
      
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={index} className="relative h-[370px] min-w-full md:h-[450px]">
            <Image
              src={item.image}
              alt={item.title}
              width={1200}
              height={500}
              className="h-full w-full object-cover"
              priority={index === 0}
            />

           
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

          
            <div className="absolute top-1/2 left-8 z-10 max-w-lg -translate-y-1/2 text-white md:left-14">
              <h3 className="text-[20px] md:text-4xl font-bold leading-tight text-violet-200">
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-5 max-w-md text-base leading-7 text-gray-200 md:text-lg">
                  {item.description}
                </p>
              )}
              <div className="mt-7 flex items-center gap-4">
                <Button className="flex items-center gap-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-300 hover:from-purple-500 px-6 py-3 text-white  cursor-pointer" onClick={()=>router.push('/profile')}>
                  <span>Get Started</span>
                  <FaArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      
      <Button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute top-1/2 left-3 z-10 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white hover:bg-black"
      >
        <FaChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute top-1/2 right-3 z-10 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white hover:bg-black"
      >
        <FaChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}

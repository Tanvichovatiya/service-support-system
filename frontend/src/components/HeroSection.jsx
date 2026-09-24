
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiShield,
} from "react-icons/fi";
import { motion } from "motion/react";

import hero from "@/assets/hero.png";
import { fadeLeft, fadeRight, fadeUp } from "./ui/Animation";

export default function HeroSection() {
  return (
    <motion.section className="relative overflow-hidden rounded-admin bg-accent-dark shadow-admin-hover">

      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-brand-soft/70 blur-[1px]"
      />

      <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-brand-soft/70 blur-[1px]" />

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">

        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">

          <motion.div variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: false,
              amount: 0.2
            }} className="relative z-10 max-w-xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-brand shadow-admin-sm">
              <span className="h-2 w-2 rounded-full bg-success" />
              Fast · Reliable · Real-Time
            </div>

            <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-brand-soft sm:text-5xl lg:text-[52px]">
              Real-Time Service &{" "}
              <span className="text-brand">Support Management</span> System
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-brand sm:text-[18px]">
              Get your service requests resolved quickly and efficiently. Our
              platform connects you with the right support team in real-time,
              ensuring better communication and faster solutions.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/request/create"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-admin-sm transition duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-admin"
              >
                Create Service Request
                <FiArrowRight size={16} />
              </Link>

              <Link
                href="/requests"
                className="inline-flex items-center justify-center rounded-xl border border-brand bg-surface px-5 py-3 text-sm font-semibold text-brand transition duration-200 hover:bg-brand-soft"
              >
                Track Your Request
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-sm text-brand-soft">
                <FiCheckCircle className="text-brand" size={18} />
                Quick Resolution
              </div>

              <div className="flex items-center gap-2 text-sm text-brand-soft">
                <FiClock className="text-brand" size={18} />
                Real-Time Updates
              </div>

              <div className="flex items-center gap-2 text-sm text-brand-soft">
                <FiShield className="text-brand" size={18} />
                Secure Platform
              </div>
            </div>
          </motion.div>


          <motion.div variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: false,
              amount: 0.2
            }} className="relative flex items-center justify-center lg:justify-end">
            <div className="absolute h-[75%] w-[75%] rounded-full bg-brand-soft/60 blur-2xl" />

            <div className="relative w-full max-w-[680px]">
              <Image
                src={hero}
                alt="Service support management"
                width={1024}
                height={682}
                priority
                className="relative h-auto w-full rounded-admin object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

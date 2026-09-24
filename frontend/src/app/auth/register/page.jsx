
"use client";

import { useRouter } from "next/navigation";
import {
  FaHeadphones,
  FaUserPlus,
} from "react-icons/fa6";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { motion } from "motion/react";
import { fadeRight } from "@/components/ui/Animation";
import Image from "next/image";
import logo from "@/assets/logo.png"
export default function RegisterPage() {


  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_20px_60px_rgba(74,47,32,0.10)]">

        <motion.section variants={fadeRight} initial="hidden" whileInView="visible" viewport={{
          once: false,
          amount: 0.2
        }} className="relative hidden w-[42%] overflow-hidden bg-brand-deep lg:flex lg:flex-col lg:justify-between">

          <div className="absolute -right-24 top-20 h-72 w-72 rounded-full border-[32px] border-brand/5" />

          <div className="absolute -right-16 top-28 h-56 w-56 rounded-full border-[20px] border-brand/5" />

          <div className="relative z-10 px-10 pt-10">
            <div className="flex items-center">

              <Image
                src={logo}
                alt="Service Support logo"
                width={40}
                height={40}
                className=" w-22 h-14"
                priority
              />

              <div>
                <p className="text-sm font-semibold text-white">
                  Service Support
                </p>

                <p className="text-xs text-white/50">
                  Management System
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 px-10">
            <div className="max-w-md">
              <div className="mb-6 h-1 w-12 rounded-full bg-accent" />

              <h1 className="font-serif text-4xl font-bold leading-tight text-text-primary xl:text-5xl">
                Create account
                <br />
                <span className="text-brand">
                  & get started
                </span>
              </h1>

              <p className="mt-6 max-w-sm text-base leading-7 text-text-secondary">
                Join us today and enjoy a seamless support
                experience built around you.
              </p>
            </div>
          </div>

          <div className="relative mt-10 h-[270px] overflow-hidden">
            <div className="absolute bottom-[-120px] left-[-70px] h-80 w-80 rounded-full bg-brand/10" />

            <div className="absolute bottom-[-100px] left-20 h-64 w-64 rounded-full bg-accent/10" />

            <div className="absolute bottom-8 left-10 right-10 rounded-2xl border border-brand/10 bg-white/70 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand text-white">
                  <FaUserPlus size={21} />
                </div>

                <div>
                  <p className="font-semibold text-text-primary">
                    Your journey starts here
                  </p>

                  <p className="mt-1 text-sm text-text-secondary">
                    Create your account in just a few steps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="flex w-full flex-col justify-center bg-white px-5 py-8 sm:px-10 lg:w-[58%] lg:px-14 xl:px-20 xl:py-12">

          <div className="mb-8 flex items-center lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
              <FaHeadphones size={18} />
            </div>

            <p className="ml-3 font-serif text-xl font-bold text-text-primary">
              Service<span className="text-accent">Hub</span>
            </p>
          </div>

          <div className="mb-7">
            <p className="mb-2 text-sm font-medium tracking-wide text-brand">
              WELCOME TO SERVICEHUB
            </p>

            <h2 className="font-serif text-3xl font-bold text-text-primary sm:text-4xl">
              Create your account
            </h2>

            <p className="mt-2 text-sm text-text-secondary">
              Fill in your details to get started.
            </p>
          </div>

          <RegisterForm />
        </section>
      </div>
    </main>
  );
}
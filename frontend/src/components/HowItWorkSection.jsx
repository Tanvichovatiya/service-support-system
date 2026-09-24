"use client";

import {
  FiArrowRight,
  FiCheck,
  FiFileText,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";
import { motion } from "motion/react";
import { fadeLeft } from "./ui/Animation";

const steps = [
  {
    number: "1",
    icon: FiUserPlus,
    title: "Create Account",
    description: "Sign up and log in to your account securely.",
  },
  {
    number: "2",
    icon: FiFileText,
    title: "Submit Request",
    description: "Describe your issue and add relevant details or files.",
  },
  {
    number: "3",
    icon: FiUsers,
    title: "Get Assigned",
    description: "Our team will assign your request to the right support staff.",
  },
  {
    number: "4",
    icon: FiCheck,
    title: "Track & Resolve",
    description: "Receive real-time updates until your issue is resolved.",
  },
];

export default function HowItWorksSection() {
  return (
    <motion.section variants={fadeLeft}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: false,
        amount: 0.2
      }} className="mt-8 rounded-admin bg-brand-deep shadow-admin">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            How It Works
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Simple Steps to Get Support
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/75">
            Our process is designed to be fast, transparent, and easy to
            follow.
          </p>
        </div>


        <div className="mt-12 grid gap-10 md:grid-cols-4 md:gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="relative text-center"
              >

                {index < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+45px)] right-[calc(-50%+45px)] top-7 hidden items-center md:flex">
                    <div className="h-px flex-1 bg-white/25" />
                    <FiArrowRight size={14} className="mx-2 shrink-0 text-white/60" />
                  </div>
                )}

                <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full border-4 border-brand-deep bg-brand text-white shadow-admin-sm">
                  <Icon size={21} />
                </div>
                
                <span className="absolute left-1/2 top-[-7px] z-20 flex h-5 min-w-5 -translate-x-1/2 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white shadow-sm">
                  {step.number}
                </span>


                <h3 className="mt-4 text-sm font-semibold text-white">
                  {step.title}
                </h3>

                <p className="mx-auto mt-1.5 max-w-[190px] text-xs leading-5 text-white/70">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
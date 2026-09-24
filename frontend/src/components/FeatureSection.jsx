
"use client";

import {
  FiBarChart2,
  FiCheckCircle,
  FiMessageCircle,
  FiPlusCircle,
  FiShield,
  FiZap,
} from "react-icons/fi";
import {motion} from "motion/react"
import { fadeRight } from "./ui/Animation";

const features = [
  {
    icon: FiPlusCircle,
    title: "Easy Request Creation",
    description:
      "Create service requests in just a few clicks.",
  },
  {
    icon: FiZap,
    title: "Real-Time Updates",
    description:
      "Track your request status live, anytime, anywhere.",
  },
  {
    icon: FiMessageCircle,
    title: "Better Communication",
    description:
      "Stay connected with support staff and get updates.",
  },
  {
    icon: FiShield,
    title: "Secure & Reliable",
    description:
      "Your data and privacy are always protected.",
  },
  {
    icon: FiBarChart2,
    title: "Performance Reports",
    description:
      "Track progress and measure success.",
  },
  {
    icon: FiCheckCircle,
    title: "Dedicated Support",
    description:
      "Our team is always ready to help you.",
  },
];

export default function FeaturesSection() {
  return (
    <motion.section variants={fadeRight}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: false,
        amount: 0.2
      }} className="border-y border-border-light bg-brand-light rounded-admin mt-9">
      <div
        className="
          mx-auto
          max-w-7xl
          px-5
          py-10
          sm:px-8
          lg:px-10
        "
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="
                  group
                  rounded-xl
                  border
                  border-border-light
                  bg-surface-soft
                  p-4
                  transition
                  duration-200
                  hover:-translate-y-1
                  hover:border-brand-muted
                  hover:bg-white
                  hover:shadow-admin-sm
                "
              >
                {/* Icon */}
                <div
                  className="
                    mb-3
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    bg-brand-soft
                    text-brand
                    transition
                    group-hover:bg-brand
                    group-hover:text-white
                  "
                >
                  <Icon size={19} />
                </div>

                {/* Title */}
                <h3
                  className="
                    text-sm
                    font-semibold
                    leading-5
                    text-text-primary
                  "
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="
                    mt-1.5
                    text-[11px]
                    leading-4
                    text-text-muted
                  "
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
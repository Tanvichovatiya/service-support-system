
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiFileText,
} from "react-icons/fi";

import requestHero from "@/assets/hero.png";
import { fadeLeft, fadeRight, fadeUp } from "@/components/ui/Animation"

const RequestHeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-brand-dark rounded-admin">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-brand-light/10 blur-3xl" />

      <div className="relative  mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-6">
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative z-10 max-w-xl "
          >
            <motion.div
              variants={fadeUp}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent-light" />
              Service Request Management
            </motion.div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Manage Your
              <span className="block text-accent-light">
                Service Requests
              </span>
              With Ease
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-white/75 sm:text-base">
              Create, track, and manage your service requests from one place.
              Stay updated on request progress and communicate with your
              support team effortlessly.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/user/requests/create"
                className="cursor-pointer inline-flex h-11 items-center justify-center gap-2 rounded-admin bg-white px-5 text-sm font-semibold text-brand shadow-admin-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-soft hover:shadow-admin"
              >
                Create Request
                <FiArrowRight size={16} />
              </Link>

              <Link
                href="/user/requests/my"
                className="cursor-pointer inline-flex h-11 items-center justify-center gap-2 rounded-admin border border-white/20 bg-white/5 px-5 text-sm font-medium text-white transition-all duration-200 hover:bg-white/10"
              >
                View Requests
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <FiCheckCircle className="text-accent-light" size={16} />
                Easy tracking
              </div>

              <div className="flex items-center gap-2 text-sm text-white/70">
                <FiClock className="text-accent-light" size={16} />
                Real-time updates
              </div>

              <div className="flex items-center gap-2 text-sm text-white/70">
                <FiFileText className="text-accent-light" size={16} />
                Request history
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative flex min-h-[300px] items-center justify-center sm:min-h-[380px] lg:min-h-[440px] rounded-admin"
          >
            <div className="absolute right-4 top-1/2 h-64 w-64 -translate-y-1/2 rounded-admin bg-accent-light/10 blur-3xl sm:h-80 sm:w-80" />

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 w-full max-w-xl rounded-admin"
            >
              <Image
                src={requestHero}
                alt="Service request management"
                width={900}
                height={600}
                priority
                className="h-auto w-full object-contain" 
              />
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="absolute bottom-5 left-4 z-20 hidden rounded-admin border border-white/10 bg-white/10 px-4 py-3 shadow-admin backdrop-blur-md sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success-light text-success">
                  <FiCheckCircle size={18} />
                </div>

                <div>
                  <p className="text-xs font-medium text-white/60">
                    Request Status
                  </p>
                  <p className="text-sm font-semibold text-white">
                    Progress Tracking
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-px w-full bg-white/10" />
    </section>
  );
};

export default RequestHeroSection;
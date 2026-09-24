


"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiCheckCircle,
  FiMessageCircle,
  FiShield,
} from "react-icons/fi";

import aboutImage from "@/assets/about.png";
import missionImage from "@/assets/mission.png";
import { motion } from "motion/react"
import { fadeLeft, fadeRight } from "./ui/Animation";

const AboutSection = () => {
  return (
    <section className="bg-background mt-10">

      <div className="mx-auto max-w-7xl px-4 py-5 bg-brand-light rounded-admin">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ">

          <div className="relative">
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-brand-soft" />

            <motion.div variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: false,
                amount: 0.2
              }} className="relative overflow-hidden rounded-admin-xl border border-border bg-surface shadow-admin-lg">
              <Image
                src={aboutImage}
                alt="Service support team"
                className="h-auto w-full object-cover"
                priority
              />
            </motion.div>

            <motion.div variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: false,
                amount: 0.2
              }} className="absolute -bottom-5 -right-5 flex items-center gap-3 rounded-admin-lg border border-border bg-surface px-4 py-3 shadow-admin-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-light text-success">
                <FiCheckCircle size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-text-primary">
                  Reliable Support
                </p>
                <p className="text-xs text-text-muted">
                  Support when you need it
                </p>
              </div>
            </motion.div>
          </div>


          <motion.div variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: false,
              amount: 0.2
            }}>
            <span className="inline-flex items-center rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand">
              About Us
            </span>

            <h2 className="mt-4 text-3xl font-bold leading-tight text-text-primary sm:text-4xl">
              Making service support
              <span className="text-brand"> simple and reliable.</span>
            </h2>

            <p className="mt-5 text-base leading-7 text-white/90">
              Our Service Support System provides a simple way for users to
              submit service requests, communicate with support staff, and
              keep track of their requests from one place.
            </p>



            <div className="mt-7 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <FiCheckCircle size={16} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    Clear communication
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-text-secondary">
                    Keep conversations and service-related communication
                    organized in one place.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <FiShield size={16} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    Organized requests
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-text-secondary">
                    Every request can be tracked with its current status,
                    priority, and support information.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-admin bg-brand px-5 py-3 text-sm font-semibold text-white shadow-admin-sm transition duration-200 hover:bg-brand-dark hover:shadow-admin"
            >
              Contact Support
              <FiArrowRight size={16} />
            </Link>
          </motion.div>

        </div>
      </div>

      <div className="border-y border-border-light bg-background-soft mt-10 rounded-admin">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

            <motion.div variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: false,
                amount: 0.2
              }} className="order-2 lg:order-1">
              <span className="inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-dark">
                Our Mission
              </span>

              <h2 className="mt-4 text-3xl font-bold leading-tight text-text-primary sm:text-4xl">
                Better support starts with
                <span className="text-brand"> better communication.</span>
              </h2>

              <p className="mt-5 text-base leading-7 text-text-secondary">
                Our goal is to create a support experience where users know
                where their requests stand and support teams have the
                information they need to respond effectively.
              </p>

              <p className="mt-4 text-base leading-7 text-text-secondary">
                We believe a support system should feel clear, accessible,
                and dependable. From creating a request to communicating with
                support staff and receiving updates, the experience should
                remain simple for everyone involved.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-admin-lg border border-border bg-background-soft p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand">
                    <FiMessageCircle size={19} />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-text-primary">
                    Connected Support
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Keep users and support teams connected throughout the
                    request lifecycle.
                  </p>
                </div>

                <div className="rounded-admin-lg border border-border bg-background-soft p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-light text-success">
                    <FiShield size={19} />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-text-primary">
                    Trusted Experience
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Keep service information organized and accessible when it
                    is needed.
                  </p>
                </div>
              </div>
            </motion.div>


            <motion.div variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: false,
                amount: 0.2
              }} className="order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-admin-xl border border-border bg-background-soft p-3 shadow-admin-lg">
                <div className="overflow-hidden rounded-admin-lg">
                  <Image
                    src={missionImage}
                    alt="Support team communication"
                    className="h-auto w-full object-cover"
                  />
                </div>

                <div className="absolute bottom-7 left-7 rounded-admin-lg border border-border bg-surface/95 px-5 py-4 shadow-admin backdrop-blur-sm">
                  <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                    Our Purpose
                  </p>

                  <p className="mt-1 text-sm font-semibold text-text-primary">
                    Simple. Clear. Connected.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default AboutSection;

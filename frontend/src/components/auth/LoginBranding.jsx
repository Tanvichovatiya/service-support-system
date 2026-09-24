"use client";

import { FiShield } from "react-icons/fi";
import { motion } from "motion/react";
import Image from "next/image";
import { fadeRight } from "../ui/Animation";
import logo from "@/assets/logo.png";

const LoginBranding = () => {
  return (
    <motion.section
      variants={fadeRight}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: false,
        amount: 0.2,
      }}
      className="relative hidden overflow-hidden bg-brand-deep lg:flex"
    >
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/30" />

      <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-accent/15" />

      <div className="relative flex min-h-[680px] w-full flex-col justify-between p-12">

        {/* Logo */}
        <div className="flex items-center ">
          {/* <div className="flex   items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20"> */}
            <Image
              src={logo}
              alt="Service Support logo"
              width={40}
              height={40}
              className=" w-22 h-14"
              priority
            />
          {/* </div> */}

          <div>
            <p className="text-sm font-semibold text-white">
              Service Support
            </p>

            <p className="text-xs text-white/50">
              Management System
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-md">

          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light/15 ring-1 ring-brand-light/30">
            <FiShield className="h-8 w-8 text-brand-light" />
          </div>

          <h1 className="text-4xl font-bold leading-tight text-white">
            Manage support.
            <br />

            <span className="text-brand-light">
              Serve better.
            </span>
          </h1>

          <p className="mt-6 max-w-sm text-base leading-7 text-white/65">
            A centralized platform to manage service requests,
            support users, assign staff, and deliver exceptional
            service.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70">
              Service Requests
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70">
              Staff Management
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70">
              Real-time Support
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 pt-6">
          <p className="text-xs text-white/40">
            Secure & reliable service support management
          </p>
        </div>

      </div>
    </motion.section>
  );
};

export default LoginBranding;
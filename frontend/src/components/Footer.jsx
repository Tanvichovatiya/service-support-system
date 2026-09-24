
"use client";

import Link from "next/link";
import {
  FiArrowRight,
  FiFacebook,
  FiGithub,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import logo from "@/assets/logo.png"
import Image from "next/image";
import {motion} from "motion/react"
import { fadeLeft } from "./ui/Animation";

export default function Footer({ role = "user" }) {
  const isStaff = role === "staff";

  const quickLinks = isStaff
    ? [
      { label: "Dashboard", href: "/staff/dashboard" },
      { label: "Requests", href: "/staff/requests/all" },
      { label: "Profile", href: "/staff/profile" },
      {label:"About",href:"/staff/about"},
      {label:"ContactUs",href:"/staff/contactus"}
    ]
    : [
      { label: "Home", href: "/" },
      { label: "My Requests", href: "/requests" },
      { label: "Create Request", href: "/request/create" },
        {label:"About",href:"/user/about"},
      {label:"ContactUs",href:"/user/contactus"}
    ];

  const supportLinks = isStaff
    ? [
      { label: "Assigned Requests", href: "/staff/requests" },
      { label: "Help Center", href: "/help" },
      { label: "Contact Support", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
    ]
    : [
      { label: "Track Request", href: "/requests" },
      { label: "Help Center", href: "/help" },
      { label: "Contact Support", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
    ];

  return (
    <motion.footer variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: false,
              amount: 0.2
            }} className="bg-brand text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-10 py-12 sm:py-14 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-12">
          {/* Brand */}
          <div className="max-w-sm">

            <Link
              href={logo}
              className="flex shrink-0 items-center"
            >
              <div className="flex h-16 w-24 items-center justify-center">
                <Image
                  src={logo}
                  alt="Service Support"
                  width={140}
                  height={70}
                  className="h-18 w-33 object-contain"
                  priority
                />
              </div>
            </Link>

            <p className="mt-5 text-sm leading-6 text-sidebar-muted">
              A simple and reliable platform to create, manage, track, and
              resolve service requests with real-time support.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-2">
              <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-sidebar-muted transition hover:bg-white/15 hover:text-white">
                <FiFacebook size={16} />
              </a>

              <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-sidebar-muted transition hover:bg-white/15 hover:text-white">
                <FiInstagram size={16} />
              </a>

              <a href="#" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-sidebar-muted transition hover:bg-white/15 hover:text-white">
                <FiLinkedin size={16} />
              </a>

              <a href="#" aria-label="GitHub" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-sidebar-muted transition hover:bg-white/15 hover:text-white">
                <FiGithub size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white">Quick Links</h3>

            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-sidebar-muted transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white">Support</h3>

            <ul className="mt-5 space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-sidebar-muted transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white">Get In Touch</h3>

            <div className="mt-5 space-y-4">
              {/* Email */}
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-accent-light">
                  <FiMail size={15} />
                </div>

                <div>
                  <p className="text-xs text-sidebar-muted">Email</p>

                  <a href="mailto:support@servicesupport.com" className="mt-0.5 block text-sm text-white transition hover:text-accent-light">
                    support@servicesupport.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-accent-light">
                  <FiPhone size={15} />
                </div>

                <div>
                  <p className="text-xs text-sidebar-muted">Phone</p>

                  <a href="tel:+919999999999" className="mt-0.5 block text-sm text-white transition hover:text-accent-light">
                    +91 99999 99999
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-accent-light">
                  <FiMapPin size={15} />
                </div>

                <div>
                  <p className="text-xs text-sidebar-muted">Location</p>

                  <p className="mt-0.5 text-sm text-white">Gujarat, India</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            {!isStaff && (
              <Link href="/request/create" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-brand transition hover:bg-accent-soft">
                Create Request
                <FiArrowRight size={15} />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <p className="text-xs text-sidebar-muted">
            © {new Date().getFullYear()} ServiceSupport. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link href="/terms" className="text-xs text-sidebar-muted transition hover:text-white">
              Terms
            </Link>

            <Link href="/privacy" className="text-xs text-sidebar-muted transition hover:text-white">
              Privacy
            </Link>

            <span className="text-xs text-sidebar-muted">
              Built for better support
            </span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

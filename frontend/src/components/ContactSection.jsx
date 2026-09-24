
"use client";

import Image from "next/image";
import { motion } from "motion/react";

import { MdEmail } from "react-icons/md";
import { FiArrowRight, FiClock, FiMessageCircle, FiShield } from "react-icons/fi";

import hero from "@/assets/hero.png";
import { fadeLeft, fadeRight } from "./ui/Animation";
import { InputField } from "./ui/InputField";
import TextArea from "./ui/TextArea";
import { Button } from "./ui/Button";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa";

const ContactSection = () => {
  return (
    <section className="bg-background ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
       
        <motion.div
          className="relative overflow-hidden rounded-admin-xl bg-brand-dark shadow-admin-lg"
        >
          
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-brand-light/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-accent-light/20 blur-3xl" />

          <div className="relative grid items-center gap-10 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-14 lg:py-16">
           
            <motion.div variants={fadeLeft}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                      once: false,
                      amount: 0.2
                    }} className="relative z-10 text-center lg:text-left">
              
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-accent-light" />
                Contact Our Team
              </div>

            
              <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Need Help With Your
                <span className="block text-accent-light">
                  Service Request?
                </span>
              </h2>

            
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base lg:text-lg">
                Have a question, need assistance, or want to learn more about
                our service support platform? Our team is ready to help you
                with quick and reliable support.
              </p>

              <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full border-0 bg-white text-brand shadow-admin-sm hover:bg-brand-soft sm:w-auto"
                >
                  Contact Now
                  <FiArrowRight className="ml-2" size={16} />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-white/30 bg-white/5 text-white hover:border-white hover:bg-white/10 hover:text-white sm:w-auto"
                >
                  Learn More
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 lg:justify-start">
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <FiClock className="text-accent-light" size={15} />
                  Quick Response
                </div>

                <div className="flex items-center gap-2 text-xs text-white/70">
                  <FiMessageCircle className="text-accent-light" size={15} />
                  Real-Time Support
                </div>

                <div className="flex items-center gap-2 text-xs text-white/70">
                  <FiShield className="text-accent-light" size={15} />
                  Secure Communication
                </div>
              </div>
            </motion.div>

           
            <motion.div variants={fadeRight}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                      once: false,
                      amount: 0.2
                    }} className="relative flex justify-center lg:justify-end">
              <div className="absolute h-64 w-64 rounded-full bg-accent-light/10 blur-3xl" />

              <div className="relative w-full max-w-md overflow-hidden rounded-admin-xl border border-white/15 bg-white/10 p-2 shadow-admin-lg backdrop-blur-md">
                <div className="relative h-[260px] overflow-hidden rounded-admin-lg sm:h-[320px]">
                  <Image
                    src={hero}
                    alt="Contact our support team"
                    fill
                    priority
                    className="object-cover transition duration-700 hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-brand/10" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="mt-8">
          
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="mx-auto mb-8 max-w-2xl text-center"
          >
            <span className="inline-flex items-center rounded-full border border-border bg-brand-soft px-3.5 py-1.5 text-xs font-semibold text-brand">
              Get In Touch
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              We’re Here to Help
            </h2>

            <p className="mt-3 text-sm leading-6 text-text-secondary sm:text-base">
              Send us a message and our support team will get back to you as
              soon as possible.
            </p>
          </motion.div>

          
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
           
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="rounded-admin-xl border-2 border-brand-dark bg-surface p-6 shadow-admin-lg sm:p-8"
            >
              <div>
                <h3 className="text-xl font-bold text-text-primary">
                  Contact Information
                </h3>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Choose any of the options below to reach our team.
                </p>
              </div>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-admin bg-brand-soft text-brand">
                    <FaLocationDot size={17} />
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">
                      Office Address
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-text-secondary">
                      123 Innovation Way
                      <br />
                      Tech District, India 10001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-admin bg-accent-soft text-brand">
                    <MdEmail size={19} />
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">
                      Email Address
                    </h4>

                    <p className="mt-1 text-sm text-text-secondary">
                      hello@google.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-admin bg-success-light text-success">
                    <FaPhone size={15} />
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">
                      Phone Number
                    </h4>

                    <p className="mt-1 text-sm text-text-secondary">
                      +91 98765 43210
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Card */}
              <div className="mt-8 rounded-admin-lg border border-border-light bg-background-soft p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
                    <FiClock size={16} />
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">
                      Support Hours
                    </h4>

                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                      Monday – Friday
                      <br />
                      9:00 AM – 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

           
            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="rounded-admin-xl border-2 border-brand-dark bg-surface p-6 shadow-admin-lg sm:p-8"
            >
              <div className="mb-7">
                <h3 className="text-xl font-bold text-text-primary">
                  Send Us a Message
                </h3>

                <p className="mt-2 text-sm text-text-secondary">
                  Fill out the form below and we’ll get back to you shortly.
                </p>
              </div>

              <form className="space-y-4">
                <InputField
                  label="Name"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  required
                />

                <InputField
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />

                <InputField
                  label="Subject"
                  id="subject"
                  name="subject"
                  placeholder="How can we help?"
                  required
                />

                <TextArea
                  label="Message"
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Write your message..."
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="mt-2 w-full"
                >
                  Send Message
                  <FiArrowRight className="ml-2" size={16} />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>

       
        <motion.div
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="mt-8 overflow-hidden rounded-admin-xl border-2 border-brand-dark bg-surface shadow-admin-lg"
        >
          <div className="border-b border-border bg-surface px-6 py-5 sm:px-8">
            <h3 className="text-lg font-bold text-text-primary">
              Find Our Office
            </h3>

            <p className="mt-1 text-sm text-text-secondary">
              Visit us or use the map below to find our location.
            </p>
          </div>

          <div className="h-[350px] sm:h-[420px]">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117711.92805346087!2d70.7388941!3d22.3038945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959ca0c9f4b8d49%3A0x7d55a4b0d4f7f5ef!2sRajkot%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
              className="h-full w-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;


"use client";

import PasswordForm from "@/components/auth/PasswordForm";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";

import { fadeUp } from "@/components/ui/Animation";
import { setPasswordApi } from "@/axiosApi/authApi";

export default function SetupPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const handleSubmit = async (password) => {
    if (!token) {
      throw new Error("Invalid or missing setup link.");
    }

    try {
      await setPasswordApi({
        token,
        password,
      });
      
        router.push("/auth/login");
    } catch (error) {
      console.log("err:", error)

    }


  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-r from-accent via-white to-accent-light px-4 py-8">
      <div className="w-full max-w-md">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: false,
            amount: 0.2,
          }}
          className="rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-8"
        >
          <div className="mb-7">
            <h1 className="text-xl font-semibold text-text-primary">
              Set your password
            </h1>

            <p className="mt-1.5 text-sm leading-6 text-text-muted">
              Create a secure password to activate your
              staff account.
            </p>
          </div>

          <PasswordForm
            onSubmit={handleSubmit}
            buttonText="Set Password"
            loadingText="Setting password..."
          />
        </motion.div>
      </div>
    </main>
  );
}


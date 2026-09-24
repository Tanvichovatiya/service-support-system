
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { FiArrowLeft, FiArrowRight, FiHeadphones, FiMail } from "react-icons/fi";

import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { fadeUp } from "@/components/ui/Animation";
import { forgotPasswordApi } from "@/axiosApi/authApi";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  const validateEmail = () => {
    const value = email.trim().toLowerCase();

    if (!value) {
      setError("Email is required.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setSuccess("");

    if (!validateEmail()) {
      return;
    }

    try {
      setLoading(true);

      await forgotPasswordApi({
        email: email.trim().toLowerCase(),
      });

      setSuccess(
        "If an account exists with this email, a password reset link has been sent."
      );
    } catch (error) {
      const responseData = error?.response?.data;

      setError(
        responseData?.message ||
          error?.message ||
          "Unable to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-r from-accent via-white to-accent-light px-4 py-8 ">
      <div className="w-full max-w-md">
      

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="rounded-admin-lg border border-border border-[1.8px] border-brand bg-surface p-6 shadow-admin sm:p-8"
        >
          {/* Header */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              Forgot your password?
            </h1>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Enter your registered email address and we&apos;ll send you a
              link to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Error */}
            {error && (
              <div className="rounded-admin-sm border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger-dark">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="rounded-admin-sm border border-success/20 bg-success-light px-4 py-3 text-sm text-success-dark">
                {success}
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-3.5 top-[38px] z-10 h-5 w-5 text-text-muted" />

              <InputField
                label="Email address"
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleChange}
                error={error && !success ? error : ""}
                required
                disabled={loading || !!success}
                autoComplete="email"
                className="[&_input]:pl-11"
              />
            </div>

            {/* Submit */}
            {!success && (
              <Button
                type="submit"
                loading={loading}
                loadingText="Sending link..."
                variant="primary"
                size="xl"
                className="group w-full cursor-pointer"
              >
                <span>Send Reset Link</span>

                <FiArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            )}
          </form>

          <div className="mt-7 border-t border-border pt-6">
            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="mx-auto flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-dark cursor-pointer"
            >
              <FiArrowLeft className="h-4 w-4" />
              Back to sign in
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

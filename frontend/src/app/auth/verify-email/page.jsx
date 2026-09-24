
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  FaEnvelope,
  FaArrowRight,
  FaRotateRight,
} from "react-icons/fa6";

import { VerifyEmail} from "@/axiosApi/authApi";

import {
  setLoading,
  setError,
  clearErrors,
  setVerificationEmail,
} from "@/redux/slice/authSlice";

const VerifyEmailPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    loading,
    error,
    verificationEmail,
  } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState("");

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  useEffect(() => {
    // If user directly opens verification page
    // without registering first
    if (!verificationEmail) {
      router.replace("/auth/register");
    }
  }, [verificationEmail, router]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 6) {
      setOtp(value);
    }

    if (error) {
      dispatch(setError(""));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    dispatch(clearErrors());

    if (!otp) {
      dispatch(setError("Please enter the OTP."));
      return;
    }

    if (otp.length !== 6) {
      dispatch(setError("Please enter a valid 6-digit OTP."));
      return;
    }

    try {
      dispatch(setLoading(true));

      const response = await VerifyEmail({
        email: verificationEmail,
        otp,
      });

      console.log("Verify email response:", response);

      dispatch(clearErrors());
      dispatch(setError(""))
    
      // Email verified successfully
      router.push("/auth/login");

    } catch (error) {
      console.log("verify email error:", error);

      const responseData = error?.response?.data;

      dispatch(
        setError(
          responseData?.message ||
            error?.message ||
            "Unable to verify email."
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!verificationEmail) {
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">

          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
            <FaEnvelope size={26} />
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-primary">
              Verify your email
            </h1>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              We&apos;ve sent a 6-digit verification code to
            </p>

            <p className="mt-1 break-all font-semibold text-text-primary">
              {verificationEmail}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
            noValidate
          >

            {/* OTP */}
            <div>
              <label
                htmlFor="otp"
                className="mb-2 block text-sm font-medium text-text-primary"
              >
                Verification Code
              </label>

              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter 6-digit OTP"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-xl font-semibold tracking-[0.5em] text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>

            {/* Verify button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <FaRotateRight className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Email
                  <FaArrowRight size={14} />
                </>
              )}
            </button>
          </form>

        

          <div className="mt-6 border-t border-border pt-5 text-center">
            <Link
              href="/auth/register"
              className="text-sm font-medium text-text-secondary transition hover:text-brand"
            >
              ← Back to registration
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VerifyEmailPage;

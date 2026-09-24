
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiHeadphones,
} from "react-icons/fi";

import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { motion } from "motion/react"

import {
  setErrors,
  setShowPassword,
  clearErrors,
  setError,
  setLoading,
  setIsUser,
  setIsStaff,
} from "@/redux/slice/authSlice";

import { validatePassword } from "@/helperFunction/validatePassword";
import { loginUser } from "@/axiosApi/authApi";
import { socket } from "@/socket/socket";
import { fadeUp } from "../ui/Animation";
import { setUser } from "@/redux/slice/authSlice";
import { getUnReadMsg } from "@/axiosApi/msgApi";
import { setUnreadMessages } from "@/redux/slice/chatSlice";
import { getUnReadnotification } from "@/axiosApi/notificationApi";

const LoginForm = ({
  title = "Sign in to your account",
  subtitle = "Enter your credentials to access your dashboard.",
  accountMessage = "",
  accountAction = "",
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth)

  const {
    errors,
    showPassword,
    loading,
    error,
  } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    dispatch(clearErrors());
    dispatch(setError(""));

    return () => {
      dispatch(clearErrors());
      dispatch(setError(""));
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      dispatch(
        setErrors({
          ...errors,
          [name]: "",
        })
      );
    }


    if (error) {
      dispatch(setError(""));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else {
      const passwordError = validatePassword(password);

      if (passwordError) {
        newErrors.password = passwordError;
      }
    }

    dispatch(setErrors(newErrors));

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    dispatch(clearErrors());
    dispatch(setError(""));

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      dispatch(setLoading(true));

      const response = await loginUser({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      // console.log("Login response:", response);

      dispatch(clearErrors());
      dispatch(setError(""));

      sessionStorage.setItem(
        "token",
        response.token
      );
      const loggedInUser = response?.user;

      if (loggedInUser) {
        dispatch(setUser(loggedInUser));
      }


      socket.auth = {
        token: response.token,
      };

      if (!socket.connected) {
        socket.connect();
      }
      try {
        const unreadData = await getUnReadMsg();

        dispatch(setUnreadMessages(unreadData));
      } catch (error) {
        console.error(
          "Failed to load unread messages:",
          error
        );
      }


      const role = response?.user?.role;

      if (role === "user") {
        router.push("/user/home");
        dispatch(setIsUser(true))
        return;
      }

      if (role === "staff") {
        router.push("/staff/home");
        dispatch(setIsStaff(true))
        return;
      }



    } catch (error) {
      console.error("Login error:", error);

      const responseData = error?.response?.data;


      if (responseData?.errors && Array.isArray(responseData.errors)) {
        const fieldErrors = {};

        responseData.errors.forEach((item) => {
          Object.entries(item).forEach(
            ([field, message]) => {
              if (!fieldErrors[field]) {
                fieldErrors[field] = message;
              }
            }
          );
        });

        dispatch(setErrors(fieldErrors));
      } else {

        dispatch(
          setError(
            responseData?.message ||
            error?.message ||
            "Failed to login. Please try again."
          )
        );
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-full max-w-md">


      <div className="mb-10 flex items-center gap-3 lg:hidden">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand">
          <FiHeadphones className="h-6 w-6 text-white" />
        </div>

        <div>
          <p className="text-sm font-bold text-text-primary">
            Service Support
          </p>

          <p className="text-xs text-text-secondary">
            Management System
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-text-secondary">
          {subtitle}
        </p>
      </div>

      <motion.form variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: false,
          amount: 0.2
        }}
        onSubmit={handleSubmit}
        className="space-y-5"
        noValidate
      >

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}


        <div className="relative">
          <FiMail
            className="
              pointer-events-none
              absolute
              left-3.5
              top-[38px]
              z-10
              h-5
              w-5
              text-text-muted
            "
          />

          <InputField
            label="Email address"
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            disabled={loading}
            autoComplete="email"
            className="[&_input]:pl-11 "
          />
        </div>

        {/* Password */}
        <div className="relative">
          <FiLock
            className="
              pointer-events-none
              absolute
              left-3.5
              top-[38px]
              z-10
              h-5
              w-5
              text-text-muted
            "
          />

          <InputField
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            disabled={loading}
            autoComplete="current-password"
            showPassword={showPassword}
            togglePasswordVisibility={() =>
              dispatch(
                setShowPassword(!showPassword)
              )
            }
            className="[&_input]:pl-11"
          />
        </div>
        <div className="flex justify-end -mt-2">
          <div className="flex justify-end -mt-2">
            <button
              type="button"
              onClick={() => router.push("/auth/forgot-password")}
              disabled={loading}
              className="text-sm font-semibold text-brand transition-colors hover:text-brand-dark disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          loading={loading}
          loadingText="Signing in..."
          variant="primary"
          size="xl"
          className="group w-full"
        >
          <span>Sign in</span>

          <FiArrowRight
            className="
              ml-2
              h-4
              w-4
              transition-transform
              group-hover:translate-x-1
            "
          />
        </Button>
      </motion.form>


      {(accountMessage || accountAction) && (
        <div className="mt-8 border-t border-border pt-6 text-center">

          {accountMessage && (
            <p className="text-sm text-text-secondary">
              {accountMessage}
            </p>
          )}

          {accountAction && (
            <Link
              href="/auth/register"
              className="font-semibold text-brand transition hover:text-brand-dark"
            >
              {accountAction}
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginForm;


"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowRight,
} from "react-icons/fa6";
import {toast} from "react-toastify"

import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import  FileInput  from "@/components/ui/FileInput";
import Select from "@/components/ui/Select";
import { motion } from "motion/react";

import {
  setErrors,
  setLoading,
  setShowPassword,
  clearErrors,
  setError,
  setVerificationEmail,
} from "@/redux/slice/authSlice";

import { validatePassword } from "@/helperFunction/validatePassword";
import { registerUser } from "@/axiosApi/authApi";
import { fadeUp } from "../ui/Animation";

export const RegisterForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();


  const { loading, errors, error, showPassword } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    gender: "",
    password: "",
    profilePic: null,
  });

  useEffect(() => {
    dispatch(clearErrors());
    dispatch(setError(""))
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
  };

  const handleProfilePicChange = (file) => {
    setFormData((prev) => ({
      ...prev,
      profilePic: file,
    }));

    if (errors.profilePic) {
      dispatch(
        setErrors({
          ...errors,
          profilePic: "",
        })
      );
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const firstname = formData.firstname.trim();
    const lastname = formData.lastname.trim();
    const email = formData.email.trim().toLowerCase();

    if (!firstname) {
      newErrors.firstname = "First name is required.";
    }

    if (!lastname) {
      newErrors.lastname = "Last name is required.";
    }

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender.";
    }

    const passwordError = validatePassword(formData.password);

    if (passwordError) {
      newErrors.password = passwordError;
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

  const isValid = validateForm();

  if (!isValid) {
    return;
  }

  try {
    dispatch(setLoading(true));

    const submitData = new FormData();

    submitData.append("firstname", formData.firstname.trim());
    submitData.append("lastname", formData.lastname.trim());
    submitData.append("email", formData.email.trim().toLowerCase());
    submitData.append("gender", formData.gender);
    submitData.append("password", formData.password);

    if (formData.profilePic) {
      submitData.append("profilePic", formData.profilePic);
    }

    
    const response = await registerUser(submitData);

    toast.success(`${response?.message} || Registration successful. OTP has been sent to your email.!`)

    dispatch(setError(""));

    dispatch(setVerificationEmail(response.email));

    router.push("/auth/verify-email");
  } catch (error) {
    console.log("register error:", error);

    const responseData = error?.response?.data;

    if (responseData?.errors && Array.isArray(responseData.errors)) {
      const fieldErrors = {};

      responseData.errors.forEach((item) => {
        Object.entries(item).forEach(([field, message]) => {
          if (!fieldErrors[field]) {
            fieldErrors[field] = message;
          }
        });
      });

      dispatch(setErrors(fieldErrors));
    } else {
      dispatch(
        setError(
          responseData?.message ||
            error?.message ||
            "Failed to create account."
        )
      );
    }
  } finally {
    dispatch(setLoading(false));
  }
};

  return (
    <motion.form 
     variants={fadeUp}
     initial="hidden"
     whileInView="visible"
     viewport={{
      once:false,
      amount:0.2
     }}
     onSubmit={handleSubmit} className="space-y-5" noValidate>

      {error && (
        <p className="text-sm text-red-500 text-center  mb-3">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          id="firstname"
          name="firstname"
          label="First Name"
          placeholder="Enter your first name"
          value={formData.firstname}
          onChange={handleChange}
          error={errors.firstname}
          required
          autoComplete="given-name"
          leftIcon={FaUser}
        />

        <InputField
          id="lastname"
          name="lastname"
          label="Last Name"
          placeholder="Enter your last name"
          value={formData.lastname}
          onChange={handleChange}
          error={errors.lastname}
          required
          autoComplete="family-name"
          leftIcon={FaUser}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          autoComplete="email"
          leftIcon={FaEnvelope}
        />

        <Select
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          placeholder="Select your gender"
          required
          error={errors.gender}
          options={[
            {
              value: "Male",
              label: "Male",
            },
            {
              value: "Female",
              label: "Female",
            },
          ]}
        />
      </div>

      <FileInput
        label="Profile Picture"
        id="profilePic"
        accept="image/png,image/jpeg,image/webp"
        file={formData.profilePic}
        onChange={handleProfilePicChange}
        error={errors.profilePic}
        helperText="JPG, PNG or WEBP — recommended max 2MB"
        maxSize={2 * 1024 * 1024}
      />

      <InputField
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="Create a password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required
        showPassword={showPassword}
        togglePasswordVisibility={() =>
          dispatch(setShowPassword(!showPassword))
        }
        autoComplete="new-password"
        leftIcon={FaLock}
      />



      <Button
        type="submit"
        variant="primary"
        size="xl"
        loading={loading}
        loadingText="Creating account..."
        className="w-full"
      >
        <span className="flex items-center justify-center gap-2">
          Create Account
          <FaArrowRight size={15} />
        </span>
      </Button>

      <p className="text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-brand transition hover:text-brand-dark"
        >
          Sign in
        </Link>
      </p>
    </motion.form>
  );
};

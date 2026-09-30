
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";

import { validatePassword } from "@/helperFunction/validatePassword";
import {
  clearErrors,
  setError,
  setErrors,
  setLoading,
} from "@/redux/slice/authSlice";

import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";

const PasswordForm = ({
  onSubmit,
  buttonText = "Set Password",
  loadingText = "Setting password...",
  submitDisabled = false,
}) => {
  const dispatch = useDispatch();
  const { loading, errors, error } = useSelector((state) => state.auth);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    dispatch(clearErrors());
    dispatch(setError(""));

    return () => {
      dispatch(clearErrors());
      dispatch(setError(""));
    };
  }, [dispatch]);

  const handlePasswordChange = (event) => {
    const value = event.target.value;

    setPassword(value);

    if (errors.password) {
      dispatch(
        setErrors({
          ...errors,
          password: "",
        })
      );
    }
  };

  const handleConfirmPasswordChange = (event) => {
    const value = event.target.value;

    setConfirmPassword(value);

    if (errors.confirmPassword) {
      dispatch(
        setErrors({
          ...errors,
          confirmPassword: "",
        })
      );
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const passwordError = validatePassword(password);

    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    dispatch(setErrors(newErrors));

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading || submitDisabled) {
      return;
    }

    dispatch(clearErrors());
    dispatch(setError(""));

    if (!validateForm()) {
      return;
    }

    try {
      dispatch(setLoading(true));
      await onSubmit(password);
    } catch (error) {
      console.error("Password form error:", error);

      const responseData = error?.response?.data;

      if (Array.isArray(responseData?.errors)) {
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
              "Something went wrong. Please try again."
          )
        );
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && (
        <p className="text-center text-sm text-danger">
          {error}
        </p>
      )}

      <InputField
        label="New password"
        id="password"
        name="password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={handlePasswordChange}
        error={errors.password}
        showPassword={showPassword}
        togglePasswordVisibility={() =>
          setShowPassword((previous) => !previous)
        }
        autoComplete="new-password"
        disabled={loading}
        required
      />

      <InputField
        label="Confirm password"
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        placeholder="Re-enter your password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        error={errors.confirmPassword}
        showPassword={showConfirmPassword}
        togglePasswordVisibility={() =>
          setShowConfirmPassword((previous) => !previous)
        }
        autoComplete="new-password"
        disabled={loading}
        required
      />

      {confirmPassword && (
        <div
          className={`flex items-center gap-2 text-xs font-medium ${
            passwordsMatch ? "text-success" : "text-danger"
          }`}
        >
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full ${
              passwordsMatch ? "bg-success/10" : "bg-danger/10"
            }`}
          >
            {passwordsMatch ? (
              <FaCheck size={10} />
            ) : (
              <span className="text-[11px]">!</span>
            )}
          </span>

          {passwordsMatch
            ? "Passwords match"
            : "Passwords do not match"}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        loadingText={loadingText}
        disabled={submitDisabled}
        className="w-full"
      >
        {buttonText}
      </Button>
    </form>
  );
};

export default PasswordForm;

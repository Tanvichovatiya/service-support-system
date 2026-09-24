
"use client";

import { FaEye, FaEyeSlash } from "react-icons/fa";

export const InputField = ({
  label,
  id,
  name,
  type = "text",
  placeholder = "",
  value,
  defaultValue = "",
  error = "",
  required = false,
  disabled = false,
  onChange,
  showPassword = false,
  togglePasswordVisibility,
  autoComplete,
  leftIcon: LeftIcon,
  className = "",
}) => {
  const isPassword = type === "password" || togglePasswordVisibility;

  const inputType = togglePasswordVisibility
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text-primary">
          {label}
          {required && <span className="ml-1 text-danger">*</span>}
        </label>
      )}

      <div className="relative">
        {LeftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-text-muted">
            <LeftIcon size={16} />
          </div>
        )}

        <input
          id={id}
          name={name}
          type={inputType}
          placeholder={placeholder}
          {...(value !== undefined ? { value } : { defaultValue })}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          onChange={onChange}
          className={`w-full rounded-admin border bg-input-background py-2.5 text-sm text-text-primary placeholder:text-input-placeholder transition duration-150 focus:border-brand focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-surface-soft disabled:opacity-60 ${LeftIcon ? "pl-11" : "px-3.5"} ${isPassword ? "pr-11" : "pr-3.5"} ${error ? "border-danger focus:border-danger focus:ring-danger/20" : "border-input-border focus:ring-brand/20"}`}
        />

        {togglePasswordVisibility && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={disabled}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-text-muted transition hover:text-brand focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
          </button>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
};

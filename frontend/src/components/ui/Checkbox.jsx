"use client";

export const Checkbox = ({
  id,
  name,
  checked = false,
  onChange,
  disabled = false,
  error = "",
  children,
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-2.5 text-sm text-text-secondary"
      >
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="
            mt-0.5
            h-4
            w-4
            shrink-0
            cursor-pointer
            rounded
            border-2
            border-brand
            accent-brand
            focus:ring-2
            focus:ring-accent
            disabled:cursor-not-allowed
          "
        />

        <span>{children}</span>
      </label>

      {error && (
        <p className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
};
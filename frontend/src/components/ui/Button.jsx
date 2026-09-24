"use client";

export const Button = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  loadingText = "Loading...",
  variant = "primary",
  size = "md",
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "bg-brand text-white shadow-sm hover:bg-brand-dark focus:ring-brand active:bg-brand-deep",

    secondary:
      "border border-border bg-surface text-text-primary shadow-sm hover:bg-surface-soft focus:ring-brand",

    accent:
      "bg-accent text-white shadow-sm hover:bg-accent-dark focus:ring-accent",

    outline:
      "border border-brand bg-transparent text-brand hover:bg-brand hover:text-white focus:ring-brand",

    danger:
      "bg-danger text-white shadow-sm hover:opacity-90 focus:ring-danger",

    ghost:
      "bg-transparent text-text-secondary hover:bg-surface-soft hover:text-text-primary focus:ring-brand",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-sm",
    xl: "h-12 px-6 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span
            className="
              h-4 w-4
              animate-spin
              rounded-full
              border-2
              border-white/30
              border-t-white
            "
            aria-hidden="true"
          />

          <span>{loadingText}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
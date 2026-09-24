"use client";

export default function Select({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select",
  required = false,
  error = "",
  disabled = false,
  className = "",
  leftIcon: LeftIcon,
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id || name} className="mb-1.5 block text-sm font-medium text-text-primary">
          {label}
          {required && <span className="ml-1 text-danger">*</span>} </label>
      )}

      
      <div className="relative">
        {LeftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-text-muted">
            <LeftIcon size={16} />
          </div>
        )}

        <select
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full appearance-none rounded-admin border bg-input-background py-2.5 pr-8 text-sm text-text-primary transition duration-150 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-surface-soft disabled:opacity-60 ${LeftIcon ? "pl-11" : "px-3.5"} ${error ? "border-danger focus:border-danger focus:ring-danger/20" : "border-input-border focus:border-brand focus:ring-brand/20"}`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex w-8 items-center justify-center text-text-muted">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>


  );
}

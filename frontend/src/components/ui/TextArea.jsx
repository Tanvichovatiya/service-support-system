
"use client";

const TextArea = ({
  label,
  id,
  name,
  placeholder = "",
  defaultValue = "",
  value,
  onChange,
  rows = 5,
  error = "",
  required = false,
  disabled = false,
  className = "",
}) => {
  const textareaProps =
    value !== undefined
      ? { value, onChange }
      : { defaultValue };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-text-primary"
        >
          {label}
          {required && <span className="ml-1 text-danger">*</span>}
        </label>
      )}

      <textarea
        id={id}
        name={name}
        rows={rows}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        {...textareaProps}
        className={`w-full resize-y rounded-admin border bg-input-background px-3.5 py-2.5 text-sm text-text-primary placeholder:text-input-placeholder transition duration-150 focus:border-brand focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-surface-soft disabled:opacity-60 ${error ? "border-danger focus:border-danger focus:ring-danger/20" : "border-input-border focus:ring-brand/20"}`}
      />

      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
};

export default TextArea;

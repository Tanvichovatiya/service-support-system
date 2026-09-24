"use client";

import React, { useRef } from "react";
import { FiPaperclip, FiX } from "react-icons/fi";

const FileInput = ({
  label,
  accept,
  file = [],
  multiple = false,
  disabled = false,
  onChange,
  helperText,
  resetKey,
}) => {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (multiple) {
      const existingNames = new Set(file.map((item) => item.name));

      const newFiles = selectedFiles.filter(
        (item) => !existingNames.has(item.name)
      );

      onChange([...file, ...newFiles]);
    } else {
      onChange(selectedFiles[0] || null);
    }

    e.target.value = "";
  };

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [resetKey]);

  const handleRemove = (index) => {
    const updatedFiles = file.filter((_, fileIndex) => fileIndex !== index);

    onChange(updatedFiles);
  };

  const selectedCount = multiple ? file.length : file ? 1 : 0;

  const selectedText =
    selectedCount === 0
      ? "No file chosen"
      : multiple
        ? `${selectedCount} ${selectedCount === 1 ? "file" : "files"} selected`
        : file?.name;

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-text-primary">
        {label}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleChange}
        className="hidden"
      />

      <div
        onClick={() => !disabled && inputRef.current?.click()}
        className={`flex min-h-[58px] w-full items-center gap-4 rounded-lg border-2 border-brand bg-surface px-3 py-2 transition-colors ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-accent-dark"}`}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
          className="shrink-0 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed"
        >
          {multiple ? "Choose Files" : "Choose File"}
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={`truncate text-sm ${
              selectedCount > 0
                ? "font-medium text-text-primary"
                : "text-text-secondary"
            }`}
          >
            {selectedText}
          </p>
        </div>

        <FiPaperclip className="shrink-0 text-text-muted" size={18} />
      </div>

      {helperText && (
        <p className="mt-1.5 text-xs text-text-secondary">{helperText}</p>
      )}

      {multiple && file?.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-medium text-text-primary">
            Selected files ({file.length})
          </p>

          {file.map((selectedFile, index) => (
            <div
              key={`${selectedFile.name}-${index}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-soft px-3 py-2.5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-dark">
                  <FiPaperclip size={16} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {selectedFile.name}
                  </p>

                  <p className="text-xs text-text-secondary">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={disabled}
                onClick={() => handleRemove(index)}
                title="Remove file"
                aria-label={`Remove ${selectedFile.name}`}
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-danger transition-colors hover:bg-danger-light disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiX size={17} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileInput;

"use client";

import React from "react";

const RequestError = ({
  error,
  loading,
  onRetry,
}) => {
  if (!error || loading) {
    return null;
  }

  return (
    <div
      className="
        mb-6
        flex
        items-center
        justify-between
        rounded-admin
        border
        border-danger
        bg-danger-light
        px-4
        py-3
        text-sm
        text-danger-dark
      "
    >
      <span>
        {error}
      </span>

      <button
        type="button"
        onClick={onRetry}
        className="font-semibold underline"
      >
        Retry
      </button>
    </div>
  );
};

export default RequestError;
"use client";

import React from "react";

import { getStatusStyle } from "@/helperFunction/statusStyle";

const RequestResultSummary = ({
  requestsCount,
  totalRequest,
  status,
}) => {
  if (totalRequest <= 0) {
    return null;
  }

  return (
    <div
      className="
        mb-4
        mt-2
        flex
        items-center
        justify-between
      "
    >
      <p className="text-sm text-accent">
        Showing{" "}
        <span className="text-md font-semibold text-brand">
          {requestsCount}
        </span>{" "}
        of{" "}
        <span className="text-md font-semibold text-brand">
          {totalRequest}
        </span>{" "}
        requests
      </p>

      {status && (
        <span
          className="
            rounded-full
            bg-brand-soft
            px-3
            py-1
            text-xs
            font-medium
            text-brand-dark
          "
        >
          {getStatusStyle(status).label}
        </span>
      )}
    </div>
  );
};

export default RequestResultSummary;
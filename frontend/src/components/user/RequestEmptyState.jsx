
"use client";

import React from "react";
import {
  FiInbox,
  FiPlus,
} from "react-icons/fi";

import { Button } from "@/components/ui/Button";

const RequestEmptyState = ({
  search,
  status,
  onCreateRequest,
}) => {
  return (
    <div
      className="
        rounded-admin-lg
        border
        border-border
        bg-surface
        px-6
        py-16
        text-center
        shadow-admin-sm
      "
    >
      <div
        className="
          mx-auto
          mb-4
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-brand-soft
          text-brand
        "
      >
        <FiInbox size={30} />
      </div>

      <h2
        className="
          text-lg
          font-semibold
          text-text-primary
        "
      >
        No service requests found
      </h2>

      <p
        className="
          mx-auto
          mt-2
          max-w-md
          text-sm
          text-text-secondary
        "
      >
        {search || status
          ? "Try changing your search or filter to find your requests."
          : "You haven't created any service requests yet."}
      </p>

      {!search && !status && (
        <Button
          type="button"
          className="
            mt-5
            inline-flex
            items-center
            gap-2
          "
          onClick={onCreateRequest}
        >
          <FiPlus size={18} />

          Create Request
        </Button>
      )}
    </div>
  );
};

export default RequestEmptyState;
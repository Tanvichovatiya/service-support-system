"use client";

import React from "react";
import {
  FiEye,
  FiPaperclip,
  FiCalendar,
  FiClock,
} from "react-icons/fi";

import { formatDate } from "@/helperFunction/formateDate";
import {
  getPriorityStyle,
  getStatusStyle,
} from "@/helperFunction/statusStyle";

const RequestCards = ({
  request,
  onViewDetails,
}) => {
  const statusStyle = getStatusStyle(
    request.status
  );

  const priorityStyle = getPriorityStyle(
    request.priority
  );

  return (
    <div
      className="
        group
        flex
        flex-col
        rounded-admin-lg
        border
        border-border
        bg-surface
        p-5
        shadow-admin-sm
        transition
        duration-200
        hover:-translate-y-0.5
        hover:shadow-admin-md
      "
    >

      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">

        <div className="min-w-0 flex-1">

          <p
            className="
              mb-1
              text-xs
              font-medium
              uppercase
              tracking-wide
              text-brand
            "
          >
            {request.category?.name ||
              "Uncategorized"}
          </p>

          <h2
            className="
              line-clamp-2
              text-base
              font-semibold
              text-text-primary
            "
          >
            {request.title}
          </h2>

        </div>

        <span
          className={`
            shrink-0
            rounded-full
            border
            px-2.5
            py-1
            text-xs
            font-medium
            capitalize
            ${statusStyle.className}
          `}
        >
          {statusStyle.label}
        </span>

      </div>

      {/* Description */}
      <p
        className="
          mb-5
          line-clamp-3
          text-sm
          leading-6
          text-text-secondary
        "
      >
        {request.description ||
          "No description provided."}
      </p>

      {/* Meta */}
      <div
        className="
          mb-5
          space-y-3
          border-y
          border-border-light
          py-4
        "
      >

        {/* Priority */}
        <div className="flex items-center justify-between gap-3">

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              text-text-secondary
            "
          >
            <FiClock size={16} />

            <span>
              Priority
            </span>
          </div>

          <span
            className={`
              rounded-full
              border
              px-2.5
              py-1
              text-xs
              font-medium
              capitalize
              ${priorityStyle.className}
            `}
          >
            {priorityStyle.label}
          </span>

        </div>

        {/* Created */}
        <div className="flex items-center justify-between gap-3">

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              text-text-secondary
            "
          >
            <FiCalendar size={16} />

            <span>
              Created
            </span>
          </div>

          <span
            className="
              text-sm
              font-medium
              text-text-primary
            "
          >
            {formatDate(request.createdAt)}
          </span>

        </div>

        {/* Attachments */}
        <div className="flex items-center justify-between gap-3">

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              text-text-secondary
            "
          >
            <FiPaperclip size={16} />

            <span>
              Attachments
            </span>
          </div>

          <span
            className="
              text-sm
              font-medium
              text-text-primary
            "
          >
            {request.attachments?.length || 0}
          </span>

        </div>

      </div>

      {/* View Details */}
      <button
        type="button"
        onClick={() =>
          onViewDetails(request._id)
        }
        className="
          mt-auto
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-admin
          border
          border-brand
          bg-brand-soft
          px-4
          py-2.5
          text-sm
          font-semibold
          text-brand-dark
          transition
          hover:bg-brand
          hover:text-white
        "
      >
        <FiEye size={17} />

        View Details
      </button>

    </div>
  );
};

export default RequestCards;
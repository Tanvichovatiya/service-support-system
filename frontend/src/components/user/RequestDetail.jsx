
"use client";

import {
  FiCalendar,
  FiClock,
  FiDownload,
  FiFile,
  FiHash,
  FiMessageCircle,
  FiPaperclip,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { useState } from "react";

import RequestStatusBadge from "./RequestStatusBadge";
import { formatDate } from "@/helperFunction/formateDate";
import { getPriorityStyle } from "@/helperFunction/statusStyle";
import { downloadAttachment } from "@/axiosApi/attachmentApi";
import RequestTimeline from "../RequestTimeLine";

export default function RequestDetails({ request }) {
  const [downloadingId, setDownloadingId] = useState(null);

  const priorityStyle = getPriorityStyle(request.priority);

  const staff = request.assignedStaff;
  const staffUser = staff?.user;

  const handleDownload = async (file) => {
    if (!file?._id) return;

    try {
      setDownloadingId(file._id);

      await downloadAttachment(file);
    } catch (error) {
      console.error("Failed to download attachment:", error);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <section
        className="
          overflow-hidden
          rounded-2xl
          border-[2.1px]
          border-brand-light
          bg-surface
          shadow-admin-sm
          hover:shadow-admin-hover
        "
      >
        <div
          className="
            border-b
            border-border-light
            bg-surface-soft
            px-5
            py-5
            sm:px-7
          "
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="
                    rounded-md
                    bg-brand-soft
                    px-2.5
                    py-1
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-brand
                  "
                >
                  {request.category?.name || "General"}
                </span>

                <span className="text-xs text-text-muted">
                  Request
                </span>
              </div>

              <h1
                className="
                  text-xl
                  font-semibold
                  leading-7
                  text-text-primary
                  sm:text-2xl
                "
              >
                {request.title}
              </h1>

              <div
                className="
                  mt-2
                  flex
                  items-center
                  gap-1.5
                  text-xs
                  text-text-muted
                "
              >
                <FiHash size={13} />

                <span>{request._id}</span>
              </div>
            </div>

            <div className="shrink-0">
              <RequestStatusBadge status={request.status} />
            </div>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-7">
          <p
            className="
              whitespace-pre-line
              text-sm
              leading-7
              text-text-secondary
            "
          >
            {request.description || "No description provided."}
          </p>
        </div>

        <div
          className="
            grid
            grid-cols-1
            border-t
            border-border-light
            sm:grid-cols-3
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              border-b
              border-border-light
              px-5
              py-4
              sm:border-b-0
              sm:border-r
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-brand-soft
                text-brand
              "
            >
              <FiClock size={16} />
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted">
                Priority
              </p>

              <p
                className={`
                  mt-0.5
                  text-sm
                  font-semibold
                  capitalize
                  ${priorityStyle.className}
                `}
              >
                {priorityStyle.label}
              </p>
            </div>
          </div>

          <div
            className="
              flex
              items-center
              gap-3
              border-b
              border-border-light
              px-5
              py-4
              sm:border-b-0
              sm:border-r
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-brand-soft
                text-brand
              "
            >
              <FiCalendar size={16} />
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted">
                Created
              </p>

              <p className="mt-0.5 text-sm font-medium text-text-primary">
                {formatDate(request.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-4">
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-brand-soft
                text-brand
              "
            >
              <FiClock size={16} />
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted">
                Last Updated
              </p>

              <p className="mt-0.5 text-sm font-medium text-text-primary">
                {formatDate(request.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="
          rounded-2xl
          border-[2.1px]
          border-brand-light
          bg-surface
          p-5
          shadow-admin-sm
          hover:shadow-admin-hover
          sm:p-6
        "
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              bg-brand-soft
              text-brand
            "
          >
            <FiUsers size={17} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Assigned Staff
            </h2>

            <p className="text-xs text-text-muted">
              Person currently handling your request
            </p>
          </div>
        </div>

        {staff && staffUser ? (
          <div
            className="
              flex
              items-center
              gap-4
              rounded-xl
              border
              border-border-light
              bg-surface-soft
              p-4
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-full
                bg-brand-soft
                text-brand
              "
            >
              {staffUser.profilePic ? (
                <img
                  src={staffUser.profilePic}
                  alt="Staff"
                  className="h-full w-full object-cover"
                />
              ) : (
                <FiUser size={20} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-text-primary">
                {staffUser.firstname} {staffUser.lastname}
              </h3>

              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
                <span>
                  Employee ID: {staff.employeeId || "N/A"}
                </span>

                <span>
                  Department: {staff.department || "N/A"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="
              rounded-xl
              border
              border-border-light
              bg-surface-soft
              px-4
              py-5
              text-center
            "
          >
            <FiUsers
              size={20}
              className="mx-auto mb-2 text-text-muted"
            />

            <p className="text-sm font-medium text-text-secondary">
              No staff assigned yet
            </p>

            <p className="mt-1 text-xs text-text-muted">
              Your request will be assigned to a staff member.
            </p>
          </div>
        )}
      </section>

      <section
        className="
          rounded-2xl
          border-[2.1px]
          border-brand-light
          bg-surface
          p-5
          shadow-admin-sm
          hover:shadow-admin-hover
          sm:p-6
        "
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              bg-brand-soft
              text-brand
            "
          >
            <FiPaperclip size={17} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Attachments
            </h2>

            <p className="text-xs text-text-muted">
              Files attached to this request
            </p>
          </div>
        </div>

        {request.attachments?.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {request.attachments.map((file, index) => {
              const fileName =
                file?.originalName ||
                file?.fileName ||
                `Attachment ${index + 1}`;

              const isDownloading =
                downloadingId === file?._id;

              return (
                <div
                  key={file?._id || index}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-border-light
                    bg-surface-soft
                    p-3
                    transition
                    hover:border-brand
                    hover:bg-brand-soft
                  "
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-brand-soft
                      text-brand
                    "
                  >
                    <FiFile size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className="
                        truncate
                        text-xs
                        font-medium
                        text-text-primary
                      "
                      title={fileName}
                    >
                      {fileName}
                    </p>

                    {file?.size && (
                      <p className="mt-0.5 text-[10px] text-text-muted">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownload(file)}
                    disabled={isDownloading}
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      text-text-muted
                      transition-all
                      duration-200
                      hover:bg-brand
                      hover:text-white
                      active:scale-95
                      disabled:cursor-not-allowed
                      disabled:opacity-50 cursor-pointer
                    "
                    title={
                      isDownloading
                        ? "Downloading..."
                        : "Download"
                    }
                    aria-label={`Download ${fileName}`}
                  >
                    <FiDownload
                      size={16}
                      className={
                        isDownloading
                          ? "animate-pulse"
                          : ""
                      }
                    />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-text-muted">
            No attachments added.
          </p>
        )}
      </section>
     
     <RequestTimeline request={request}/>
      
    </div>
  );
}

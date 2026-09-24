"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import {
  FaArrowLeft,
  FaUser,
  FaTag,
  FaCalendarAlt,
  FaClock,
  FaPaperclip,
  FaCommentAlt,
  FaDownload,
  FaFile,
  FaImage,
  FaCheckCircle,
  FaSpinner,
  FaExclamationCircle,
  FaHistory,
} from "react-icons/fa";

import { getAssignRedById, getAssignReqById } from "@/axiosApi/serviceRequestApi";

import { formatDate, } from "@/helperFunction/formateDate";
import { getStatusStyle, getPriorityStyle } from "@/helperFunction/statusStyle";
import RequestTimeline from "@/components/RequestTimeLine";

export default function RequestByIdPage() {
  const router = useRouter();
  const params = useParams();

  const requestId = params?.id;

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!requestId) return;

    const fetchRequest = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAssignReqById(requestId);


        setRequest(data);
      } catch (error) {
        console.error("Fetch request error:", error);

        setError(
          error?.response?.data?.message ||
          "Failed to load service request."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [requestId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <FaSpinner className="animate-spin text-2xl text-brand" />

              <p className="text-sm text-text-secondary">
                Loading service request...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <button
            type="button"
            onClick={() => router.back()}
            className=" cursor-pointer
              mb-6
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-text-secondary
              transition
              hover:text-brand
            "
          >
            <FaArrowLeft className="text-xs" />
            Back to Requests
          </button>

          <div
            className="
              rounded-admin-lg
              border
              border-danger/20
              bg-danger-light
              p-8
              text-center
            "
          >
            <FaExclamationCircle className="mx-auto mb-3 text-3xl text-danger" />

            <h2 className="text-lg font-semibold text-danger-dark">
              Unable to load request
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              {error || "Service request not found."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const statusStyle = getStatusStyle(request.status);
  const priorityStyle = getPriorityStyle(request.priority);

  const userName =
    `${request.user?.firstname || ""} ${request.user?.lastname || ""
      }`.trim() || "Unknown User";

  return (
    <div className="min-h-screen bg-background px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="
              mb-4
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-text-secondary
              transition
              hover:text-brand cursor-pointer
            "
          >
            <FaArrowLeft className="text-xs" />
            Back to Requests
          </button>

          <div
            className="
              flex
              flex-col
              gap-4
              rounded-admin-lg
              border-[2.1px]
              border-brand-light
              bg-surface
              p-5
              shadow-admin-sm
              sm:p-6
              lg:flex-row
              lg:items-center hover:shadow-admin-hover
              lg:justify-between 
            "
          >
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">

                <StatusBadge
                  label={statusStyle.label}
                  className={statusStyle.className}
                />

                <StatusBadge
                  label={priorityStyle.label}
                  className={priorityStyle.className}
                />
              </div>

              <h1 className="truncate text-xl font-semibold text-text-primary sm:text-2xl">
                {request.title}
              </h1>

              <p className="mt-1 text-sm text-text-muted">
                Created on {formatDate(request.createdAt)}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              {/* <button
                type="button"
                className="
                  flex
                  items-center
                  gap-2
                  rounded-admin
                  border
                  border-border
                  bg-surface
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-text-secondary
                  transition
                  hover:border-brand
                  hover:text-brand
                "
              >
                <FaHistory className="text-xs" />
                History
              </button> */}
            </div>
          </div>
        </div>



        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">



          <div className="space-y-6 lg:col-span-2">


            <section
              className="
                rounded-admin-lg
                border-[2.1px]
                border-brand-light
                hover:shadow-admin-hover
                bg-surface
                shadow-admin-sm 
              "
            >
              <SectionHeader
                icon={<FaFile />}
                title="Request Details"
              />

              <div className="p-5 sm:p-6">

                <div className="mb-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Description
                  </p>

                  <p className="whitespace-pre-wrap text-sm leading-7 text-text-secondary">
                    {request.description || "No description provided."}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <InfoItem
                    icon={<FaTag />}
                    label="Category"
                    value={request.category?.name || "Uncategorized"}
                  />

                  <InfoItem
                    icon={<FaExclamationCircle />}
                    label="Priority"
                    value={priorityStyle.label}
                  />

                  <InfoItem
                    icon={<FaCalendarAlt />}
                    label="Created"
                    value={formatDate(request.createdAt)}
                  />

                  <InfoItem
                    icon={<FaClock />}
                    label="Last Updated"
                    value={formatDate(request.updatedAt)}
                  />

                </div>
              </div>
            </section>


            <RequestTimeline request={request} />



            <section
              className="
                rounded-admin-lg
                border-[2.1px]
                border-brand-light
                hover:shadow-admin-hover
                bg-surface
                shadow-admin-sm 
              "
            >
              <SectionHeader
                icon={<FaPaperclip />}
                title="Request Attachments"
                count={request.attachments?.length || 0}
              />

              <div className="p-5 sm:p-6">
                {request.attachments?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {request.attachments.map((attachment) => (
                      <AttachmentCard
                        key={attachment._id}
                        attachment={attachment}
                        uploader={
                          attachment.uploader
                            ? `${attachment.uploader.firstname || ""} ${attachment.uploader.lastname || ""
                              }`.trim()
                            : "Unknown"
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<FaPaperclip />}
                    text="No attachments added to this request."
                  />
                )}
              </div>
            </section>

            {/* 
            <section
              className="
                rounded-admin-lg
                border
                border-border-light
                bg-surface
                shadow-admin-sm
              "
            >
              <SectionHeader
                icon={<FaCommentAlt />}
                title="Conversation"
                count={request.comments?.length || 0}
              />

              <div className="p-5 sm:p-6">

                {request.comments?.length > 0 ? (
                  <div className="space-y-6">
                    {request.comments.map((comment) => (
                      <CommentCard
                        key={comment._id}
                        comment={comment}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<FaCommentAlt />}
                    text="No comments yet."
                  />
                )}

              </div>
            </section> */}

          </div>

          <div className="space-y-6">


            <section
              className="
                rounded-admin-lg
                border-[2.1px]
                border-brand-light
                hover:shadow-admin-hover
                bg-surface
                shadow-admin-sm
              "
            >
              <SectionHeader
                icon={<FaUser />}
                title="Customer"
              />

              <div className="p-5">

                <div className="flex items-center gap-3">
                  {request.user?.profilePic ? (
                    <img
                      src={request.user.profilePic}
                      alt={userName}
                      className="
                        h-12
                        w-12
                        rounded-full
                        border
                        border-border
                        object-cover
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-brand-soft
                        text-brand
                      "
                    >
                      <FaUser />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text-primary">
                      {userName}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-text-muted">
                      Customer
                    </p>
                  </div>
                </div>

              </div>
            </section>

            <section
              className="
                rounded-admin-lg
                border-[2.1px]
                border-brand-light
                hover:shadow-admin-hover
                bg-surface
                shadow-admin-sm
              "
            >
              <SectionHeader
                icon={<FaTag />}
                title="Service Category"
              />

              <div className="p-5">

                <h3 className="text-sm font-semibold text-text-primary">
                  {request.category?.name || "Uncategorized"}
                </h3>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {request.category?.description ||
                    "No category description available."}
                </p>

              </div>
            </section>


            <section className="rounded-admin-lg border-[2.1px]
                border-brand-light
                hover:shadow-admin-hover bg-surface shadow-admin-sm">
              <SectionHeader
                icon={<FaCheckCircle />}
                title="Current Status"
              />

              <div className="p-5">
                <div
                  className={`
        rounded-admin
        border
        p-4
        ${statusStyle.className}
      `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {statusStyle.label}
                    </span>

                    <FaCheckCircle className="text-sm" />
                  </div>
                </div>
              </div>
            </section>

          </div>

        </div>
      </div>
    </div>
  );
}




function StatusBadge({ label, className }) {
  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-2.5
        py-1
        text-xs
        font-medium
        ${className}
      `}
    >
      {label}
    </span>
  );
}



function SectionHeader({ icon, title, count }) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        border-b
        border-border-light
        px-5
        py-4
        sm:px-6
      "
    >
      <div className="flex items-center gap-2.5">
        <span className="text-sm text-brand">
          {icon}
        </span>

        <h2 className="text-sm font-semibold text-text-primary">
          {title}
        </h2>
      </div>

      {typeof count === "number" && (
        <span
          className="
            rounded-full
            bg-background-soft
            px-2
            py-0.5
            text-xs
            font-medium
            text-text-secondary
          "
        >
          {count}
        </span>
      )}
    </div>
  );
}


function InfoItem({ icon, label, value }) {
  return (
    <div
      className="
        rounded-admin
        border
        border-border-light
        bg-surface-soft
        p-4
      "
    >
      <div className="flex items-center gap-2">
        <span className="text-xs text-brand">
          {icon}
        </span>

        <span className="text-xs font-medium text-text-muted">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-medium text-text-primary">
        {value}
      </p>
    </div>
  );
}



function TimelineItem({
  title,
  date,
  active,
  last = false,
}) {
  return (
    <div className="relative flex gap-4">
      {!last && (
        <div
          className={`
            absolute
            left-[7px]
            top-5
            h-full
            w-px
            ${active ? "bg-brand-muted" : "bg-border-light"}
          `}
        />
      )}

      <div
        className={`
          relative
          z-10
          mt-1
          h-4
          w-4
          shrink-0
          rounded-full
          border-2
          ${active
            ? "border-brand bg-brand"
            : "border-border bg-surface"
          }
        `}
      />

      <div className="pb-6">
        <p
          className={`
            text-sm
            font-medium
            ${active
              ? "text-text-primary"
              : "text-text-muted"
            }
          `}
        >
          {title}
        </p>

        <p className="mt-1 text-xs text-text-muted">
          {date ? formatDate(date) : "Not completed"}
        </p>
      </div>
    </div>
  );
}


function AttachmentCard({ attachment, uploader }) {
  const isImage =
    attachment.mimeType?.startsWith("image/") ||
    attachment.fileType?.startsWith("image/");

  const fileUrl =
    attachment.url ||
    attachment.secure_url ||
    attachment.fileUrl;

  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-admin
        border
        border-border-light
        bg-surface-soft
        p-3
      "
    >
      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-admin-sm
          bg-brand-soft
          text-brand
        "
      >
        {isImage ? <FaImage /> : <FaFile />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-primary">
          {attachment.originalName ||
            attachment.filename ||
            attachment.name ||
            "Attachment"}
        </p>

        <p className="mt-0.5 truncate text-xs text-text-muted">
          Uploaded by {uploader}
        </p>
      </div>

      {fileUrl && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-admin-sm
            text-text-muted
            transition
            hover:bg-brand-soft
            hover:text-brand
          "
          title="Download attachment"
        >
          <FaDownload className="text-xs" />
        </a>
      )}
    </div>
  );
}


function CommentCard({ comment }) {
  const commentUser = comment.commentUser;

  const name =
    `${commentUser?.firstname || ""} ${commentUser?.lastname || ""
      }`.trim() || "Unknown User";

  return (
    <div className="flex gap-3">

      {commentUser?.profilePic ? (
        <img
          src={commentUser.profilePic}
          alt={name}
          className="
            h-10
            w-10
            shrink-0
            rounded-full
            border
            border-border
            object-cover
          "
        />
      ) : (
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-brand-soft
            text-brand
          "
        >
          <FaUser className="text-xs" />
        </div>
      )}

      <div className="min-w-0 flex-1">

        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-text-primary">
            {name}
          </p>

          {commentUser?.role && (
            <span
              className="
                rounded-full
                bg-background-soft
                px-2
                py-0.5
                text-[10px]
                font-medium
                uppercase
                tracking-wide
                text-text-muted
              "
            >
              {commentUser.role}
            </span>
          )}

          <span className="text-xs text-text-muted">
            {formatDate(comment.createdAt)}
          </span>
        </div>

        <div
          className="
            mt-2
            rounded-admin
            rounded-tl-none
            border
            border-border-light
            bg-surface-soft
            p-4
          "
        >
          <p className="whitespace-pre-wrap text-sm leading-6 text-text-secondary">
            {comment.message}
          </p>


          {comment.attachments?.length > 0 && (
            <div className="mt-3 space-y-2 border-t border-border-light pt-3">
              {comment.attachments.map((attachment) => (
                <AttachmentCard
                  key={attachment._id}
                  attachment={attachment}
                  uploader={name}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-admin
        border
        border-dashed
        border-border
        bg-surface-soft
        px-5
        py-10
      "
    >
      <div className="mb-3 text-2xl text-text-light">
        {icon}
      </div>

      <p className="text-sm text-text-muted">
        {text}
      </p>
    </div>
  );
}
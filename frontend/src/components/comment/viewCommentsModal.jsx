"use client";

import { useEffect, useState } from "react";
import {
  FaCommentAlt,
  FaPaperclip,
  FaTimes,
  FaFile,
  FaDownload,
  FaEye,
} from "react-icons/fa";

import {
  getComment
} from "@/axiosApi/serviceRequestApi";
import { downloadAttachment } from "@/axiosApi/attachmentApi";

const ViewCommentsModal = ({
  isOpen,
  onClose,
  requestId,
  refreshKey = 0,
}) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    if (!isOpen || !requestId) return;

    const fetchComments = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getComment(requestId);

        setComments(result.comments || []);
      } catch (error) {
        console.error("Get comments error:", error);

        setError(
          error?.response?.data?.message ||
            "Failed to load comments."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [isOpen, requestId, refreshKey]);

  if (!isOpen) return null;

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserName = (comment) => {
    const user = comment.user;

    if (!user) {
      return "Unknown User";
    }

    const name = [user.firstname, user.lastname]
      .filter(Boolean)
      .join(" ");

    return name || user.email || "Unknown User";
  };

  

  const handleDownloadAttachment = async (attachment) => {
    if (!attachment?._id) return;

    try {
      setDownloadingId(attachment._id);

      await downloadAttachment(attachment);
    } catch (error) {
      console.error("Download attachment error:", error);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-admin-xl border border-border bg-modal-background shadow-admin-lg">
        <div className="flex shrink-0 items-center justify-between border-b border-border-light bg-background-soft px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-admin bg-brand-soft text-brand">
              <FaCommentAlt size={15} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-text-primary">
                Comments
              </h2>

              <p className="text-xs text-text-secondary">
                Conversation for this service request
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition hover:bg-brand-soft hover:text-brand cursor-pointer"
          >
            <FaTimes size={15} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center gap-3">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-brand-muted border-t-brand" />

              <p className="text-sm text-text-secondary">
                Loading comments...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-admin border border-danger bg-danger-light px-4 py-3 text-sm text-danger-dark">
              {error}
            </div>
          ) : comments.length === 0 ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
                <FaCommentAlt size={20} />
              </div>

              <h3 className="text-base font-semibold text-text-primary">
                No comments yet
              </h3>

              <p className="mt-1 text-sm text-text-secondary">
                There are no comments for this request.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="rounded-admin-lg border border-border bg-surface p-4 shadow-admin-sm"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text-primary">
                        {getUserName(comment)}
                      </p>

                      {comment.user?.role && (
                        <p className="mt-0.5 text-xs uppercase tracking-wide text-brand">
                          {comment.user.role}
                        </p>
                      )}
                    </div>

                    <span className="shrink-0 text-xs text-text-muted">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>

                  <p className="whitespace-pre-wrap text-sm leading-6 text-text-secondary">
                    {comment.msg}
                  </p>

                  {comment.attachments?.length > 0 && (
                    <div className="mt-4 border-t border-border-light pt-3">
                      <div className="mb-2 flex items-center gap-2">
                        <FaPaperclip
                          size={12}
                          className="text-brand"
                        />

                        <span className="text-xs font-semibold text-text-primary">
                          Attachments ({comment.attachments.length})
                        </span>
                      </div>

                      <div className="space-y-2">
                        {comment.attachments.map(
                          (attachment, index) => {
                            const fileUrl =
                              attachment.url ||
                              attachment.secure_url ||
                              attachment.path;

                            const fileName =
                              attachment.originalName ||
                              attachment.originalname ||
                              attachment.fileName ||
                              attachment.name ||
                              `Attachment ${index + 1}`;

                            const isDownloading =
                              downloadingId === attachment._id;

                            return (
                              <div
                                key={
                                  attachment._id ||
                                  `${fileName}-${index}`
                                }
                                className="flex items-center justify-between gap-3 rounded-admin border border-border bg-background-soft px-3 py-2.5"
                              >
                                <div className="flex min-w-0 items-center gap-2.5">
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
                                    <FaFile size={13} />
                                  </div>

                                  <span className="truncate text-xs font-medium text-text-primary">
                                    {fileName}
                                  </span>
                                </div>

                                <div className="flex shrink-0 items-center gap-1">
                                  {fileUrl && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleViewAttachment(
                                          fileUrl
                                        )
                                      }
                                      title="View attachment"
                                      aria-label="View attachment"
                                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-text-secondary transition hover:bg-brand-soft hover:text-brand"
                                    >
                                      <FaEye size={13} />
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDownloadAttachment(
                                        attachment
                                      )
                                    }
                                    disabled={
                                      isDownloading ||
                                      !attachment?._id
                                    }
                                    title={
                                      isDownloading
                                        ? "Downloading..."
                                        : "Download attachment"
                                    }
                                    aria-label="Download attachment"
                                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-brand transition hover:bg-brand-soft hover:text-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {isDownloading ? (
                                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand-muted border-t-brand" />
                                    ) : (
                                      <FaDownload size={13} />
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 justify-end border-t border-border-light bg-background-soft px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-admin border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-soft cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCommentsModal;
"use client";

import { useState } from "react";
import {
  FaCommentAlt,
  FaPaperclip,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

import FileInput from "@/components/ui/FileInput";
import { Button } from "@/components/ui/Button";

import { addComment } from "@/axiosApi/serviceRequestApi";
import {toast} from "react-toastify"

const AddCommentModal = ({
  isOpen,
  onClose,
  requestId,
  onSuccess,
}) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    if (loading) return;

    setMessage("");
    setAttachments([]);
    setError("");

    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Comment message is required.");
      return;
    }

    if (!requestId) {
      setError("Request ID is missing.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("message", message.trim());

      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      const result = await addComment(requestId, formData);

      setMessage("");
      setAttachments([]);
      setError("");

      if (onSuccess) {
        await onSuccess(result);
      }
      toast.success("Comment Add Successfully")

      onClose();
    } catch (error) {
      console.error("Add comment error:", error);

      setError(
        error?.response?.data?.message || "Failed to add comment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-admin-xl border border-border bg-modal-background shadow-admin-lg">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-border-light bg-background-soft px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-admin bg-brand-soft text-brand">
              <FaCommentAlt size={15} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-text-primary">
                Add Comment
              </h2>

              <p className="text-xs text-text-secondary">
                Add a message or attach supporting files.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition hover:bg-brand-soft hover:text-brand disabled:cursor-not-allowed cursor-pointer"
          >
            <FaTimes size={15} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-5">
            {/* ERROR */}
            {error && (
              <div className="rounded-admin border border-danger bg-danger-light px-4 py-3 text-sm text-danger-dark">
                {error}
              </div>
            )}

            {/* MESSAGE */}
            <div>
              <label
                htmlFor="comment-message"
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                Comment
                <span className="ml-1 text-danger">*</span>
              </label>

              <textarea
                id="comment-message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                placeholder="Write your comment..."
                rows={5}
                disabled={loading}
                className="w-full resize-none rounded-admin border border-input-border bg-input-background px-3.5 py-3 text-sm text-text-primary placeholder:text-input-placeholder outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* ATTACHMENTS */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <FaPaperclip size={13} className="text-brand" />

                <span className="text-sm font-medium text-text-primary">
                  Attachments
                </span>
              </div>

              <FileInput
                label=""
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                file={attachments}
                multiple={true}
                disabled={loading}
                onChange={setAttachments}
                helperText="You can select multiple files."
                resetKey={isOpen}
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-end gap-3 border-t border-border-light bg-background-soft px-5 py-4">
            <Button
              type="button"
              variant="secondary"
              disabled={loading}
              onClick={handleClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={loading}
              loadingText="Adding..."
              className="flex items-center gap-2"
            >
              {!loading && <FaCheck size={12} />}
              Add Comment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCommentModal;
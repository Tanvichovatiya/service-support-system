
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiPaperclip,
} from "react-icons/fi";
import { FaComment, FaCommentMedical } from "react-icons/fa";

import RequestStatusBadge from "./RequestStatusBadge";
import { formatDate } from "@/helperFunction/formateDate";
import { getPriorityStyle ,getStatusStyle } from "@/helperFunction/statusStyle";
import AddCommentModal from "../comment/AddCommentModal";
import ViewCommentsModal from "../comment/viewCommentsModal";
import RequestHistoryModal from "./RequestHistroyModal";

export default function RequestCard({ request }) {
  const priorityStyle = getPriorityStyle(request.priority);

  const [showAddComment, setShowAddComment] = useState(false);
  const [showViewComments, setShowViewComments] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCommentSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const actionButtonClass =
    "cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg border border-border-light bg-surface text-text-secondary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand hover:bg-brand-soft hover:text-brand hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-soft";

  return (
    <>
      <div className="group flex min-h-[300px] flex-col rounded-2xl border-[1.5px] border-brand bg-surface p-5  transition-all duration-200 hover:-translate-y-0.5  hover:border-brand-dark hover:shadow-admin-hover ">
       
        <div className="flex items-start gap-4 justify-between border-b border-border-light pb-4">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-md bg-brand/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand">
                {request.category?.name || "General"}
              </span>
            </div>

            <h3 className="line-clamp-2 text-base font-semibold leading-6 text-text-primary">
              {request.title}
            </h3>
          </div>

          <div className="shrink-0">
            <RequestStatusBadge status={request.status} />
          </div>
        </div>

        

        <div className="flex-1 py-4">
          <p className="text-sm leading-6 text-text-secondary">
            {request.description
              ? request.description.length > 180
                ? `${request.description.slice(0, 180)}...`
                : request.description
              : "No description provided."}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border-light py-4">
          
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <FiClock size={14} />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wide text-text-muted">
                Priority
              </p>

              <span
                className={`text-xs font-semibold capitalize ${priorityStyle.className}`}
              >
                {priorityStyle.label}
              </span>
            </div>
          </div>

          
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <FiPaperclip size={14} />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wide text-text-muted">
                Attachments
              </p>

              <p className="text-xs font-medium text-text-primary">
                {request.attachments?.length || 0}{" "}
                {request.attachments?.length === 1 ? "File" : "Files"}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border-light pt-4">

          <div className="flex items-center justify-between gap-3">

            <div className="flex items-center gap-2">
              <FiCalendar size={14} className="text-text-muted" />

              <div>
                <p className="text-[10px] uppercase tracking-wide text-text-muted">
                  Created
                </p>

                <p className="text-xs font-medium text-text-secondary">
                  {formatDate(request.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
             
              <button
                type="button"
                onClick={() => setShowAddComment(true)}
                title="Add Comment"
                aria-label="Add Comment"
                className={actionButtonClass}
              >
                <FaCommentMedical size={15} />
              </button>

              
              <button
                type="button"
                onClick={() => setShowViewComments(true)}
                title="View Comments"
                aria-label="View Comments"
                className={actionButtonClass}
              >
                <FaComment size={15} />
              </button>
            </div>
          </div>

          <div className="mt-3 flex justify-end gap-2">
           
            <button
              type="button"
              onClick={() => setShowHistory(true)}
              title="Request History"
              aria-label="Request History"
              className="cursor-pointer flex items-center gap-2 rounded-lg border border-border-light bg-surface px-3.5 py-2 text-xs font-semibold text-text-secondary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand hover:bg-brand-soft hover:text-brand hover:shadow-md"
            >
              <FiClock size={14} />
              <span>History</span>
            </button>

           
            <Link
              href={`/user/requests/${request._id}`}
              title="View Details"
              className="flex items-center gap-2 rounded-lg bg-brand px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-brand-dark"
            >
              <span>View Details</span>
              <FiArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>

    
      <AddCommentModal
        isOpen={showAddComment}
        onClose={() => setShowAddComment(false)}
        requestId={request._id}
        onSuccess={handleCommentSuccess}
      />

     
      <ViewCommentsModal
        isOpen={showViewComments}
        onClose={() => setShowViewComments(false)}
        requestId={request._id}
        refreshKey={refreshKey}
      />
      <RequestHistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        requestId={request._id}
      />
    </>
  );
}

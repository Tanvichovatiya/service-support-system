
"use client";

import { useEffect, useMemo, useState } from "react";
import { FiClock, FiLoader, FiX } from "react-icons/fi";

import { getRequestHistroy } from "@/axiosApi/serviceRequestApi";
import { formatDate } from "@/helperFunction/formateDate";
import { formatRequestHistory } from "@/helperFunction/histroyHelper";

import RequestStatusBadge from "./RequestStatusBadge";
import HistoryTimeline from "./HistroyTimeline";

const RequestHistoryModal = ({
  isOpen,
  onClose,
  requestId,
}) => {
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !requestId) {
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getRequestHistroy(requestId);
        const formattedHistory = formatRequestHistory(data);

        setHistoryData(formattedHistory);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Something went wrong while fetching request history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isOpen, requestId]);

  useEffect(() => {
    if (!isOpen) {
      setHistoryData(null);
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  const history = useMemo(
    () => historyData?.history || [],
    [historyData]
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-modal-background shadow-admin-lg">
        <div className="flex items-start justify-between border-b border-border-light px-5 py-4">
          <div className="min-w-0">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-brand">
              Request History
            </p>

            <h2 className="truncate text-lg font-semibold text-text-primary">
              {historyData?.request?.title || "Request History"}
            </h2>

            {historyData?.request && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-text-muted">
                  Created {formatDate(historyData.request.createdAt)}
                </span>

                <span className="text-border-dark">•</span>

                <RequestStatusBadge
                  status={historyData.request.status}
                />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close request history"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-muted transition hover:bg-background-soft hover:text-text-primary cursor-pointer"
          >
            <FiX size={19} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {loading && (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <FiLoader
                  className="animate-spin"
                  size={18}
                />
                Loading request history...
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-danger/20 bg-danger-light px-4 py-4 text-sm text-danger-dark">
              {error}
            </div>
          )}

          {!loading && !error && history.length === 0 && (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <FiClock size={20} />
                </div>

                <h3 className="text-sm font-semibold text-text-primary">
                  No history available
                </h3>

                <p className="mt-1 text-xs text-text-muted">
                  No activity has been recorded for this request yet.
                </p>
              </div>
            </div>
          )}

          {!loading && !error && history.length > 0 && (
            <HistoryTimeline history={history} />
          )}
        </div>

        <div className="flex items-center justify-end border-t border-border-light bg-surface-soft px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border-light bg-surface px-4 py-2 text-xs font-semibold text-text-secondary transition hover:border-brand hover:bg-brand-soft hover:text-brand cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestHistoryModal;

"use client";

import { useEffect, useMemo, useState } from "react";

import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiLoader,
  FiRefreshCw,
  FiUser,
  FiX,
} from "react-icons/fi";

import RequestStatusBadge from "./RequestStatusBadge";

import { getRequestHistroy } from "@/axiosApi/serviceRequestApi";
import { formatDate } from "@/helperFunction/formateDate";
import { formatRequestHistory , formatStatus} from "@/helperFunction/histroyHelper";

const HISTORY_ICONS = {
  check: FiCheckCircle,
  user: FiUser,
  refresh: FiRefreshCw,
  edit: FiEdit3,
  clock: FiClock,
  x: FiX,
};


const StaffCard = ({ staff, type = "new" }) => {
  if (!staff) {
    return (
      <div className="flex-1 rounded-lg bg-background-soft px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
          {type === "old" ? "Previous Staff" : "New Staff"}
        </p>

        <p className="mt-1 text-xs font-medium text-text-muted">
          Not available
        </p>
      </div>
    );
  }

  const isOld = type === "old";

  const staffName =
    [staff.firstname, staff.lastname]
      .filter(Boolean)
      .join(" ")
      .trim() || "Unknown Staff";

  return (
    <div
      className={`flex-1 rounded-lg px-3 py-2.5 ${
        isOld
          ? "bg-danger-light"
          : "bg-success-light"
      }`}
    >
   
      <p
        className={`text-[10px] font-semibold uppercase tracking-wide ${
          isOld
            ? "text-danger-dark"
            : "text-success-dark"
        }`}
      >
        {isOld ? "Previous Staff" : "New Staff"}
      </p>

      {/* STAFF */}

      <div className="mt-1 flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-brand">
          <FiUser size={13} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-text-primary">
            {staffName}
          </p>

          {staff.email && (
            <p className="truncate text-[10px] text-text-muted">
              {staff.email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};



const AssignmentDetails = ({ assignment }) => {
  if (!assignment) {
    return null;
  }


  if (!assignment.isReassigned) {
    return (
      <div className="mt-3 rounded-lg border border-border-light bg-surface-soft px-3 py-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
          Assigned To
        </p>

        <StaffCard
          staff={assignment.newStaff}
          type="new"
        />
      </div>
    );
  }


  return (
    <div className="mt-3 rounded-lg border border-border-light bg-surface px-3 py-3">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
        Staff Reassignment
      </p>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      
        <StaffCard
          staff={assignment.oldStaff}
          type="old"
        />

     

        <div className="flex justify-center px-1 text-text-muted">
          <FiArrowRight size={16} />
        </div>


        <StaffCard
          staff={assignment.newStaff}
          type="new"
        />
      </div>
    </div>
  );
};


const StatusChange = ({ item }) => {
  if (!item?.statusChange) {
    return null;
  }

  const oldStatus = item.oldValue?.status;
  const newStatus = item.newValue?.status;

  if (!oldStatus || !newStatus) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-background-soft px-3 py-2.5">
   
      <span className="rounded-md bg-surface px-2 py-1 text-[11px] font-medium capitalize text-text-secondary">
        {formatStatus(oldStatus)}
      </span>

      <FiArrowRight
        size={13}
        className="text-text-muted"
      />

      <span className="rounded-md bg-brand-soft px-2 py-1 text-[11px] font-semibold capitalize text-brand">
        {formatStatus(newStatus)}
      </span>
    </div>
  );
};


const CreatedRequestDetails = ({ values }) => {
  if (!values?.length) {
    return null;
  }

  const filteredValues = values.filter(
    (value) =>
      !value
        ?.toLowerCase()
        .startsWith("category id:")
  );

  if (!filteredValues.length) {
    return null;
  }

  return (
    <div className="mt-3 rounded-lg border border-border-light bg-surface px-3 py-2.5">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
        Request Details
      </p>

      <div className="space-y-1.5">
        {filteredValues.map((value, index) => (
          <p
            key={`${value}-${index}`}
            className="break-words text-xs text-text-secondary"
          >
            {value}
          </p>
        ))}
      </div>
    </div>
  );
};


const GenericChanges = ({ changes }) => {
  if (!changes) {
    return null;
  }

  const {
    oldValues = [],
    newValues = [],
  } = changes;

  if (
    !oldValues.length &&
    !newValues.length
  ) {
    return null;
  }

  return (
    <div className="mt-3 grid gap-2 sm:grid-cols-2">
      {/* =================================================
          PREVIOUS
      ================================================= */}

      {oldValues.length > 0 && (
        <div className="rounded-lg bg-danger-light px-3 py-2.5">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-danger-dark">
            Previous
          </p>

          <div className="space-y-1">
            {oldValues.map((value, index) => (
              <p
                key={`${value}-${index}`}
                className="break-words text-xs text-text-secondary"
              >
                {value}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* =================================================
          UPDATED
      ================================================= */}

      {newValues.length > 0 && (
        <div className="rounded-lg bg-success-light px-3 py-2.5">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-success-dark">
            Updated
          </p>

          <div className="space-y-1">
            {newValues.map((value, index) => (
              <p
                key={`${value}-${index}`}
                className="break-words text-xs text-text-secondary"
              >
                {value}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};



export default function RequestHistoryModal({
  isOpen,
  onClose,
  requestId,
}) {
  const [historyData, setHistoryData] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  /* =======================================================
     FETCH HISTORY
  ======================================================= */

  useEffect(() => {
    if (!isOpen || !requestId) {
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getRequestHistroy(requestId);

     
        // const data =
        //   response?.data?.data ??
        //   response?.data ??
        //   response;

        const formattedHistory =
          formatRequestHistory(data);

        setHistoryData(
          formattedHistory,
        );
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Something went wrong while fetching request history.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isOpen, requestId]);



  const history = useMemo(() => {
    return historyData?.history || [];
  }, [historyData]);


  useEffect(() => {
    if (!isOpen) {
      setHistoryData(null);
      setError("");
      setLoading(false);
    }
  }, [isOpen]);



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
              {historyData?.request?.title ||
                "Request History"}
            </h2>

        

            {historyData?.request && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-text-muted">
                  Created{" "}
                  {formatDate(
                    historyData.request
                      .createdAt,
                  )}
                </span>

                <span className="text-border-dark">
                  •
                </span>

                <RequestStatusBadge
                  status={
                    historyData.request
                      .status
                  }
                />
              </div>
            )}
          </div>



          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-text-muted transition hover:bg-background-soft hover:text-text-primary"
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


       

          {!loading &&
            !error &&
            history.length === 0 && (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">

                
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
                    <FiClock size={20} />
                  </div>

                  <h3 className="text-sm font-semibold text-text-primary">
                    No history available
                  </h3>

                  {/* DESCRIPTION */}

                  <p className="mt-1 text-xs text-text-muted">
                    No activity has been
                    recorded for this request
                    yet.
                  </p>
                </div>
              </div>
            )}



          {!loading &&
            !error &&
            history.length > 0 && (
              <div className="relative">


                <div className="absolute bottom-5 left-[19px] top-5 w-px bg-border-light" />


                

                <div className="space-y-6">

                  {history.map((item) => {


                    const config =
                      item.actionConfig;


                    const Icon =
                      HISTORY_ICONS[
                        config?.iconName
                      ] || FiEdit3;


                    return (
                      <div
                        key={item._id}
                        className="relative flex gap-4"
                      >

                        {/* =================================================
                            TIMELINE ICON
                        ================================================= */}

                        <div
                          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            config?.bg ||
                            "bg-brand-soft"
                          } ${
                            config?.color ||
                            "text-brand"
                          }`}
                        >
                          <Icon size={16} />
                        </div>



                        <div className="min-w-0 flex-1 rounded-xl border border-border-light bg-brand-soft p-4 shadow-admin-sm">

                          {/* =================================================
                              TITLE / USER / DATE
                          ================================================= */}

                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                            {/* LEFT */}

                            <div>
                              <h3 className="text-sm font-semibold text-text-primary">
                                {config?.label ||
                                  "Request Updated"}
                              </h3>


                              {/* USER */}

                              {item.userName && (
                                <div className="mt-1 flex items-center gap-1.5 text-xs text-text-muted">
                                  <FiUser
                                    size={12}
                                  />

                                  <span>
                                    {
                                      item.userName
                                    }

                                    {item.userId
                                      ?.role
                                      ? ` • ${item.userId.role}`
                                      : ""}
                                  </span>
                                </div>
                              )}
                            </div>


                            {/* DATE */}

                            <span className="shrink-0 text-[11px] text-text-muted">
                              {formatDate(
                                item.createdAt,
                              )}
                            </span>
                          </div>


                          <p className="mt-3 text-xs leading-5 text-text-secondary">
                            {item.description ||
                              "The service request was updated."}
                          </p>



                          <AssignmentDetails
                            assignment={
                              item.assignment
                            }
                          />


                          <StatusChange
                            item={item}
                          />


                          <CreatedRequestDetails
                            values={
                              item.createdDetails
                            }
                          />


                          <GenericChanges
                            changes={
                              item.genericChanges
                            }
                          />

                        </div>
                      </div>
                    );
                  })}

                </div>
              </div>
            )}
        </div>


        <div className="flex items-center justify-end border-t border-border-light bg-surface-soft px-5 py-3">

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-border-light bg-surface px-4 py-2 text-xs font-semibold text-text-secondary transition hover:border-brand hover:bg-brand-soft hover:text-brand"
          >
            Close
          </button>

        </div>
      </div>
    </div>
  );
}
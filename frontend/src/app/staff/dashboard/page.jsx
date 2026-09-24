
"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  FiBriefcase,
  FiClock,
  FiCheckCircle,
  FiActivity,
  FiEye,
  FiCheck,
  FiArrowRight,
  FiRefreshCw,
  FiAlertCircle,
  FiCalendar,
  FiLayers,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

import { getStaffPerformance } from "@/axiosApi/staffApi";
import { acceptAssignedRequest } from "@/axiosApi/serviceRequestApi"

import {
  fadeUp,
  fadeLeft,
  fadeRight,
} from "@/components/ui/Animation";
import {
  getStatusStyle,
  getPriorityStyle,
} from "@/helperFunction/statusStyle";

const StaffDashboard = () => {
  const router = useRouter();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);



  const fetchDashboard = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const data = await getStaffPerformance();

        setDashboard(data);
      } catch (error) {
        console.error(
          "Failed to fetch staff performance:",
          error
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);



  const handleAccept = async (requestId) => {
    if (!requestId || acceptingId) {
      return;
    }

    try {
      setAcceptingId(requestId);

      await acceptAssignedRequest(requestId);

      // Refresh dashboard after accepting
      await fetchDashboard(true);
    } catch (error) {
      console.error(
        "Failed to accept request:",
        error
      );
    } finally {
      setAcceptingId(null);
    }
  };



  const handleView = (requestId) => {
    if (!requestId) {
      return;
    }

    router.push(`/staff/requests/${requestId}`);
  };



  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };



  const formatDuration = (milliseconds) => {
    if (!milliseconds || milliseconds <= 0) {
      return "—";
    }

    const totalMinutes = Math.round(
      milliseconds / (1000 * 60)
    );

    const days = Math.floor(
      totalMinutes / (60 * 24)
    );

    const hours = Math.floor(
      (totalMinutes % (60 * 24)) / 60
    );

    const minutes = totalMinutes % 60;

    if (days > 0) {
      return `${days}d ${hours}h`;
    }

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-background px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[500px] items-center justify-center rounded-admin-xl border border-border bg-surface shadow-admin-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
                <FiRefreshCw
                  size={21}
                  className="animate-spin"
                />
              </div>

              <div className="text-center">
                <p className="font-semibold text-text-primary">
                  Loading dashboard
                </p>

                <p className="mt-1 text-sm text-text-muted">
                  Fetching your service performance...
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const summary = dashboard?.summary || {};

  const requests =
    dashboard?.recentRequests || [];



  const stats = [
    {
      title: "Total Assigned",
      value: summary.totalAssigned || 0,
      description: "Service requests assigned to you",
      icon: FiBriefcase,
      iconClass: "bg-brand-soft text-brand",
    },

    {
      title: "In Progress",
      value: summary.inProgress || 0,
      description: "Requests currently being handled",
      icon: FiActivity,
      iconClass: "bg-warning-light text-warning-dark",
    },

    {
      title: "Completed",
      value: summary.completed || 0,
      description: "Successfully completed requests",
      icon: FiCheckCircle,
      iconClass: "bg-success-light text-success-dark",
    },

    {
      title: "Avg. Completion",
      value: formatDuration(
        summary.averageCompletionTimeMs
      ),
      description: "Average time to complete",
      icon: FiClock,
      iconClass: "bg-info-light text-info",
    },
  ];

  return (
    <main className="min-h-[calc(100vh-72px)] rounded-admin bg-gradient-to-b from-brand-light via-accent-soft to-accent px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">



        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: false,
            amount: 0.2
          }}

          className="relative mb-6 overflow-hidden rounded-admin-xl border border-border bg-surface p-6 shadow-admin-sm"
        >

          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-brand-soft/70 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                <FiActivity size={13} />
                Staff Performance
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                Staff Dashboard
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">
                Track your assigned service requests,
                current workload, and completion
                performance from one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-admin border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-secondary shadow-admin-sm transition-all duration-200 hover:border-brand hover:bg-brand-soft hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiRefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>
        </motion.div>



        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: false,
            amount: 0.2
          }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.title}
                whileHover={{
                  y: -5,
                  transition: {
                    duration: 0.2,
                  },
                }}
                className="group rounded-admin-xl border border-border bg-surface p-5 shadow-admin-sm transition-shadow duration-200 hover:shadow-admin"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-text-muted">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight text-text-primary">
                      {stat.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-admin ${stat.iconClass}`}
                  >
                    <Icon size={21} />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-border-light pt-3">
                  <span className="text-xs leading-5 text-text-muted">
                    {stat.description}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>



        <motion.section
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: false,
            amount: 0.2
          }}
          className="mt-6"
        >
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FiLayers
                  size={19}
                  className="text-brand"
                />

                <h2 className="text-lg font-bold text-brand">
                  Recent Service Requests
                </h2>
              </div>

              <p className="mt-1 text-sm text-text-muted">
                Your latest assigned service requests.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push("/staff/requests/all")
              }
              className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-brand transition hover:text-brand-dark cursor-pointer"
            >
              View all
              <FiArrowRight size={15} />
            </button>
          </div>


          {requests.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-admin-xl border border-border bg-surface px-6 text-center shadow-admin-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
                <FiBriefcase size={23} />
              </div>

              <h3 className="mt-4 font-semibold text-text-primary">
                No service requests
              </h3>

              <p className="mt-1 max-w-md text-sm text-text-muted">
                You don't have any assigned service
                requests at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {requests.map((request, index) => {
                const status = getStatusStyle(request.status);
                const priority = getPriorityStyle(request.priority);


                const isAssigned =
                  request.status === "assigned";

                const isAccepting =
                  acceptingId === request._id;

                return (
                  <motion.article
                    key={request._id}
                    variants={
                      index % 2 === 0
                        ? fadeLeft
                        : fadeRight
                    }
                    initial="hidden"
                    animate="visible"
                    transition={{
                      delay: 0.1 + index * 0.08,
                    }}
                    whileHover={{
                      y: -4,
                      transition: {
                        duration: 0.2,
                      },
                    }}
                    className="group rounded-admin-xl border border-border bg-surface p-5 shadow-admin-sm transition-shadow duration-200 hover:shadow-admin"
                  >
                    {/* Top */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          {/* Category */}
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand">
                            <FiLayers size={11} />

                            {request.category?.name ||
                              "Uncategorized"}
                          </span>

                          {/* Priority */}
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${priority.className}`}
                          >
                            {priority.label}
                          </span>
                        </div>

                        <h3 className="line-clamp-2 text-base font-bold text-text-primary transition-colors group-hover:text-brand">
                          {request.title}
                        </h3>
                      </div>

                      {/* Status */}
                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${status.className}`}
                      >
                        {request.status ===
                          "completed" && (
                            <FiCheckCircle
                              size={11}
                            />
                          )}

                        {request.status ===
                          "in_progress" && (
                            <FiActivity size={11} />
                          )}

                        {request.status ===
                          "assigned" && (
                            <FiAlertCircle
                              size={11}
                            />
                          )}

                        {status.label}
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-text-secondary">
                      {request.description}
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-2 border-y border-border-light py-3 sm:grid-cols-2">
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <FiCalendar
                          size={14}
                          className="shrink-0 text-brand"
                        />

                        <span>
                          Assigned{" "}
                          {formatDate(
                            request.assignedAt
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <FiClock
                          size={14}
                          className="shrink-0 text-brand"
                        />

                        <span>
                          {request.startedAt
                            ? `Started ${formatDate(
                              request.startedAt
                            )}`
                            : "Not started yet"}
                        </span>
                      </div>
                    </div>

                   
                    {request.completedAt && (
                      <div className="mt-3 flex items-center gap-2 text-xs font-medium text-success">
                        <FiCheckCircle size={14} />

                        <span>
                          Completed{" "}
                          {formatDate(
                            request.completedAt
                          )}
                        </span>
                      </div>
                    )}

                    
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {/* Accept only assigned */}
                      {isAssigned && (
                        <button
                          type="button"
                          onClick={() =>
                            handleAccept(
                              request._id
                            )
                          }
                          disabled={isAccepting}
                          className="inline-flex items-center justify-center gap-2 rounded-admin bg-success px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-success-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                        >
                          {isAccepting ? (
                            <FiRefreshCw
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <FiCheck size={14} />
                          )}

                          {isAccepting
                            ? "Accepting..."
                            : "Accept"}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleView(
                            request._id
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-admin border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-brand transition-all duration-200 hover:border-brand hover:bg-brand-soft cursor-pointer"
                      >
                        <FiEye size={14} />
                        View
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </motion.section>
      </div>
    </main>
  );
};

export default StaffDashboard;

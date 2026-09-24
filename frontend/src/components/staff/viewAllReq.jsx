
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import {
  FaSearch,
  FaEye,
  FaFilter,
  FaCheck,
  FaClipboardList,
  FaCheckCircle,
} from "react-icons/fa";
import { FaComment } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/Button";

import { setError, setLoading } from "@/redux/slice/authSlice";
import { setAssignedRequests } from "@/redux/slice/staffRequestSlice";

import {
  getPriorityStyle,
  getStatusStyle,
} from "@/helperFunction/statusStyle";

import {
  acceptAssignedRequest,
  getAssignedRequests,
  updateRequestStatus,
} from "@/axiosApi/serviceRequestApi";

import AddCommentModal from "../comment/AddCommentModal";
import ViewCommentsModal from "../comment/viewCommentsModal";
import { FaCommentMedical } from "react-icons/fa";

const ViewAllReq = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    requests = [],
    page = 1,
    limit = 2,
    totalRequest = 0,
    totalPages = 0,
  } = useSelector((state) => state.staffServiceReq);

  const { loading, error } = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [acceptingId, setAcceptingId] = useState(null);
  const [completingId, setCompletingId] = useState(null);

  const [commentModal, setCommentModal] = useState({
    open: false,
    requestId: null,
  });

  const [viewCommentsModal, setViewCommentsModal] = useState({
    open: false,
    requestId: null,
  });

  const [commentsRefreshKey, setCommentsRefreshKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 900);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchAssignedRequests = async (pageNumber = 1) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(""));

      const result = await getAssignedRequests({
        page: pageNumber,
        status,
        priority,
        search: debouncedSearch,
      });

      dispatch(
        setAssignedRequests({
          requests: result.requests || [],
          page: result.page || 1,
          limit: result.limit || 2,
          totalRequest: result.totalRequest || 0,
          totalPages: result.totalPages || 0,
        })
      );
    } catch (error) {
      console.error("Staff request fetch error:", error);

      dispatch(
        setError(
          error?.response?.data?.message ||
          "Failed to load requests."
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAssignedRequests(1);
  }, [debouncedSearch, status, priority]);

  const handlePageChange = (pageNumber) => {
    fetchAssignedRequests(pageNumber);
  };

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatus("");
    setPriority("");
  };

  const handleAccept = async (requestId) => {
    try {
      setAcceptingId(requestId);
      dispatch(setError(""));

      await acceptAssignedRequest(requestId);
      await fetchAssignedRequests(page);
    } catch (error) {
      console.error("Accept request error:", error);

      dispatch(
        setError(
          error?.response?.data?.message ||
          "Failed to accept service request."
        )
      );
    } finally {
      setAcceptingId(null);
    }
  };

  const handleComplete = async (requestId) => {
    try {
      setCompletingId(requestId);
      dispatch(setError(""));

      await updateRequestStatus(requestId, "completed");
      await fetchAssignedRequests(page);
    } catch (error) {
      console.error("Complete request error:", error);

      dispatch(
        setError(
          error?.response?.data?.message ||
          "Failed to mark request as completed."
        )
      );
    } finally {
      setCompletingId(null);
    }
  };

  const handleView = (requestId) => {
    router.push(`/staff/requests/${requestId}`);
  };

  const handleAddComment = (requestId) => {
    setCommentModal({
      open: true,
      requestId,
    });
  };

  const closeAddCommentModal = () => {
    setCommentModal({
      open: false,
      requestId: null,
    });
  };

  const handleViewComments = (requestId) => {
    setViewCommentsModal({
      open: true,
      requestId,
    });
  };

  const closeViewCommentsModal = () => {
    setViewCommentsModal({
      open: false,
      requestId: null,
    });
  };

  const handleCommentSuccess = () => {
    setCommentsRefreshKey((previous) => previous + 1);
  };

  return (
    <>
      <main className="min-h-[calc(100vh-165px)] bg-background px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-1 text-sm font-medium uppercase tracking-wider text-brand">
                  Staff Workspace
                </p>

                <h1 className="text-2xl font-semibold text-text-primary sm:text-3xl">
                  My Requests
                </h1>

                <p className="mt-1 max-w-2xl text-sm text-text-secondary sm:text-base">
                  View and manage all service requests assigned to you.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-admin bg-brand-soft px-4 py-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-brand">
                  <FaClipboardList size={15} />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-brand">
                    Total Requests
                  </p>

                  <p className="text-xl font-semibold text-brand">
                    {totalRequest}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-admin-lg border-[2.1px] border-brand bg-surface p-4 shadow-admin-sm sm:p-5 hover:shadow-admin-hover">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-admin bg-brand-soft text-brand">
                <FaFilter size={14} />
              </div>

              <div>
                <h2 className="font-semibold text-text-primary">
                  Find Requests
                </h2>

                <p className="text-xs text-text-muted">
                  Search and filter your requests
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="lg:col-span-2">
                <label
                  htmlFor="search"
                  className="mb-1.5 block text-sm font-medium text-text-secondary"
                >
                  Search
                </label>

                <div className="relative">
                  <FaSearch
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                    size={14}
                  />

                  <input
                    id="search"
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search title, description, category or customer..."
                    className="
                      w-full
                      rounded-admin
                      border
                      border-input-border
                      bg-input-background
                      py-2.5
                      pl-9
                      pr-10
                      text-sm
                      text-text-primary
                      placeholder:text-input-placeholder
                      outline-none
                      transition
                      focus:border-brand
                      focus:ring-2
                      focus:ring-brand-soft
                    "
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="
                        absolute
                        right-2
                        top-1/2
                        flex
                        h-7
                        w-7
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-full
                        text-text-muted
                        transition
                        hover:bg-brand-soft
                        hover:text-brand
                      "
                    >
                      <IoClose size={17} />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="mb-1.5 block text-sm font-medium text-text-secondary"
                >
                  Status
                </label>

                <select
                  id="status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="
                    w-full
                    rounded-admin
                    border
                    border-input-border
                    bg-input-background
                    px-3
                    py-2.5
                    text-sm
                    text-text-primary
                    outline-none
                    transition
                    focus:border-brand
                    focus:ring-2
                    focus:ring-brand-soft
                  "
                >
                  <option value="">All Status</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="mb-1.5 block text-sm font-medium text-text-secondary"
                >
                  Priority
                </label>

                <select
                  id="priority"
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                  className="
                    w-full
                    rounded-admin
                    border
                    border-input-border
                    bg-input-background
                    px-3
                    py-2.5
                    text-sm
                    text-text-primary
                    outline-none
                    transition
                    focus:border-brand
                    focus:ring-2
                    focus:ring-brand-soft
                  "
                >
                  <option value="">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {(search || status || priority) && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="cursor-pointer text-sm font-medium text-brand transition hover:text-brand-dark"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-5 rounded-admin border border-danger bg-danger-light px-4 py-3 text-sm text-danger-dark">
              {error}
            </div>
          )}

          <div className="rounded-admin-lg border-[2.1px] border-brand bg-surface p-4 shadow-admin-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  My Service Requests
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                  Assigned, in-progress and completed requests
                </p>
              </div>

              {!loading && requests.length > 0 && (
                <span className="w-fit rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
                  {requests.length} on this page
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex min-h-[350px] flex-col items-center justify-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-muted border-t-brand" />

                <p className="text-sm text-text-secondary">
                  Loading requests...
                </p>
              </div>
            ) : requests.length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <FaClipboardList size={22} />
                </div>

                <h3 className="text-lg font-semibold text-text-primary">
                  No requests found
                </h3>

                <p className="mt-1 max-w-md text-sm text-text-secondary">
                  There are no service requests matching your current
                  filters.
                </p>

                {(search || status || priority) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4  text-sm font-medium text-brand hover:text-brand-dark cursor-pointer"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {requests.map((request) => {
                  const customerName = [
                    request.user?.firstname,
                    request.user?.lastname,
                  ]
                    .filter(Boolean)
                    .join(" ");

                  const priorityStyle = getPriorityStyle(request.priority);
                  const statusStyle = getStatusStyle(request.status);

                  const isAssigned = request.status === "assigned";
                  const isInProgress = request.status === "in_progress";

                  const isAccepting = acceptingId === request._id;
                  const isCompleting = completingId === request._id;

                  return (
                    <article
                      key={request._id}
                      className=" group flex  min-h-[430px]  flex-col overflow-hidden rounded-admin-lg border border-border bg-surface shadow-admin-hover hover:border-brand-light hover:border-[2.1px]"
                    >
                      <div className="flex flex-1 flex-col p-5">
                        <div className="mb-5 flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand">
                              Service Request
                            </p>

                            <h3
                              title={request.title}
                              className=" line-clamp-2 min-h-[48px] text-[17px] font-semibold leading-6 text-text-primary"
                            >
                              {request.title}
                            </h3>
                          </div>

                          <span
                            className={`  shrink-0  rounded-full border px-3 py-1.5 text-[11px] font-semibold ${priorityStyle.className}`}
                          >
                            {priorityStyle.label}
                          </span>
                        </div>

                        <div className="mb-5 flex items-center justify-between border-b border-border-light pb-4">
                          <span className="text-xs font-medium text-text-muted">
                            Status
                          </span>

                          <span
                            className={` rounded-full px-3 py-1.5 text-[11px] font-semibold ${statusStyle.className}`}
                          >
                            {statusStyle.label}
                          </span>
                        </div>

                        <div className="mb-4">
                          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-text-muted">
                            Category
                          </p>

                          <p className="truncate text-sm font-semibold text-brand">
                            {request.category?.name || "Uncategorized"}
                          </p>
                        </div>

                        <div className="mb-5">
                          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-text-muted">
                            Description
                          </p>

                          <p
                            className=" line-clamp-3 min-h-[60px] text-sm leading-5 text-text-secondary"
                          >
                            {request.description || "No description provided."}
                          </p>
                        </div>

                        <div className="mt-auto rounded-admin border border-border-light bg-background-soft p-3.5">
                          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-text-muted">
                            Customer
                          </p>

                          <p className="truncate text-sm font-semibold text-text-primary">
                            {customerName || "Unknown customer"}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-border-light bg-background-soft/40 px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {isAssigned && (
                            <Button
                              type="button"
                              disabled={isAccepting}
                              onClick={() => handleAccept(request._id)}
                              className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-admin
                  bg-success
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-admin-sm
                  transition-all
                  hover:bg-success-dark
                  hover:shadow-admin
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
                            >
                              <FaCheck size={12} />

                              {isAccepting ? "Accepting..." : "Accept"}
                            </Button>
                          )}

                          {isInProgress && (
                            <Button
                              type="button"
                              disabled={isCompleting}
                              onClick={() => handleComplete(request._id)}
                              className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-admin
                  bg-success
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-admin-sm
                  transition-all
                  hover:bg-success-dark
                  hover:shadow-admin
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
                            >
                              <FaCheckCircle size={13} />

                              {isCompleting
                                ? "Completing..."
                                : "Mark Completed"}
                            </Button>
                          )}

                          <Button
                            type="button"
                            onClick={() => handleView(request._id)}
                            className="
                flex
                flex-1
                items-center
                justify-center
                gap-2
                rounded-admin
                bg-brand
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-admin-sm
                transition-all
                hover:bg-brand-dark
                hover:shadow-admin
              "
                          >
                            <FaEye size={13} />
                            View
                          </Button>
                        </div>

                        <div className="mt-3 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddComment(request._id)}
                            title="Add Comment"
                            aria-label="Add Comment"
                            className="
                flex
                h-9
                w-9
                cursor-pointer
                items-center
                justify-center
                rounded-admin
                border
                border-border
                bg-surface
                text-text-secondary
                transition-all
                hover:border-brand-light
                hover:bg-brand-soft
                hover:text-brand
                focus:outline-none
                focus:ring-2
                focus:ring-brand-light
                focus:ring-offset-1
              "
                          >
                            <FaCommentMedical size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleViewComments(request._id)}
                            title="View Comments"
                            aria-label="View Comments"
                            className="
                flex
                h-9
                w-9
                cursor-pointer
                items-center
                justify-center
                rounded-admin
                border
                border-border
                bg-surface
                text-text-secondary
                transition-all
                hover:border-info
                hover:bg-info-light
                hover:text-info
                focus:outline-none
                focus:ring-2
                focus:ring-info
                focus:ring-offset-1
              "
                          >
                            <FaComment size={14} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {!loading && requests.length > 0 && (
              <Pagination
                currentPage={page}
                total={totalRequest}
                limit={limit}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </main>

      <AddCommentModal
        isOpen={commentModal.open}
        onClose={closeAddCommentModal}
        requestId={commentModal.requestId}
        onSuccess={handleCommentSuccess}
      />

      <ViewCommentsModal
        isOpen={viewCommentsModal.open}
        onClose={closeViewCommentsModal}
        requestId={viewCommentsModal.requestId}
        refreshKey={commentsRefreshKey}
      />
    </>
  );
};

export default ViewAllReq;

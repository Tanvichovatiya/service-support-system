"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { FiPlus } from "react-icons/fi";

import { useRouter } from "next/navigation";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import { getMyRequests } from "@/axiosApi/serviceRequestApi";

import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/Button";

import { debounce } from "@/helperFunction/debaounce";

import {
  setError,
  setLoading,
} from "@/redux/slice/authSlice";

import {
  clearRequest,
  setRequests,
} from "@/redux/slice/userServiceRequestSlice";

import RequestFilters from "@/components/user/RequestFilters"
import RequestList from "@/components/user/RequestList";
import RequestEmptyState from "@/components/user/RequestEmptyState";
import RequestResultSummary from "@/components/user/RequestResultSummary";
import RequestError from "@/components/user/RequestError";
import RequestHeroSection from "@/components/user/RequestHeroSection";

const MyRequestPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  

  const {
    requests,
    page,
    limit,
    totalRequest,
    hasNextPage,
    hasPrevPage,
  } = useSelector(
    (state) => state.userServiceReq
  );

  const {
    loading,
    error,
  } = useSelector(
    (state) => state.auth
  );

  

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const [status, setStatus] = useState("");


  const debouncedSetSearch = useMemo(
    () =>
      debounce((value) => {
        setDebouncedSearch(value.trim());
      }, 800),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearch(value);

    debouncedSetSearch(value);
  };

  

  const fetchRequests = async (
    pageNumber = 1,
    searchValue = debouncedSearch,
    statusValue = status
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(""));

      const data = await getMyRequests({
        page: pageNumber,
        search: searchValue,
        status: statusValue,
      });

      dispatch(
        setRequests({
          requests: data?.requests || [],

          page: data?.page || 1,

          limit: data?.limit || 6,

          // IMPORTANT:
          // Backend returns "totalreq"
          totalRequest:
            data?.totalreq || 0,

          totalPages:
            data?.totalPages || 0,
        })
      );
    } catch (error) {
      console.error(
        "Get my requests error:",
        error
      );

      dispatch(
        setError(
          error?.response?.data?.message ||
            "Unable to load your service requests."
        )
      );

      dispatch(clearRequest());
    } finally {
      dispatch(setLoading(false));
    }
  };

  

  useEffect(() => {
    fetchRequests(
      1,
      debouncedSearch,
      status
    );
  }, [debouncedSearch]);

  
  const handleStatusChange = (e) => {
    const value = e.target.value;

    setStatus(value);

    fetchRequests(
      1,
      debouncedSearch,
      value
    );
  };

 
  const handleClearSearch = () => {
    setSearch("");
    setDebouncedSearch("");

    fetchRequests(
      1,
      "",
      status
    );
  };


  const handleClearAll = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatus("");

    fetchRequests(
      1,
      "",
      ""
    );
  };

  
  const handlePageChange = (
    pageNumber
  ) => {
    fetchRequests(
      pageNumber,
      debouncedSearch,
      status
    );
  };

  
  const handleRetry = () => {
    fetchRequests(
      page,
      debouncedSearch,
      status
    );
  };

  const handleViewDetails = (
    requestId
  ) => {
    router.push(
      `/user/requests/${requestId}`
    );
  };


  const handleCreateRequest = () => {
    router.push(
      "/user/requests/create"
    );
  };

  const showEmptyState =
    !loading &&
    !error &&
    requests.length === 0;

  return (
    <main>
      <RequestHeroSection/>
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

      
        <div
          className="
            mb-6
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h1
              className="
                text-2xl
                font-bold
                text-brand
                sm:text-3xl
              "
            >
              My Requests
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-text-secondary
              "
            >
              Track and manage your service requests
            </p>
          </div>

          <Button
            type="button"
            className="
              flex
              items-center
              justify-center
              gap-2
            "
            onClick={
              handleCreateRequest
            }
          >
            <FiPlus size={18} />

            Create Request
          </Button>
        </div>

    

        <RequestFilters
          search={search}
          status={status}
          onSearchChange={
            handleSearchChange
          }
          onStatusChange={
            handleStatusChange
          }
          onClearSearch={
            handleClearSearch
          }
          onClearAll={
            handleClearAll
          }
          loading={loading}
        />

        <RequestError
          error={error}
          loading={loading}
          onRetry={handleRetry}
        />

        {!loading && !error && (
          <RequestResultSummary
            requestsCount={
              requests.length
            }
            totalRequest={
              totalRequest
            }
            status={status}
          />
        )}


        {showEmptyState && (
          <RequestEmptyState
            search={search}
            status={status}
            onCreateRequest={
              handleCreateRequest
            }
          />
        )}

      

        <RequestList
          requests={requests}
          loading={loading}
          onViewDetails={handleViewDetails}
        />

       
        {!loading &&
          !error &&
          requests.length > 0 && (
            <Pagination
              currentPage={page}
              total={totalRequest}
              limit={limit}
              hasNextPage={
                hasNextPage
              }
              hasPrevPage={
                hasPrevPage
              }
              onPageChange={
                handlePageChange
              }
            />
          )}

      </div>
    </div>
    </main>
  );
};

export default MyRequestPage;
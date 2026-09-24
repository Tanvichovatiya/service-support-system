
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  FiArrowLeft,
} from "react-icons/fi";

import RequestDetails from "@/components/user/RequestDetail"
import { getMyRequestById } from "@/axiosApi/serviceRequestApi";

export default function RequestDetailsPage() {
  const params = useParams();
  const requestId = params.id;

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true);

        const response = await getMyRequestById(requestId);

        setRequest(response.serviceRequest);
      } catch (error) {
        console.error("Failed to fetch request:", error);

        setError(
          error?.response?.data?.message ||
            "Failed to load service request."
        );
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchRequest();
    }
  }, [requestId]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm text-text-muted">
          Loading request...
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Link
          href="/user/requests"
          className="
            mb-6
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-brand
            hover:text-brand-dark
          "
        >
          <FiArrowLeft size={15} />
          Back to My Requests
        </Link>

        <div
          className="
            rounded-xl
            border
            border-danger
            bg-danger-light
            p-5
            text-sm
            text-danger-dark
          "
        >
          {error || "Service request not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      
      <Link
        href="/user/requests/my"
        className="
          mb-5
          inline-flex
          items-center
          gap-2
          text-sm
          font-medium
          text-brand
          transition
          hover:text-brand-dark
        "
      >
        <FiArrowLeft size={15} />
        Back to My Requests
      </Link>

      <RequestDetails request={request} />
    </div>
  );
}
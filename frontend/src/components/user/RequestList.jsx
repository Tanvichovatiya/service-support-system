

"use client";

import React from "react";

import RequestCard from "./RequestCard";
import RequestCardSkeleton from "./RequestCardSkeleton";

const RequestList = ({
  requests,
  loading,
  onViewDetails,
}) => {
  if (loading) {
    return (
      <div
        className="
          grid
          gap-5
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <RequestCardSkeleton
            key={item}
          />
        ))}
      </div>
    );
  }

  if (!requests.length) {
    return null;
  }

  return (
    <div
      className="
        grid
        gap-5
        md:grid-cols-2
        xl:grid-cols-3
      "
    >
      {requests.map((request) => (
        <RequestCard
          key={request._id}
          request={request}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default RequestList;
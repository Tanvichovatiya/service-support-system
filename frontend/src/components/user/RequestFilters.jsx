"use client";

import React from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

import { InputField } from "@/components/ui/InputField";
import {Button} from "@/components/ui/Button";
import Select from "../ui/Select";

const STATUS_OPTIONS = [
  {
    value: "",
    label: "All Status",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "assigned",
    label: "Assigned",
  },
  {
    value: "in_progress",
    label: "In Progress",
  },
  {
    value: "completed",
    label: "Completed",
  },
];

const RequestFilters = ({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClearSearch,
  onClearAll,
  loading,
}) => {
  return (<div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end">
    {/* Search */} <div className="relative flex-1"> <InputField
      type="text"
      value={search}
      onChange={onSearchChange}
      placeholder="Search by title, description or category..."
      leftIcon={FiSearch}
      className="w-full"
    />
      {search !== "" && (
        <button
          type="button"
          onClick={onClearSearch}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center text-text-muted transition hover:text-brand"
        >
          <IoMdClose size={18} />
        </button>
      )}
    </div>

   
    <div className="relative lg:w-52">
      <Select
        value={status}
        onChange={onStatusChange}
        options={STATUS_OPTIONS}
        placeholder="All Status"
        className="w-full"
      />
{/* 
      <FiFilter
        size={17}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand"
      /> */}
    </div>

    
    <Button
      type="button"
      onClick={onClearAll}
      disabled={loading || (!search && !status)}
      variant="primary"
      size="lg"
      className="rounded-admin border-2 border-accent-soft px-4 text-text-secondary  cursor-pointer"
    >
      <span className="text-accent-soft">Clear All</span>
    </Button>
  </div>


  );
};

export default RequestFilters

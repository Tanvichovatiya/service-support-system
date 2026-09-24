
"use client";

const statusConfig = {
  pending: {
    label: "Pending",
    className:
      "bg-warning-light text-warning-dark",
  },

  assigned: {
    label: "Assigned",
    className:
      "bg-info-light text-info",
  },

  in_progress: {
    label: "In Progress",
    className:
      "bg-brand-soft text-brand-dark",
  },

  completed: {
    label: "Completed",
    className:
      "bg-success-light text-success-dark",
  },

  cancelled: {
    label: "Cancelled",
    className:
      "bg-danger-light text-danger-dark",
  },
};

export default function RequestStatusBadge({
  status,
}) {
  const config =
    statusConfig[status] || {
      label: status || "Unknown",
      className:
        "bg-surface-soft text-text-secondary",
    };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-2.5
        py-1
        text-xs
        font-medium
        ${config.className}
      `}
    >
      <span
        className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current"
      />

      {config.label}
    </span>
  );
}
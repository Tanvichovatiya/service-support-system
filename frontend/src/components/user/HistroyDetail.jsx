

import { formatStatus } from "@/helperFunction/histroyHelper";
import {
  FiArrowRight,
  FiUser,
} from "react-icons/fi";

const StaffCard = ({ staff, type = "new" }) => {
  const isOld = type === "old";
  const staffName =
    [staff?.firstname, staff?.lastname]
      .filter(Boolean)
      .join(" ")
      .trim() || "Unknown Staff";

  if (!staff) {
    return (
      <div className="flex-1 rounded-lg bg-background-soft px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
          {isOld ? "Previous Staff" : "New Staff"}
        </p>
        <p className="mt-1 text-xs font-medium text-text-muted">
          Not available
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 rounded-lg px-3 py-2.5 ${
        isOld ? "bg-danger-light" : "bg-success-light"
      }`}
    >
      <p
        className={`text-[10px] font-semibold uppercase tracking-wide ${
          isOld ? "text-danger-dark" : "text-success-dark"
        }`}
      >
        {isOld ? "Previous Staff" : "New Staff"}
      </p>

      <div className="mt-1 flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-brand">
          <FiUser size={13} />
        </div>

        <p className="min-w-0 truncate text-xs font-semibold text-text-primary">
          {staffName}
        </p>
      </div>
    </div>
  );
};

const StaffList = ({ staff = [], type = "new" }) => {
  const staffList = Array.isArray(staff) ? staff : [];

  if (!staffList.length) {
    return <StaffCard type={type} />;
  }

  return (
    <div className="flex-1 space-y-2">
      {staffList.map((member) => (
        <StaffCard
          key={member._id}
          staff={member}
          type={type}
        />
      ))}
    </div>
  );
};

export const AssignmentDetails = ({ assignment }) => {
  if (!assignment) {
    return null;
  }

  const {
    oldStaff = [],
    newStaff = [],
    isReassigned,
  } = assignment;

  if (!isReassigned) {
    return (
      <div className="mt-3 rounded-lg border border-border-light bg-surface-soft px-3 py-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
          Assigned To
        </p>

        <StaffList staff={newStaff} />
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-lg border border-border-light bg-surface px-3 py-3">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
        Staff Reassignment
      </p>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <StaffList staff={oldStaff} type="old" />

        <div className="flex justify-center px-1 pt-3 text-text-muted sm:pt-4">
          <FiArrowRight size={16} />
        </div>

        <StaffList staff={newStaff} />
      </div>
    </div>
  );
};

export const StatusChange = ({ item }) => {
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

export const CreatedRequestDetails = ({ values = [] }) => {
  const filteredValues = values.filter(
    (value) =>
      !value?.toLowerCase().startsWith("category id:")
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

export const GenericChanges = ({ changes }) => {
  if (!changes) {
    return null;
  }

  const {
    oldValues = [],
    newValues = [],
  } = changes;

  if (!oldValues.length && !newValues.length) {
    return null;
  }

  return (
    <div className="mt-3 grid gap-2 sm:grid-cols-2">
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

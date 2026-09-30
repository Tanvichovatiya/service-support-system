

import {
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiRefreshCw,
  FiUser,
  FiX,
} from "react-icons/fi";

import { formatDate } from "@/helperFunction/formateDate";
import {
  AssignmentDetails,
  CreatedRequestDetails,
  GenericChanges,
  StatusChange,
} from "./HistroyDetail";

const HISTORY_ICONS = {
  check: FiCheckCircle,
  user: FiUser,
  refresh: FiRefreshCw,
  edit: FiEdit3,
  clock: FiClock,
  x: FiX,
};

const HistoryItem = ({ item }) => {
  const config = item.actionConfig;

  const Icon =
    HISTORY_ICONS[config?.iconName] || FiEdit3;

  return (
    <div className="relative flex gap-4">
      <div
        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          config?.bg || "bg-brand-soft"
        } ${config?.color || "text-brand"}`}
      >
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1 rounded-xl border border-border-light bg-brand-soft p-4 shadow-admin-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              {config?.label || "Request Updated"}
            </h3>

            {item.userName && (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-text-muted">
                <FiUser size={12} />

                <span>
                  {item.userName}
                  {item.userId?.role
                    ? ` • ${item.userId.role}`
                    : ""}
                </span>
              </div>
            )}
          </div>

          <span className="shrink-0 text-[11px] text-text-muted">
            {formatDate(item.createdAt)}
          </span>
        </div>

        <p className="mt-3 text-xs leading-5 text-text-secondary">
          {item.description ||
            "The service request was updated."}
        </p>

        <AssignmentDetails
          assignment={item.assignment}
        />

        <StatusChange item={item} />

        <CreatedRequestDetails
          values={item.createdDetails}
        />

        <GenericChanges
          changes={item.genericChanges}
        />
      </div>
    </div>
  );
};

export default HistoryItem;

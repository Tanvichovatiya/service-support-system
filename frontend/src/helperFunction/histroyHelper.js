
export const ACTION_CONFIG = {
  SERVICE_REQUEST_CREATED: {
    label: "Request Created",
    iconName: "check",
    color: "text-success",
    bg: "bg-success-light",
  },

  SERVICE_REQUEST_ASSIGNED: {
    label: "Request Assigned",
    iconName: "user",
    color: "text-info",
    bg: "bg-info-light",
  },

  SERVICE_REQUEST_REASSIGNED: {
    label: "Request Reassigned",
    iconName: "refresh",
    color: "text-warning-dark",
    bg: "bg-warning-light",
  },

  SERVICE_REQUEST_STATUS_UPDATED: {
    label: "Status Updated",
    iconName: "edit",
    color: "text-brand",
    bg: "bg-brand-soft",
  },

  SERVICE_REQUEST_STARTED: {
    label: "Request Started",
    iconName: "clock",
    color: "text-info",
    bg: "bg-info-light",
  },

  SERVICE_REQUEST_COMPLETED: {
    label: "Request Completed",
    iconName: "check",
    color: "text-success",
    bg: "bg-success-light",
  },

  SERVICE_REQUEST_CANCELLED: {
    label: "Request Cancelled",
    iconName: "x",
    color: "text-danger",
    bg: "bg-danger-light",
  },
};

export const getStaffName = (staff) => {
  if (!staff) {
    return "Unknown Staff";
  }

  const name = [staff.firstname, staff.lastname]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || "Unknown Staff";
};

export const getStaffNames = (staffList) => {
  if (!Array.isArray(staffList) || staffList.length === 0) {
    return [];
  }

  return staffList.map(getStaffName);
};

export const getUserName = (user) => {
  if (!user) {
    return "";
  }

  return [user.firstname, user.lastname]
    .filter(Boolean)
    .join(" ")
    .trim();
};

export const formatStatus = (status) => {
  if (!status) {
    return "";
  }

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const formatActionLabel = (action) => {
  if (!action) {
    return "Request Updated";
  }

  return action
    .replace(/^SERVICE_REQUEST_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const formatKeyLabel = (key) => {
  if (!key) {
    return "";
  }

  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (char) => char.toUpperCase());
};

export const formatValue = (value) => {
  if (!value || typeof value !== "object") {
    return [];
  }

  return Object.entries(value)
    .filter(
      ([key, item]) =>
        item !== null &&
        item !== undefined &&
        key !== "assignedStaff" &&
        key !== "assignedStaffIds" &&
        key !== "assignedStaffId" &&
        key !== "status",
    )
    .map(([key, item]) => {
      const label = formatKeyLabel(key);

      if (Array.isArray(item)) {
        return `${label}: ${item.length} item${
          item.length === 1 ? "" : "s"
        }`;
      }

      if (typeof item === "object") {
        return `${label}: ${JSON.stringify(item)}`;
      }

      return `${label}: ${item}`;
    });
};

export const getHistoryDescription = (item) => {
  if (!item) {
    return "The service request was updated.";
  }

  const { action, oldValue, newValue } = item;

  switch (action) {
    case "SERVICE_REQUEST_CREATED":
      return "The service request was created.";

    case "SERVICE_REQUEST_ASSIGNED": {
      const staff = newValue?.assignedStaff || [];
      const names = getStaffNames(staff);

      if (names.length === 0) {
        return "The service request was assigned to staff.";
      }

      return `The service request was assigned to ${names.join(", ")}.`;
    }

    case "SERVICE_REQUEST_REASSIGNED": {
      const oldStaff = oldValue?.assignedStaff || [];
      const newStaff = newValue?.assignedStaff || [];

      const oldNames = getStaffNames(oldStaff);
      const newNames = getStaffNames(newStaff);

      const previous =
        oldNames.length > 0
          ? oldNames.join(", ")
          : "previous staff";

      const current =
        newNames.length > 0
          ? newNames.join(", ")
          : "new staff";

      return `The service request was reassigned from ${previous} to ${current}.`;
    }

    case "SERVICE_REQUEST_STATUS_UPDATED": {
      const oldStatus = oldValue?.status;
      const newStatus = newValue?.status;

      if (oldStatus && newStatus) {
        return `Status changed from ${formatStatus(
          oldStatus,
        )} to ${formatStatus(newStatus)}.`;
      }

      return "The service request status was updated.";
    }

    case "SERVICE_REQUEST_STARTED":
      return "The staff member started working on this request.";

    case "SERVICE_REQUEST_COMPLETED":
      return "The service request was completed.";

    case "SERVICE_REQUEST_CANCELLED":
      return "The service request was cancelled.";

    default:
      return "The service request was updated.";
  }
};

export const isAssignmentAction = (action) => {
  return (
    action === "SERVICE_REQUEST_ASSIGNED" ||
    action === "SERVICE_REQUEST_REASSIGNED"
  );
};

export const getAssignmentDetails = (item) => {
  if (!item || !isAssignmentAction(item.action)) {
    return null;
  }

  const oldStaff = Array.isArray(item.oldValue?.assignedStaff)
    ? item.oldValue.assignedStaff
    : [];

  const newStaff = Array.isArray(item.newValue?.assignedStaff)
    ? item.newValue.assignedStaff
    : [];

  const oldStaffIds = Array.isArray(item.oldValue?.assignedStaffIds)
    ? item.oldValue.assignedStaffIds
    : [];

  const newStaffIds = Array.isArray(item.newValue?.assignedStaffIds)
    ? item.newValue.assignedStaffIds
    : [];

  return {
    oldStaff,
    newStaff,
    oldStaffIds,
    newStaffIds,
    isReassigned:
      item.action === "SERVICE_REQUEST_REASSIGNED",
  };
};

export const hasStatusChange = (item) => {
  return Boolean(
    item?.oldValue?.status &&
      item?.newValue?.status,
  );
};

export const getCreatedRequestDetails = (item) => {
  if (
    item?.action !== "SERVICE_REQUEST_CREATED" ||
    !item?.newValue
  ) {
    return [];
  }

  return formatValue(item.newValue).filter(
    (value) => !value.startsWith("User Id:"),
  );
};

export const getGenericChanges = (item) => {
  if (!item) {
    return {
      oldValues: [],
      newValues: [],
    };
  }

  if (item.action === "SERVICE_REQUEST_CREATED") {
    return {
      oldValues: [],
      newValues: [],
    };
  }

  if (isAssignmentAction(item.action)) {
    return {
      oldValues: [],
      newValues: [],
    };
  }

  if (hasStatusChange(item)) {
    return {
      oldValues: [],
      newValues: [],
    };
  }

  return {
    oldValues: formatValue(item.oldValue),
    newValues: formatValue(item.newValue),
  };
};

export const getActionConfig = (action) => {
  return (
    ACTION_CONFIG[action] || {
      label: formatActionLabel(action),
      iconName: "edit",
      color: "text-brand",
      bg: "bg-brand-soft",
    }
  );
};

export const formatHistoryItem = (item) => {
  if (!item) {
    return null;
  }

  return {
    ...item,
    actionConfig: getActionConfig(item.action),
    userName: getUserName(item.userId),
    description: getHistoryDescription(item),
    assignment: getAssignmentDetails(item),
    statusChange: hasStatusChange(item),
    createdDetails: getCreatedRequestDetails(item),
    genericChanges: getGenericChanges(item),
  };
};

export const formatRequestHistory = (data) => {
  if (!data) {
    return {
      request: null,
      history: [],
    };
  }

  return {
    request: data.request || null,
    history: Array.isArray(data.history)
      ? data.history
          .map(formatHistoryItem)
          .filter(Boolean)
      : [],
  };
};

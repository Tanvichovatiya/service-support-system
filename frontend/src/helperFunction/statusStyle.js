


const STATUS_STYLES = {
  pending: {
    label: "Pending",
    className:
      "bg-warning-light text-warning-dark border-warning",
  },

  assigned: {
    label: "Assigned",
    className:
      "bg-info-light text-info border-border",
  },

  in_progress: {
    label: "In Progress",
    className:
      "bg-accent-soft text-accent-dark border-accent-light",
  },

  completed: {
    label: "Completed",
    className:
      "bg-success-light text-success-dark border-success",
  },
};

const PRIORITY_STYLES = {
  low: {
    label: "Low",
    className:
      "bg-surface-soft text-text-secondary border-border",
  },

  medium: {
    label: "Medium",
    className:
      "bg-warning-light text-warning-dark border-border",
  },

  high: {
    label: "High",
    className:
      "bg-accent-soft text-accent-dark border-accent-light",
  },

  urgent: {
    label: "Urgent",
    className:
      "bg-danger-light text-danger-dark border-danger",
  },
};

export const getStatusStyle = (status) => {
  return (
    STATUS_STYLES[status] || {
      label: status?.replace("_", " ") || "Unknown",
      className:
        "bg-surface-soft text-text-secondary border-border",
    }
  );
};

export const getPriorityStyle = (priority) => {
  return (
    PRIORITY_STYLES[priority] || {
      label: priority || "Unknown",
      className:
        "bg-surface-soft text-text-secondary border-border",
    }
  );
};
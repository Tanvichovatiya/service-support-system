import { auditLogServices } from "../services/auditLogServices.js";

export const getChanges = (oldData, newData, fields = []) => {
  const oldValue = {};
  const newValue = {};

  for (const field of fields) {
    const oldFieldValue = oldData[field];
    const newFieldValue = newData[field];

    if (oldFieldValue !== newFieldValue) {
      oldValue[field] = oldFieldValue;
      newValue[field] = newFieldValue;
    }
  }

  return {
    oldValue,
    newValue,
    hasChanges: Object.keys(oldValue).length > 0,
  };
};


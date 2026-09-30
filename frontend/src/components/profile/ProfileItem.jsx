
import React from "react";

const ProfileItem = ({
  icon: Icon,
  label,
  value,
  valueClass = "text-text-primary",
  children,
}) => {
  return (
    <div className="flex gap-3 rounded-admin border border-border-light bg-surface-soft p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
        <Icon size={14} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-text-muted">{label}</p>

        {children || (
          <p
            className={`mt-0.5 truncate text-sm font-medium ${valueClass}`}
          >
            {value}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileItem;


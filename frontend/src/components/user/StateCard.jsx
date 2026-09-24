

"use client";

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  iconClassName = "bg-brand-soft text-brand",
}) {
  return (
    <div
      className="
        rounded-xl
        border border-border
        bg-surface
        p-5
        shadow-admin
        transition
        hover:shadow-admin-hover
      "
    >
      <div className="flex items-start justify-between">
        
        <div>
          <p className="text-sm text-text-secondary">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-semibold text-heading">
            {value}
          </h3>

          {description && (
            <p className="mt-1 text-xs text-text-muted">
              {description}
            </p>
          )}
        </div>

        <div
          className={`
            flex h-10 w-10
            items-center justify-center
            rounded-lg
            ${iconClassName}
          `}
        >
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}
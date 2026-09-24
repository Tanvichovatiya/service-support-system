const RequestCardSkeleton = () => {
  return (
    <div
      className="
        animate-pulse
        rounded-admin-lg
        border
        border-border
        bg-surface
        p-5
        shadow-admin-sm
      "
    >
      <div className="mb-4 h-5 w-2/3 rounded bg-surface-soft" />

      <div className="mb-3 h-4 w-full rounded bg-surface-soft" />

      <div className="mb-5 h-4 w-4/5 rounded bg-surface-soft" />

      <div className="mb-4 h-8 w-1/3 rounded bg-surface-soft" />

      <div className="h-10 w-full rounded bg-surface-soft" />
    </div>
  );
};

export default RequestCardSkeleton;
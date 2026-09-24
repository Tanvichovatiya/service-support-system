"use client";

import { FaClock } from "react-icons/fa";
import { formatDate } from "@/helperFunction/formateDate";

export default function RequestTimeline({ request }) {
  const timelineItems = [
    {
      title: "Request Created",
      date: request?.createdAt,
    },
    {
      title: "Request Assigned",
      date: request?.assignedAt,
    },
    {
      title: "Work Started",
      date: request?.startedAt,
    },
    {
      title: "Request Completed",
      date: request?.completedAt,
    },
  ];

  return (
    <section className="rounded-admin-lg border-[2.1px]
          border-brand-light bg-surface shadow-admin-sm hover:shadow-admin-hover">
      <div className="flex items-center justify-between border-b border-border-light px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="text-sm text-brand">
            <FaClock />
          </span>

          <h2 className="text-sm font-semibold text-text-primary">
            Request Timeline
          </h2>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {timelineItems.map((item, index) => {
          const active = Boolean(item.date);
          const last = index === timelineItems.length - 1;

          return (
            <TimelineItem
              key={item.title}
              title={item.title}
              date={item.date}
              active={active}
              last={last}
            />
          );
        })}
      </div>
    </section>
  );
}

function TimelineItem({ title, date, active, last }) {
  return (
    <div className="relative flex gap-4">
      {!last && (
        <div
          className={`absolute left-[7px] top-5 h-full w-px ${
            active ? "bg-brand-muted" : "bg-border-light"
          }`}
        />
      )}

      <div
        className={`relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${
          active
            ? "border-brand bg-brand"
            : "border-border bg-surface"
        }`}
      />

      <div className="pb-6">
        <p
          className={`text-sm font-medium ${
            active ? "text-text-primary" : "text-text-muted"
          }`}
        >
          {title}
        </p>

        <p className="mt-1 text-xs text-text-muted">
          {date ? formatDate(date) : "Not completed"}
        </p>
      </div>
    </div>
  );
}
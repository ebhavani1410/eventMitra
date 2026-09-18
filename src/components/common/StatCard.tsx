import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  iconClass?: string;
}

function StatCard({
  title,
  value,
  description,
  icon,
  iconClass = "stat-purple",
}: StatCardProps) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${iconClass}`}>
        {icon}
      </div>

      <div className="stat-content">
        <span className="stat-title">{title}</span>

        <strong className="stat-value">
          {value}
        </strong>

        <span className="stat-description">
          {description}
        </span>
      </div>
    </div>
  );
}

export default StatCard;
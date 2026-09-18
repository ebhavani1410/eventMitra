import {
  Search,
  Bell,
  CalendarDays,
  Menu,
  ChevronDown,
} from "lucide-react";
import type { User } from "../../types";

interface TopbarProps {
  user: User | null;
  onMenuClick: () => void;
}

function Topbar({
  user,
  onMenuClick,
}: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu-button"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>

        <div className="mobile-brand">
          <div className="brand-icon brand-icon-small">
            EM
          </div>

          <span>EventMithra</span>
        </div>

        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search events, managers, venues..."
          />

          <span className="search-shortcut">
            Ctrl K
          </span>
        </div>
      </div>

      <div className="topbar-actions">
        <button
          className="topbar-icon-button"
          title="Calendar"
        >
          <CalendarDays size={20} />
        </button>

        <button
          className="topbar-icon-button notification-button"
          title="Notifications"
        >
          <Bell size={20} />
          <span className="notification-dot">3</span>
        </button>

        <div className="profile-menu">
          <div className="avatar">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="profile-info">
            <strong>{user?.name || "Customer"}</strong>
            <span>Customer</span>
          </div>

          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
}

export default Topbar;  
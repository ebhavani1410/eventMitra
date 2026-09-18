import {
  LayoutDashboard,
  CalendarDays,
  Users,
  MapPin,
  Send,
  FileText,
  CreditCard,
  MessageSquare,
  Bell,
  Star,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard/customer",
  },
  {
    label: "My Events",
    icon: CalendarDays,
    path: "/customer/events",
  },
  {
    label: "Event Managers",
    icon: Users,
    path: "/customer/managers",
  },
  {
    label: "Manager Requests",
    icon: Send,
    path: "/customer/requests",
  },
  {
    label: "Venues",
    icon: MapPin,
    path: "/customer/venues",
  },
  {
    label: "Proposals",
    icon: FileText,
    path: "/customer/proposals",
  },
  {
    label: "Bookings",
    icon: CalendarDays,
    path: "/customer/bookings",
  },
  {
    label: "Payments",
    icon: CreditCard,
    path: "/customer/payments",
  },
  {
    label: "Messages",
    icon: MessageSquare,
    path: "/customer/messages",
  },
  {
    label: "Notifications",
    icon: Bell,
    path: "/customer/notifications",
  },
  {
    label: "Reviews",
    icon: Star,
    path: "/customer/reviews",
  },
];

function Sidebar({
  collapsed,
  onToggle,
  onLogout,
}: SidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">
          EM
        </div>

        {!collapsed && (
          <div>
            <h1>EventMithra</h1>
            <span>Event Management</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">
          {!collapsed && "MENU"}
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.label}
              href={item.path}
              className={`sidebar-link ${
                item.label === "Dashboard"
                  ? "sidebar-link-active"
                  : ""
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={19} strokeWidth={2} />

              {!collapsed && (
                <span>{item.label}</span>
              )}
            </a>
          );
        })}

        <div className="nav-section-title nav-settings">
          {!collapsed && "ACCOUNT"}
        </div>

        <a
          href="/customer/settings"
          className="sidebar-link"
          title={collapsed ? "Settings" : undefined}
        >
          <Settings size={19} />
          {!collapsed && <span>Settings</span>}
        </a>
      </nav>

      {!collapsed && (
        <div className="sidebar-promo">
          <div className="promo-icon">✦</div>

          <h3>Plan your perfect event</h3>

          <p>
            Let EventMithra help you bring your ideas
            to life.
          </p>

          <a href="/customer/create-event">
            Create New Event
          </a>
        </div>
      )}

      <div className="sidebar-bottom">
        <button
          className="sidebar-link sidebar-button"
          onClick={onLogout}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={19} />

          {!collapsed && <span>Logout</span>}
        </button>

        <button
          className="sidebar-collapse"
          onClick={onToggle}
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
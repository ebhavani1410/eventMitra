import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useStore } from "../../store/useStore";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const navigate = useNavigate();

  const user = useStore((state) => state.user);

  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const handleLogout = () => {
    useStore.getState().logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        onLogout={handleLogout}
      />

      {mobileSidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div
        className={`main-area ${
          collapsed ? "main-area-expanded" : ""
        }`}
      >
        <Topbar
          user={user}
          onMenuClick={() =>
            setMobileSidebarOpen(!mobileSidebarOpen)
          }
        />

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const NAV = [
  { path: "/admin", label: "Dashboard", icon: "⊞" },
  { path: "/admin/vehicles", label: "Vehicles", icon: "🚗" },
  { path: "/admin/bookings", label: "Bookings", icon: "📋" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const isActive = (path) =>
    path === "/admin"
      ? location.pathname === path
      : location.pathname.startsWith(path);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        .admin-wrap { display: flex; min-height: 100vh; background: var(--bg); font-family: 'Syne', sans-serif; }
        .admin-sidebar {
          width: ${collapsed ? "72px" : "240px"}; transition: width 0.3s cubic-bezier(.4,0,.2,1);
          background: var(--surface); border-right: 1px solid var(--border);
          display: flex; flex-direction: column; position: fixed; top: 0; bottom: 0; z-index: 50; overflow: hidden;
        }
        .sidebar-top {
          padding: ${collapsed ? "20px 14px" : "20px 20px"}; border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
        }
        .sidebar-logo { font-size: 1.1rem; font-weight: 900; color: var(--gold); white-space: nowrap; overflow: hidden; }
        .sidebar-logo span { color: var(--text); }
        .collapse-btn {
          background: #fff; border: 1px solid rgba(17,17,17,0.14); color: rgba(21,21,21,0.75);
          width: 28px; height: 28px; border-radius: 6px; cursor: pointer; font-size: 0.75rem;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s;
        }
        .collapse-btn:hover { border-color: rgba(244,196,48,0.85); background: rgba(244,196,48,0.12); color: #7a5a00; }
        .sidebar-nav { flex: 1; padding: 16px 10px; display: flex; flex-direction: column; gap: 4px; }
        .sidebar-link {
          display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px;
          color: var(--text-dim); text-decoration: none; font-size: 0.875rem; font-weight: 900;
          transition: all 0.2s; white-space: nowrap; overflow: hidden;
        }
        .sidebar-link:hover { background: rgba(244,196,48,0.12); color: var(--text); }
        .sidebar-link.active { background: rgba(244,196,48,0.18); color: #7a5a00; border: 1px solid rgba(244,196,48,0.35); }
        .sidebar-icon { font-size: 1.1rem; flex-shrink: 0; }
        .sidebar-bottom { padding: 16px 10px; border-top: 1px solid var(--border); }
        .admin-user-info { display: flex; align-items: center; gap: 10px; padding: 8px 12px; overflow: hidden; }
        .admin-avatar {
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, var(--gold), #ff6b00);
          display: flex; align-items: center; justify-content: center;
          font-weight: 900; color: #1b1300; font-size: 0.8rem;
        }
        .admin-name { font-size: 0.8rem; color: var(--text); font-weight: 900; white-space: nowrap; }
        .admin-role { font-size: 0.7rem; color: #7a5a00; font-weight: 900; }
        .logout-btn {
          width: 100%; margin-top: 8px; padding: 9px; border-radius: 10px;
          background: rgba(255,60,60,0.08); border: 1px solid rgba(255,60,60,0.2);
          color: #b42318; cursor: pointer; font-size: 0.8rem;
          font-family: 'Syne', sans-serif; font-weight: 600; transition: all 0.2s;
          white-space: nowrap; overflow: hidden;
        }
        .logout-btn:hover { background: rgba(255,60,60,0.15); color: #ff6b6b; }
        .admin-main { flex: 1; margin-left: ${collapsed ? "72px" : "240px"}; transition: margin-left 0.3s cubic-bezier(.4,0,.2,1); }
        .admin-topbar {
          background: rgba(255,255,255,0.86); backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border); padding: 16px 32px;
          display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 40;
        }
        .topbar-title { font-size: 1rem; font-weight: 900; color: var(--text); }
        .topbar-badge {
          background: rgba(244,196,48,0.18); color: #7a5a00; font-size: 0.72rem;
          padding: 4px 10px; border-radius: 20px; font-weight: 900; border: 1px solid rgba(244,196,48,0.35);
        }
        .admin-content { padding: 32px; }
        @media(max-width:768px) { .admin-sidebar { width: 72px; } .admin-main { margin-left: 72px; } .admin-content { padding: 16px; } }
      `}</style>
      <div className="admin-wrap">
        <aside className="admin-sidebar">
          <div className="sidebar-top">
            {!collapsed && (
              <div className="sidebar-logo">
                Ride<span>X</span>{" "}
                <span
                  style={{
                    color: "var(--text-dim)",
                    fontSize: "0.7rem",
                    fontWeight: 900,
                  }}
                >
                  ADMIN
                </span>
              </div>
            )}
            <button
              className="collapse-btn"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? "→" : "←"}
            </button>
          </div>
          <nav className="sidebar-nav">
            {NAV.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                className={`sidebar-link ${isActive(path) ? "active" : ""}`}
              >
                <span className="sidebar-icon">{icon}</span>
                {!collapsed && label}
              </Link>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="admin-user-info">
              <div className="admin-avatar">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
              {!collapsed && (
                <div>
                  <div className="admin-name">
                    {user?.name?.split(" ")[0] || "Admin"}
                  </div>
                  <div className="admin-role">Administrator</div>
                </div>
              )}
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              {collapsed ? "↩" : "Logout"}
            </button>
          </div>
        </aside>
        <div className="admin-main">
          <div className="admin-topbar">
            <span className="topbar-title">
              {NAV.find((n) => isActive(n.path))?.label || "Admin"}
            </span>
            <span className="topbar-badge">Admin Panel</span>
          </div>
          <div className="admin-content">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

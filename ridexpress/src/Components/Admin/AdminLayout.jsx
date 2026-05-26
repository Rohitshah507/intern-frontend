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

  const handleLogout = () => { logout(); navigate("/login"); };
  const isActive = (path) => path === "/admin" ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        .admin-wrap { display: flex; min-height: 100vh; background: #080810; font-family: 'Syne', sans-serif; }
        .admin-sidebar {
          width: ${collapsed ? "72px" : "240px"}; transition: width 0.3s cubic-bezier(.4,0,.2,1);
          background: #0d0d1a; border-right: 1px solid rgba(255,200,50,0.1);
          display: flex; flex-direction: column; position: fixed; top: 0; bottom: 0; z-index: 50; overflow: hidden;
        }
        .sidebar-top {
          padding: ${collapsed ? "20px 14px" : "20px 20px"}; border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: space-between;
        }
        .sidebar-logo { font-size: 1.1rem; font-weight: 800; color: #FFC832; white-space: nowrap; overflow: hidden; }
        .sidebar-logo span { color: #fff; }
        .collapse-btn {
          background: none; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.5);
          width: 28px; height: 28px; border-radius: 6px; cursor: pointer; font-size: 0.75rem;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s;
        }
        .collapse-btn:hover { border-color: #FFC832; color: #FFC832; }
        .sidebar-nav { flex: 1; padding: 16px 10px; display: flex; flex-direction: column; gap: 4px; }
        .sidebar-link {
          display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px;
          color: rgba(255,255,255,0.5); text-decoration: none; font-size: 0.875rem; font-weight: 500;
          transition: all 0.2s; white-space: nowrap; overflow: hidden;
        }
        .sidebar-link:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .sidebar-link.active { background: rgba(255,200,50,0.12); color: #FFC832; }
        .sidebar-icon { font-size: 1.1rem; flex-shrink: 0; }
        .sidebar-bottom { padding: 16px 10px; border-top: 1px solid rgba(255,255,255,0.05); }
        .admin-user-info { display: flex; align-items: center; gap: 10px; padding: 8px 12px; overflow: hidden; }
        .admin-avatar {
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #FFC832, #ff6b00);
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; color: #0a0a0f; font-size: 0.8rem;
        }
        .admin-name { font-size: 0.8rem; color: rgba(255,255,255,0.7); font-weight: 600; white-space: nowrap; }
        .admin-role { font-size: 0.7rem; color: #FFC832; }
        .logout-btn {
          width: 100%; margin-top: 8px; padding: 9px; border-radius: 10px;
          background: rgba(255,60,60,0.08); border: 1px solid rgba(255,60,60,0.2);
          color: rgba(255,100,100,0.8); cursor: pointer; font-size: 0.8rem;
          font-family: 'Syne', sans-serif; font-weight: 600; transition: all 0.2s;
          white-space: nowrap; overflow: hidden;
        }
        .logout-btn:hover { background: rgba(255,60,60,0.15); color: #ff6b6b; }
        .admin-main { flex: 1; margin-left: ${collapsed ? "72px" : "240px"}; transition: margin-left 0.3s cubic-bezier(.4,0,.2,1); }
        .admin-topbar {
          background: rgba(13,13,26,0.8); backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,200,50,0.08); padding: 16px 32px;
          display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 40;
        }
        .topbar-title { font-size: 1rem; font-weight: 700; color: rgba(255,255,255,0.85); }
        .topbar-badge {
          background: rgba(255,200,50,0.12); color: #FFC832; font-size: 0.72rem;
          padding: 4px 10px; border-radius: 20px; font-weight: 600; border: 1px solid rgba(255,200,50,0.2);
        }
        .admin-content { padding: 32px; }
        @media(max-width:768px) { .admin-sidebar { width: 72px; } .admin-main { margin-left: 72px; } .admin-content { padding: 16px; } }
      `}</style>
      <div className="admin-wrap">
        <aside className="admin-sidebar">
          <div className="sidebar-top">
            {!collapsed && <div className="sidebar-logo">Ride<span>X</span> <span style={{color:"rgba(255,255,255,0.4)",fontSize:"0.7rem"}}>ADMIN</span></div>}
            <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>{collapsed ? "→" : "←"}</button>
          </div>
          <nav className="sidebar-nav">
            {NAV.map(({ path, label, icon }) => (
              <Link key={path} to={path} className={`sidebar-link ${isActive(path) ? "active" : ""}`}>
                <span className="sidebar-icon">{icon}</span>
                {!collapsed && label}
              </Link>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="admin-user-info">
              <div className="admin-avatar">{user?.name?.[0]?.toUpperCase() || "A"}</div>
              {!collapsed && (
                <div>
                  <div className="admin-name">{user?.name?.split(" ")[0] || "Admin"}</div>
                  <div className="admin-role">Administrator</div>
                </div>
              )}
            </div>
            <button className="logout-btn" onClick={handleLogout}>{collapsed ? "↩" : "Logout"}</button>
          </div>
        </aside>
        <div className="admin-main">
          <div className="admin-topbar">
            <span className="topbar-title">
              {NAV.find(n => isActive(n.path))?.label || "Admin"}
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

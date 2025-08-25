import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };
  const active = (path) => location.pathname === path ? "nav-active" : "";

  return (
    <>
      <style>{`
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: rgba(255,255,255,0.86); backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          font-family: 'Syne', sans-serif;
        }
        .nav-inner {
          max-width: 1280px; margin: 0 auto; padding: 0 24px;
          display: flex; align-items: center; justify-content: space-between; height: 68px;
        }
        .nav-logo {
          font-size: 1.5rem; font-weight: 800; letter-spacing: -0.03em;
          color: var(--gold); text-decoration: none;
        }
        .nav-logo span { color: var(--text); }
        .nav-links { display: flex; align-items: center; gap: 8px; }
        .nav-link {
          color: var(--text-dim); text-decoration: none;
          padding: 8px 14px; border-radius: 8px; font-size: 0.875rem;
          font-weight: 700; transition: all 0.2s; letter-spacing: 0.01em;
        }
        .nav-link:hover { color: var(--text); background: rgba(244,196,48,0.18); }
        .nav-active { color: #7a5a00 !important; }
        .nav-btn {
          padding: 9px 20px; border-radius: 10px; font-size: 0.875rem;
          font-weight: 600; cursor: pointer; text-decoration: none;
          transition: all 0.2s; font-family: 'Syne', sans-serif;
        }
        .nav-btn-outline {
          color: #7a5a00; border: 1.5px solid rgba(244,196,48,0.65);
          background: transparent;
        }
        .nav-btn-outline:hover { background: rgba(244,196,48,0.16); border-color: rgba(244,196,48,0.95); }
        .nav-btn-fill { background: var(--gold); color: #1b1300; border: none; }
        .nav-btn-fill:hover { filter: brightness(0.97); transform: translateY(-1px); }
        .nav-user {
          display: flex; align-items: center; gap: 10px;
          color: var(--text); font-size: 0.875rem; font-weight: 700;
        }
        .nav-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: linear-gradient(135deg, var(--gold), #ff8c00);
          display: flex; align-items: center; justify-content: center;
          font-weight: 900; color: #1b1300; font-size: 0.8rem;
        }
        .hamburger { display: none; background: none; border: none; cursor: pointer; padding: 6px; }
        .ham-line { display: block; width: 22px; height: 2px; background: var(--text); margin: 4px 0; transition: 0.3s; }
        @media(max-width:768px) {
          .nav-links { display: none; }
          .hamburger { display: block; }
          .nav-mobile { display: flex !important; flex-direction: column; gap: 4px;
            position: fixed; top: 68px; left: 0; right: 0;
            background: rgba(255,255,255,0.96); padding: 16px 24px 24px;
            border-bottom: 1px solid var(--border);
          }
        }
        .nav-mobile { display: none; }
      `}</style>
      <nav className="navbar">
        <div className="nav-inner">
          <Link to="/" className="nav-logo">Ride<span>Xpress</span></Link>
          <div className="nav-links">
            <Link to="/" className={`nav-link ${active("/")}`}>Home</Link>
            <Link to="/vehicles" className={`nav-link ${active("/vehicles")}`}>Vehicles</Link>
            {user && <Link to="/my-bookings" className={`nav-link ${active("/my-bookings")}`}>My Bookings</Link>}
            {isAdmin && <Link to="/admin" className="nav-link" style={{color:"#7a5a00"}}>Admin Panel</Link>}
            {user ? (
              <div className="nav-user">
                <div className="nav-avatar">{user.name?.[0]?.toUpperCase() || "U"}</div>
                <span>{user.name?.split(" ")[0]}</span>
                <button className="nav-btn nav-btn-outline" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="nav-btn nav-btn-outline">Login</Link>
                <Link to="/signup" className="nav-btn nav-btn-fill">Sign Up</Link>
              </>
            )}
          </div>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="ham-line"></span><span className="ham-line"></span><span className="ham-line"></span>
          </button>
        </div>
        <div className="nav-mobile" style={menuOpen ? {display:"flex"} : {}}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/vehicles" className="nav-link" onClick={() => setMenuOpen(false)}>Vehicles</Link>
          {user && <Link to="/my-bookings" className="nav-link" onClick={() => setMenuOpen(false)}>My Bookings</Link>}
          {isAdmin && <Link to="/admin" className="nav-link" style={{color:"#7a5a00"}} onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
          {user ? (
            <button className="nav-btn nav-btn-outline" style={{width:"fit-content",marginTop:"8px"}} onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
          ) : (
            <>
              <Link to="/login" className="nav-btn nav-btn-outline" style={{width:"fit-content"}} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="nav-btn nav-btn-fill" style={{width:"fit-content"}} onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}

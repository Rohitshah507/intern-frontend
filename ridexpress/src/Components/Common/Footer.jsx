import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <style>{`
        .footer {
          background: var(--surface); border-top: 1px solid var(--border);
          padding: 48px 24px 24px; font-family: 'Syne', sans-serif;
        }
        .footer-inner { max-width: 1280px; margin: 0 auto; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 48px; margin-bottom: 40px; }
        .footer-brand { font-size: 1.4rem; font-weight: 900; color: var(--gold); margin-bottom: 12px; }
        .footer-brand span { color: var(--text); }
        .footer-tagline { color: var(--text-dim); font-size: 0.875rem; line-height: 1.6; max-width: 260px; }
        .footer-col h4 { color: var(--text); font-size: 0.8rem; font-weight: 900; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 16px; }
        .footer-col a { display: block; color: var(--text-dim); text-decoration: none; font-size: 0.875rem; margin-bottom: 10px; transition: color 0.2s; font-weight: 700; }
        .footer-col a:hover { color: #7a5a00; }
        .footer-bottom { border-top: 1px solid var(--border); padding-top: 20px; display: flex; justify-content: space-between; align-items: center; }
        .footer-copy { color: var(--text-dim); font-size: 0.8rem; font-weight: 700; }
        @media(max-width:640px) { .footer-grid { grid-template-columns: 1fr; gap: 32px; } .footer-bottom { flex-direction: column; gap: 8px; } }
      `}</style>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">Ride<span>Xpress</span></div>
              <p className="footer-tagline">Premium vehicle rentals for every journey. Explore Nepal in style and comfort.</p>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <Link to="/">Home</Link>
              <Link to="/vehicles">Vehicles</Link>
              <Link to="/my-bookings">My Bookings</Link>
            </div>
            <div className="footer-col">
              <h4>Account</h4>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
              <Link to="/forgot-password">Reset Password</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© {new Date().getFullYear()} RideXpress. All rights reserved.</span>
            <span className="footer-copy">Made in Nepal 🇳🇵</span>
          </div>
        </div>
      </footer>
    </>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const u = await login(form);
      const admin = (u?.roles || []).some((r) => String(r).toUpperCase() === "ADMIN");
      navigate(admin ? "/admin" : "/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <>
      <style>{`
        .auth-page{
          min-height: calc(100vh - 68px);
          display:flex;align-items:center;justify-content:center;
          padding: 44px 18px;
          background: radial-gradient(800px 400px at 50% 0%, var(--gold-dim) 0%, transparent 70%), var(--bg);
          font-family: 'Syne', sans-serif;
        }
        .auth-card{
          width:100%; max-width: 460px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 18px;
          box-shadow: 0 18px 50px rgba(17,17,17,0.08);
          padding: 28px;
          text-align:left;
        }
        .auth-title{ font-size: 1.6rem; font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 6px; }
        .auth-sub{ color: var(--text-dim); font-size: 0.92rem; margin-bottom: 20px; }
        .auth-error{
          background: rgba(255,60,60,0.08);
          border: 1px solid rgba(255,60,60,0.25);
          color: #b42318;
          padding: 10px 12px; border-radius: 12px;
          font-size: 0.9rem; margin-bottom: 14px;
        }
        .f-label{ display:block; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 800; color: var(--text-dim); margin-bottom: 7px; }
        .f-input{
          width:100%; box-sizing:border-box;
          border: 1px solid rgba(17,17,17,0.14);
          background: #fff;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 0.95rem;
          outline:none;
          color: var(--text);
          transition: border-color .18s, box-shadow .18s;
        }
        .f-input:focus{ border-color: var(--gold); box-shadow: 0 0 0 4px rgba(255,200,50,0.18); }
        .row{ display:flex; gap: 10px; align-items:center; }
        .grow{ flex:1; }
        .toggle{
          border: 1px solid rgba(17,17,17,0.14);
          background: #fff;
          border-radius: 12px;
          padding: 12px 14px;
          cursor:pointer;
          font-weight: 800;
          color: var(--text);
        }
        .btn{
          width:100%;
          margin-top: 14px;
          padding: 12px 14px;
          border-radius: 12px;
          border: none;
          background: var(--gold);
          color: #1b1300;
          font-weight: 900;
          cursor:pointer;
          transition: transform .12s ease, filter .12s ease;
        }
        .btn:hover{ filter: brightness(0.97); transform: translateY(-1px); }
        .btn:disabled{ opacity: 0.7; cursor:not-allowed; transform:none; }
        .auth-links{ display:flex; justify-content:space-between; margin-top: 14px; font-size: 0.9rem; }
        .auth-links a{ color: #7a5a00; font-weight: 800; text-decoration:none; }
        .auth-links a:hover{ text-decoration: underline; }
      `}</style>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-title">Welcome back</div>
          <div className="auth-sub">Log in to manage your bookings and account.</div>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={onSubmit}>
            <label className="f-label">Email</label>
            <input className="f-input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={onChange} required />

            <div style={{ height: 12 }} />

            <label className="f-label">Password</label>
            <div className="row">
              <input className="f-input grow" name="password" type={show ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={onChange} required />
              <button type="button" className="toggle" onClick={() => setShow((s) => !s)} aria-label="Toggle password visibility">
                {show ? "Hide" : "Show"}
              </button>
            </div>

            <button className="btn" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
          </form>

          <div className="auth-links">
            <Link to="/forgot-password">Forgot password?</Link>
            <Link to="/signup">Create account</Link>
          </div>
        </div>
      </div>
    </>
  );
}

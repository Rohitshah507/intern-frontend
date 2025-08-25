import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authAPI } from "../../../services/Api";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setDone(true);
    } catch (err) {
      setError(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
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
          width:100%; max-width: 520px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 18px;
          box-shadow: 0 18px 50px rgba(17,17,17,0.08);
          padding: 28px;
          text-align:left;
        }
        .auth-title{ font-size: 1.5rem; font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 6px; }
        .auth-sub{ color: var(--text-dim); font-size: 0.92rem; margin-bottom: 18px; line-height: 1.55; }
        .auth-error{
          background: rgba(255,60,60,0.08);
          border: 1px solid rgba(255,60,60,0.25);
          color: #b42318;
          padding: 10px 12px; border-radius: 12px;
          font-size: 0.9rem; margin-bottom: 14px;
        }
        .auth-success{
          background: rgba(50,200,100,0.12);
          border: 1px solid rgba(50,200,100,0.25);
          color: #146c43;
          padding: 12px 12px; border-radius: 12px;
          font-size: 0.92rem; margin-bottom: 14px;
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
          <div className="auth-title">Reset your password</div>
          <div className="auth-sub">
            Enter your email and we’ll send you a reset link (if the account exists).
          </div>

          {error && <div className="auth-error">{error}</div>}
          {done && <div className="auth-success">If your email exists in our system, a reset link has been sent.</div>}

          <form onSubmit={onSubmit}>
            <label className="f-label">Email</label>
            <input className="f-input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
            <button className="btn" disabled={loading}>{loading ? "Sending..." : "Send reset link"}</button>
          </form>

          <div className="auth-links">
            <Link to="/login">Back to login</Link>
            <Link to="/signup">Create account</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export function ResetPassword() {
  const query = useQuery();
  const navigate = useNavigate();
  const token = query.get("token") || "";
  const userId = query.get("userId") || "";

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!token || !userId) {
      setError("Missing token or userId in the reset link.");
      return;
    }
    setLoading(true);
    try {
      await authAPI.resetPassword({ token, userId, ...form });
      setDone(true);
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
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
          width:100%; max-width: 520px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 18px;
          box-shadow: 0 18px 50px rgba(17,17,17,0.08);
          padding: 28px;
          text-align:left;
        }
        .auth-title{ font-size: 1.5rem; font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 6px; }
        .auth-sub{ color: var(--text-dim); font-size: 0.92rem; margin-bottom: 18px; line-height: 1.55; }
        .auth-error{
          background: rgba(255,60,60,0.08);
          border: 1px solid rgba(255,60,60,0.25);
          color: #b42318;
          padding: 10px 12px; border-radius: 12px;
          font-size: 0.9rem; margin-bottom: 14px;
        }
        .auth-success{
          background: rgba(50,200,100,0.12);
          border: 1px solid rgba(50,200,100,0.25);
          color: #146c43;
          padding: 12px 12px; border-radius: 12px;
          font-size: 0.92rem; margin-bottom: 14px;
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
        .muted{ color: var(--text-dim); font-size: 0.85rem; margin-top: 12px; }
      `}</style>

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-title">Set a new password</div>
          <div className="auth-sub">Choose a strong password to secure your account.</div>

          {error && <div className="auth-error">{error}</div>}
          {done && <div className="auth-success">Password updated. Redirecting to login…</div>}

          <form onSubmit={onSubmit}>
            <label className="f-label">New password</label>
            <input className="f-input" name="password" type="password" value={form.password} onChange={onChange} minLength={8} required />

            <div style={{ height: 12 }} />

            <label className="f-label">Confirm new password</label>
            <input className="f-input" name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} minLength={8} required />

            <button className="btn" disabled={loading || done}>{loading ? "Updating..." : "Update password"}</button>
          </form>

          <div className="muted">
            If your reset link is expired, request a new one from{" "}
            <Link to="/forgot-password" style={{ fontWeight: 900, color: "#7a5a00", textDecoration: "none" }}>
              Forgot Password
            </Link>
            .
          </div>
        </div>
      </div>
    </>
  );
}

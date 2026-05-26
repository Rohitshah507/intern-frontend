import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(form);
      if (user?.roles?.includes("admin")) navigate("/admin");
      else navigate("/");
    } catch (err) {
      setError(err.message || "Login failed. Check your credentials.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        .auth-page {
          min-height: 100vh; background: #0a0a0f; display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; padding: 24px;
        }
        .auth-card {
          width: 100%; max-width: 420px;
          background: #0d0d1a; border: 1px solid rgba(255,200,50,0.12);
          border-radius: 20px; padding: 40px 36px;
        }
        .auth-logo { font-size: 1.3rem; font-weight: 800; color: #FFC832; margin-bottom: 8px; }
        .auth-logo span { color: #fff; }
        .auth-title { font-size: 1.6rem; font-weight: 800; color: #fff; margin-bottom: 4px; }
        .auth-sub { color: rgba(255,255,255,0.4); font-size: 0.875rem; margin-bottom: 32px; }
        .form-group { margin-bottom: 18px; }
        .form-label { display: block; color: rgba(255,255,255,0.6); font-size: 0.8rem; font-weight: 600; margin-bottom: 8px; letter-spacing: 0.05em; text-transform: uppercase; }
        .form-input {
          width: 100%; box-sizing: border-box;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 12px 14px; color: #fff; font-size: 0.9rem;
          font-family: 'Syne', sans-serif; outline: none; transition: border-color 0.2s;
        }
        .form-input:focus { border-color: #FFC832; }
        .form-input::placeholder { color: rgba(255,255,255,0.25); }
        .auth-error {
          background: rgba(255,60,60,0.1); border: 1px solid rgba(255,60,60,0.25);
          color: #ff6b6b; padding: 12px 14px; border-radius: 10px; font-size: 0.875rem; margin-bottom: 16px;
        }
        .auth-submit {
          width: 100%; padding: 13px; background: #FFC832; color: #0a0a0f; border: none;
          border-radius: 12px; font-size: 1rem; font-weight: 700; cursor: pointer;
          font-family: 'Syne', sans-serif; transition: all 0.2s; margin-bottom: 20px;
        }
        .auth-submit:hover:not(:disabled) { background: #e6b22e; }
        .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-links { text-align: center; color: rgba(255,255,255,0.4); font-size: 0.875rem; }
        .auth-links a { color: #FFC832; text-decoration: none; font-weight: 600; }
        .auth-divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 20px 0; }
      `}</style>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">Ride<span>Xpress</span></div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in to your account to continue</p>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>
            <div style={{textAlign:"right",marginBottom:"20px"}}>
              <Link to="/forgot-password" style={{color:"#FFC832",fontSize:"0.8rem",textDecoration:"none"}}>Forgot password?</Link>
            </div>
            <button className="auth-submit" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
          </form>
          <hr className="auth-divider" />
          <div className="auth-links">Don't have an account? <Link to="/signup">Sign up</Link></div>
        </div>
      </div>
    </>
  );
}

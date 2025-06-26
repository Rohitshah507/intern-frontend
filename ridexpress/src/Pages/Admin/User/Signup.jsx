import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";

const PROVINCES = [
  "Koshi",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim",
];

export default function Signup() {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();

  const [form, setForm] = useState({
    role: "USER",
    name: "",
    email: "",
    phone: "",
    city: "",
    province: "Bagmati",
    street: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      roles: [form.role],
      address: {
        city: form.city,
        province: form.province,
        street: form.street,
        country: "Nepal",
      },
    };

    try {
      const u = await signup(payload);
      const admin = (u?.roles || []).some((r) => String(r).toUpperCase() === "ADMIN");
      navigate(admin ? "/admin" : "/", { replace: true });
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <>
      <style>{`
        .auth-page{
          min-height: calc(100vh - 68px);
          display:flex;align-items:center;justify-content:center;
          padding: 44px 18px;
          background: radial-gradient(900px 420px at 50% 0%, var(--gold-dim) 0%, transparent 70%), var(--bg);
          font-family: 'Syne', sans-serif;
        }
        .auth-card{
          width:100%; max-width: 680px;
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
        .grid{ display:grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media(max-width:720px){ .grid{ grid-template-columns: 1fr; } }
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
          margin-top: 16px;
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
        .hint{
          margin-top: 10px;
          font-size: 0.82rem;
          color: var(--text-dim);
          line-height: 1.5;
        }
        .hint strong{ color: var(--text); }
      `}</style>

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-title">Create your account</div>
          <div className="auth-sub">Sign up to book vehicles faster and manage your rentals.</div>
          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={onSubmit}>
            <div className="grid">
              <div>
                <label className="f-label">Role</label>
                <select className="f-input" name="role" value={form.role} onChange={onChange}>
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div>
                <label className="f-label">Full name</label>
                <input className="f-input" name="name" value={form.name} onChange={onChange} placeholder="Your name" required />
              </div>

              <div>
                <label className="f-label">Email</label>
                <input className="f-input" name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" required />
              </div>
              <div>
                <label className="f-label">Phone</label>
                <input className="f-input" name="phone" value={form.phone} onChange={onChange} placeholder="98XXXXXXXX" required />
              </div>

              <div>
                <label className="f-label">City</label>
                <input className="f-input" name="city" value={form.city} onChange={onChange} placeholder="Kathmandu" required />
              </div>
              <div>
                <label className="f-label">Province</label>
                <select className="f-input" name="province" value={form.province} onChange={onChange} required>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ gridColumn: "1/-1" }}>
                <label className="f-label">Street</label>
                <input className="f-input" name="street" value={form.street} onChange={onChange} placeholder="Street / ward / area" required />
              </div>

              <div>
                <label className="f-label">Password</label>
                <input className="f-input" name="password" type="password" value={form.password} onChange={onChange} placeholder="Minimum 8 characters" required minLength={8} />
              </div>
              <div>
                <label className="f-label">Confirm password</label>
                <input className="f-input" name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} placeholder="Re-type password" required minLength={8} />
              </div>
            </div>

            <div className="hint">
              By signing up as <strong>{form.role === "ADMIN" ? "Admin" : "User"}</strong>, you will be redirected accordingly after signup.
            </div>

            <button className="btn" disabled={loading}>{loading ? "Creating account..." : "Sign Up"}</button>
          </form>

          <div className="auth-links">
            <Link to="/login">Already have an account?</Link>
            <Link to="/vehicles">Browse vehicles</Link>
          </div>
        </div>
      </div>
    </>
  );
}

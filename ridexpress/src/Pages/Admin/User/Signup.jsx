import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";

export default function Signup() {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "",
    address: { city: "", province: "", street: "", country: "Nepal" }
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["city","province","street"].includes(name)) {
      setForm(f => ({ ...f, address: { ...f.address, [name]: value } }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(form);
      navigate("/");
    } catch (err) {
      setError(err.message || "Signup failed.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        .auth-page { min-height: 100vh; background: #0a0a0f; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; padding: 24px; }
        .auth-card { width: 100%; max-width: 500px; background: #0d0d1a; border: 1px solid rgba(255,200,50,0.12); border-radius: 20px; padding: 40px 36px; }
        .auth-logo { font-size: 1.3rem; font-weight: 800; color: #FFC832; margin-bottom: 8px; }
        .auth-logo span { color: #fff; }
        .auth-title { font-size: 1.6rem; font-weight: 800; color: #fff; margin-bottom: 4px; }
        .auth-sub { color: rgba(255,255,255,0.4); font-size: 0.875rem; margin-bottom: 28px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .form-group { margin-bottom: 14px; }
        .form-group.full { grid-column: 1 / -1; }
        .form-label { display: block; color: rgba(255,255,255,0.6); font-size: 0.75rem; font-weight: 600; margin-bottom: 7px; letter-spacing: 0.05em; text-transform: uppercase; }
        .form-input { width: 100%; box-sizing: border-box; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 11px 14px; color: #fff; font-size: 0.875rem; font-family: 'Syne', sans-serif; outline: none; transition: border-color 0.2s; }
        .form-input:focus { border-color: #FFC832; }
        .form-input::placeholder { color: rgba(255,255,255,0.25); }
        .section-label { color: rgba(255,255,255,0.35); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin: 20px 0 14px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px; }
        .auth-error { background: rgba(255,60,60,0.1); border: 1px solid rgba(255,60,60,0.25); color: #ff6b6b; padding: 12px 14px; border-radius: 10px; font-size: 0.875rem; margin-bottom: 16px; }
        .auth-submit { width: 100%; padding: 13px; background: #FFC832; color: #0a0a0f; border: none; border-radius: 12px; font-size: 1rem; font-weight: 700; cursor: pointer; font-family: 'Syne', sans-serif; transition: all 0.2s; margin-top: 8px; margin-bottom: 20px; }
        .auth-submit:hover:not(:disabled) { background: #e6b22e; }
        .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-links { text-align: center; color: rgba(255,255,255,0.4); font-size: 0.875rem; }
        .auth-links a { color: #FFC832; text-decoration: none; font-weight: 600; }
      `}</style>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">Ride<span>Xpress</span></div>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-sub">Join RideXpress and start your journey</p>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full">
                <label className="form-label">Full Name</label>
                <input className="form-input" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group full">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" name="password" placeholder="Min. 8 chars" value={form.password} onChange={handleChange} required minLength={8} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" name="phone" placeholder="+977 98XXXXXXXX" value={form.phone} onChange={handleChange} required />
              </div>
            </div>
            <div className="section-label">Address</div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" name="city" placeholder="Kathmandu" value={form.address.city} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Province</label>
                <input className="form-input" name="province" placeholder="Bagmati" value={form.address.province} onChange={handleChange} required />
              </div>
              <div className="form-group full">
                <label className="form-label">Street</label>
                <input className="form-input" name="street" placeholder="Thamel, Kathmandu" value={form.address.street} onChange={handleChange} required />
              </div>
            </div>
            <button className="auth-submit" disabled={loading}>{loading ? "Creating account..." : "Create Account"}</button>
          </form>
          <div className="auth-links">Already have an account? <Link to="/login">Sign in</Link></div>
        </div>
      </div>
    </>
  );
}

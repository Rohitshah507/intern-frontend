import { useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../../../services/Api";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try { await authAPI.forgotPassword({ email }); setSent(true); }
    catch (err) { setError(err.message || "Failed to send reset email."); }
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        .auth-page { min-height: 100vh; background: #0a0a0f; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; padding: 24px; }
        .auth-card { width: 100%; max-width: 420px; background: #0d0d1a; border: 1px solid rgba(255,200,50,0.12); border-radius: 20px; padding: 40px 36px; }
        .auth-logo { font-size: 1.3rem; font-weight: 800; color: #FFC832; margin-bottom: 8px; }
        .auth-logo span { color: #fff; }
        .auth-title { font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 4px; }
        .auth-sub { color: rgba(255,255,255,0.4); font-size: 0.875rem; margin-bottom: 28px; line-height: 1.6; }
        .form-label { display: block; color: rgba(255,255,255,0.6); font-size: 0.75rem; font-weight: 600; margin-bottom: 8px; letter-spacing: 0.05em; text-transform: uppercase; }
        .form-input { width: 100%; box-sizing: border-box; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 14px; color: #fff; font-size: 0.9rem; font-family: 'Syne', sans-serif; outline: none; transition: border-color 0.2s; margin-bottom: 20px; }
        .form-input:focus { border-color: #FFC832; }
        .form-input::placeholder { color: rgba(255,255,255,0.25); }
        .auth-error { background: rgba(255,60,60,0.1); border: 1px solid rgba(255,60,60,0.25); color: #ff6b6b; padding: 12px 14px; border-radius: 10px; font-size: 0.875rem; margin-bottom: 16px; }
        .auth-success { background: rgba(50,200,100,0.1); border: 1px solid rgba(50,200,100,0.25); color: #5ce89b; padding: 16px 14px; border-radius: 10px; font-size: 0.875rem; margin-bottom: 16px; line-height: 1.6; }
        .auth-submit { width: 100%; padding: 13px; background: #FFC832; color: #0a0a0f; border: none; border-radius: 12px; font-size: 1rem; font-weight: 700; cursor: pointer; font-family: 'Syne', sans-serif; transition: all 0.2s; margin-bottom: 20px; }
        .auth-submit:hover:not(:disabled) { background: #e6b22e; }
        .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-links { text-align: center; color: rgba(255,255,255,0.4); font-size: 0.875rem; }
        .auth-links a { color: #FFC832; text-decoration: none; font-weight: 600; }
      `}</style>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">Ride<span>Xpress</span></div>
          <h1 className="auth-title">Forgot Password</h1>
          <p className="auth-sub">Enter your email and we'll send you a reset link</p>
          {error && <div className="auth-error">{error}</div>}
          {sent ? (
            <div className="auth-success">✅ Reset link sent! Check your inbox and follow the instructions.</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              <button className="auth-submit" disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</button>
            </form>
          )}
          <div className="auth-links"><Link to="/login">← Back to Login</Link></div>
        </div>
      </div>
    </>
  );
}

export function ResetPassword() {
  const [form, setForm] = useState({ token: "", newPassword: "" });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try { await authAPI.resetPassword(form); setDone(true); }
    catch (err) { setError(err.message || "Reset failed."); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page" style={{minHeight:"100vh",background:"#0a0a0f",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",padding:"24px"}}>
      <div style={{width:"100%",maxWidth:"420px",background:"#0d0d1a",border:"1px solid rgba(255,200,50,0.12)",borderRadius:"20px",padding:"40px 36px"}}>
        <div style={{fontSize:"1.3rem",fontWeight:800,color:"#FFC832",marginBottom:"8px"}}>Ride<span style={{color:"#fff"}}>Xpress</span></div>
        <h1 style={{fontSize:"1.5rem",fontWeight:800,color:"#fff",marginBottom:"4px"}}>Reset Password</h1>
        <p style={{color:"rgba(255,255,255,0.4)",fontSize:"0.875rem",marginBottom:"28px"}}>Enter your reset token and new password</p>
        {error && <div style={{background:"rgba(255,60,60,0.1)",border:"1px solid rgba(255,60,60,0.25)",color:"#ff6b6b",padding:"12px 14px",borderRadius:"10px",fontSize:"0.875rem",marginBottom:"16px"}}>{error}</div>}
        {done ? (
          <div style={{background:"rgba(50,200,100,0.1)",border:"1px solid rgba(50,200,100,0.25)",color:"#5ce89b",padding:"16px 14px",borderRadius:"10px",fontSize:"0.875rem",marginBottom:"16px"}}>
            ✅ Password reset! <Link to="/login" style={{color:"#FFC832"}}>Login now</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {[["token","Reset Token","Paste your reset token"],["newPassword","New Password","Min. 8 characters"]].map(([name, label, ph]) => (
              <div key={name} style={{marginBottom:"16px"}}>
                <label style={{display:"block",color:"rgba(255,255,255,0.6)",fontSize:"0.75rem",fontWeight:600,marginBottom:"8px",letterSpacing:"0.05em",textTransform:"uppercase"}}>{label}</label>
                <input type={name === "newPassword" ? "password" : "text"} placeholder={ph} value={form[name]}
                  onChange={e => setForm(f => ({...f,[name]:e.target.value}))} required
                  style={{width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",padding:"12px 14px",color:"#fff",fontSize:"0.9rem",fontFamily:"'Syne',sans-serif",outline:"none"}} />
              </div>
            ))}
            <button disabled={loading} style={{width:"100%",padding:"13px",background:"#FFC832",color:"#0a0a0f",border:"none",borderRadius:"12px",fontSize:"1rem",fontWeight:700,cursor:"pointer",fontFamily:"'Syne',sans-serif",marginTop:"8px"}}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
        <div style={{textAlign:"center",marginTop:"20px",color:"rgba(255,255,255,0.4)",fontSize:"0.875rem"}}>
          <Link to="/login" style={{color:"#FFC832",textDecoration:"none",fontWeight:600}}>← Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

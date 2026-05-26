import { useState, useEffect } from "react";
import { bookingAPI } from "../../../services/Api";

const STATUS_COLOR = {
  pending: { bg: "rgba(255,200,50,0.1)", color: "#FFC832", border: "rgba(255,200,50,0.2)" },
  confirmed: { bg: "rgba(50,200,100,0.1)", color: "#5ce89b", border: "rgba(50,200,100,0.2)" },
  cancelled: { bg: "rgba(255,60,60,0.1)", color: "#ff6b6b", border: "rgba(255,60,60,0.2)" },
  completed: { bg: "rgba(100,100,255,0.1)", color: "#8080ff", border: "rgba(100,100,255,0.2)" },
};

function StatusBadge({ status }) {
  const s = STATUS_COLOR[status] || STATUS_COLOR.pending;
  return <span style={{background:s.bg,color:s.color,border:`1px solid ${s.border}`,padding:"4px 12px",borderRadius:"20px",fontSize:"0.72rem",fontWeight:700,textTransform:"capitalize"}}>{status}</span>;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payModal, setPayModal] = useState(null);
  const [payForm, setPayForm] = useState({ method: "online" });
  const [payLoading, setPayLoading] = useState(false);
  const [payMsg, setPayMsg] = useState("");

  const fetchBookings = () => {
    setLoading(true);
    bookingAPI.getByUser().then(d => setBookings(d.data || d.bookings || d || [])).catch(e => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(fetchBookings, []);

  const handlePayment = async (e) => {
    e.preventDefault(); setPayLoading(true); setPayMsg("");
    try {
      await bookingAPI.initiatePayment(payModal._id, { method: payForm.method, amount: payModal.totalPrice });
      setPayMsg("Payment initiated! Redirecting to confirm...");
      setTimeout(async () => {
        try { await bookingAPI.confirmPayment(payModal._id, {}); fetchBookings(); setPayModal(null); }
        catch(e2) { setPayMsg(e2.message); }
      }, 1200);
    } catch(err) { setPayMsg(err.message); }
    finally { setPayLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        .mb-page { min-height: 60vh; background: #0a0a0f; color: #fff; font-family: 'Syne', sans-serif; padding: 48px 24px; }
        .mb-inner { max-width: 900px; margin: 0 auto; }
        .page-title { font-size: clamp(1.6rem, 4vw, 2.2rem); font-weight: 800; letter-spacing: -0.03em; margin-bottom: 8px; }
        .page-title span { color: #FFC832; }
        .page-sub { color: rgba(255,255,255,0.35); font-size: 0.875rem; margin-bottom: 36px; }
        .booking-card { background: #0d0d1a; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; margin-bottom: 16px; overflow: hidden; }
        .bc-header { padding: 20px 24px; display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .bc-id { font-family: 'DM Mono', monospace; font-size: 0.75rem; color: rgba(255,255,255,0.3); margin-bottom: 6px; }
        .bc-vehicle { font-size: 1rem; font-weight: 700; }
        .bc-body { padding: 20px 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; }
        .bc-item label { display: block; font-size: 0.7rem; color: rgba(255,255,255,0.35); font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 5px; }
        .bc-item span { font-size: 0.875rem; font-weight: 500; }
        .bc-footer { padding: 16px 24px; background: rgba(255,255,255,0.02); display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.04); }
        .bc-total { font-size: 1.1rem; font-weight: 800; color: #FFC832; }
        .pay-btn { padding: 9px 20px; background: #FFC832; color: #0a0a0f; border: none; border-radius: 10px; font-weight: 700; font-family: 'Syne', sans-serif; font-size: 0.8rem; cursor: pointer; transition: background 0.2s; }
        .pay-btn:hover { background: #e6b22e; }
        .paid-badge { font-size: 0.8rem; color: #5ce89b; font-weight: 600; }
        .empty { text-align: center; padding: 80px; color: rgba(255,255,255,0.3); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 24px; }
        .modal { background: #0d0d1a; border: 1px solid rgba(255,200,50,0.2); border-radius: 20px; padding: 36px; width: 100%; max-width: 380px; }
        .modal-title { font-size: 1.2rem; font-weight: 800; margin-bottom: 20px; }
        .m-label { display: block; color: rgba(255,255,255,0.5); font-size: 0.75rem; font-weight: 600; margin-bottom: 8px; letter-spacing: 0.05em; text-transform: uppercase; }
        .m-select { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 11px 14px; color: #fff; font-family: 'Syne', sans-serif; font-size: 0.875rem; outline: none; margin-bottom: 20px; }
        .m-msg { font-size: 0.875rem; color: #5ce89b; margin-bottom: 12px; }
        .m-btns { display: flex; gap: 10px; }
        .m-cancel { flex: 1; padding: 11px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); border-radius: 10px; cursor: pointer; font-family: 'Syne', sans-serif; font-weight: 600; }
        .m-confirm { flex: 1; padding: 11px; background: #FFC832; color: #0a0a0f; border: none; border-radius: 10px; cursor: pointer; font-family: 'Syne', sans-serif; font-weight: 700; }
        .m-confirm:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
      <div className="mb-page">
        <div className="mb-inner">
          <h1 className="page-title">My <span>Bookings</span></h1>
          <p className="page-sub">{bookings.length} booking{bookings.length !== 1 ? "s" : ""} found</p>
          {loading && <div className="empty">Loading your bookings...</div>}
          {error && <div className="empty" style={{color:"#ff6b6b"}}>{error}</div>}
          {!loading && !error && (
            bookings.length ? bookings.map(b => {
              const vehicle = b.bookingItems?.[0];
              const vName = vehicle?.vehicle?.name || vehicle?.vehicle || "Vehicle";
              const isPaid = b.paymentStatus === "paid";
              return (
                <div className="booking-card" key={b._id}>
                  <div className="bc-header">
                    <div>
                      <div className="bc-id">#{b._id?.slice(-8).toUpperCase()}</div>
                      <div className="bc-vehicle">{vName}</div>
                      <div style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.3)",marginTop:"4px"}}>Plate: {b.vehicleNumber}</div>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                  <div className="bc-body">
                    {[["Start Date", new Date(b.startDate).toLocaleDateString()],["End Date", new Date(b.endDate).toLocaleDateString()],["Pickup", b.pickupLocation],["Drop-off", b.dropLocation]].map(([l,v]) => (
                      <div className="bc-item" key={l}><label>{l}</label><span>{v}</span></div>
                    ))}
                  </div>
                  <div className="bc-footer">
                    <div className="bc-total">Rs. {b.totalPrice?.toLocaleString()}</div>
                    {isPaid ? (
                      <span className="paid-badge">✅ Paid</span>
                    ) : (
                      b.status !== "cancelled" && <button className="pay-btn" onClick={() => { setPayModal(b); setPayMsg(""); }}>Pay Now</button>
                    )}
                  </div>
                </div>
              );
            }) : <div className="empty"><div style={{fontSize:"3rem",marginBottom:"16px"}}>📋</div><div>No bookings yet. <a href="/vehicles" style={{color:"#FFC832"}}>Browse vehicles</a></div></div>
          )}
        </div>
      </div>
      {payModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setPayModal(null)}>
          <div className="modal">
            <div className="modal-title">Complete Payment</div>
            <div style={{background:"rgba(255,200,50,0.06)",borderRadius:"10px",padding:"14px",marginBottom:"20px"}}>
              <div style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.4)"}}>Total Amount</div>
              <div style={{fontSize:"1.5rem",fontWeight:800,color:"#FFC832"}}>Rs. {payModal.totalPrice?.toLocaleString()}</div>
            </div>
            <form onSubmit={handlePayment}>
              <label className="m-label">Payment Method</label>
              <select className="m-select" value={payForm.method} onChange={e => setPayForm({method:e.target.value})}>
                <option value="online">Online Transfer</option>
                <option value="card">Card</option>
                <option value="cash">Cash</option>
              </select>
              {payMsg && <div className="m-msg">{payMsg}</div>}
              <div className="m-btns">
                <button type="button" className="m-cancel" onClick={() => setPayModal(null)}>Cancel</button>
                <button type="submit" className="m-confirm" disabled={payLoading}>{payLoading ? "Processing..." : "Pay Now"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

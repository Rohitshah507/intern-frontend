import { useState, useEffect } from "react";
import { bookingAPI } from "../../../services/Api";

const STATUS_COLOR = {
  pending: {
    bg: "rgba(244,196,48,0.14)",
    color: "#7a5a00",
    border: "rgba(244,196,48,0.35)",
  },
  confirmed: {
    bg: "rgba(50,200,100,0.1)",
    color: "#5ce89b",
    border: "rgba(50,200,100,0.2)",
  },
  cancelled: {
    bg: "rgba(255,60,60,0.1)",
    color: "#ff6b6b",
    border: "rgba(255,60,60,0.2)",
  },
  completed: {
    bg: "rgba(100,100,255,0.1)",
    color: "#8080ff",
    border: "rgba(100,100,255,0.2)",
  },
};

function StatusBadge({ status }) {
  const s = STATUS_COLOR[status] || STATUS_COLOR.pending;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "0.72rem",
        fontWeight: 700,
        textTransform: "capitalize",
      }}
    >
      {status}
    </span>
  );
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
    bookingAPI
      .getByUser()
      .then((d) => setBookings(d.data || d.bookings || d || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(fetchBookings, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    setPayLoading(true);
    setPayMsg("");
    try {
      await bookingAPI.initiatePayment(payModal._id, {
        method: payForm.method,
        amount: payModal.totalPrice,
      });
      setPayMsg("Payment initiated! Redirecting to confirm...");
      setTimeout(async () => {
        try {
          await bookingAPI.confirmPayment(payModal._id, {});
          fetchBookings();
          setPayModal(null);
        } catch (e2) {
          setPayMsg(e2.message);
        }
      }, 1200);
    } catch (err) {
      setPayMsg(err.message);
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        .mb-page { min-height: 60vh; background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif; padding: 48px 24px; }
        .mb-inner { max-width: 900px; margin: 0 auto; }
        .page-title { font-size: clamp(1.6rem, 4vw, 2.2rem); font-weight: 800; letter-spacing: -0.03em; margin-bottom: 8px; }
        .page-title span { color: #7a5a00; }
        .page-sub { color: var(--text-dim); font-size: 0.875rem; margin-bottom: 36px; font-weight: 700; }
        .booking-card { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; margin-bottom: 16px; overflow: hidden; box-shadow: 0 18px 50px rgba(17,17,17,0.06); }
        .bc-header { padding: 20px 24px; display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border); }
        .bc-id { font-family: 'DM Mono', monospace; font-size: 0.75rem; color: var(--text-dim); margin-bottom: 6px; }
        .bc-vehicle { font-size: 1rem; font-weight: 900; }
        .bc-body { padding: 20px 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; }
        .bc-item label { display: block; font-size: 0.7rem; color: var(--text-dim); font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 5px; }
        .bc-item span { font-size: 0.875rem; font-weight: 800; color: var(--text); }
        .bc-footer { padding: 16px 24px; background: rgba(244,196,48,0.10); display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); }
        .bc-total { font-size: 1.1rem; font-weight: 900; color: #7a5a00; }
        .pay-btn { padding: 9px 20px; background: var(--gold); color: #1b1300; border: none; border-radius: 12px; font-weight: 900; font-family: 'Syne', sans-serif; font-size: 0.8rem; cursor: pointer; transition: transform 0.12s, filter 0.12s; }
        .pay-btn:hover { filter: brightness(0.97); transform: translateY(-1px); }
        .paid-badge { font-size: 0.8rem; color: #146c43; font-weight: 900; }
        .empty { text-align: center; padding: 80px; color: var(--text-dim); font-weight: 800; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 24px; }
        .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 28px; width: 100%; max-width: 400px; }
        .modal-title { font-size: 1.2rem; font-weight: 800; margin-bottom: 20px; }
        .m-label { display: block; color: var(--text-dim); font-size: 0.75rem; font-weight: 900; margin-bottom: 8px; letter-spacing: 0.08em; text-transform: uppercase; }
        .m-select { width: 100%; background: #fff; border: 1px solid rgba(17,17,17,0.14); border-radius: 12px; padding: 11px 14px; color: var(--text); font-family: 'Syne', sans-serif; font-size: 0.875rem; outline: none; margin-bottom: 20px; }
        .m-select:focus { border-color: var(--gold); box-shadow: 0 0 0 4px rgba(244,196,48,0.18); }
        .m-msg { font-size: 0.875rem; color: #146c43; margin-bottom: 12px; font-weight: 800; }
        .m-btns { display: flex; gap: 10px; }
        .m-cancel { flex: 1; padding: 11px; background: #fff; border: 1px solid rgba(17,17,17,0.14); color: var(--text); border-radius: 12px; cursor: pointer; font-family: 'Syne', sans-serif; font-weight: 900; }
        .m-cancel:hover { background: rgba(244,196,48,0.12); border-color: rgba(244,196,48,0.85); }
        .m-confirm { flex: 1; padding: 11px; background: var(--gold); color: #1b1300; border: none; border-radius: 12px; cursor: pointer; font-family: 'Syne', sans-serif; font-weight: 900; }
        .m-confirm:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
      <div className="mb-page">
        <div className="mb-inner">
          <h1 className="page-title">
            My <span>Bookings</span>
          </h1>
          <p className="page-sub">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found
          </p>
          {loading && <div className="empty">Loading your bookings...</div>}
          {error && (
            <div className="empty" style={{ color: "#b42318" }}>
              {error}
            </div>
          )}
          {!loading &&
            !error &&
            (bookings.length ? (
              bookings.map((b) => {
                const vehicle = b.bookingItems?.[0];
                const vName =
                  vehicle?.vehicle?.name || vehicle?.vehicle || "Vehicle";
                const isPaid = b.paymentStatus === "paid";
                return (
                  <div className="booking-card" key={b._id}>
                    <div className="bc-header">
                      <div>
                        <div className="bc-id">
                          #{b._id?.slice(-8).toUpperCase()}
                        </div>
                        <div className="bc-vehicle">{vName}</div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--text-dim)",
                            marginTop: "4px",
                            fontWeight: 700,
                          }}
                        >
                          Plate: {b.vehicleNumber}
                        </div>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="bc-body">
                      {[
                        [
                          "Start Date",
                          new Date(b.startDate).toLocaleDateString(),
                        ],
                        ["End Date", new Date(b.endDate).toLocaleDateString()],
                        ["Pickup", b.pickupLocation],
                        ["Drop-off", b.dropLocation],
                      ].map(([l, v]) => (
                        <div className="bc-item" key={l}>
                          <label>{l}</label>
                          <span>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bc-footer">
                      <div className="bc-total">
                        Rs. {b.totalPrice?.toLocaleString()}
                      </div>
                      {isPaid ? (
                        <span className="paid-badge">✅ Paid</span>
                      ) : (
                        b.status !== "cancelled" && (
                          <button
                            className="pay-btn"
                            onClick={() => {
                              setPayModal(b);
                              setPayMsg("");
                            }}
                          >
                            Pay Now
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty">
                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📋</div>
                <div>
                  No bookings yet.{" "}
                  <a
                    href="/vehicles"
                    style={{
                      color: "#7a5a00",
                      fontWeight: 900,
                      textDecoration: "none",
                    }}
                  >
                    Browse vehicles
                  </a>
                </div>
              </div>
            ))}
        </div>
      </div>
      {payModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setPayModal(null)}
        >
          <div className="modal">
            <div className="modal-title">Complete Payment</div>
            <div
              style={{
                background: "rgba(244,196,48,0.14)",
                borderRadius: "14px",
                padding: "14px",
                marginBottom: "20px",
                border: "1px dashed rgba(17,17,17,0.16)",
              }}
            >
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-dim)",
                  fontWeight: 900,
                }}
              >
                Total Amount
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 900,
                  color: "#7a5a00",
                }}
              >
                Rs. {payModal.totalPrice?.toLocaleString()}
              </div>
            </div>
            <form onSubmit={handlePayment}>
              <label className="m-label">Payment Method</label>
              <select
                className="m-select"
                value={payForm.method}
                onChange={(e) => setPayForm({ method: e.target.value })}
              >
                <option value="online">Online Transfer</option>
                <option value="card">Card</option>
                <option value="cash">Cash</option>
              </select>
              {payMsg && <div className="m-msg">{payMsg}</div>}
              <div className="m-btns">
                <button
                  type="button"
                  className="m-cancel"
                  onClick={() => setPayModal(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="m-confirm"
                  disabled={payLoading}
                >
                  {payLoading ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

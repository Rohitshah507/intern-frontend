import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { bookingAPI, vehicleAPI } from "../../../services/Api";
import { useAuth } from "../../../Context/AuthContext";

export default function BookVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [booking, setBooking] = useState({
    vehicleNumber: "",
    startDate: "",
    endDate: "",
    pickupLocation: "",
    dropLocation: "",
  });

  useEffect(() => {
    setLoading(true);
    vehicleAPI
      .getById(id)
      .then((d) => setVehicle(d.data || d.vehicle || d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const days = useMemo(() => {
    if (!booking.startDate || !booking.endDate) return 0;
    return Math.max(
      1,
      Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / 86400000)
    );
  }, [booking.startDate, booking.endDate]);

  const total = days * (vehicle?.pricePerDay || 0);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    setSubmitting(true);
    try {
      await bookingAPI.create({
        ...booking,
        bookingItems: [
          {
            vehicle: id,
            quantity: 1,
            pricePerDay: vehicle.pricePerDay,
            subtotal: total,
          },
        ],
        totalPrice: total,
        user: user._id,
      });
      setDone(true);
    } catch (err) {
      setError(err.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "64px 18px", textAlign: "center", color: "var(--text-dim)" }}>
        Loading booking…
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div style={{ padding: "64px 18px", textAlign: "center" }}>
        <div style={{ fontWeight: 900, fontSize: "1.2rem", marginBottom: 8 }}>Vehicle not found</div>
        <Link to="/vehicles" style={{ color: "#7a5a00", fontWeight: 900, textDecoration: "none" }}>
          Back to vehicles
        </Link>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .bk-page{
          min-height: 60vh;
          padding: 44px 18px;
          background: radial-gradient(900px 420px at 50% 0%, var(--gold-dim) 0%, transparent 70%), var(--bg);
          font-family: 'Syne', sans-serif;
        }
        .bk-wrap{ max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 420px; gap: 22px; align-items: start; }
        @media(max-width: 900px){ .bk-wrap{ grid-template-columns: 1fr; } }
        .card{
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 18px;
          box-shadow: 0 18px 50px rgba(17,17,17,0.08);
          overflow: hidden;
        }
        .pad{ padding: 22px; }
        .title{ font-size: 1.4rem; font-weight: 900; color: var(--text); letter-spacing: -0.02em; }
        .sub{ margin-top: 6px; color: var(--text-dim); font-size: 0.92rem; }
        .badge{ display:inline-flex; align-items:center; gap:8px; padding: 6px 12px; border-radius: 999px; font-size: 0.78rem; font-weight: 900; margin-top: 12px; }
        .badge.av{ background: rgba(50,200,100,0.12); border: 1px solid rgba(50,200,100,0.25); color: #146c43; }
        .badge.na{ background: rgba(255,60,60,0.10); border: 1px solid rgba(255,60,60,0.25); color: #b42318; }
        .vimg{ width:100%; height: 270px; object-fit: cover; background: #f2f2f2; }
        .meta{ margin-top: 10px; display:flex; gap: 10px; flex-wrap: wrap; }
        .pill{ padding: 8px 10px; border: 1px solid rgba(17,17,17,0.12); border-radius: 12px; font-size: 0.85rem; color: var(--text); background: #fff; }
        .price{ margin-top: 12px; font-size: 1.6rem; font-weight: 900; color: #7a5a00; }
        .price small{ font-size: 0.9rem; color: var(--text-dim); font-weight: 700; }
        .err{
          background: rgba(255,60,60,0.08);
          border: 1px solid rgba(255,60,60,0.25);
          color: #b42318;
          padding: 10px 12px; border-radius: 12px;
          font-size: 0.9rem; margin-bottom: 12px;
        }
        .ok{
          background: rgba(50,200,100,0.12);
          border: 1px solid rgba(50,200,100,0.25);
          color: #146c43;
          padding: 12px 12px; border-radius: 12px;
          font-size: 0.92rem; margin-top: 12px;
          text-align:center;
        }
        .f-label{ display:block; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 900; color: var(--text-dim); margin-bottom: 7px; }
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
          margin-bottom: 12px;
        }
        .f-input:focus{ border-color: var(--gold); box-shadow: 0 0 0 4px rgba(255,200,50,0.18); }
        .sum{
          border: 1px dashed rgba(17,17,17,0.18);
          background: rgba(255,200,50,0.10);
          border-radius: 14px;
          padding: 12px;
          margin-top: 6px;
          margin-bottom: 12px;
        }
        .sum-row{ display:flex; justify-content:space-between; color: var(--text); font-weight: 800; font-size: 0.92rem; }
        .sum-row span:first-child{ color: var(--text-dim); font-weight: 900; }
        .btn{
          width:100%;
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
        .ghost{
          margin-top: 10px;
          width:100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid rgba(17,17,17,0.14);
          background: #fff;
          color: var(--text);
          font-weight: 900;
          cursor:pointer;
        }
        .ghost:hover{ background: rgba(255,200,50,0.10); border-color: rgba(255,200,50,0.55); }
      `}</style>

      <div className="bk-page">
        <div className="bk-wrap">
          <div className="card">
            {vehicle.imageUrls?.[0] ? (
              <img className="vimg" src={vehicle.imageUrls[0]} alt={vehicle.name} />
            ) : (
              <div className="vimg" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}>
                🚗
              </div>
            )}
            <div className="pad">
              <div className="title">{vehicle.name}</div>
              <div className="sub">
                {vehicle.brand} · {vehicle.model} {vehicle.year ? `· ${vehicle.year}` : ""}
              </div>
              <div className={`badge ${vehicle.available ? "av" : "na"}`}>{vehicle.available ? "Available" : "Unavailable"}</div>

              <div className="price">
                Rs. {vehicle.pricePerDay?.toLocaleString()} <small>/ day</small>
              </div>
              <div className="meta">
                {vehicle.type && <div className="pill">Type: {vehicle.type}</div>}
                {vehicle.fuelType && <div className="pill">Fuel: {vehicle.fuelType}</div>}
                {vehicle.transmission && <div className="pill">Transmission: {vehicle.transmission}</div>}
              </div>
              {vehicle.description && <div className="sub" style={{ marginTop: 12 }}>{vehicle.description}</div>}
            </div>
          </div>

          <div className="card">
            <div className="pad">
              <div className="title">Booking details</div>
              <div className="sub">Fill the form to confirm your booking.</div>

              {done ? (
                <div className="ok">
                  <div style={{ fontSize: "2rem", marginBottom: 8 }}>✅</div>
                  <div style={{ fontWeight: 900, marginBottom: 6 }}>Booking confirmed!</div>
                  <div style={{ color: "var(--text-dim)", fontWeight: 800, marginBottom: 12 }}>You can review it in My Bookings.</div>
                  <button className="btn" onClick={() => navigate("/my-bookings")}>Go to My Bookings</button>
                </div>
              ) : (
                <form onSubmit={onSubmit}>
                  {error && <div className="err">{error}</div>}

                  <label className="f-label">Vehicle number</label>
                  <input className="f-input" value={booking.vehicleNumber} onChange={(e) => setBooking((b) => ({ ...b, vehicleNumber: e.target.value }))} placeholder="e.g. BA 1 KA 1234" required />

                  <label className="f-label">Start date</label>
                  <input className="f-input" type="date" value={booking.startDate} min={new Date().toISOString().split("T")[0]} onChange={(e) => setBooking((b) => ({ ...b, startDate: e.target.value }))} required />

                  <label className="f-label">End date</label>
                  <input className="f-input" type="date" value={booking.endDate} min={booking.startDate || new Date().toISOString().split("T")[0]} onChange={(e) => setBooking((b) => ({ ...b, endDate: e.target.value }))} required />

                  <label className="f-label">Pickup location</label>
                  <input className="f-input" value={booking.pickupLocation} onChange={(e) => setBooking((b) => ({ ...b, pickupLocation: e.target.value }))} placeholder="e.g. Thamel, Kathmandu" required />

                  <label className="f-label">Drop location</label>
                  <input className="f-input" value={booking.dropLocation} onChange={(e) => setBooking((b) => ({ ...b, dropLocation: e.target.value }))} placeholder="e.g. Pokhara Bus Park" required />

                  {!!days && (
                    <div className="sum">
                      <div className="sum-row"><span>Duration</span><span>{days} day{days !== 1 ? "s" : ""}</span></div>
                      <div style={{ height: 8 }} />
                      <div className="sum-row"><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
                    </div>
                  )}

                  <button className="btn" disabled={submitting || !vehicle.available}>
                    {!vehicle.available ? "Not available" : submitting ? "Booking..." : "Confirm booking"}
                  </button>
                  <button className="ghost" type="button" onClick={() => navigate(`/vehicles/${id}`)}>Back to vehicle</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


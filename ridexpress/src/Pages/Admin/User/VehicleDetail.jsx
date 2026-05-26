import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { vehicleAPI, bookingAPI } from "../../../services/Api";
import { useAuth } from "../../../Context/AuthContext";

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [booking, setBooking] = useState({
    startDate: "",
    endDate: "",
    pickupLocation: "",
    dropLocation: "",
    vehicleNumber: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    vehicleAPI
      .getById(id)
      .then((d) => setVehicle(d.data || d.vehicle || d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const days =
    booking.startDate && booking.endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(booking.endDate) - new Date(booking.startDate)) /
              86400000,
          ),
        )
      : 0;
  const total = days * (vehicle?.pricePerDay || 0);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await bookingAPI.create({
        ...booking,
        startDate: booking.startDate,
        endDate: booking.endDate,
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
      setBookingDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-dim)",
          fontFamily: "'Syne',sans-serif",
          background: "var(--bg)",
          fontWeight: 800,
        }}
      >
        Loading vehicle...
      </div>
    );
  if (!vehicle)
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#b42318",
          fontFamily: "'Syne',sans-serif",
          background: "var(--bg)",
          fontWeight: 900,
        }}
      >
        Vehicle not found.
      </div>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        .vd-page { min-height: 60vh; background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif; padding: 48px 24px; }
        .vd-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 400px; gap: 40px; }
        .vd-img-main { width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 18px; background: #f1f1f1; }
        .vd-img-placeholder { width: 100%; aspect-ratio: 16/9; background: linear-gradient(135deg, #fff6da, #ffffff); border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 5rem; }
        .vd-thumbs { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
        .vd-thumb { width: 72px; height: 52px; object-fit: cover; border-radius: 10px; cursor: pointer; opacity: 0.65; transition: opacity 0.2s; border: 2px solid transparent; }
        .vd-thumb.active { opacity: 1; border-color: rgba(244,196,48,0.95); }
        .vd-type { font-size: 0.7rem; color: #7a5a00; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px; }
        .vd-name { font-size: 2rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 6px; }
        .vd-meta { color: var(--text-dim); font-size: 0.875rem; margin-bottom: 20px; font-weight: 700; }
        .vd-price { font-size: 2rem; font-weight: 900; color: #7a5a00; margin-bottom: 20px; }
        .vd-price small { font-size: 0.9rem; color: var(--text-dim); font-weight: 800; }
        .vd-desc { color: var(--text-dim); font-size: 0.875rem; line-height: 1.7; margin-bottom: 24px; font-weight: 700; }
        .booking-card { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 22px; position: sticky; top: 88px; box-shadow: 0 18px 50px rgba(17,17,17,0.08); }
        .booking-title { display:flex; align-items: center; justify-content: space-between; gap: 10px; font-size: 1.1rem; font-weight: 700; margin-bottom: 20px; }
        .booking-title a { font-size: 0.78rem; color: #7a5a00; font-weight: 900; text-decoration: none; }
        .booking-title a:hover { text-decoration: underline; }
        .b-label { display: block; color: var(--text-dim); font-size: 0.75rem; font-weight: 900; margin-bottom: 7px; letter-spacing: 0.08em; text-transform: uppercase; }
        .b-input { width: 100%; box-sizing: border-box; background: #fff; border: 1px solid rgba(17,17,17,0.14); border-radius: 12px; padding: 11px 12px; color: var(--text); font-size: 0.9rem; font-family: 'Syne', sans-serif; outline: none; margin-bottom: 14px; transition: border-color 0.2s, box-shadow 0.2s; }
        .b-input:focus { border-color: var(--gold); box-shadow: 0 0 0 4px rgba(244,196,48,0.18); }
        .b-input::placeholder { color: rgba(21,21,21,0.45); }
        .b-summary { background: rgba(244,196,48,0.12); border-radius: 14px; padding: 14px; margin-bottom: 16px; border: 1px dashed rgba(17,17,17,0.16); }
        .b-row { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--text); font-weight: 800; margin-bottom: 6px; }
        .b-row span:first-child { color: var(--text-dim); font-weight: 900; }
        .b-total { display: flex; justify-content: space-between; font-size: 1rem; font-weight: 900; color: #7a5a00; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(17,17,17,0.12); }
        .b-btn { width: 100%; padding: 13px; background: var(--gold); color: #1b1300; border: none; border-radius: 12px; font-size: 1rem; font-weight: 900; cursor: pointer; font-family: 'Syne', sans-serif; transition: all 0.2s; }
        .b-btn:hover:not(:disabled) { filter: brightness(0.97); transform: translateY(-1px); }
        .b-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .b-error { background: rgba(255,60,60,0.08); border: 1px solid rgba(255,60,60,0.25); color: #b42318; padding: 10px 12px; border-radius: 12px; font-size: 0.85rem; margin-bottom: 12px; font-weight: 800; }
        .b-success { background: rgba(50,200,100,0.12); border: 1px solid rgba(50,200,100,0.25); color: #146c43; padding: 16px; border-radius: 14px; text-align: center; }
        @media(max-width: 768px) { .vd-inner { grid-template-columns: 1fr; } .booking-card { position: static; } }
      `}</style>
      <div className="vd-page">
        <div className="vd-inner">
          <div>
            {vehicle.imageUrls?.length > 0 ? (
              <>
                <img
                  className="vd-img-main"
                  src={vehicle.imageUrls[imgIdx]}
                  alt={vehicle.name}
                />
                {vehicle.imageUrls.length > 1 && (
                  <div className="vd-thumbs">
                    {vehicle.imageUrls.map((url, i) => (
                      <img
                        key={i}
                        className={`vd-thumb ${i === imgIdx ? "active" : ""}`}
                        src={url}
                        alt=""
                        onClick={() => setImgIdx(i)}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="vd-img-placeholder">🚗</div>
            )}
            <div style={{ marginTop: "32px" }}>
              <div className="vd-type">{vehicle.type}</div>
              <h1 className="vd-name">{vehicle.name}</h1>
              <div className="vd-meta">
                {vehicle.brand} · {vehicle.model}
                {vehicle.year && ` · ${vehicle.year}`}
              </div>
              <div className="vd-price">
                Rs. {vehicle.pricePerDay?.toLocaleString()}
                <small> / day</small>
              </div>
              {vehicle.description && (
                <div className="vd-desc">{vehicle.description}</div>
              )}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {[
                  ["Type", vehicle.type],
                  ["Brand", vehicle.brand],
                  ["Model", vehicle.model],
                  ["Year", vehicle.year],
                ]
                  .filter(([, v]) => v)
                  .map(([label, val]) => (
                    <div
                      key={label}
                      style={{
                        background: "#fff",
                        border: "1px solid rgba(17,17,17,0.12)",
                        borderRadius: "12px",
                        padding: "10px 16px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--text-dim)",
                          fontWeight: 900,
                          marginBottom: "4px",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 900,
                          color: "var(--text)",
                        }}
                      >
                        {val}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div>
            <div className="booking-card">
              <div className="booking-title">
                <span>Book This Vehicle</span>
                <a href={`/book/${id}`}>Open booking page →</a>
              </div>
              {bookingDone ? (
                <div className="b-success">
                  <div style={{ fontSize: "2rem", marginBottom: "12px" }}>
                    ✅
                  </div>
                  <div style={{ fontWeight: 700, marginBottom: "8px" }}>
                    Booking Confirmed!
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-dim)",
                      fontWeight: 700,
                    }}
                  >
                    Check My Bookings for details.
                  </div>
                  <button
                    className="b-btn"
                    style={{ marginTop: "16px" }}
                    onClick={() => navigate("/my-bookings")}
                  >
                    View My Bookings
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBook}>
                  {error && <div className="b-error">{error}</div>}
                  <label className="b-label">Vehicle Number</label>
                  <input
                    className="b-input"
                    placeholder="e.g. BA 1 KA 1234"
                    value={booking.vehicleNumber}
                    onChange={(e) =>
                      setBooking((b) => ({
                        ...b,
                        vehicleNumber: e.target.value,
                      }))
                    }
                    required
                  />
                  <label className="b-label">Start Date</label>
                  <input
                    className="b-input"
                    type="date"
                    value={booking.startDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setBooking((b) => ({ ...b, startDate: e.target.value }))
                    }
                    required
                  />
                  <label className="b-label">End Date</label>
                  <input
                    className="b-input"
                    type="date"
                    value={booking.endDate}
                    min={
                      booking.startDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    onChange={(e) =>
                      setBooking((b) => ({ ...b, endDate: e.target.value }))
                    }
                    required
                  />
                  <label className="b-label">Pickup Location</label>
                  <input
                    className="b-input"
                    placeholder="e.g. Thamel, Kathmandu"
                    value={booking.pickupLocation}
                    onChange={(e) =>
                      setBooking((b) => ({
                        ...b,
                        pickupLocation: e.target.value,
                      }))
                    }
                    required
                  />
                  <label className="b-label">Drop Location</label>
                  <input
                    className="b-input"
                    placeholder="e.g. Pokhara Bus Park"
                    value={booking.dropLocation}
                    onChange={(e) =>
                      setBooking((b) => ({
                        ...b,
                        dropLocation: e.target.value,
                      }))
                    }
                    required
                  />
                  {days > 0 && (
                    <div className="b-summary">
                      <div className="b-row">
                        <span>Duration</span>
                        <span>
                          {days} day{days !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="b-row">
                        <span>Rate</span>
                        <span>
                          Rs. {vehicle.pricePerDay?.toLocaleString()} / day
                        </span>
                      </div>
                      <div className="b-total">
                        <span>Total</span>
                        <span>Rs. {total.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  <button
                    className="b-btn"
                    disabled={submitting || !vehicle.available}
                  >
                    {!vehicle.available
                      ? "Not Available"
                      : submitting
                        ? "Booking..."
                        : "Confirm Booking"}
                  </button>
                  {!user && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-dim)",
                        textAlign: "center",
                        marginTop: "10px",
                        fontWeight: 800,
                      }}
                    >
                      You'll be redirected to login
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

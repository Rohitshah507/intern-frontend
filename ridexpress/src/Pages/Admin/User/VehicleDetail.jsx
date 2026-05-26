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
  const [booking, setBooking] = useState({ startDate: "", endDate: "", pickupLocation: "", dropLocation: "", vehicleNumber: "" });
  const [submitting, setSubmitting] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    vehicleAPI.getById(id).then(d => setVehicle(d.data || d.vehicle || d)).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  const days = booking.startDate && booking.endDate
    ? Math.max(1, Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / 86400000))
    : 0;
  const total = days * (vehicle?.pricePerDay || 0);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    setSubmitting(true); setError("");
    try {
      await bookingAPI.create({
        ...booking, startDate: booking.startDate, endDate: booking.endDate,
        bookingItems: [{ vehicle: id, quantity: 1, pricePerDay: vehicle.pricePerDay, subtotal: total }],
        totalPrice: total, user: user._id,
      });
      setBookingDone(true);
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div style={{minHeight:"60vh",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,0.4)",fontFamily:"'Syne',sans-serif",background:"#0a0a0f"}}>Loading vehicle...</div>;
  if (!vehicle) return <div style={{minHeight:"60vh",display:"flex",alignItems:"center",justifyContent:"center",color:"#ff6b6b",fontFamily:"'Syne',sans-serif",background:"#0a0a0f"}}>Vehicle not found.</div>;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        .vd-page { min-height: 60vh; background: #0a0a0f; color: #fff; font-family: 'Syne', sans-serif; padding: 48px 24px; }
        .vd-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 400px; gap: 40px; }
        .vd-img-main { width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 16px; background: #15151f; }
        .vd-img-placeholder { width: 100%; aspect-ratio: 16/9; background: #15151f; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 5rem; }
        .vd-thumbs { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
        .vd-thumb { width: 72px; height: 52px; object-fit: cover; border-radius: 8px; cursor: pointer; opacity: 0.5; transition: opacity 0.2s; border: 2px solid transparent; }
        .vd-thumb.active { opacity: 1; border-color: #FFC832; }
        .vd-type { font-size: 0.7rem; color: #FFC832; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px; }
        .vd-name { font-size: 2rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 6px; }
        .vd-meta { color: rgba(255,255,255,0.45); font-size: 0.875rem; margin-bottom: 20px; }
        .vd-price { font-size: 2rem; font-weight: 800; color: #FFC832; margin-bottom: 20px; }
        .vd-price small { font-size: 0.9rem; color: rgba(255,255,255,0.4); font-weight: 400; }
        .vd-desc { color: rgba(255,255,255,0.5); font-size: 0.875rem; line-height: 1.7; margin-bottom: 24px; }
        .booking-card { background: #0d0d1a; border: 1px solid rgba(255,200,50,0.15); border-radius: 16px; padding: 28px; position: sticky; top: 88px; }
        .booking-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 20px; }
        .b-label { display: block; color: rgba(255,255,255,0.5); font-size: 0.75rem; font-weight: 600; margin-bottom: 7px; letter-spacing: 0.05em; text-transform: uppercase; }
        .b-input { width: 100%; box-sizing: border-box; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 12px; color: #fff; font-size: 0.875rem; font-family: 'Syne', sans-serif; outline: none; margin-bottom: 14px; transition: border-color 0.2s; }
        .b-input:focus { border-color: #FFC832; }
        .b-input::placeholder { color: rgba(255,255,255,0.25); }
        .b-summary { background: rgba(255,200,50,0.06); border-radius: 10px; padding: 14px; margin-bottom: 16px; }
        .b-row { display: flex; justify-content: space-between; font-size: 0.875rem; color: rgba(255,255,255,0.5); margin-bottom: 6px; }
        .b-total { display: flex; justify-content: space-between; font-size: 1rem; font-weight: 700; color: #FFC832; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,200,50,0.2); }
        .b-btn { width: 100%; padding: 13px; background: #FFC832; color: #0a0a0f; border: none; border-radius: 12px; font-size: 1rem; font-weight: 700; cursor: pointer; font-family: 'Syne', sans-serif; transition: all 0.2s; }
        .b-btn:hover:not(:disabled) { background: #e6b22e; }
        .b-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .b-error { background: rgba(255,60,60,0.1); border: 1px solid rgba(255,60,60,0.2); color: #ff6b6b; padding: 10px 12px; border-radius: 8px; font-size: 0.8rem; margin-bottom: 12px; }
        .b-success { background: rgba(50,200,100,0.1); border: 1px solid rgba(50,200,100,0.2); color: #5ce89b; padding: 16px; border-radius: 10px; text-align: center; }
        @media(max-width: 768px) { .vd-inner { grid-template-columns: 1fr; } .booking-card { position: static; } }
      `}</style>
      <div className="vd-page">
        <div className="vd-inner">
          <div>
            {vehicle.imageUrls?.length > 0 ? (
              <>
                <img className="vd-img-main" src={vehicle.imageUrls[imgIdx]} alt={vehicle.name} />
                {vehicle.imageUrls.length > 1 && (
                  <div className="vd-thumbs">
                    {vehicle.imageUrls.map((url, i) => (
                      <img key={i} className={`vd-thumb ${i === imgIdx ? "active" : ""}`} src={url} alt="" onClick={() => setImgIdx(i)} />
                    ))}
                  </div>
                )}
              </>
            ) : <div className="vd-img-placeholder">🚗</div>}
            <div style={{marginTop:"32px"}}>
              <div className="vd-type">{vehicle.type}</div>
              <h1 className="vd-name">{vehicle.name}</h1>
              <div className="vd-meta">{vehicle.brand} · {vehicle.model}{vehicle.year && ` · ${vehicle.year}`}</div>
              <div className="vd-price">Rs. {vehicle.pricePerDay?.toLocaleString()}<small> / day</small></div>
              {vehicle.description && <div className="vd-desc">{vehicle.description}</div>}
              <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
                {[["Type", vehicle.type],["Brand", vehicle.brand],["Model", vehicle.model],["Year", vehicle.year]].filter(([,v]) => v).map(([label, val]) => (
                  <div key={label} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",padding:"10px 16px"}}>
                    <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.35)",fontWeight:600,marginBottom:"4px",textTransform:"uppercase",letterSpacing:"0.05em"}}>{label}</div>
                    <div style={{fontSize:"0.9rem",fontWeight:600}}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="booking-card">
              <div className="booking-title">Book This Vehicle</div>
              {bookingDone ? (
                <div className="b-success">
                  <div style={{fontSize:"2rem",marginBottom:"12px"}}>✅</div>
                  <div style={{fontWeight:700,marginBottom:"8px"}}>Booking Confirmed!</div>
                  <div style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.5)"}}>Check My Bookings for details.</div>
                  <button className="b-btn" style={{marginTop:"16px"}} onClick={() => navigate("/my-bookings")}>View My Bookings</button>
                </div>
              ) : (
                <form onSubmit={handleBook}>
                  {error && <div className="b-error">{error}</div>}
                  <label className="b-label">Vehicle Number</label>
                  <input className="b-input" placeholder="e.g. BA 1 KA 1234" value={booking.vehicleNumber} onChange={e => setBooking(b => ({...b, vehicleNumber: e.target.value}))} required />
                  <label className="b-label">Start Date</label>
                  <input className="b-input" type="date" value={booking.startDate} min={new Date().toISOString().split("T")[0]} onChange={e => setBooking(b => ({...b, startDate: e.target.value}))} required />
                  <label className="b-label">End Date</label>
                  <input className="b-input" type="date" value={booking.endDate} min={booking.startDate || new Date().toISOString().split("T")[0]} onChange={e => setBooking(b => ({...b, endDate: e.target.value}))} required />
                  <label className="b-label">Pickup Location</label>
                  <input className="b-input" placeholder="e.g. Thamel, Kathmandu" value={booking.pickupLocation} onChange={e => setBooking(b => ({...b, pickupLocation: e.target.value}))} required />
                  <label className="b-label">Drop Location</label>
                  <input className="b-input" placeholder="e.g. Pokhara Bus Park" value={booking.dropLocation} onChange={e => setBooking(b => ({...b, dropLocation: e.target.value}))} required />
                  {days > 0 && (
                    <div className="b-summary">
                      <div className="b-row"><span>Duration</span><span>{days} day{days !== 1 ? "s" : ""}</span></div>
                      <div className="b-row"><span>Rate</span><span>Rs. {vehicle.pricePerDay?.toLocaleString()} / day</span></div>
                      <div className="b-total"><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
                    </div>
                  )}
                  <button className="b-btn" disabled={submitting || !vehicle.available}>
                    {!vehicle.available ? "Not Available" : submitting ? "Booking..." : "Confirm Booking"}
                  </button>
                  {!user && <p style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.4)",textAlign:"center",marginTop:"10px"}}>You'll be redirected to login</p>}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

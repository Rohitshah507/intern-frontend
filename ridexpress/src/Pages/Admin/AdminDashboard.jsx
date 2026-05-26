import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { vehicleAPI, bookingAPI } from "../../services/Api";

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{background:"#0d0d1a",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"16px",padding:"24px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:"-10px",right:"-10px",fontSize:"4rem",opacity:0.06}}>{icon}</div>
      <div style={{fontSize:"1.5rem",marginBottom:"12px"}}>{icon}</div>
      <div style={{fontSize:"2rem",fontWeight:800,color: color || "#fff",marginBottom:"4px"}}>{value}</div>
      <div style={{fontSize:"0.875rem",fontWeight:600,color:"rgba(255,255,255,0.6)",marginBottom:"4px"}}>{label}</div>
      {sub && <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.3)"}}>{sub}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([vehicleAPI.getAll(), bookingAPI.getAll()])
      .then(([vd, bd]) => {
        setVehicles(vd.data || vd.vehicles || vd || []);
        setBookings(bd.data || bd.bookings || bd || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const available = vehicles.filter(v => v.available).length;
  const totalRevenue = bookings.filter(b => b.paymentStatus === "paid").reduce((s, b) => s + (b.totalPrice || 0), 0);
  const pending = bookings.filter(b => b.status === "pending").length;
  const recent = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const STATUS_COLOR = { pending: "#FFC832", confirmed: "#5ce89b", cancelled: "#ff6b6b", completed: "#8080ff" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        .dash { font-family: 'Syne', sans-serif; color: #fff; }
        .dash-title { font-size: 1.4rem; font-weight: 800; margin-bottom: 4px; }
        .dash-sub { color: rgba(255,255,255,0.35); font-size: 0.875rem; margin-bottom: 32px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .section-title { font-size: 1rem; font-weight: 700; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
        .section-title a { font-size: 0.8rem; color: #FFC832; text-decoration: none; font-weight: 600; }
        .table { width: 100%; border-collapse: collapse; }
        .table th { text-align: left; padding: 10px 14px; font-size: 0.7rem; color: rgba(255,255,255,0.35); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .table td { padding: 13px 14px; font-size: 0.875rem; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .table tr:last-child td { border-bottom: none; }
        .table tr:hover td { background: rgba(255,255,255,0.02); }
        .card { background: #0d0d1a; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden; margin-bottom: 24px; }
        .status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; }
      `}</style>
      <div className="dash">
        <div className="dash-title">Good to see you 👋</div>
        <div className="dash-sub">{loading ? "Loading..." : `Managing ${vehicles.length} vehicles and ${bookings.length} bookings`}</div>
        <div className="stats-grid">
          <StatCard icon="🚗" label="Total Vehicles" value={vehicles.length} sub={`${available} available`} color="#FFC832" />
          <StatCard icon="📋" label="Total Bookings" value={bookings.length} sub={`${pending} pending`} color="#8080ff" />
          <StatCard icon="💰" label="Total Revenue" value={`Rs. ${(totalRevenue/1000).toFixed(0)}K`} sub="From paid bookings" color="#5ce89b" />
          <StatCard icon="⚡" label="Available Now" value={available} sub={`${vehicles.length - available} rented`} color="#FFC832" />
        </div>
        <div className="card">
          <div style={{padding:"20px 20px 0"}}>
            <div className="section-title">Recent Bookings <Link to="/admin/bookings">View All →</Link></div>
          </div>
          <table className="table">
            <thead><tr><th>ID</th><th>Vehicle</th><th>Total</th><th>Status</th><th>Payment</th><th>Date</th></tr></thead>
            <tbody>
              {recent.length ? recent.map(b => {
                const vName = b.bookingItems?.[0]?.vehicle?.name || "Vehicle";
                return (
                  <tr key={b._id}>
                    <td style={{fontFamily:"'DM Mono',monospace",fontSize:"0.75rem",color:"rgba(255,255,255,0.4)"}}>#{b._id?.slice(-8).toUpperCase()}</td>
                    <td>{vName}</td>
                    <td>Rs. {b.totalPrice?.toLocaleString()}</td>
                    <td><span style={{background:STATUS_COLOR[b.status]+"22",color:STATUS_COLOR[b.status],padding:"3px 10px",borderRadius:"20px",fontSize:"0.72rem",fontWeight:700,textTransform:"capitalize"}}>{b.status}</span></td>
                    <td><span style={{fontSize:"0.75rem",color:b.paymentStatus==="paid"?"#5ce89b":"rgba(255,255,255,0.4)"}}>{b.paymentStatus}</span></td>
                    <td style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.4)"}}>{new Date(b.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={6} style={{textAlign:"center",padding:"40px",color:"rgba(255,255,255,0.3)"}}>No bookings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="card">
          <div style={{padding:"20px 20px 0"}}>
            <div className="section-title">Recent Vehicles <Link to="/admin/vehicles">Manage →</Link></div>
          </div>
          <table className="table">
            <thead><tr><th>Name</th><th>Type</th><th>Price/Day</th><th>Status</th></tr></thead>
            <tbody>
              {vehicles.slice(0,5).map(v => (
                <tr key={v._id}>
                  <td style={{fontWeight:600}}>{v.name}</td>
                  <td style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.45)"}}>{v.type}</td>
                  <td>Rs. {v.pricePerDay?.toLocaleString()}</td>
                  <td><span style={{background:v.available?"rgba(50,200,100,0.1)":"rgba(255,60,60,0.1)",color:v.available?"#5ce89b":"#ff6b6b",padding:"3px 10px",borderRadius:"20px",fontSize:"0.72rem",fontWeight:700}}>{v.available ? "Available" : "Rented"}</span></td>
                </tr>
              ))}
              {!vehicles.length && <tr><td colSpan={4} style={{textAlign:"center",padding:"40px",color:"rgba(255,255,255,0.3)"}}>No vehicles added</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

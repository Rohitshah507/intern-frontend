import { useState, useEffect } from "react";
import { bookingAPI } from "../../services/Api";

const STATUS_COLOR = {
  pending: { bg: "rgba(244,196,48,0.14)", color: "#7a5a00", border: "rgba(244,196,48,0.35)" },
  confirmed: { bg: "rgba(50,200,100,0.1)", color: "#5ce89b", border: "rgba(50,200,100,0.2)" },
  cancelled: { bg: "rgba(255,60,60,0.1)", color: "#ff6b6b", border: "rgba(255,60,60,0.2)" },
  completed: { bg: "rgba(100,100,255,0.1)", color: "#8080ff", border: "rgba(100,100,255,0.2)" },
};

function StatusBadge({ status }) {
  const s = STATUS_COLOR[status] || STATUS_COLOR.pending;
  return <span style={{background:s.bg,color:s.color,border:`1px solid ${s.border}`,padding:"3px 10px",borderRadius:"20px",fontSize:"0.72rem",fontWeight:700,textTransform:"capitalize"}}>{status}</span>;
}

function DetailModal({ booking, onClose, onUpdate }) {
  const [status, setStatus] = useState(booking.status);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleUpdate = async () => {
    setLoading(true); setMsg("");
    try {
      await bookingAPI.update(booking._id, { status });
      setMsg("Updated successfully!"); onUpdate();
    } catch(e) { setMsg(e.message); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this booking?")) return;
    try { await bookingAPI.delete(booking._id); onUpdate(); onClose(); }
    catch(e) { setMsg(e.message); }
  };

  const vehicle = booking.bookingItems?.[0];
  const vName = vehicle?.vehicle?.name || "Vehicle";

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:"24px"}} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"20px",padding:"28px",width:"100%",maxWidth:"520px",fontFamily:"'Syne',sans-serif",color:"var(--text)",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 18px 50px rgba(17,17,17,0.12)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"24px"}}>
          <div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:"0.75rem",color:"var(--text-dim)",marginBottom:"6px",fontWeight:800}}>#{booking._id?.slice(-8).toUpperCase()}</div>
            <div style={{fontSize:"1.2rem",fontWeight:800}}>{vName}</div>
          </div>
          <StatusBadge status={booking.status} />
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"24px"}}>
          {[
            ["Plate Number", booking.vehicleNumber],
            ["Total Price", `Rs. ${booking.totalPrice?.toLocaleString()}`],
            ["Start Date", new Date(booking.startDate).toLocaleDateString()],
            ["End Date", new Date(booking.endDate).toLocaleDateString()],
            ["Pickup", booking.pickupLocation],
            ["Drop-off", booking.dropLocation],
            ["Payment", booking.paymentStatus],
            ["Created", new Date(booking.createdAt).toLocaleDateString()],
          ].map(([l, v]) => (
            <div key={l} style={{background:"rgba(244,196,48,0.10)",borderRadius:"12px",padding:"12px",border:"1px dashed rgba(17,17,17,0.14)"}}>
              <div style={{fontSize:"0.7rem",color:"var(--text-dim)",fontWeight:900,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"6px"}}>{l}</div>
              <div style={{fontSize:"0.875rem",fontWeight:900,textTransform:"capitalize",color:"var(--text)"}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{marginBottom:"20px"}}>
          <label style={{display:"block",color:"var(--text-dim)",fontSize:"0.72rem",fontWeight:900,marginBottom:"10px",letterSpacing:"0.08em",textTransform:"uppercase"}}>Update Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} style={{width:"100%",background:"#fff",border:"1px solid rgba(17,17,17,0.14)",borderRadius:"12px",padding:"11px 14px",color:"var(--text)",fontFamily:"'Syne',sans-serif",fontSize:"0.875rem",outline:"none",marginBottom:"12px"}}>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {msg && <div style={{fontSize:"0.875rem",color:msg.includes("success")?"#146c43":"#b42318",marginBottom:"12px",fontWeight:800}}>{msg}</div>}
          <div style={{display:"flex",gap:"10px"}}>
            <button onClick={handleDelete} style={{padding:"10px 16px",background:"rgba(255,60,60,0.1)",border:"1px solid rgba(255,60,60,0.2)",color:"#b42318",borderRadius:"12px",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"0.8rem"}}>Delete</button>
            <button onClick={handleUpdate} disabled={loading} style={{flex:1,padding:"10px",background:"var(--gold)",color:"#1b1300",border:"none",borderRadius:"12px",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:900}}>
              {loading ? "Saving..." : "Update Status"}
            </button>
            <button onClick={onClose} style={{padding:"10px 16px",background:"#fff",border:"1px solid rgba(17,17,17,0.14)",color:"var(--text)",borderRadius:"12px",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:900}}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetch = () => {
    setLoading(true);
    bookingAPI.getAll().then(d => setBookings(d.data || d.bookings || d || [])).finally(() => setLoading(false));
  };
  useEffect(fetch, []);

  const statuses = ["all", "pending", "confirmed", "completed", "cancelled"];
  const filtered = bookings.filter(b => {
    const matchF = filter === "all" || b.status === filter;
    const vName = b.bookingItems?.[0]?.vehicle?.name || "";
    const matchS = `${vName} ${b.vehicleNumber} ${b._id}`.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        .adm-b { font-family: 'Syne', sans-serif; color: var(--text); }
        .adm-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .adm-title { font-size: 1.4rem; font-weight: 800; }
        .filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
        .f-btn { padding: 7px 14px; border-radius: 12px; border: 1px solid rgba(17,17,17,0.14); background: #fff; color: rgba(21,21,21,0.75); font-size: 0.78rem; font-weight: 900; cursor: pointer; font-family: 'Syne', sans-serif; text-transform: capitalize; transition: all 0.2s; }
        .f-btn:hover { border-color: rgba(244,196,48,0.85); background: rgba(244,196,48,0.12); }
        .f-btn.active { background: var(--gold); color: #1b1300; border-color: rgba(244,196,48,0.95); }
        .search-in { background: #fff; border: 1px solid rgba(17,17,17,0.14); border-radius: 12px; padding: 9px 14px; color: var(--text); font-size: 0.875rem; font-family: 'Syne', sans-serif; outline: none; width: 240px; }
        .search-in::placeholder { color: rgba(21,21,21,0.45); }
        .search-in:focus { border-color: var(--gold); box-shadow: 0 0 0 4px rgba(244,196,48,0.18); }
        .bookings-table { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; box-shadow: 0 18px 50px rgba(17,17,17,0.06); }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 12px 16px; font-size: 0.7rem; color: var(--text-dim); font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase; border-bottom: 1px solid var(--border); background: rgba(244,196,48,0.10); }
        td { padding: 13px 16px; font-size: 0.875rem; border-bottom: 1px solid var(--border); font-weight: 800; color: var(--text); }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(244,196,48,0.10); cursor: pointer; }
        .view-btn { padding: 6px 12px; background: rgba(244,196,48,0.16); border: 1px solid rgba(244,196,48,0.35); color: #7a5a00; border-radius: 10px; cursor: pointer; font-size: 0.75rem; font-weight: 900; font-family: 'Syne', sans-serif; }
        .loader { text-align: center; padding: 60px; color: var(--text-dim); font-weight: 900; }
      `}</style>
      <div className="adm-b">
        <div className="adm-header">
          <div className="adm-title">Bookings ({bookings.length})</div>
          <input className="search-in" placeholder="Search bookings..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filters">
          {statuses.map(s => (
            <button key={s} className={`f-btn ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>{s}</button>
          ))}
        </div>
        <div className="bookings-table">
          {loading ? <div className="loader">Loading bookings...</div> : (
            <table>
              <thead>
                <tr><th>ID</th><th>Vehicle</th><th>Dates</th><th>Total</th><th>Status</th><th>Payment</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.length ? filtered.map(b => {
                  const vName = b.bookingItems?.[0]?.vehicle?.name || "Vehicle";
                  return (
                    <tr key={b._id}>
                      <td style={{fontFamily:"'DM Mono',monospace",fontSize:"0.72rem",color:"var(--text-dim)",fontWeight:800}}>#{b._id?.slice(-8).toUpperCase()}</td>
                      <td style={{fontWeight:900}}>{vName}<div style={{fontSize:"0.72rem",color:"var(--text-dim)",fontWeight:800}}>{b.vehicleNumber}</div></td>
                      <td style={{fontSize:"0.8rem",color:"var(--text-dim)",fontWeight:800}}>
                        <div>{new Date(b.startDate).toLocaleDateString()}</div>
                        <div>{new Date(b.endDate).toLocaleDateString()}</div>
                      </td>
                      <td style={{fontWeight:900}}>Rs. {b.totalPrice?.toLocaleString()}</td>
                      <td><StatusBadge status={b.status} /></td>
                      <td><span style={{fontSize:"0.75rem",color:b.paymentStatus==="paid"?"#146c43":b.paymentStatus==="refunded"?"#3f3fd4":"var(--text-dim)",textTransform:"capitalize",fontWeight:800}}>{b.paymentStatus}</span></td>
                      <td><button className="view-btn" onClick={() => setSelected(b)}>Manage</button></td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={7} style={{textAlign:"center",padding:"50px",color:"var(--text-dim)",fontWeight:900}}>No bookings found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {selected && <DetailModal booking={selected} onClose={() => setSelected(null)} onUpdate={fetch} />}
    </>
  );
}

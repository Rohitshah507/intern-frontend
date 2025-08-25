import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { vehicleAPI } from "../../../services/Api";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    vehicleAPI.getAll().then(d => setVehicles(d.data || d.vehicles || d || [])).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const types = ["all", ...new Set(vehicles.map(v => v.type).filter(Boolean))];
  const filtered = vehicles.filter(v => {
    const matchSearch = `${v.name} ${v.brand} ${v.model}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || v.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        .vehicles-page { min-height: 60vh; background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif; padding: 48px 24px; }
        .vehicles-inner { max-width: 1280px; margin: 0 auto; }
        .page-header { margin-bottom: 40px; }
        .page-title { font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 800; letter-spacing: -0.03em; }
        .page-title span { color: #7a5a00; }
        .page-sub { color: var(--text-dim); font-size: 0.9rem; margin-top: 8px; font-weight: 700; }
        .filters { display: flex; gap: 12px; margin-bottom: 36px; flex-wrap: wrap; }
        .search-input {
          flex: 1; min-width: 200px; background: #fff; border: 1px solid rgba(17,17,17,0.14);
          border-radius: 12px; padding: 11px 16px; color: var(--text); font-size: 0.875rem;
          font-family: 'Syne', sans-serif; outline: none;
        }
        .search-input:focus { border-color: var(--gold); box-shadow: 0 0 0 4px rgba(244,196,48,0.18); }
        .search-input::placeholder { color: rgba(21,21,21,0.45); }
        .filter-btn {
          padding: 10px 18px; border-radius: 12px; border: 1px solid rgba(17,17,17,0.14);
          background: #fff; color: rgba(21,21,21,0.75); font-size: 0.8rem; font-weight: 900;
          cursor: pointer; font-family: 'Syne', sans-serif; text-transform: capitalize; transition: all 0.2s;
        }
        .filter-btn:hover { border-color: rgba(244,196,48,0.85); background: rgba(244,196,48,0.12); }
        .filter-btn.active { background: var(--gold); color: #1b1300; border-color: rgba(244,196,48,0.95); }
        .vehicles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .v-card {
          background: var(--surface); border: 1px solid var(--border); border-radius: 18px;
          overflow: hidden; transition: all 0.25s; cursor: pointer;
        }
        .v-card:hover { transform: translateY(-4px); border-color: rgba(244,196,48,0.6); box-shadow: 0 18px 46px rgba(17,17,17,0.12); }
        .v-img { width: 100%; height: 200px; object-fit: cover; background: #f1f1f1; }
        .v-img-placeholder { width: 100%; height: 200px; background: linear-gradient(135deg, #fff6da, #ffffff); display: flex; align-items: center; justify-content: center; font-size: 3rem; }
        .v-body { padding: 20px; }
        .v-type { font-size: 0.7rem; color: #7a5a00; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }
        .v-name { font-size: 1.1rem; font-weight: 900; margin-bottom: 4px; color: var(--text); }
        .v-brand { font-size: 0.8rem; color: var(--text-dim); margin-bottom: 12px; font-weight: 700; }
        .v-row { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; }
        .v-price { font-size: 1.2rem; font-weight: 900; color: #7a5a00; }
        .v-price small { font-size: 0.7rem; color: var(--text-dim); font-weight: 800; }
        .v-badge { font-size: 0.7rem; padding: 4px 10px; border-radius: 20px; font-weight: 600; }
        .v-badge.avail { background: rgba(50,200,100,0.15); color: #5ce89b; border: 1px solid rgba(50,200,100,0.2); }
        .v-badge.unavail { background: rgba(255,60,60,0.1); color: #ff6b6b; border: 1px solid rgba(255,60,60,0.15); }
        .v-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px; }
        .v-btn {
          display: block; width: 100%; padding: 10px;
          border-radius: 10px;
          font-weight: 800; font-family: 'Syne', sans-serif; font-size: 0.85rem;
          text-align: center; text-decoration: none; cursor: pointer; transition: all 0.2s;
        }
        .v-btn.primary { background: var(--gold); color: #1b1300; border: none; }
        .v-btn.primary:hover { filter: brightness(0.97); transform: translateY(-1px); }
        .v-btn.ghost { background: #fff; border: 1px solid rgba(17,17,17,0.14); color: var(--text); }
        .v-btn.ghost:hover { border-color: rgba(244,196,48,0.85); background: rgba(244,196,48,0.12); }
        .empty { text-align: center; padding: 80px 24px; color: var(--text-dim); font-weight: 800; }
        .loader { text-align: center; padding: 80px; color: var(--text-dim); font-weight: 800; }
      `}</style>
      <div className="vehicles-page">
        <div className="vehicles-inner">
          <div className="page-header">
            <h1 className="page-title">Our <span>Fleet</span></h1>
            <p className="page-sub">{vehicles.length} vehicles available for rent</p>
          </div>
          <div className="filters">
            <input className="search-input" placeholder="Search by name, brand, model..." value={search} onChange={e => setSearch(e.target.value)} />
            {types.map(t => (
              <button key={t} className={`filter-btn ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>{t}</button>
            ))}
          </div>
          {loading && <div className="loader">Loading vehicles...</div>}
          {error && <div className="loader" style={{color:"#b42318"}}>{error}</div>}
          {!loading && !error && (
            filtered.length ? (
              <div className="vehicles-grid">
                {filtered.map(v => (
                  <div className="v-card" key={v._id}>
                    {v.imageUrls?.[0] ? (
                      <img className="v-img" src={v.imageUrls[0]} alt={v.name} />
                    ) : (
                      <div className="v-img-placeholder">🚗</div>
                    )}
                    <div className="v-body">
                      <div className="v-type">{v.type}</div>
                      <div className="v-name">{v.name}</div>
                      <div className="v-brand">{v.brand} · {v.model} {v.year && `· ${v.year}`}</div>
                      {v.description && <div style={{fontSize:"0.8rem",color:"var(--text-dim)",lineHeight:"1.6",marginBottom:"4px",fontWeight:700}}>{v.description.slice(0,80)}{v.description.length>80 ? "…" : ""}</div>}
                      <div className="v-row">
                        <div className="v-price">Rs. {v.pricePerDay?.toLocaleString()}<small> / day</small></div>
                        <span className={`v-badge ${v.available ? "avail" : "unavail"}`}>{v.available ? "Available" : "Unavailable"}</span>
                      </div>
                      {v.available && (
                        <div className="v-actions">
                          <Link to={`/vehicles/${v._id}`} className="v-btn ghost">Details</Link>
                          <Link to={`/book/${v._id}`} className="v-btn primary">Book Now</Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : <div className="empty"><div style={{fontSize:"3rem",marginBottom:"16px"}}>🔍</div><div>No vehicles found matching your search</div></div>
          )}
        </div>
      </div>
    </>
  );
}

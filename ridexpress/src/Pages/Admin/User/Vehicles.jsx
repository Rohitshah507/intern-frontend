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
        .vehicles-page { min-height: 60vh; background: #0a0a0f; color: #fff; font-family: 'Syne', sans-serif; padding: 48px 24px; }
        .vehicles-inner { max-width: 1280px; margin: 0 auto; }
        .page-header { margin-bottom: 40px; }
        .page-title { font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 800; letter-spacing: -0.03em; }
        .page-title span { color: #FFC832; }
        .page-sub { color: rgba(255,255,255,0.4); font-size: 0.9rem; margin-top: 8px; }
        .filters { display: flex; gap: 12px; margin-bottom: 36px; flex-wrap: wrap; }
        .search-input {
          flex: 1; min-width: 200px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 11px 16px; color: #fff; font-size: 0.875rem;
          font-family: 'Syne', sans-serif; outline: none;
        }
        .search-input:focus { border-color: #FFC832; }
        .search-input::placeholder { color: rgba(255,255,255,0.3); }
        .filter-btn {
          padding: 10px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);
          background: transparent; color: rgba(255,255,255,0.5); font-size: 0.8rem; font-weight: 600;
          cursor: pointer; font-family: 'Syne', sans-serif; text-transform: capitalize; transition: all 0.2s;
        }
        .filter-btn:hover { border-color: #FFC832; color: #FFC832; }
        .filter-btn.active { background: #FFC832; color: #0a0a0f; border-color: #FFC832; }
        .vehicles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .v-card {
          background: #0d0d1a; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px;
          overflow: hidden; transition: all 0.25s; cursor: pointer;
        }
        .v-card:hover { transform: translateY(-4px); border-color: rgba(255,200,50,0.25); box-shadow: 0 12px 32px rgba(0,0,0,0.4); }
        .v-img { width: 100%; height: 200px; object-fit: cover; background: #15151f; }
        .v-img-placeholder { width: 100%; height: 200px; background: linear-gradient(135deg, #15151f, #0d0d1a); display: flex; align-items: center; justify-content: center; font-size: 3rem; }
        .v-body { padding: 20px; }
        .v-type { font-size: 0.7rem; color: #FFC832; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }
        .v-name { font-size: 1.1rem; font-weight: 700; margin-bottom: 4px; }
        .v-brand { font-size: 0.8rem; color: rgba(255,255,255,0.4); margin-bottom: 12px; }
        .v-row { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; }
        .v-price { font-size: 1.2rem; font-weight: 800; color: #FFC832; }
        .v-price small { font-size: 0.7rem; color: rgba(255,255,255,0.4); font-weight: 400; }
        .v-badge { font-size: 0.7rem; padding: 4px 10px; border-radius: 20px; font-weight: 600; }
        .v-badge.avail { background: rgba(50,200,100,0.15); color: #5ce89b; border: 1px solid rgba(50,200,100,0.2); }
        .v-badge.unavail { background: rgba(255,60,60,0.1); color: #ff6b6b; border: 1px solid rgba(255,60,60,0.15); }
        .v-book-btn {
          display: block; width: 100%; margin-top: 14px; padding: 10px;
          background: #FFC832; color: #0a0a0f; border: none; border-radius: 10px;
          font-weight: 700; font-family: 'Syne', sans-serif; font-size: 0.875rem;
          text-align: center; text-decoration: none; cursor: pointer; transition: background 0.2s;
        }
        .v-book-btn:hover { background: #e6b22e; }
        .empty { text-align: center; padding: 80px 24px; color: rgba(255,255,255,0.3); }
        .loader { text-align: center; padding: 80px; color: rgba(255,255,255,0.4); }
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
          {error && <div className="loader" style={{color:"#ff6b6b"}}>{error}</div>}
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
                      {v.description && <div style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.35)",lineHeight:"1.6",marginBottom:"4px"}}>{v.description.slice(0,80)}{v.description.length>80 ? "…" : ""}</div>}
                      <div className="v-row">
                        <div className="v-price">Rs. {v.pricePerDay?.toLocaleString()}<small> / day</small></div>
                        <span className={`v-badge ${v.available ? "avail" : "unavail"}`}>{v.available ? "Available" : "Unavailable"}</span>
                      </div>
                      {v.available && (
                        <Link to={`/vehicles/${v._id}`} className="v-book-btn">View & Book</Link>
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

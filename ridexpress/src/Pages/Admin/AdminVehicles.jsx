import { useState, useEffect, useRef } from "react";
import { vehicleAPI } from "../../services/Api";

const EMPTY_FORM = {
  name: "",
  brand: "",
  model: "",
  type: "",
  year: "",
  pricePerDay: "",
  available: true,
  description: "",
};

function VehicleModal({ vehicle, onClose, onSaved }) {
  const [form, setForm] = useState(
    vehicle ? { ...vehicle } : { ...EMPTY_FORM },
  );
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(
        ([k, v]) => v !== undefined && v !== null && fd.append(k, v),
      );
      files.forEach((f) => fd.append("photos", f));
      if (vehicle) await vehicleAPI.update(vehicle._id, fd);
      else await vehicleAPI.create(fd);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: "24px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          padding: "28px",
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          overflowY: "auto",
          fontFamily: "'Syne',sans-serif",
          boxShadow: "0 18px 50px rgba(17,17,17,0.12)",
        }}
      >
        <h2
          style={{
            fontSize: "1.2rem",
            fontWeight: 900,
            color: "var(--text)",
            marginBottom: "24px",
          }}
        >
          {vehicle ? "Edit Vehicle" : "Add New Vehicle"}
        </h2>
        {error && (
          <div
            style={{
              background: "rgba(255,60,60,0.1)",
              border: "1px solid rgba(255,60,60,0.2)",
              color: "#ff6b6b",
              padding: "10px 14px",
              borderRadius: "10px",
              fontSize: "0.875rem",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
            }}
          >
            {[
              ["name", "Name", "Toyota Corolla", true],
              ["brand", "Brand", "Toyota", true],
              ["model", "Model", "Corolla", true],
              ["type", "Type", "Sedan", true],
              ["year", "Year", "2022", false, "number"],
              ["pricePerDay", "Price per Day", "2500", true, "number"],
            ].map(([name, label, ph, req, type = "text"]) => (
              <div key={name}>
                <label
                  style={{
                    display: "block",
                    color: "var(--text-dim)",
                    fontSize: "0.72rem",
                    fontWeight: 900,
                    marginBottom: "7px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  placeholder={ph}
                  value={form[name] || ""}
                  onChange={handleChange}
                  required={req}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "#fff",
                    border: "1px solid rgba(17,17,17,0.14)",
                    borderRadius: "12px",
                    padding: "10px 12px",
                    color: "var(--text)",
                    fontSize: "0.875rem",
                    fontFamily: "'Syne',sans-serif",
                    outline: "none",
                  }}
                />
              </div>
            ))}
            <div style={{ gridColumn: "1/-1" }}>
              <label
                style={{
                  display: "block",
                  color: "var(--text-dim)",
                  fontSize: "0.72rem",
                  fontWeight: 900,
                  marginBottom: "7px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Description
              </label>
              <textarea
                name="description"
                placeholder="Vehicle description..."
                value={form.description || ""}
                onChange={handleChange}
                rows={3}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#fff",
                  border: "1px solid rgba(17,17,17,0.14)",
                  borderRadius: "12px",
                  padding: "10px 12px",
                  color: "var(--text)",
                  fontSize: "0.875rem",
                  fontFamily: "'Syne',sans-serif",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label
                style={{
                  display: "block",
                  color: "var(--text-dim)",
                  fontSize: "0.72rem",
                  fontWeight: 900,
                  marginBottom: "10px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Photos
              </label>
              <div
                style={{
                  border: "2px dashed rgba(17,17,17,0.18)",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: "rgba(244,196,48,0.10)",
                }}
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => setFiles([...e.target.files])}
                />
                <div
                  style={{
                    color: "var(--text-dim)",
                    fontSize: "0.875rem",
                    fontWeight: 800,
                  }}
                >
                  {files.length
                    ? `${files.length} file(s) selected`
                    : "Click to upload photos"}
                </div>
              </div>
            </div>
            <div
              style={{
                gridColumn: "1/-1",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <input
                type="checkbox"
                name="available"
                id="avail"
                checked={!!form.available}
                onChange={handleChange}
                style={{
                  width: "16px",
                  height: "16px",
                  accentColor: "var(--gold)",
                }}
              />
              <label
                htmlFor="avail"
                style={{
                  color: "var(--text)",
                  fontSize: "0.875rem",
                  fontWeight: 900,
                }}
              >
                Available for booking
              </label>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "11px",
                background: "#fff",
                border: "1px solid rgba(17,17,17,0.14)",
                color: "var(--text)",
                borderRadius: "12px",
                cursor: "pointer",
                fontFamily: "'Syne',sans-serif",
                fontWeight: 900,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 2,
                padding: "11px",
                background: "var(--gold)",
                color: "#1b1300",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontFamily: "'Syne',sans-serif",
                fontWeight: 900,
              }}
            >
              {loading
                ? "Saving..."
                : vehicle
                  ? "Update Vehicle"
                  : "Add Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "add" | vehicle object
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");

  const fetch = () => {
    setLoading(true);
    vehicleAPI
      .getAll()
      .then((d) => setVehicles(d.data || d.vehicles || d || []))
      .finally(() => setLoading(false));
  };
  useEffect(fetch, []);

  const handleDelete = async (id) => {
    try {
      await vehicleAPI.delete(id);
      fetch();
      setDeleteId(null);
    } catch (e) {
      alert(e.message);
    }
  };

  const filtered = vehicles.filter((v) =>
    `${v.name} ${v.brand} ${v.type}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        .adm-v { font-family: 'Syne', sans-serif; color: var(--text); }
        .adm-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .adm-title { font-size: 1.4rem; font-weight: 800; }
        .add-btn { padding: 10px 20px; background: var(--gold); color: #1b1300; border: none; border-radius: 12px; font-weight: 900; font-family: 'Syne', sans-serif; cursor: pointer; font-size: 0.875rem; transition: transform 0.12s, filter 0.12s; }
        .add-btn:hover { filter: brightness(0.97); transform: translateY(-1px); }
        .search { background: #fff; border: 1px solid rgba(17,17,17,0.14); border-radius: 12px; padding: 10px 16px; color: var(--text); font-size: 0.875rem; font-family: 'Syne', sans-serif; outline: none; width: 280px; }
        .search::placeholder { color: rgba(21,21,21,0.45); }
        .search:focus { border-color: var(--gold); box-shadow: 0 0 0 4px rgba(244,196,48,0.18); }
        .v-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .v-card { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; box-shadow: 0 18px 50px rgba(17,17,17,0.06); }
        .v-img { width: 100%; height: 160px; object-fit: cover; background: #f1f1f1; }
        .v-placeholder { width: 100%; height: 160px; background: linear-gradient(135deg, #fff6da, #ffffff); display: flex; align-items: center; justify-content: center; font-size: 3rem; }
        .v-body { padding: 16px; }
        .v-tag { font-size: 0.68rem; color: #7a5a00; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; }
        .v-name { font-weight: 900; margin-bottom: 2px; color: var(--text); }
        .v-sub { font-size: 0.8rem; color: var(--text-dim); margin-bottom: 12px; font-weight: 700; }
        .v-footer { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-top: 1px solid var(--border); background: rgba(244,196,48,0.10); }
        .v-price { font-weight: 900; color: #7a5a00; font-size: 0.9rem; }
        .v-actions { display: flex; gap: 8px; }
        .edit-btn { padding: 6px 12px; background: rgba(244,196,48,0.16); border: 1px solid rgba(244,196,48,0.35); color: #7a5a00; border-radius: 10px; cursor: pointer; font-size: 0.75rem; font-weight: 900; font-family: 'Syne', sans-serif; }
        .edit-btn:hover { filter: brightness(0.97); }
        .del-btn { padding: 6px 12px; background: rgba(255,60,60,0.08); border: 1px solid rgba(255,60,60,0.2); color: #b42318; border-radius: 10px; cursor: pointer; font-size: 0.75rem; font-weight: 900; font-family: 'Syne', sans-serif; }
        .confirm-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 300; }
        .confirm-box { background: var(--surface); border: 1px solid rgba(255,60,60,0.25); border-radius: 18px; padding: 28px; max-width: 340px; text-align: center; font-family: 'Syne', sans-serif; box-shadow: 0 18px 50px rgba(17,17,17,0.12); }
        .loader { text-align: center; padding: 60px; color: var(--text-dim); font-weight: 900; }
      `}</style>
      <div className="adm-v">
        <div className="adm-header">
          <div className="adm-title">Vehicles ({vehicles.length})</div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              className="search"
              placeholder="Search vehicles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="add-btn" onClick={() => setModal("add")}>
              + Add Vehicle
            </button>
          </div>
        </div>
        {loading ? (
          <div className="loader">Loading vehicles...</div>
        ) : (
          <div className="v-grid">
            {filtered.map((v) => (
              <div className="v-card" key={v._id}>
                {v.imageUrls?.[0] ? (
                  <img className="v-img" src={v.imageUrls[0]} alt={v.name} />
                ) : (
                  <div className="v-placeholder">🚗</div>
                )}
                <div className="v-body">
                  <div className="v-tag">{v.type}</div>
                  <div className="v-name">{v.name}</div>
                  <div className="v-sub">
                    {v.brand} · {v.model} {v.year && `(${v.year})`}
                  </div>
                  <span
                    style={{
                      background: v.available
                        ? "rgba(50,200,100,0.1)"
                        : "rgba(255,60,60,0.1)",
                      color: v.available ? "#5ce89b" : "#ff6b6b",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                    }}
                  >
                    {v.available ? "Available" : "Unavailable"}
                  </span>
                </div>
                <div className="v-footer">
                  <div className="v-price">
                    Rs. {v.pricePerDay?.toLocaleString()}/day
                  </div>
                  <div className="v-actions">
                    <button className="edit-btn" onClick={() => setModal(v)}>
                      Edit
                    </button>
                    <button
                      className="del-btn"
                      onClick={() => setDeleteId(v._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!filtered.length && (
              <div
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  padding: "60px",
                  color: "var(--text-dim)",
                  fontWeight: 900,
                }}
              >
                No vehicles found
              </div>
            )}
          </div>
        )}
      </div>
      {(modal === "add" || (modal && typeof modal === "object")) && (
        <VehicleModal
          vehicle={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            fetch();
          }}
        />
      )}
      {deleteId && (
        <div className="confirm-modal">
          <div className="confirm-box">
            <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>🗑️</div>
            <div
              style={{
                fontSize: "1rem",
                fontWeight: 900,
                color: "var(--text)",
                marginBottom: "8px",
              }}
            >
              Delete Vehicle?
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "var(--text-dim)",
                marginBottom: "24px",
                fontWeight: 800,
              }}
            >
              This action cannot be undone.
            </div>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button
                onClick={() => setDeleteId(null)}
                style={{
                  padding: "9px 20px",
                  background: "#fff",
                  border: "1px solid rgba(17,17,17,0.14)",
                  color: "var(--text)",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 900,
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                style={{
                  padding: "9px 20px",
                  background: "#ff4444",
                  border: "none",
                  color: "#fff",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 700,
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

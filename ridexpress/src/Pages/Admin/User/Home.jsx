import { Link } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Crimson+Pro:ital,wght@0,400;1,400&display=swap');
        .home { color: var(--text); font-family: 'Syne', sans-serif; }
        .hero {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, var(--gold-dim) 0%, transparent 70%), var(--bg);
          padding: 80px 24px 60px; text-align: center; position: relative; overflow: hidden;
        }
        .hero::before {
          content: ''; position: absolute; inset: 0;
          background-image: radial-gradient(rgba(255,200,50,0.06) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        .hero-inner { position: relative; max-width: 900px; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,200,50,0.1); border: 1px solid rgba(255,200,50,0.25);
          color: #7a5a00; padding: 6px 16px; border-radius: 40px; font-size: 0.8rem;
          font-weight: 600; margin-bottom: 32px; letter-spacing: 0.05em;
        }
        .hero-title {
          font-size: clamp(3rem, 8vw, 6rem); font-weight: 800; line-height: 1.0;
          letter-spacing: -0.04em; margin-bottom: 24px;
        }
        .hero-title em { font-family: 'Crimson Pro', serif; font-style: italic; color: #7a5a00; font-size: 1.1em; }
        .hero-sub {
          font-size: clamp(1rem, 2vw, 1.2rem); color: var(--text-dim);
          max-width: 500px; margin: 0 auto 40px; line-height: 1.7; font-weight: 400;
        }
        .hero-ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .btn-primary {
          padding: 14px 32px; background: var(--gold); color: #1b1300; border: none;
          border-radius: 12px; font-size: 1rem; font-weight: 700; cursor: pointer;
          text-decoration: none; font-family: 'Syne', sans-serif; transition: all 0.2s;
          display: inline-block;
        }
        .btn-primary:hover { filter: brightness(0.97); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(244,196,48,0.25); }
        .btn-ghost {
          padding: 14px 32px; background: transparent; color: var(--text);
          border: 1.5px solid rgba(17,17,17,0.16); border-radius: 12px; font-size: 1rem;
          font-weight: 600; text-decoration: none; display: inline-block; transition: all 0.2s;
          font-family: 'Syne', sans-serif;
        }
        .btn-ghost:hover { border-color: rgba(244,196,48,0.6); background: rgba(244,196,48,0.12); }
        .stats-row {
          max-width: 900px; margin: 0 auto -40px; padding: 0 24px;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
          background: rgba(255,200,50,0.1); border-radius: 16px; overflow: hidden;
          position: relative; z-index: 2;
        }
        .stat-item { background: var(--surface); padding: 28px 24px; text-align: center; }
        .stat-num { font-size: 2rem; font-weight: 900; color: #7a5a00; }
        .stat-label { font-size: 0.8rem; color: var(--text-dim); font-weight: 800; margin-top: 4px; }
        .section { padding: 100px 24px; }
        .section-inner { max-width: 1200px; margin: 0 auto; }
        .section-title { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800; margin-bottom: 12px; letter-spacing: -0.03em; }
        .section-title span { color: #7a5a00; }
        .section-sub { color: var(--text-dim); margin-bottom: 56px; font-size: 1rem; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1px; background: rgba(17,17,17,0.08); border-radius: 20px; overflow: hidden; }
        .feature-card { background: var(--surface); padding: 36px 28px; }
        .feature-icon { font-size: 2rem; margin-bottom: 16px; }
        .feature-title { font-size: 1.1rem; font-weight: 900; margin-bottom: 10px; }
        .feature-desc { color: var(--text-dim); font-size: 0.875rem; line-height: 1.7; }
        .cta-section {
          margin: 0 24px 80px; max-width: 1200px; margin-left: auto; margin-right: auto;
          background: linear-gradient(135deg, rgba(255,200,50,0.15), rgba(255,100,0,0.08));
          border: 1px solid rgba(255,200,50,0.2); border-radius: 24px; padding: 60px 40px;
          text-align: center;
        }
        .cta-title { font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 800; margin-bottom: 16px; }
        .cta-sub { color: var(--text-dim); margin-bottom: 32px; }
        @media(max-width: 640px) { .stats-row { grid-template-columns: 1fr; } .cta-section { padding: 40px 24px; } }
      `}</style>
      <div className="home">
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-badge">🚀 Nepal's Premium Rental Platform</div>
            <h1 className="hero-title">
              Drive Your <em>Adventure</em> Forward
            </h1>
            <p className="hero-sub">
              Premium vehicles, seamless booking, and unmatched service across
              Nepal. Your journey starts here.
            </p>
            <div className="hero-ctas">
              <Link to="/vehicles" className="btn-primary">
                Browse Vehicles
              </Link>
              {!user && (
                <Link to="/signup" className="btn-ghost">
                  Create Account
                </Link>
              )}
              {user && (
                <Link to="/my-bookings" className="btn-ghost">
                  My Bookings
                </Link>
              )}
            </div>
          </div>
        </section>

        <div className="stats-row">
          {[
            ["500+", "Vehicles Available"],
            ["10K+", "Happy Customers"],
            ["50+", "Locations"],
          ].map(([n, l]) => (
            <div className="stat-item" key={l}>
              <div className="stat-num">{n}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>

        <section className="section" style={{ background: "var(--surface)" }}>
          <div className="section-inner">
            <h2 className="section-title">
              Why Choose <span>RideXpress</span>?
            </h2>
            <p className="section-sub">
              Everything you need for a perfect rental experience
            </p>
            <div className="features-grid">
              {[
                [
                  "🚗",
                  "Huge Fleet",
                  "Cars, bikes, SUVs — find the perfect vehicle for any trip or budget.",
                ],
                [
                  "⚡",
                  "Instant Booking",
                  "Book in minutes with our streamlined, mobile-friendly process.",
                ],
                [
                  "🔒",
                  "Secure Payments",
                  "Multiple payment options with encrypted, safe transactions.",
                ],
                [
                  "📍",
                  "Wide Coverage",
                  "Available across major cities and towns throughout Nepal.",
                ],
                [
                  "🛠",
                  "24/7 Support",
                  "Round-the-clock assistance for any issue, anywhere.",
                ],
                [
                  "💰",
                  "Best Prices",
                  "Competitive daily rates with no hidden charges or surprises.",
                ],
              ].map(([icon, title, desc]) => (
                <div className="feature-card" key={title}>
                  <div className="feature-icon">{icon}</div>
                  <div className="feature-title">{title}</div>
                  <div className="feature-desc">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {!user && (
          <div className="cta-section">
            <h2 className="cta-title">Ready to Hit the Road?</h2>
            <p className="cta-sub">
              Join thousands of satisfied customers across Nepal
            </p>
            <Link to="/signup" className="btn-primary">
              Get Started — It's Free
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

import { useEffect, useState, useCallback } from "react";
import {
  Package, PackagePlus, PackageSearch, CircleCheck, Truck, Clock3, Cog, ArrowRight,
  ChevronRight, CreditCard, History, Bell, ChartColumn, Activity, Pencil, Search,
  CircleAlert, Inbox,
} from "lucide-react";
import AppShell from "../components/AppShell";
import { StatusBadge, EmptyState, PanelHead } from "../components/ui";
import "./UserDashboard.css";

// ── CONFIG: เปลี่ยนเป็น URL ของ Render backend ตอน deploy
const API = process.env.REACT_APP_API_URL || "https://two025-itcs383-arai-kor-dai-cyio.onrender.com/api";
// ── Helpers
function getInitial(name) {
  return name ? name.trim()[0].toUpperCase() : "?";
}
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-TH", {
    day: "numeric", month: "short", year: "numeric",
  });
}
function formatTimeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return formatDate(dateStr);
}
function statusBadge(status) {
  const s = (status || "").toLowerCase();
  if (s === "delivered")
    return <StatusBadge tone="delivered" icon={CircleCheck}>Delivered</StatusBadge>;
  if (s === "in transit" || s === "transit")
    return <StatusBadge tone="transit" icon={Truck}>In Transit</StatusBadge>;
  if (s === "processing")
    return <StatusBadge tone="processing" icon={Cog}>Processing</StatusBadge>;
  return <StatusBadge tone="pending" icon={Clock3}>Pending</StatusBadge>;
}
// Tone + icon for a raw status string (used by Quick Track, which shows the raw status text)
function statusLook(status) {
  const s = (status || "").toLowerCase();
  if (s === "delivered") return { tone: "delivered", icon: CircleCheck };
  if (s === "in transit" || s === "transit") return { tone: "transit", icon: Truck };
  if (s === "processing") return { tone: "processing", icon: Cog };
  if (s === "pending") return { tone: "pending", icon: Clock3 };
  return { tone: "neutral", icon: Package };
}
function activityDotColor(type) {
  const map = { delivered: "delivered", payment: "neutral", created: "neutral", arrived: "transit", transit: "transit" };
  return map[(type || "").toLowerCase()] || "neutral";
}
function activityIcon(type) {
  const map = { delivered: CircleCheck, payment: CreditCard, created: PackagePlus, arrived: Truck, transit: Truck };
  return map[(type || "").toLowerCase()] || Activity;
}
function notifDotClass(type) {
  const map = { info: "transit", warning: "pending", success: "delivered", error: "returned" };
  return `tone-dot--${map[(type || "").toLowerCase()] || "transit"}`;
}

// ── API Fetch wrapper
async function apiFetch(path) {
  try {
    const res = await fetch(`${API}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`API error [${path}]:`, err.message);
    return null;
  }
}

// ════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════
export default function UserDashboard() {
  const USER_ID = localStorage.getItem("userId") || 1;

  const [user, setUser]             = useState({ name: "Loading…", email: "…" });
  const [stats, setStats]           = useState({});
  const [shipments, setShipments]   = useState([]);
  const [notifs, setNotifs]         = useState([]);
  const [activity, setActivity]     = useState([]);
  const [chartData, setChartData]   = useState([]);
  const [trackInput, setTrackInput] = useState("");
  const [trackResult, setTrackResult] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [unread, setUnread]         = useState(0);
  const [topbarDate, setTopbarDate] = useState("");

  // ── Load all data
  useEffect(() => {
    const now = new Date();
    setTopbarDate(now.toLocaleDateString("en-TH", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    }));

    async function init() {
      // Profile
      let u = await apiFetch(`/user/profile/${USER_ID}`);
      if (!u) {
        u = {
          name: localStorage.getItem("userName") || "Somchai Jaidee",
          email: localStorage.getItem("userEmail") || "somchai@example.com",
          created_at: null,
        };
      }
      localStorage.setItem("userName", u.name);
      localStorage.setItem("userEmail", u.email || "—");
      setUser(u);

      // Stats
      const st = await apiFetch(`/user/stats/${USER_ID}`);
      if (st) setStats(st);

      // Shipments
      const sh = await apiFetch(`/shipments/${USER_ID}`);
      if (sh) setShipments(sh);

      // Notifications
      const nf = await apiFetch(`/notifications/${USER_ID}`);
      if (nf) {
        setNotifs(nf.slice(0, 4));
        setUnread(nf.filter((n) => !n.is_read).length);
      }

      // Activity
      const ev = await apiFetch(`/activity/${USER_ID}`);
      if (ev) setActivity(ev.slice(0, 5));

      // Chart
      const ch = await apiFetch(`/shipments/monthly/${USER_ID}`);
      if (ch) setChartData(ch);
    }
    init();
  }, [USER_ID]);

  // ── Quick Track
  const doTrack = useCallback(async () => {
    const val = trackInput.trim().toUpperCase();
    if (!val) return;
    setTrackLoading(true);
    setTrackResult(null);
    const data = await apiFetch(`/shipments/track/${val}`);
    setTrackLoading(false);
    if (!data || data.error) {
      setTrackResult({ error: true });
    } else {
      setTrackResult({ ...data, val });
    }
  }, [trackInput]);

  // ── Mark all notifications read
  const markAllRead = useCallback(async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API}/notifications/${USER_ID}/read-all`, { method: "PATCH" });
    } catch (_) {}
    setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnread(0);
  }, [USER_ID]);

  // ── Chart max
  const maxV = Math.max(...chartData.map((d) => d.count), 1);

  const since = user.created_at
    ? `Member since ${new Date(user.created_at).getFullYear()}`
    : "Member";

  const firstName = user.name.split(" ")[0];
  const trackLook = trackResult && !trackResult.error ? statusLook(trackResult.status) : null;

  return (
    <AppShell
      active="dashboard"
      title={`${getGreeting()}, ${firstName}`}
      subtitle={topbarDate}
      user={{ name: user.name, sub: since, initial: getInitial(user.name) }}
      counts={{ history: shipments.length || "—" }}
      actions={
        <>
          <div className="search" role="search">
            <Search aria-hidden="true" />
            <input
              type="text"
              className="input"
              placeholder="Search tracking ID…"
              aria-label="Search tracking ID"
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
            />
          </div>
          <span className="avatar avatar--brand hide-sm" aria-hidden="true">{getInitial(user.name)}</span>
        </>
      }
    >
      {/* Welcome */}
      <section className="dash-hero" aria-labelledby="welcome-title">
        <div>
          <h2 id="welcome-title">Welcome back, {firstName}!</h2>
          <p>
            You have <strong>{stats.transit ?? 0} parcel{stats.transit !== 1 ? "s" : ""}</strong> currently in transit
            {stats.pending > 0 && (
              <> and <strong>{stats.pending} pending payment{stats.pending !== 1 ? "s" : ""}</strong></>
            )}. Everything is on track!
          </p>
        </div>
        <div className="dash-hero-actions">
          <a href="/create-shipment" className="btn btn-primary"><PackagePlus aria-hidden="true" /> New Shipment</a>
          <a href="/tracking" className="btn btn-secondary"><PackageSearch aria-hidden="true" /> Track Parcel</a>
        </div>
      </section>

      {/* Stats */}
      <section className="stat-strip dash-stats" aria-label="Shipment summary">
        {[
          { tone: "muted",     icon: Package,     label: "Total Shipments", val: stats.total },
          { tone: "delivered", icon: CircleCheck, label: "Delivered",       val: stats.delivered },
          { tone: "transit",   icon: Truck,       label: "In Transit",      val: stats.transit },
          { tone: "pending",   icon: Clock3,      label: "Pending",         val: stats.pending },
        ].map(({ tone, icon: Icon, label, val }) => (
          <div className="stat" key={label}>
            <div className="stat-label"><Icon className={`ic-${tone}`} aria-hidden="true" />{label}</div>
            <div className="stat-value">
              {val ?? <span className="skeleton" style={{ width: 56, height: 28 }} aria-label="Loading" />}
            </div>
          </div>
        ))}
      </section>

      <div className="dash-grid">
        {/* LEFT */}
        <div className="stack">
          {/* Recent Shipments */}
          <section className="panel">
            <PanelHead icon={Package} title="Recent Shipments" subtitle={`Your last ${shipments.length} shipments`}>
              <a href="/history" className="link">View all <ArrowRight aria-hidden="true" /></a>
            </PanelHead>
            <div className="table-wrap">
              <table className="table table--stack">
                <thead>
                  <tr>
                    <th scope="col">Tracking ID</th>
                    <th scope="col">Destination</th>
                    <th scope="col">Date</th>
                    <th scope="col">Status</th>
                    <th scope="col"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.length === 0 ? (
                    <tr className="table-empty">
                      <td colSpan={5} data-label="">
                        <EmptyState icon={Inbox} size="sm" title="No shipments found." />
                      </td>
                    </tr>
                  ) : shipments.map((s) => (
                    <tr key={s.tracking_number}>
                      <td className="stack-head" data-label="Tracking ID"><span className="tracking-id">{s.tracking_number}</span></td>
                      <td data-label="Destination" className="dest-cell">{s.destination}</td>
                      <td data-label="Date" className="t-muted num nowrap">{formatDate(s.created_at)}</td>
                      <td data-label="Status">{statusBadge(s.status)}</td>
                      <td className="t-right stack-action" data-label="">
                        <a href={`/tracking?id=${s.tracking_number}`} className="btn btn-ghost btn-sm">
                          Track <ChevronRight aria-hidden="true" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Chart */}
          <section className="panel">
            <PanelHead icon={ChartColumn} title="Shipment Activity" subtitle="Last 6 months overview" />
            <div className="panel-body">
              {chartData.length === 0 ? (
                <EmptyState icon={ChartColumn} size="sm" title="No chart data available." />
              ) : (
                <>
                  <div className="bars" role="img" aria-label={`Shipments per month: ${chartData.map((d) => `${d.month} ${d.count}`).join(", ")}`}>
                    {chartData.map((d, i) => (
                      <div className="bars-col" key={d.month}>
                        <div className={`bars-bar${i === chartData.length - 1 ? " is-hl" : ""}`} style={{ height: `${(d.count / maxV) * 100}%` }}>
                          <span className="bars-val">{d.count}</span>
                          <span className="bars-tip">{d.count} shipment{d.count !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bars-labels" aria-hidden="true">
                    {chartData.map((d) => <span key={d.month}>{d.month}</span>)}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Activity Timeline */}
          <section className="panel">
            <PanelHead icon={Activity} title="Recent Activity" subtitle="Latest updates" />
            <div className="panel-body">
              {activity.length === 0 ? (
                <EmptyState icon={Activity} size="sm" title="No recent activity." />
              ) : (
                <ol className="timeline dash-activity">
                  {activity.map((e, i) => {
                    const Icon = activityIcon(e.type);
                    return (
                      <li className="tl-item" key={i}>
                        <span className={`tl-node tone-${activityDotColor(e.type)}`}><Icon aria-hidden="true" /></span>
                        <div className="tl-body">
                          <div className="tl-title">{e.title}</div>
                          <div className="tl-sub">{e.subtitle || ""}</div>
                          <div className="tl-time">{formatTimeAgo(e.created_at)}</div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <div className="stack dash-side">
          {/* Profile Card */}
          <section className="panel dash-profile" aria-label="Profile">
            <div className="dash-profile-top">
              <span className="avatar avatar--lg avatar--brand" aria-hidden="true">{getInitial(user.name)}</span>
              <div style={{ minWidth: 0 }}>
                <div className="dash-profile-name">{user.name}</div>
                <div className="dash-profile-email">{user.email || "—"}</div>
              </div>
            </div>
            <dl className="dash-profile-stats">
              <div>
                <dt>Shipments</dt>
                <dd className="num">{stats.total ?? "—"}</dd>
              </div>
              <div>
                <dt>Delivered</dt>
                <dd className="num">{stats.delivered ?? "—"}</dd>
              </div>
              <div>
                <dt>Spent</dt>
                <dd className="num">{stats.totalSpend ? `฿${Number(stats.totalSpend).toLocaleString()}` : "฿0"}</dd>
              </div>
            </dl>
            <div className="dash-profile-foot">
              <button type="button" className="btn btn-secondary btn-sm btn-block"><Pencil aria-hidden="true" /> Edit Profile</button>
            </div>
          </section>

          {/* Quick Track */}
          <section className="panel">
            <PanelHead icon={PackageSearch} title="Quick Track" subtitle="Enter a tracking number" />
            <div className="panel-body">
              <div className="dash-track-row">
                <label htmlFor="quick-track" className="sr-only">Tracking number</label>
                <input
                  id="quick-track"
                  type="text"
                  className="input mono"
                  placeholder="e.g. TH-2024-0089"
                  value={trackInput}
                  onChange={(e) => { setTrackInput(e.target.value); setTrackResult(null); }}
                  onKeyDown={(e) => e.key === "Enter" && doTrack()}
                />
                <button type="button" className="btn btn-dark" onClick={doTrack}>Track <ArrowRight aria-hidden="true" /></button>
              </div>
              <div aria-live="polite">
                {trackLoading && (
                  <div className="dash-track-result row muted"><span className="spinner" aria-hidden="true" /> Searching…</div>
                )}
                {trackResult && !trackLoading && (
                  trackResult.error ? (
                    <div className="alert alert--danger dash-track-result">
                      <CircleAlert aria-hidden="true" />
                      <span>Tracking number not found. Please check and try again.</span>
                    </div>
                  ) : (
                    <div className="dash-track-result dash-track-card">
                      <div className="row-between">
                        <span className="tracking-id">{trackResult.val}</span>
                        <StatusBadge tone={trackLook.tone} icon={trackLook.icon}>
                          {trackResult.status ? trackResult.status.charAt(0).toUpperCase() + trackResult.status.slice(1) : "Unknown"}
                        </StatusBadge>
                      </div>
                      <dl className="dash-track-grid">
                        <div><dt>Origin</dt><dd>{trackResult.origin || "—"}</dd></div>
                        <div><dt>Destination</dt><dd>{trackResult.destination || trackResult.dest || "—"}</dd></div>
                        <div><dt>Est. Delivery</dt><dd className="num">{trackResult.eta ? formatDate(trackResult.eta) : "—"}</dd></div>
                        <div><dt>Last Update</dt><dd>{trackResult.last_update || "—"}</dd></div>
                      </dl>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="panel">
            <PanelHead title="Quick Actions" />
            <nav className="list" aria-label="Quick actions">
              {[
                { href: "/create-shipment", icon: PackagePlus,   label: "New Shipment" },
                { href: "/tracking",        icon: PackageSearch, label: "Track Parcel" },
                { href: "/payments",        icon: CreditCard,    label: "Make Payment" },
                { href: "/history",         icon: History,       label: "View History" },
              ].map(({ href, icon: Icon, label }) => (
                <a href={href} className="list-row" key={label}>
                  <span className="list-icon"><Icon aria-hidden="true" /></span>
                  <span className="grow cell-main">{label}</span>
                  <ChevronRight className="chev" aria-hidden="true" />
                </a>
              ))}
            </nav>
          </section>

          {/* Notifications */}
          <section className="panel">
            <PanelHead icon={Bell} title="Notifications" subtitle={`${unread} unread`}>
              <button type="button" className="link" onClick={markAllRead}>Mark all read</button>
            </PanelHead>
            {notifs.length === 0 ? (
              <EmptyState icon={Bell} size="sm" title="No notifications." />
            ) : (
              <ul className="list">
                {notifs.map((n, i) => (
                  <li className={`list-row dash-notif${!n.is_read ? " is-unread" : ""}`} key={i}>
                    <span className={`tone-dot ${notifDotClass(n.type)}`} aria-hidden="true" />
                    <div className="grow">
                      <p className="dash-notif-msg">{n.message}</p>
                      <span className="cell-sub">{formatTimeAgo(n.created_at)}</span>
                    </div>
                    {!n.is_read && <span className="sr-only">Unread</span>}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  );
}

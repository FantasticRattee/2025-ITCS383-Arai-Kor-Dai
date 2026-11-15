import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search, CircleCheck, Truck, Cog, Clock3, Undo2, Package, PackagePlus, PackageSearch, MapPin,
  Send, House, Check, Copy, Printer, Share2, CalendarDays, CircleAlert, Route, ClipboardList,
} from "lucide-react";
import AppShell from "../components/AppShell";
import { StatusBadge, PanelHead } from "../components/ui";
import "./TrackingPage.css";

const API = process.env.REACT_APP_API_URL || "https://two025-itcs383-arai-kor-dai-cyio.onrender.com/api";

// ── Helpers
function formatDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("en-TH", { day: "numeric", month: "short", year: "numeric" });
}

function statusConfig(status) {
  const s = (status || "").toLowerCase().replace(" ", "-");
  const map = {
    "delivered":  { cls: "delivered",  tone: "delivered",  icon: CircleCheck, title: "Delivered",           badge: "DELIVERED",  progress: 100 },
    "in-transit": { cls: "in-transit", tone: "transit",    icon: Truck,       title: "In Transit",          badge: "IN TRANSIT", progress: 60  },
    "in transit": { cls: "in-transit", tone: "transit",    icon: Truck,       title: "In Transit",          badge: "IN TRANSIT", progress: 60  },
    "processing": { cls: "processing", tone: "processing", icon: Cog,         title: "Processing",          badge: "PROCESSING", progress: 20  },
    "pending":    { cls: "pending",    tone: "pending",    icon: Clock3,      title: "Pending Pickup",      badge: "PENDING",    progress: 5   },
    "returned":   { cls: "returned",   tone: "returned",   icon: Undo2,       title: "Returned to Sender",  badge: "RETURNED",   progress: 80  },
  };
  return map[s] || map["pending"];
}

function StatusPill({ status }) {
  const s = (status || "").toLowerCase().replace(" ", "-");
  const map = {
    "delivered":  <StatusBadge tone="delivered" icon={CircleCheck}>Delivered</StatusBadge>,
    "in-transit": <StatusBadge tone="transit" icon={Truck}>In Transit</StatusBadge>,
    "in transit": <StatusBadge tone="transit" icon={Truck}>In Transit</StatusBadge>,
    "processing": <StatusBadge tone="processing" icon={Cog}>Processing</StatusBadge>,
    "pending":    <StatusBadge tone="pending" icon={Clock3}>Pending</StatusBadge>,
    "returned":   <StatusBadge tone="returned" icon={Undo2}>Returned</StatusBadge>,
  };
  return map[s] || <StatusBadge tone="neutral" icon={Package}>{status}</StatusBadge>;
}

// ════════════════════════════════════════════════
//  ROUTE VISUAL
// ════════════════════════════════════════════════
function RouteVisual({ data, cfg }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setProgress(cfg.progress), 300);
    return () => clearTimeout(t);
  }, [cfg.progress]);

  const stops = data.events?.length
    ? data.events.slice(0, 4)
    : [
        { location: data.origin || "Origin",      date: "Departed", done: true  },
        { location: data.destination || "Destination", date: data.eta ? formatDate(data.eta) : "—", current: cfg.cls !== "delivered" },
      ];

  return (
    <section className="panel">
      <PanelHead icon={Route} title="Delivery Route" subtitle={`${data.origin || "—"} → ${data.destination || "—"}`} />
      <div className="panel-body">
        <div className={`trk-route trk-route--${cfg.tone}`}>
          <div className="trk-node">
            <span className="trk-node-dot"><Send aria-hidden="true" /></span>
            <span className="trk-node-name">{data.origin || "—"}</span>
            <span className="trk-node-sub">Origin</span>
          </div>
          <div
            className="trk-line"
            role="progressbar"
            aria-label="Delivery progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={cfg.progress}
          >
            <div className="trk-line-fill" style={{ width: `${progress}%` }} />
            <div className="trk-truck" style={{ left: `${progress}%` }}><Truck aria-hidden="true" /></div>
          </div>
          <div className="trk-node trk-node--end">
            <span className="trk-node-dot trk-node-dot--dest"><MapPin aria-hidden="true" /></span>
            <span className="trk-node-name">{data.destination || "—"}</span>
            <span className="trk-node-sub">Destination</span>
          </div>
        </div>
        <ol className="trk-stops">
          {stops.map((s, i) => (
            <li className={`trk-stop${s.done ? " is-passed" : ""}${s.current ? " is-current" : ""}`} key={i}>
              <span className="trk-stop-dot" aria-hidden="true" />
              <span className="trk-stop-name">{s.location || s.loc || "—"}</span>
              <span className="trk-stop-date num">{s.date || ""}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════
//  TIMELINE
// ════════════════════════════════════════════════
function Timeline({ data, cfg }) {
  const isDelivered  = (data.status || "").toLowerCase() === "delivered";
  const isTransit    = (data.status || "").toLowerCase().includes("transit");
  const isProcessing = (data.status || "").toLowerCase() === "processing";

  const events = data.events?.length
    ? data.events
    : [
        { done: true,  icon: PackagePlus, title: "Shipment Created",      loc: data.origin || "—",                   time: data.created_at ? formatDate(data.created_at) : "—" },
        { done: isTransit || isDelivered, current: isProcessing, icon: isTransit || isDelivered ? Check : isProcessing ? Cog : null,
          title: "Processing & Dispatch", loc: "Sorting Hub",
          time: isProcessing ? "In progress" : isTransit || isDelivered ? "Completed" : "Pending",
          pending: !isTransit && !isDelivered && !isProcessing },
        { done: isDelivered, current: isTransit, icon: isDelivered ? Check : isTransit ? Truck : null,
          title: "In Transit", loc: `En route to ${data.destination || "—"}`,
          time: isTransit ? data.last_update || "In progress" : isDelivered ? "Completed" : "Pending",
          pending: !isDelivered && !isTransit },
        { done: isDelivered, icon: isDelivered ? House : null,
          title: "Delivered", loc: data.destination || "—",
          time: isDelivered ? formatDate(data.eta) : `Expected ${data.eta ? formatDate(data.eta) : "—"}`,
          pending: !isDelivered },
      ];

  return (
    <ol className="timeline">
      {events.map((e, i) => {
        const Icon = e.icon || Package;
        return (
          <li className={`tl-item${e.done ? " is-done" : ""}`} key={i}>
            <span className={`tl-node${e.done ? " is-done" : e.current ? " is-current" : ""}`}>
              {(e.done || e.current) && <Icon aria-hidden="true" strokeWidth={2.4} />}
            </span>
            <div className="tl-body">
              <div className={`tl-title${e.pending && !e.current ? " is-pending" : ""}`}>
                {e.title}
                {e.current && <span className="sr-only"> (current step)</span>}
              </div>
              <div className="tl-sub"><MapPin aria-hidden="true" />{e.loc || e.location || "—"}</div>
              <div className={`tl-time${e.pending && !e.current ? " is-pending" : ""}`}>{e.time || e.created_at || ""}</div>
              {e.note && <div className="trk-note">{e.note}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

// ════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════
export default function TrackingPage() {
  const [input,      setInput]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState(null);   // null | object
  const [error,      setError]      = useState(false);
  const [chips,      setChips]      = useState(["PO-20240312001","PO-20240308003","PO-20240306007","PO-20240303005"]);
  const [copied,     setCopied]     = useState(false);
  const resultsRef = useRef(null);

  // Load quick chips from API
  useEffect(() => {
    async function loadChips() {
      try {
        const res  = await fetch(`${API}/shipments/recent`);
        const data = await res.json();
        if (data?.length) setChips(data.slice(0, 4).map(s => s.tracking_number));
      } catch (_) {}
    }
    loadChips();

    // Auto-track from URL ?id=
    const urlId = new URLSearchParams(window.location.search).get("id");
    if (urlId) { setInput(urlId); track(urlId); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const track = useCallback(async (override) => {
    const val = (override || input).trim().toUpperCase();
    if (!val) return;
    setError(false);
    setResult(null);
    setLoading(true);
    try {
      const res  = await fetch(`${API}/shipments/track/${val}`);
      const data = await res.json();
      if (!data || data.error) { setError(true); }
      else { setResult({ ...data, _id: val }); }
    } catch (_) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [input]);

  // Scroll to results when data arrives
  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  function copyId() {
    if (!result) return;
    navigator.clipboard.writeText(result._id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const cfg = result ? statusConfig(result.status) : null;
  const StatusIcon = cfg ? cfg.icon : null;

  return (
    <AppShell
      active="tracking"
      title="Track Shipment"
      subtitle="Real-time parcel tracking"
      back={{ href: "/dashboard", label: "Back" }}
      contentClassName="content--narrow"
    >
      {/* Search */}
      <section className="panel trk-search" aria-labelledby="trk-search-title">
        <div className="panel-body">
          <h2 id="trk-search-title">Enter your Tracking ID</h2>
          <p>Track any parcel with your tracking number from your receipt or history</p>
          <div className="trk-search-row" role="search">
            <label htmlFor="trk-input" className="sr-only">Tracking ID</label>
            <div className="control has-lead trk-search-input">
              <Search className="lead" aria-hidden="true" />
              <input
                id="trk-input"
                type="text"
                className="input mono"
                placeholder="e.g. PO-20240312001"
                maxLength={20}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && track()}
              />
            </div>
            <button
              type="button"
              className={`btn btn-primary${loading ? " is-loading" : ""}`}
              onClick={() => track()}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Tracking…
                </>
              ) : (
                <>
                  <PackageSearch aria-hidden="true" />
                  Track
                </>
              )}
            </button>
          </div>
          <div className="trk-quick">
            <span className="muted">Try:</span>
            {chips.map(id => (
              <button type="button" key={id} className="chip mono trk-chip" onClick={() => { setInput(id); track(id); }}>{id}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Error banner */}
      {error && (
        <div className="alert alert--danger trk-error" role="alert">
          <CircleAlert aria-hidden="true" />
          <span>Tracking ID not found. Please check the number and try again.</span>
        </div>
      )}

      {/* Results */}
      {result && cfg && (
        <div className="trk-results fade-up" ref={resultsRef}>

          {/* Status */}
          <section className="panel" aria-label="Shipment status">
            <div className={`trk-status trk-status--${cfg.tone}`}>
              <div className="trk-status-left">
                <span className="trk-status-icon"><StatusIcon aria-hidden="true" /></span>
                <div>
                  <h2>{cfg.title}</h2>
                  <p>{result.last_update ? `Last updated: ${result.last_update}` : `Status: ${cfg.title}`}</p>
                </div>
              </div>
              <StatusBadge tone={cfg.tone} icon={StatusIcon} size="lg">{cfg.badge}</StatusBadge>
            </div>
            <dl className="meta-grid trk-meta">
              <div className="meta-cell"><dt>Tracking ID</dt><dd className="mono">{result._id}</dd></div>
              <div className="meta-cell"><dt>Sender</dt><dd>{result.origin || "—"}</dd></div>
              <div className="meta-cell"><dt>Receiver</dt><dd>{result.recipient || "—"}</dd></div>
              <div className="meta-cell"><dt>Est. Delivery</dt><dd className="num">{result.eta ? formatDate(result.eta) : "—"}</dd></div>
            </dl>
          </section>

          {/* Route visual */}
          <RouteVisual data={result} cfg={cfg} />

          {/* Detail grid */}
          <div className="trk-detail">
            <section className="panel">
              <PanelHead icon={ClipboardList} title="Tracking History" subtitle="Full shipment journey" />
              <div className="panel-body">
                <Timeline data={result} cfg={cfg} />
              </div>
            </section>

            <section className="panel">
              <PanelHead icon={Package} title="Package Info" subtitle="Shipment details" />
              <div className="panel-body">
                <div className="kv">
                  {[
                    { key: "Type",         val: result.type     || "Parcel",   accent: false },
                    { key: "Service",      val: result.service  || "Standard", accent: false },
                    { key: "Weight",       val: result.weight   || "—",        accent: false },
                    { key: "Dimensions",   val: result.dims     || "—",        accent: false },
                    { key: "Contents",     val: result.contents || "—",        accent: false },
                    { key: "Shipping Fee", val: result.amount ? `฿${Number(result.amount).toLocaleString()}` : "—", accent: true },
                  ].map(({ key, val, accent }) => (
                    <div className="kv-row" key={key}>
                      <span className="kv-key">{key}</span>
                      <span className={`kv-val num${accent ? " trk-fee" : ""}`}>{val}</span>
                    </div>
                  ))}
                  <div className="kv-row trk-kv-status">
                    <span className="kv-key">Status</span>
                    <span className="kv-val"><StatusPill status={result.status} /></span>
                  </div>
                </div>

                <div className="trk-eta">
                  <CalendarDays aria-hidden="true" />
                  <div>
                    <strong>{(result.status || "").toLowerCase() === "delivered" ? "Delivered Successfully" : "Estimated Delivery"}</strong>
                    <span className="num">{result.eta ? formatDate(result.eta) : "—"}</span>
                  </div>
                </div>

                <div className="trk-share">
                  <button type="button" className={`btn btn-secondary btn-sm${copied ? " trk-copied" : ""}`} onClick={copyId}>
                    {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                    {copied ? "Copied!" : "Copy ID"}
                  </button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                    <Printer aria-hidden="true" />
                    Print
                  </button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigator.share?.({ title: "Tracking", text: result._id, url: window.location.href })}>
                    <Share2 aria-hidden="true" />
                    Share
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && !error && (
        <div className="panel trk-empty">
          <div className="empty">
            <div className="empty-icon"><PackageSearch aria-hidden="true" /></div>
            <h3>Enter a Tracking ID to get started</h3>
            <p>Type your tracking number above or click one of the demo IDs to see live tracking in action.</p>
          </div>
        </div>
      )}
    </AppShell>
  );
}

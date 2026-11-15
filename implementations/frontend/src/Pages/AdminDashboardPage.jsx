import { useState, useEffect, useRef } from "react";
import {
  Search, Bell, Check, ArrowUp, Package, CircleCheck, Truck, Banknote, ClipboardList, Activity,
  Zap, ChartColumn, ChartPie, Clock3, Undo2, PackageCheck, Send, Mail, Stamp, CreditCard,
  UserPlus, PackagePlus, PackageSearch, UserCheck, ChevronRight, TriangleAlert,
} from "lucide-react";
import AppShell from "../components/AppShell";
import { StatusBadge, PanelHead } from "../components/ui";
import "./Admin.css";

// ─── Static data ──────────────────────────────────────────────────────────────
const SHIPMENTS = [
  { id: "PO-20240324001", sender: "Viroj W.",        sLoc: "Bangkok",  receiver: "Nanthicha S.",    rLoc: "Nonthaburi",   type: "Parcel",     status: "sp-pending",   statusTxt: "Pending",   fee: "฿90" },
  { id: "PO-20240323002", sender: "Suphannika S.",   sLoc: "Bangkok",  receiver: "Ekkawit C.",      rLoc: "Pathum Thani", type: "Express",    status: "sp-returned",  statusTxt: "Returned",  fee: "฿225" },
  { id: "PO-20240322003", sender: "Apichart N.",     sLoc: "Bangkok",  receiver: "Darunee P.",      rLoc: "Samut Sakhon", type: "Registered", status: "sp-received",  statusTxt: "Received",  fee: "฿115" },
  { id: "PO-20240321004", sender: "Rungnapha S.",    sLoc: "Bangkok",  receiver: "Watcharaporn S.", rLoc: "Samut Prakan", type: "Letter",     status: "sp-sent",      statusTxt: "Sent",      fee: "฿16" },
  { id: "PO-20240320005", sender: "Winai C.",        sLoc: "Bangkok",  receiver: "Patcharin D.",    rLoc: "Ang Thong",    type: "Parcel",     status: "sp-pending",   statusTxt: "Pending",   fee: "฿78" },
  { id: "PO-20240319006", sender: "Pornpan S.",      sLoc: "Bangkok",  receiver: "Atchara K.",      rLoc: "Nakhon Pathom",type: "Express",    status: "sp-delivered", statusTxt: "Delivered",  fee: "฿200" },
];

const STATUS_LOOK = {
  "sp-pending":   { tone: "pending",    icon: Clock3 },
  "sp-returned":  { tone: "returned",   icon: Undo2 },
  "sp-received":  { tone: "processing", icon: PackageCheck },
  "sp-sent":      { tone: "transit",    icon: Send },
  "sp-delivered": { tone: "delivered",  icon: CircleCheck },
};
const TYPE_ICONS = { Parcel: Package, Express: Zap, Registered: Stamp, Letter: Mail };

const ACTIVITY = [
  { tone: "delivered", icon: CircleCheck,   title: "PO-20240319006 delivered to Nakhon Pathom", time: "2 minutes ago" },
  { tone: "neutral",   icon: PackagePlus,   title: "New shipment created by Viroj W.",           time: "14 minutes ago" },
  { tone: "pending",   icon: TriangleAlert, title: "PO-20240323002 return initiated — delivery failed", time: "1 hour ago" },
  { tone: "neutral",   icon: CreditCard,    title: "Payment of ฿225 received via PromptPay",    time: "2 hours ago" },
  { tone: "neutral",   icon: UserPlus,      title: "New user registered: Wirut Thanakit",        time: "3 hours ago" },
];

const WEEK_DATA = [22, 31, 28, 35, 24, 18, 10];
const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const STATUS_DIST = [
  { label: "Delivered", count: 9,  pct: 37, color: "var(--delivered-fg)",  icon: CircleCheck },
  { label: "Sent",      count: 9,  pct: 37, color: "var(--transit-fg)",    icon: Send },
  { label: "Received",  count: 8,  pct: 33, color: "var(--processing-fg)", icon: PackageCheck },
  { label: "Pending",   count: 5,  pct: 21, color: "#c98a12",              icon: Clock3 },
  { label: "Returned",  count: 2,  pct: 8,  color: "var(--returned-fg)",   icon: Undo2 },
];

const QUICK_ACTIONS = [
  { icon: PackagePlus,   label: "New Shipment",   sub: "Create label",   href: "/create-shipment" },
  { icon: PackageSearch, label: "Track Parcel",   sub: "Live status",    href: "/tracking" },
  { icon: UserCheck,     label: "User Approvals", sub: "5 waiting",      href: "/admin/users" },
  { icon: ChartColumn,   label: "Reports",        sub: "Stats & export", href: "/admin/reports" },
];

// ─── Animated counter hook ────────────────────────────────────────────────────
function useAnimatedCount(target, prefix = "", suffix = "") {
  const [display, setDisplay] = useState("0");
  const rafRef = useRef(null);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const dur = 1200, start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        setDisplay(prefix + Math.round(e * target).toLocaleString() + suffix);
        if (p < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, 200);
    return () => { clearTimeout(delay); cancelAnimationFrame(rafRef.current); };
  }, [target, prefix, suffix]);

  return display;
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ iconCls, icon: Icon, trend, target, prefix = "", suffix = "", label }) {
  const val = useAnimatedCount(target, prefix, suffix);
  return (
    <div className="stat">
      <div className="stat-label"><Icon className={iconCls} aria-hidden="true" />{label}</div>
      <div className="stat-value">{val}</div>
      <div className="stat-meta"><span className="trend-up row" style={{ gap: 2 }}><ArrowUp aria-hidden="true" />{trend}</span></div>
    </div>
  );
}

// ─── Mini bar chart ───────────────────────────────────────────────────────────
function MiniChart({ data, labels, highlightIdx = 2 }) {
  const [animated, setAnimated] = useState(false);
  const maxVal = Math.max(...data);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <div className="bars" role="img" aria-label={`Shipments per day: ${labels.map((l, i) => `${l} ${data[i]}`).join(", ")}`}>
        {data.map((v, i) => (
          <div className="bars-col" key={i}>
            <div
              className={`bars-bar${i === highlightIdx ? " is-hl" : ""}`}
              style={{ height: animated ? `${Math.round((v / maxVal) * 100)}%` : "0%", transitionDelay: `${i * 0.08}s` }}
            >
              <span className="bars-val">{v}</span>
              <span className="bars-tip">{v} shipments</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bars-labels" aria-hidden="true">
        {labels.map(l => <span key={l}>{l}</span>)}
      </div>
    </>
  );
}

// ─── Status distribution bars ─────────────────────────────────────────────────
function StatusBars({ data }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <ul className="adm-dist">
      {data.map(s => (
        <li key={s.label}>
          <div className="row-between">
            <span className="row" style={{ gap: 8 }}><s.icon aria-hidden="true" style={{ width: 15, height: 15, color: s.color }} />{s.label}</span>
            <strong className="num">{s.count}</strong>
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: animated ? `${s.pct}%` : "0%", background: s.color }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  return (
    <AppShell
      variant="admin"
      active="dashboard"
      title="Dashboard"
      subtitle="Wednesday, 11 March 2026"
      counts={{ users: 5 }}
      actions={
        <>
          <button type="button" className="icon-btn hide-sm" aria-label="Search"><Search aria-hidden="true" /></button>
          <button type="button" className="icon-btn" aria-label="Notifications, 4 new">
            <Bell aria-hidden="true" />
            <span className="dot-count" aria-hidden="true">4</span>
          </button>
          <span className="topbar-divider hide-sm" aria-hidden="true" />
          <span className="user-chip hide-sm"><span className="avatar" aria-hidden="true">A</span>Super Admin</span>
        </>
      }
    >
      {/* Welcome */}
      <section className="page-intro">
        <div>
          <h2>Good morning, Admin</h2>
          <p>Here's what's happening at your post office today — 11 March 2026</p>
        </div>
        <div className="page-intro-actions">
          <a href="/admin/users" className="btn btn-primary">
            <Check aria-hidden="true" />
            5 Pending Approvals
          </a>
        </div>
      </section>

      {/* KPI row */}
      <section className="stat-strip mb-20" aria-label="Key figures">
        <KpiCard iconCls="ic-muted"     icon={Package}     trend="+12%" target={247}  label="Total Shipments" />
        <KpiCard iconCls="ic-delivered" icon={CircleCheck} trend="+8%"  target={38}   label="Delivered Today" />
        <KpiCard iconCls="ic-transit"   icon={Truck}       trend="+5%"  target={54}   label="In Transit" />
        <KpiCard iconCls="ic-muted"     icon={Banknote}    trend="+18%" target={4280} label="Revenue (฿) This Week" prefix="฿" />
      </section>

      {/* Row 1: Shipments table + right column */}
      <div className="grid-main adm-grid mb-20">
        <section className="panel">
          <PanelHead icon={ClipboardList} title="Recent Shipments" subtitle="Latest 6 transactions" />
          <div className="table-wrap">
            <table className="table table--stack table--dense">
              <thead>
                <tr>
                  <th scope="col">Tracking ID</th><th scope="col">Sender</th><th scope="col">Receiver</th>
                  <th scope="col">Type</th><th scope="col">Status</th><th scope="col" className="t-right">Fee</th>
                  <th scope="col"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {SHIPMENTS.map(s => {
                  const look = STATUS_LOOK[s.status];
                  const TypeIcon = TYPE_ICONS[s.type] || Package;
                  return (
                    <tr key={s.id}>
                      <td className="stack-head" data-label="Tracking ID"><span className="tracking-id">{s.id}</span></td>
                      <td data-label="Sender"><div><div className="cell-main">{s.sender}</div><div className="cell-sub">{s.sLoc}</div></div></td>
                      <td data-label="Receiver"><div><div className="cell-main">{s.receiver}</div><div className="cell-sub">{s.rLoc}</div></div></td>
                      <td data-label="Type"><span className="tag"><TypeIcon aria-hidden="true" />{s.type}</span></td>
                      <td data-label="Status"><StatusBadge tone={look.tone} icon={look.icon}>{s.statusTxt}</StatusBadge></td>
                      <td data-label="Fee" className="t-right num cell-main">{s.fee}</td>
                      <td className="t-right stack-action" data-label=""><button type="button" className="btn btn-secondary btn-sm">View</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right column */}
        <div className="stack">
          <section className="panel">
            <PanelHead icon={Activity} title="Recent Activity" />
            <div className="panel-body">
              <ol className="timeline adm-activity">
                {ACTIVITY.map((a, i) => (
                  <li key={i} className="tl-item">
                    <span className={`tl-node tone-${a.tone}`}><a.icon aria-hidden="true" /></span>
                    <div className="tl-body">
                      <div className="tl-title" style={{ fontWeight: 500 }}>{a.title}</div>
                      <div className="tl-time">{a.time}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="panel">
            <PanelHead icon={Zap} title="Quick Actions" />
            <nav className="list" aria-label="Quick actions">
              {QUICK_ACTIONS.map(q => (
                <a key={q.label} href={q.href} className="list-row">
                  <span className="list-icon"><q.icon aria-hidden="true" /></span>
                  <span className="grow"><span className="cell-main" style={{ display: "block" }}>{q.label}</span><span className="cell-sub">{q.sub}</span></span>
                  <ChevronRight className="chev" aria-hidden="true" />
                </a>
              ))}
            </nav>
          </section>
        </div>
      </div>

      {/* Row 2: Weekly chart + Status distribution */}
      <div className="grid-2">
        <section className="panel">
          <PanelHead icon={ChartColumn} title="Shipments This Week" subtitle="Mon 4 Mar — Sun 10 Mar 2026" />
          <div className="panel-body">
            <MiniChart data={WEEK_DATA} labels={WEEK_LABELS} highlightIdx={2} />
            <div className="mini-stats">
              <div className="mini-stat"><div className="mini-stat-value">168</div><div className="mini-stat-label">Total</div></div>
              <div className="mini-stat"><div className="mini-stat-value">฿18,420</div><div className="mini-stat-label">Revenue</div></div>
              <div className="mini-stat"><div className="mini-stat-value">94%</div><div className="mini-stat-label">Delivered</div></div>
            </div>
          </div>
        </section>

        <section className="panel">
          <PanelHead icon={ChartPie} title="Status Distribution" subtitle="Current month" />
          <div className="panel-body">
            <StatusBars data={STATUS_DIST} />
            <div className="mini-stats">
              <div className="mini-stat"><div className="mini-stat-value">24</div><div className="mini-stat-label">This Month</div></div>
              <div className="mini-stat"><div className="mini-stat-value">2</div><div className="mini-stat-label">Pending</div></div>
              <div className="mini-stat"><div className="mini-stat-value">฿2,841</div><div className="mini-stat-label">Collected</div></div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

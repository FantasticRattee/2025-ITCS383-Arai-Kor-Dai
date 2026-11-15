import { useState, useEffect, useMemo } from "react";
import {
  Search, Download, Package, Mail, Zap, Stamp, Send, PackageCheck, Clock3, Undo2, ArrowUpDown,
  ChevronLeft, ChevronRight, Inbox, CircleAlert, Files,
} from "lucide-react";
import AppShell from "../components/AppShell";
import { StatusBadge, EmptyState } from "../components/ui";
import "./HistoryPage.css";

const API_URL       = process.env.REACT_APP_API_URL || "https://two025-itcs383-arai-kor-dai-cyio.onrender.com/api";
const USER_ID       = localStorage.getItem("userId") || 1;
const ROWS_PER_PAGE = 8;

const TYPE_ICONS = { Parcel:Package, Letter:Mail, Express:Zap, Registered:Stamp };

const BADGE_CLS = {
  Sent:     { tone: "transit",   icon: Send },
  Received: { tone: "delivered", icon: PackageCheck },
  Pending:  { tone: "pending",   icon: Clock3 },
  Returned: { tone: "returned",  icon: Undo2 },
};

function normStatus(s) {
  const map = {
    paid:"Sent", delivered:"Received", pending:"Pending",
    processing:"Pending", shipped:"Sent", cancelled:"Returned", returned:"Returned",
  };
  return map[(s||"").toLowerCase()] || s || "Pending";
}

function fmtDate(raw) {
  if (!raw) return "—";
  return new Date(raw).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
}

// ════════════════════════════════════════════════
//  STATUS BADGE
// ════════════════════════════════════════════════
function Badge({ status }) {
  const look = BADGE_CLS[status] || BADGE_CLS.Pending;
  return <StatusBadge tone={look.tone} icon={look.icon}>{status}</StatusBadge>;
}

// ════════════════════════════════════════════════
//  PAGINATION
// ════════════════════════════════════════════════
function Pagination({ page, totalPages, total, perPage, onChange }) {
  const start = (page - 1) * perPage + 1;
  const end   = Math.min(page * perPage, total);
  const info  = total ? `Showing ${start}–${end} of ${total} records` : "No records found";

  return (
    <div className="panel-foot">
      <div className="muted num" style={{ fontSize: "var(--fs-sm)" }}>{info}</div>
      <nav className="pager" aria-label="Pagination">
        <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page"><ChevronLeft aria-hidden="true" /></button>
        {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(pg => (
          <button type="button" key={pg} className={pg === page ? "is-active" : ""} aria-current={pg === page ? "page" : undefined} onClick={() => onChange(pg)}>{pg}</button>
        ))}
        <button type="button" onClick={() => onChange(page + 1)} disabled={page >= totalPages} aria-label="Next page"><ChevronRight aria-hidden="true" /></button>
      </nav>
    </div>
  );
}

// ════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════
export default function HistoryPage() {
  const [allData,  setAllData]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [search,   setSearch]   = useState("");
  const [statusF,  setStatusF]  = useState("");
  const [typeF,    setTypeF]    = useState("");
  const [page,     setPage]     = useState(1);

  // ── Fetch history ──
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res  = await fetch(`${API_URL}/shipments/history/${USER_ID}`);
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const rows = await res.json();
        setAllData(rows.map(r => ({
          id:       r.tracking_number,
          sender:   "Me",
          sAddr:    r.sAddr  || "—",
          receiver: r.receiver || "—",
          rAddr:    r.rAddr  || "—",
          type:     r.paymentMethod === "Cash on Delivery" ? "Registered" : "Parcel",
          date:     fmtDate(r.created_at),
          status:   normStatus(r.status),
          fee:      r.amount ? `฿${parseFloat(r.amount).toFixed(0)}` : "—",
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Filtered data (derived) ──
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allData.filter(r =>
      (!q || [r.id, r.sender, r.receiver, r.sAddr, r.rAddr].some(v => v.toLowerCase().includes(q))) &&
      (!statusF || r.status === statusF) &&
      (!typeF   || r.type   === typeF)
    );
  }, [allData, search, statusF, typeF]);

  // ── Reset page on filter change ──
  useEffect(() => setPage(1), [search, statusF, typeF]);

  // ── Stats ──
  const stats = useMemo(() => ({
    total:    filtered.length,
    sent:     filtered.filter(r => r.status === "Sent").length,
    received: filtered.filter(r => r.status === "Received").length,
    pending:  filtered.filter(r => r.status === "Pending").length,
  }), [filtered]);

  // ── Page slice ──
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const pageData   = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  return (
    <AppShell
      active="history"
      title="Transaction History"
      subtitle="Post Office — All parcel & mail records"
      back={{ href: "/dashboard", label: "Back" }}
    >
      {/* Stats */}
      <section className="stat-strip hist-stats" aria-label="Record summary">
        {[
          { icon: Files,        cls: "ic-muted",     label: "Total Records", val: stats.total },
          { icon: Send,         cls: "ic-transit",   label: "Sent",          val: stats.sent },
          { icon: PackageCheck, cls: "ic-delivered", label: "Received",      val: stats.received },
          { icon: Clock3,       cls: "ic-pending",   label: "Pending",       val: stats.pending },
        ].map(({ icon: Icon, cls, label, val }) => (
          <div className="stat" key={label}>
            <div className="stat-label"><Icon className={cls} aria-hidden="true" />{label}</div>
            <div className="stat-value">{val}</div>
          </div>
        ))}
      </section>

      <section className="panel">
        {/* Toolbar */}
        <div className="hist-toolbar">
          <div className="control has-lead hist-search">
            <Search className="lead" aria-hidden="true" />
            <input
              type="text"
              className="input"
              placeholder="Search by name, tracking ID, city…"
              aria-label="Search records"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="select hist-filter" aria-label="Filter by status" value={statusF} onChange={e => setStatusF(e.target.value)}>
            <option value="">All Status</option>
            <option>Sent</option><option>Received</option>
            <option>Pending</option><option>Returned</option>
          </select>
          <select className="select hist-filter" aria-label="Filter by type" value={typeF} onChange={e => setTypeF(e.target.value)}>
            <option value="">All Types</option>
            <option>Parcel</option><option>Letter</option>
            <option>Express</option><option>Registered</option>
          </select>
          <button type="button" className="btn btn-secondary">
            <Download aria-hidden="true" />
            Export
          </button>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table className="table table--stack">
            <thead>
              <tr>
                <th scope="col"><span className="th-sort">Tracking ID <ArrowUpDown aria-hidden="true" /></span></th>
                <th scope="col">Sender</th>
                <th scope="col">Receiver</th>
                <th scope="col">Type</th>
                <th scope="col"><span className="th-sort">Date <ArrowUpDown aria-hidden="true" /></span></th>
                <th scope="col">Status</th>
                <th scope="col" className="t-right">Fee</th>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="table-empty">
                  <td colSpan={8} data-label="">
                    <div className="empty empty--sm" role="status"><span className="spinner spinner--lg" aria-hidden="true" /><p>Loading…</p></div>
                  </td>
                </tr>
              ) : error ? (
                <tr className="table-empty">
                  <td colSpan={8} data-label="">
                    <EmptyState icon={CircleAlert} tone="error" title="Could not load data">{error}</EmptyState>
                  </td>
                </tr>
              ) : pageData.length === 0 ? (
                <tr className="table-empty">
                  <td colSpan={8} data-label="">
                    <EmptyState icon={Inbox} title="No records found." />
                  </td>
                </tr>
              ) : pageData.map((r) => {
                const TypeIcon = TYPE_ICONS[r.type] || Package;
                return (
                  <tr key={r.id}>
                    <td className="stack-head" data-label="Tracking ID"><span className="tracking-id">{r.id}</span></td>
                    <td data-label="Sender">
                      <div>
                        <div className="cell-main">{r.sender}</div>
                        <div className="cell-sub">{r.sAddr}</div>
                      </div>
                    </td>
                    <td data-label="Receiver">
                      <div>
                        <div className="cell-main">{r.receiver}</div>
                        <div className="cell-sub">{r.rAddr}</div>
                      </div>
                    </td>
                    <td data-label="Type"><span className="tag"><TypeIcon aria-hidden="true" />{r.type}</span></td>
                    <td data-label="Date" className="t-muted num nowrap">{r.date}</td>
                    <td data-label="Status"><Badge status={r.status} /></td>
                    <td data-label="Fee" className="t-right num nowrap cell-main">{r.fee}</td>
                    <td className="t-right stack-action" data-label="">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => window.location.href = `/tracking?id=${encodeURIComponent(r.id)}`}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={totalPages}
          total={filtered.length}
          perPage={ROWS_PER_PAGE}
          onChange={setPage}
        />
      </section>
    </AppShell>
  );
}

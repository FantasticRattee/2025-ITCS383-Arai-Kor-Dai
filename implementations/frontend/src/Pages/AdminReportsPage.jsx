import { useState, useEffect, useRef, useCallback } from "react";
import {
  Bell, FileSpreadsheet, FileDown, Package, CircleCheck, Truck, Banknote, TrendingUp, ArrowUp,
  ChartColumn, ChartPie, ChartLine, Table2, ClipboardList, Route, FileText, X, Download, Check,
  CalendarDays,
} from "lucide-react";
import AppShell from "../components/AppShell";
import { PanelHead } from "../components/ui";
import "./Admin.css";

// ─── Data ─────────────────────────────────────────────────────────────────────
const DATA = {
  day: { labels:['8am','10am','12pm','2pm','4pm','6pm'], parcels:[4,6,9,7,5,3], letters:[2,3,5,4,3,1], express:[1,2,3,2,1,1], registered:[1,1,2,1,1,0], revenue:[620,840,1280,960,680,420], total:47, delivered:41, transit:4, revenue_total:4800, avg:102, periodLabel:'Today', chartSub:'Hourly — 11 Mar 2026', peakDay:'12:00–14:00', rate:'87%', ret:'3.2%', collected:'฿4,800' },
  week: { labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], parcels:[18,24,22,30,20,14,8], letters:[10,13,11,15,12,8,5], express:[6,9,8,11,7,5,3], registered:[4,5,4,6,5,3,2], revenue:[2200,3100,2850,3800,2750,1900,1020], total:247, delivered:232, transit:11, revenue_total:18420, avg:74, periodLabel:'This Week', chartSub:'Mon 4 Mar — Sun 10 Mar 2026', peakDay:'Thursday', rate:'94%', ret:'2.4%', collected:'฿18,420' },
  month: { labels:['W1','W2','W3','W4'], parcels:[82,95,88,71], letters:[45,52,48,39], express:[28,33,30,24], registered:[18,21,19,15], revenue:[9800,11400,10600,8500], total:990, delivered:941, transit:38, revenue_total:40300, avg:40, periodLabel:'This Month', chartSub:'March 2026', peakDay:'Week 2', rate:'95%', ret:'1.8%', collected:'฿40,300' },
  year: { labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], parcels:[280,260,310,90,0,0,0,0,0,0,0,0], letters:[155,143,171,50,0,0,0,0,0,0,0,0], express:[95,88,105,30,0,0,0,0,0,0,0,0], registered:[62,57,68,20,0,0,0,0,0,0,0,0], revenue:[38000,35400,42100,12000,0,0,0,0,0,0,0,0], total:2680, delivered:2540, transit:98, revenue_total:127500, avg:47, periodLabel:'This Year', chartSub:'January — December 2026', peakDay:'March', rate:'95%', ret:'1.6%', collected:'฿127,500' },
};
// Categorical chart colours for the four mail types (always shown with a text legend)
const TYPE_META = [
  { key:'parcels',    label:'Parcels',    color:'#2f3a46' },
  { key:'express',    label:'Express',    color:'#d9962b' },
  { key:'letters',    label:'Letters',    color:'#4a86e8' },
  { key:'registered', label:'Registered', color:'#8c7ae6' },
];
const TYPE_COLOR = Object.fromEntries(TYPE_META.map(t => [t.key, t.color]));
const AVG_FEE = { parcels:84, letters:18, express:185, registered:110 };
const TOP_ROUTES = [
  { name:'Bangkok → Nonthaburi', sub:'Metropolitan corridor', count:42 },
  { name:'Bangkok → Chiang Mai', sub:'North route', count:31 },
  { name:'Bangkok → Phuket', sub:'South route', count:28 },
  { name:'Bangkok → Khon Kaen', sub:'Northeast route', count:19 },
  { name:'Bangkok → Hat Yai', sub:'Deep south route', count:14 },
];

// ─── Animated counter hook ────────────────────────────────────────────────────
function useAnimatedCount(target, prefix = '', suffix = '') {
  const [display, setDisplay] = useState('0');
  const rafRef = useRef(null);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const dur = 900, start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const v = e * target;
      setDisplay(prefix + Math.round(v).toLocaleString() + suffix);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, prefix, suffix]);

  return display;
}

// ─── Bar chart component ──────────────────────────────────────────────────────
function BarChart({ d, typeFilter }) {
  const [animated, setAnimated] = useState(false);
  const keys = typeFilter === 'all' ? ['parcels','letters','express','registered'] : [typeFilter];
  const CHART_H = 160;

  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, [d, typeFilter]);

  const totals = d.labels.map((_, i) => keys.reduce((s, k) => s + d[k][i], 0));
  const maxV = Math.max(...totals, 1);

  return (
    <div className="rep-chart" role="img" aria-label={`Parcel volume by type, ${d.chartSub}`}>
      {d.labels.map((lbl, i) => (
        <div key={lbl} className="rep-group">
          <div className="rep-bars">
            {keys.map((k) => {
              const v = d[k][i];
              const px = Math.round((v / maxV) * CHART_H);
              return (
                <div
                  key={k}
                  className="rep-bar"
                  style={{ height: animated ? `${px}px` : '0px', transitionDelay: `${0.2 + i * 0.055}s`, background: TYPE_COLOR[k] }}
                >
                  <div className="bars-tip">{v} {k}</div>
                </div>
              );
            })}
          </div>
          <div className="rep-label">{lbl}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Revenue SVG chart ────────────────────────────────────────────────────────
function RevChart({ d }) {
  const vals = d.revenue;
  const maxR = Math.max(...vals, 1);
  const W = 600, H = 150, padX = 10, padY = 16;
  const n = vals.length;

  const pts = vals.map((v, i) => ({
    x: Math.round(padX + (i / Math.max(n - 1, 1)) * (W - padX * 2)),
    y: Math.round(padY + (1 - v / maxR) * (H - padY * 2)),
  }));

  const polyline = pts.map(p => `${p.x},${p.y}`).join(' ');
  const area = `${pts[0].x},${H} ` + pts.map(p => `${p.x},${p.y}`).join(' ') + ` ${pts[pts.length - 1].x},${H}`;

  return (
    <>
      <svg className="rep-line" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={`Revenue ${d.periodLabel.toLowerCase()}`}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3d4651" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#3d4651" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map(f => <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="#e2e6eb" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
        <polygon points={area} fill="url(#revGrad)" />
        <polyline points={polyline} fill="none" stroke="#3d4651" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#fff" stroke="#3d4651" strokeWidth="2" vectorEffect="non-scaling-stroke">
            <title>฿{vals[i].toLocaleString()}</title>
          </circle>
        ))}
      </svg>
      <div className="rep-line-labels" aria-hidden="true">
        {d.labels.map(l => <span key={l}>{l}</span>)}
      </div>
    </>
  );
}

// ─── Type breakdown ───────────────────────────────────────────────────────────
function TypeBreakdown({ d, typeFilter }) {
  const [widths, setWidths] = useState({});
  const relevant = typeFilter === 'all' ? TYPE_META : TYPE_META.filter(t => t.key === typeFilter);
  const totals = relevant.map(t => d[t.key].reduce((s, v) => s + v, 0));
  const grand = totals.reduce((s, v) => s + v, 0) || 1;

  useEffect(() => {
    setWidths({});
    const t = setTimeout(() => {
      const w = {};
      relevant.forEach((t2, i) => { w[t2.key] = Math.round((totals[i] / grand) * 100); });
      setWidths(w);
    }, 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d, typeFilter]);

  return (
    <ul className="adm-dist">
      {relevant.map((t, i) => {
        const cnt = totals[i];
        const pct = Math.round((cnt / grand) * 100);
        return (
          <li key={t.key}>
            <div className="row-between">
              <span className="row" style={{ gap: 8, fontWeight: 600 }}>
                <span className="legend-swatch" style={{ background: t.color }} aria-hidden="true" />
                {t.label}
              </span>
              <span className="row" style={{ gap: 12 }}>
                <span className="muted num">{cnt} parcels</span>
                <strong className="num">{pct}%</strong>
              </span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${widths[t.key] ?? 0}%`, background: t.color }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ─── KPI card with animated counter ──────────────────────────────────────────
function KpiCard({ iconCls, icon: Icon, trend, target, prefix = '', suffix = '', label }) {
  const val = useAnimatedCount(target, prefix, suffix);
  return (
    <div className="stat">
      <div className="stat-label"><Icon className={iconCls} aria-hidden="true" />{label}</div>
      <div className="stat-value">{val}</div>
      <div className="stat-meta"><span className="trend-up row" style={{ gap: 2 }}><ArrowUp aria-hidden="true" />{trend}</span></div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdminReportsPage() {
  const [period, setPeriodState] = useState('week');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('2026-03-04');
  const [dateTo, setDateTo] = useState('2026-03-11');

  // Export modal
  const [exportModal, setExportModal] = useState(false);
  const [exportType, setExportType] = useState('pdf');
  const [exportChecks, setExportChecks] = useState({ stats: true, revenue: true, routes: false, summary: false });
  const [exportPeriodSel, setExportPeriodSel] = useState('This Week (4–10 Mar 2026)');

  // Progress modal
  const [progress, setProgress] = useState({ show: false, title: '', step: '', pct: 0 });

  // Toast
  const [toast, setToast] = useState({ show: false, msg: '' });
  const toastRef = useRef(null);

  const d = DATA[period];

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  }, []);

  const openExport = (type) => { setExportType(type); setExportModal(true); };
  const closeExportModal = () => setExportModal(false);

  const exportCSV = useCallback(() => {
    const rows = [['Period','Label','Parcels','Letters','Express','Registered','Total','Revenue (THB)']];
    d.labels.forEach((lbl, i) => {
      const total = d.parcels[i] + d.letters[i] + d.express[i] + d.registered[i];
      rows.push([d.periodLabel, lbl, d.parcels[i], d.letters[i], d.express[i], d.registered[i], total, d.revenue[i]]);
    });
    rows.push([], [' SUMMARY '], [' Total Parcels', d.total], ['Delivered', d.delivered], ['In Transit', d.transit],
      ['Total Revenue (THB)', d.revenue_total], ['Avg Fee (THB)', d.avg], ['Delivery Rate', d.rate], ['Return Rate', d.ret], ['Peak Day', d.peakDay]);
    const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\r\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'PostOffice_Report_' + d.periodLabel.replace(/\s+/g, '_') + '.csv';
    a.click(); URL.revokeObjectURL(url);
  }, [d]);

  const runExport = useCallback(async () => {
    closeExportModal();
    if (exportType === 'csv') {
      setProgress({ show: true, title: 'Exporting CSV...', step: 'Building rows...', pct: 40 });
      await new Promise(r => setTimeout(r, 300));
      exportCSV();
      setProgress(p => ({ ...p, pct: 100, step: 'Done!' }));
      await new Promise(r => setTimeout(r, 400));
      setProgress(p => ({ ...p, show: false }));
      showToast('CSV downloaded: PostOffice_Report_' + d.periodLabel.replace(/\s+/g, '_') + '.csv');
    } else {
      setProgress({ show: true, title: 'Generating PDF...', step: 'Starting...', pct: 0 });
      // jsPDF would be loaded via CDN — placeholder flow
      await new Promise(r => setTimeout(r, 400));
      setProgress(p => ({ ...p, pct: 100, step: 'Done!' }));
      await new Promise(r => setTimeout(r, 300));
      setProgress(p => ({ ...p, show: false }));
      showToast('PDF downloaded successfully');
    }
  }, [exportType, exportCSV, d.periodLabel, showToast]);

  const relevant = typeFilter === 'all' ? TYPE_META : TYPE_META.filter(t => t.key === typeFilter);

  return (
    <AppShell
      variant="admin"
      active="reports"
      title="Statistics & Reports"
      subtitle="FR-11 · FR-12 · FR-13 — Parcel stats, revenue analytics, PDF export"
      back={{ href: "/admin/dashboard", label: "Back to Dashboard" }}
      counts={{ users: 5 }}
      actions={
        <>
          <button type="button" className="icon-btn" aria-label="Notifications, 5 new">
            <Bell aria-hidden="true" />
            <span className="dot-count" aria-hidden="true">5</span>
          </button>
          <span className="topbar-divider hide-sm" aria-hidden="true" />
          <span className="user-chip hide-sm"><span className="avatar" aria-hidden="true">A</span>Super Admin</span>
        </>
      }
    >
      {/* Load jsPDF for PDF export */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" />

      {/* Page header */}
      <section className="page-intro">
        <div>
          <h2>Statistics &amp; Reports</h2>
          <p>Wednesday, 11 March 2026</p>
        </div>
        <div className="page-intro-actions">
          <button type="button" className="btn btn-secondary" onClick={() => openExport('csv')}>
            <FileSpreadsheet aria-hidden="true" />
            Export CSV
          </button>
          <button type="button" className="btn btn-primary" onClick={() => openExport('pdf')}>
            <FileDown aria-hidden="true" />
            Export PDF
          </button>
        </div>
      </section>

      {/* Filter bar */}
      <div className="adm-toolbar" role="group" aria-label="Report filters">
        <span className="adm-toolbar-label">Period</span>
        <div className="segmented">
          {['day','week','month','year'].map(p => (
            <button type="button" key={p} className={period === p ? 'is-active' : ''} aria-pressed={period === p} onClick={() => setPeriodState(p)}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        <label className="adm-toolbar-label" htmlFor="rep-type" style={{ marginLeft: 8 }}>Type</label>
        <select id="rep-type" className="select select--sm" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="parcels">Parcels</option>
          <option value="letters">Letters</option>
          <option value="express">Express</option>
          <option value="registered">Registered</option>
        </select>
        <div className="row rep-dates">
          <input type="date" className="input input--sm" aria-label="From date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <span className="muted">–</span>
          <input type="date" className="input input--sm" aria-label="To date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </div>
        <span style={{ flex: 1 }} />
        <span className="tag"><CalendarDays aria-hidden="true" />{d.periodLabel}</span>
      </div>

      {/* KPI row */}
      <section className="stat-strip stat-strip--5 mb-20" aria-label="Key figures">
        <KpiCard iconCls="ic-muted"     icon={Package}     trend="12%" target={d.total}         label="Total Parcels" />
        <KpiCard iconCls="ic-delivered" icon={CircleCheck} trend="8%"  target={d.delivered}     label="Delivered" />
        <KpiCard iconCls="ic-transit"   icon={Truck}       trend="5%"  target={d.transit}       label="In Transit" />
        <KpiCard iconCls="ic-muted"     icon={Banknote}    trend="18%" target={d.revenue_total} prefix="฿" label="Revenue (฿)" />
        <KpiCard iconCls="ic-muted"     icon={TrendingUp}  trend="3%"  target={d.avg}           prefix="฿" label="Avg. Fee (฿)" />
      </section>

      {/* FR-11: Bar chart + Type breakdown */}
      <div className="grid-main mb-20">
        <section className="panel">
          <PanelHead icon={ChartColumn} title="Parcel Volume by Type" subtitle={d.chartSub}>
            <span className="tag">{d.periodLabel}</span>
          </PanelHead>
          <div className="panel-body">
            <BarChart d={d} typeFilter={typeFilter} />
            <div className="legend">
              {['parcels','letters','express','registered'].map(k => (
                <span className="legend-item" key={k}>
                  <span className="legend-swatch" style={{ background: TYPE_COLOR[k] }} aria-hidden="true" />
                  {k.charAt(0).toUpperCase() + k.slice(1)}
                </span>
              ))}
            </div>
          </div>
        </section>
        <section className="panel">
          <PanelHead icon={ChartPie} title="Type Breakdown" subtitle="Share of total volume" />
          <div className="panel-body">
            <TypeBreakdown d={d} typeFilter={typeFilter} />
          </div>
        </section>
      </div>

      {/* FR-12: Revenue chart + Revenue by type table */}
      <div className="grid-main mb-20">
        <section className="panel">
          <PanelHead icon={ChartLine} title="Revenue Report" subtitle={`Daily revenue — ${d.periodLabel.toLowerCase()}`}>
            <span className="tag">{d.periodLabel}</span>
          </PanelHead>
          <div className="panel-body">
            <RevChart d={d} />
          </div>
        </section>
        <section className="panel">
          <PanelHead icon={Table2} title="Revenue by Type" subtitle="Breakdown this period" />
          <div className="table-wrap">
            <table className="table table--compact">
              <thead>
                <tr><th scope="col">Type</th><th scope="col" className="t-right">Parcels</th><th scope="col" className="t-right">Revenue</th><th scope="col" className="t-right">Avg. Fee</th></tr>
              </thead>
              <tbody>
                {relevant.map(t => {
                  const cnt = d[t.key].reduce((s, v) => s + v, 0);
                  const rev = cnt * AVG_FEE[t.key];
                  return (
                    <tr key={t.key}>
                      <td><span className="row" style={{ gap: 8 }}><span className="legend-swatch" style={{ background: t.color }} aria-hidden="true" />{t.label}</span></td>
                      <td className="t-right num">{cnt}</td>
                      <td className="t-right num cell-main">฿{rev.toLocaleString()}</td>
                      <td className="t-right num">฿{AVG_FEE[t.key]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Summary + Top routes */}
      <div className="grid-2">
        <section className="panel">
          <PanelHead icon={ClipboardList} title="Period Summary" subtitle="Key metrics at a glance" />
          <div className="panel-body">
            <dl className="rep-summary">
              <div><dt>Delivery Rate</dt><dd className="num">{d.rate}</dd><span>of all shipments delivered</span></div>
              <div><dt>Return Rate</dt><dd className="num">{d.ret}</dd><span>returned / failed</span></div>
              <div><dt>Peak Day</dt><dd>{d.peakDay}</dd><span>highest volume day</span></div>
              <div><dt>Total Collected</dt><dd className="num">{d.collected}</dd><span>all payment methods</span></div>
            </dl>
          </div>
        </section>
        <section className="panel">
          <PanelHead icon={Route} title="Top Routes" subtitle="Most active origin → destination" />
          <ol className="list">
            {TOP_ROUTES.map((r, i) => (
              <li key={r.name} className="list-row">
                <span className="rep-rank num">{i + 1}</span>
                <div className="grow">
                  <div className="cell-main">{r.name}</div>
                  <div className="cell-sub">{r.sub}</div>
                </div>
                <span className="num cell-main">{r.count}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* ── FR-13: Export Modal ── */}
      {exportModal && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setExportModal(false); }}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="export-title">
            <div className="modal-head">
              <div className="modal-icon"><FileText aria-hidden="true" /></div>
              <div>
                <h2 id="export-title">{exportType === 'pdf' ? 'Export PDF Report' : 'Export CSV Data'}</h2>
                <p>Choose sections to include in the report</p>
              </div>
              <button type="button" className="icon-btn modal-close" onClick={closeExportModal} aria-label="Close"><X aria-hidden="true" /></button>
            </div>
            <div className="modal-body">
              <div className="label" style={{ marginBottom: 8 }}>Include sections</div>
              <div className="stack-sm" style={{ gap: 8 }}>
                {[
                  { key:'stats',   icon:ChartColumn,   title:'Parcel Statistics',  sub:'Volume by type, period totals, delivery rates' },
                  { key:'revenue', icon:Banknote,      title:'Revenue Report',     sub:'Daily revenue, totals by type, average fees' },
                  { key:'routes',  icon:Route,         title:'Top Routes',         sub:'Most active origin-destination pairs' },
                  { key:'summary', icon:ClipboardList, title:'Period Summary',     sub:'Delivery rate, return rate, peak day' },
                ].map(opt => (
                  <label key={opt.key} className="rep-export-opt">
                    <input type="checkbox" checked={exportChecks[opt.key]} onChange={e => setExportChecks(c => ({ ...c, [opt.key]: e.target.checked }))} />
                    <span className="list-icon"><opt.icon aria-hidden="true" /></span>
                    <span className="grow"><span className="cell-main" style={{ display: 'block' }}>{opt.title}</span><span className="cell-sub">{opt.sub}</span></span>
                  </label>
                ))}
              </div>
              <div className="field" style={{ marginTop: 16 }}>
                <label className="label" htmlFor="export-period">Report period</label>
                <select id="export-period" className="select" value={exportPeriodSel} onChange={e => setExportPeriodSel(e.target.value)}>
                  <option>This Week (4–10 Mar 2026)</option>
                  <option>This Month (Mar 2026)</option>
                  <option>Last Month (Feb 2026)</option>
                  <option>Custom date range</option>
                </select>
              </div>
            </div>
            <div className="modal-foot">
              <button type="button" className="btn btn-secondary" onClick={closeExportModal}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={runExport}>
                <Download aria-hidden="true" />
                {exportType === 'pdf' ? 'Generate PDF' : 'Download CSV'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress modal */}
      {progress.show && (
        <div className="modal-backdrop">
          <div className="modal modal--sm" role="dialog" aria-modal="true" aria-labelledby="progress-title">
            <div className="modal-center">
              <div className="modal-icon"><FileText aria-hidden="true" /></div>
              <h2 id="progress-title" style={{ fontSize: 17 }}>{progress.title}</h2>
              <p>{progress.step}</p>
              <div className="bar-track" style={{ margin: '16px 0 8px' }} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.pct}>
                <div className="bar-fill" style={{ width: `${progress.pct}%`, transition: 'width .3s ease' }} />
              </div>
              <p className="num" style={{ fontSize: 'var(--fs-sm)' }}>{progress.pct}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`toast toast--success${toast.show ? ' show' : ''}`} role="status" aria-live="polite">
        <Check aria-hidden="true" />
        <span>{toast.msg}</span>
      </div>
    </AppShell>
  );
}

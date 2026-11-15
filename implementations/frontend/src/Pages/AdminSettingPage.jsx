import { Fragment, useState, useCallback } from "react";
import {
  Check, Settings, User, ShieldCheck, Users, Bell, Server, TriangleAlert, Building2, Tag,
  Languages, Clock3, Banknote, Package, Lock, KeyRound, Search, HardDrive, Trash2, RotateCcw,
  CircleCheck,
} from "lucide-react";
import AppShell from "../components/AppShell";
import { Field, Control, PanelHead } from "../components/ui";
import "./Admin.css";

// ════════════════════════════════════════════════
//  TOAST
// ════════════════════════════════════════════════
function Toast({ toast }) {
  return (
    <div className={`toast${toast.show ? " show" : ""}${toast.type === "success" ? " toast--success" : ""}`} role="status" aria-live="polite">
      <Check aria-hidden="true" strokeWidth={2.5} />
      <span>{toast.msg}</span>
    </div>
  );
}

// ════════════════════════════════════════════════
//  TOGGLE SWITCH
// ════════════════════════════════════════════════
function ToggleSwitch({ checked, onChange, label }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={onChange} aria-label={label} />
      <span className="switch-track" />
    </label>
  );
}

function ToggleRow({ title, desc, checked, onChange }) {
  return (
    <div className="setting-row">
      <div>
        <strong>{title}</strong>
        <span className="desc">{desc}</span>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

// ════════════════════════════════════════════════
//  SAVE BUTTON ROW
// ════════════════════════════════════════════════
function BtnRow({ label = "Save Changes", onSave, secondary, onSecondary }) {
  return (
    <div className="adm-btn-row">
      <button type="button" className="btn btn-primary" onClick={onSave}>
        <Check aria-hidden="true" />
        {label}
      </button>
      {secondary && <button type="button" className="btn btn-secondary" onClick={onSecondary}>{secondary}</button>}
    </div>
  );
}

// ════════════════════════════════════════════════
//  PANEL: General
// ════════════════════════════════════════════════
function PanelGeneral({ toast }) {
  const [gen, setGen] = useState({
    name:"Thailand Post Office", version:"v2.4.1", lang:"English",
    tz:"Asia/Bangkok (UTC+7)", currency:"THB — Thai Baht",
    maxShip:"500", banner:"System maintenance scheduled for Sunday 15 Mar 2026, 02:00–04:00 AM.",
  });
  const [price, setPrice] = useState({
    parcel:"85", letter:"18", weight:"15", insurance:"35", cod:"30", priority:"60",
  });
  const s = k => e => setGen(p=>({...p,[k]:e.target.value}));
  const sp = k => e => setPrice(p=>({...p,[k]:e.target.value}));

  return (
    <>
      {/* System Config */}
      <section className="panel">
        <PanelHead icon={Building2} title="System Configuration" subtitle="Core postal system settings" />
        <div className="panel-body">
          <div className="form-grid">
            <Field id="g-name" label="System Name" required>
              <Control icon={Building2}><input id="g-name" className="input" type="text" value={gen.name} onChange={s("name")} /></Control>
            </Field>
            <Field id="g-version" label="System Version">
              <Control icon={Tag}><input id="g-version" className="input mono" type="text" value={gen.version} readOnly /></Control>
            </Field>
            <Field id="g-lang" label="Default Language">
              <Control icon={Languages}>
                <select id="g-lang" className="select" value={gen.lang} onChange={s("lang")}>
                  <option>English</option><option>Thai (ภาษาไทย)</option>
                </select>
              </Control>
            </Field>
            <Field id="g-tz" label="Timezone">
              <Control icon={Clock3}>
                <select id="g-tz" className="select" value={gen.tz} onChange={s("tz")}>
                  <option>Asia/Bangkok (UTC+7)</option><option>UTC</option>
                </select>
              </Control>
            </Field>
            <Field id="g-currency" label="Currency">
              <Control icon={Banknote}>
                <select id="g-currency" className="select" value={gen.currency} onChange={s("currency")}>
                  <option>THB — Thai Baht</option><option>USD — US Dollar</option>
                </select>
              </Control>
            </Field>
            <Field id="g-max" label="Max Shipments Per Day">
              <Control icon={Package}><input id="g-max" className="input" type="number" value={gen.maxShip} onChange={s("maxShip")} /></Control>
            </Field>
            <Field id="g-banner" label="System Announcement Banner" className="span-2" hint="Leave blank to disable the banner.">
              <textarea id="g-banner" className="textarea" placeholder="Enter a message to display…" value={gen.banner} onChange={s("banner")} />
            </Field>
          </div>
          <BtnRow label="Save Changes" onSave={() => toast("General settings saved successfully.", "success")} secondary="Reset" />
        </div>
      </section>

      {/* Pricing */}
      <section className="panel">
        <PanelHead icon={Banknote} title="Pricing Configuration" subtitle="Base fees and surcharge rules" />
        <div className="panel-body">
          <div className="form-grid">
            {[["parcel","Base Parcel Fee (THB)"],["letter","Base Letter Fee (THB)"],
              ["weight","Weight Surcharge (THB/kg over 1kg)"],["insurance","Insurance Add-on (THB)"],
              ["cod","COD Surcharge (THB)"],["priority","Priority Service Surcharge (THB)"]].map(([k,lbl])=>(
              <Field id={`price-${k}`} label={lbl} key={k}>
                <input id={`price-${k}`} className="input" type="number" value={price[k]} onChange={sp(k)} />
              </Field>
            ))}
          </div>
          <BtnRow label="Save Pricing" onSave={() => toast("Pricing settings saved.", "success")} secondary="Reset to Defaults" />
        </div>
      </section>
    </>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Admin Profile
// ════════════════════════════════════════════════
function PanelProfile({ toast }) {
  const [p, setP] = useState({ name:"Admin User", username:"admin_001", email:"admin@post.th", phone:"+66 2 123 4567", role:"Super Admin", dept:"Operations & IT" });
  const s = k => e => setP(prev=>({...prev,[k]:e.target.value}));
  return (
    <section className="panel">
      <PanelHead icon={User} title="Admin Profile" subtitle="Update your admin account details" />
      <div className="panel-body">
        <div className="adm-profile">
          <span className="avatar avatar--lg" style={{ background: "var(--ink)", color: "#fff" }} aria-hidden="true">A</span>
          <div>
            <div className="adm-profile-name">Admin User</div>
            <div className="muted" style={{ fontSize: "var(--fs-sm)" }}>admin_001 · Super Admin</div>
            <div className="row" style={{ marginTop: 8, gap: 8 }}>
              <span className="tag tag--outline">Super Admin</span>
              <span className="tag"><CircleCheck className="ic-delivered" aria-hidden="true" />Active</span>
            </div>
          </div>
        </div>
        <div className="form-grid">
          {[["name","Full Name","text",true],["username","Username","text",false],["email","Email Address","email",true],["phone","Phone","tel",false]].map(([k,lbl,type,req])=>(
            <Field id={`ap-${k}`} label={lbl} required={req} key={k}>
              <input id={`ap-${k}`} className="input" type={type} value={p[k]} onChange={s(k)} />
            </Field>
          ))}
          <Field id="ap-role" label="Role">
            <select id="ap-role" className="select" value={p.role} onChange={s("role")}>
              <option>Super Admin</option><option>Admin</option><option>Moderator</option>
            </select>
          </Field>
          <Field id="ap-dept" label="Department">
            <input id="ap-dept" className="input" type="text" value={p.dept} onChange={s("dept")} />
          </Field>
        </div>
        <BtnRow label="Save Profile" onSave={() => toast("Profile updated successfully.", "success")} secondary="Discard" />
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Security
// ════════════════════════════════════════════════
function PanelSecurity({ toast }) {
  const [sec, setSec] = useState({ tfa:true, timeout:true, ipWhitelist:false, auditLog:true });
  const toggle = k => () => setSec(p=>({...p,[k]:!p[k]}));
  return (
    <>
      <section className="panel">
        <PanelHead icon={Lock} title="Change Password" subtitle="Update your admin login credentials" />
        <div className="panel-body">
          <div className="form-grid">
            <Field id="as-cur" label="Current Password" required className="span-2">
              <input id="as-cur" className="input" type="password" placeholder="Enter current password" autoComplete="current-password" />
            </Field>
            <Field id="as-new" label="New Password" required>
              <input id="as-new" className="input" type="password" placeholder="Min 8 characters" autoComplete="new-password" />
            </Field>
            <Field id="as-confirm" label="Confirm New Password" required>
              <input id="as-confirm" className="input" type="password" placeholder="Repeat new password" autoComplete="new-password" />
            </Field>
          </div>
          <BtnRow label="Update Password" onSave={() => toast("Password changed successfully.", "success")} />
        </div>
      </section>
      <section className="panel">
        <PanelHead icon={ShieldCheck} title="Security Settings" subtitle="Login and access control" />
        <div className="panel-body">
          <ToggleRow title="Two-Factor Authentication (2FA)" desc="Require OTP on every admin login"                              checked={sec.tfa}         onChange={toggle("tfa")} />
          <ToggleRow title="Session Timeout"                  desc="Auto-logout after 30 minutes of inactivity"                   checked={sec.timeout}     onChange={toggle("timeout")} />
          <ToggleRow title="Login IP Whitelist"               desc="Restrict admin access to approved IP addresses only"          checked={sec.ipWhitelist} onChange={toggle("ipWhitelist")} />
          <ToggleRow title="Audit Log"                        desc="Log all admin actions for security review"                     checked={sec.auditLog}    onChange={toggle("auditLog")} />
          <BtnRow label="Save Settings" onSave={() => toast("Security settings saved.", "success")} />
        </div>
      </section>
    </>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Roles & Permissions
// ════════════════════════════════════════════════
const PERM_DATA = [
  { section:"Dashboard & Reports", perms:[
    { label:"View Dashboard",  sa:true,  admin:true,  mod:true  },
    { label:"View Reports",    sa:true,  admin:true,  mod:false },
    { label:"Export Reports",  sa:true,  admin:true,  mod:false },
  ]},
  { section:"User Management", perms:[
    { label:"View Users",             sa:true, admin:true,  mod:true  },
    { label:"Approve / Reject Users", sa:true, admin:true,  mod:false },
    { label:"Delete Users",           sa:true, admin:false, mod:false },
  ]},
  { section:"System", perms:[
    { label:"Access Settings",    sa:true, admin:false, mod:false },
    { label:"Manage Pricing",     sa:true, admin:false, mod:false },
    { label:"System Maintenance", sa:true, admin:false, mod:false },
  ]},
];

function PanelRoles({ toast }) {
  const [perms, setPerms] = useState(
    PERM_DATA.flatMap(g => g.perms).reduce((acc, p) => {
      acc[p.label] = { admin: p.admin, mod: p.mod };
      return acc;
    }, {})
  );
  const toggle = (lbl, role) => () => setPerms(p => ({ ...p, [lbl]: { ...p[lbl], [role]: !p[lbl][role] } }));

  return (
    <section className="panel">
      <PanelHead icon={KeyRound} title="Roles & Permissions" subtitle="Control what each admin role can access" />
      <div className="table-wrap">
        <table className="table adm-perm-table">
          <thead>
            <tr>
              <th scope="col">Permission</th>
              <th scope="col" className="t-center">Super Admin</th>
              <th scope="col" className="t-center">Admin</th>
              <th scope="col" className="t-center">Moderator</th>
            </tr>
          </thead>
          <tbody>
            {PERM_DATA.map(({ section, perms: ps }) => (
              <Fragment key={section}>
                <tr className="adm-perm-section">
                  <th scope="colgroup" colSpan={4}>{section}</th>
                </tr>
                {ps.map(({ label }) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td className="t-center"><input type="checkbox" className="adm-perm-check" checked disabled aria-label={`${label}: Super Admin`} /></td>
                    <td className="t-center"><input type="checkbox" className="adm-perm-check" checked={perms[label]?.admin ?? false} onChange={toggle(label,"admin")} aria-label={`${label}: Admin`} /></td>
                    <td className="t-center"><input type="checkbox" className="adm-perm-check" checked={perms[label]?.mod ?? false} onChange={toggle(label,"mod")} aria-label={`${label}: Moderator`} /></td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="panel-foot">
        <button type="button" className="btn btn-primary" onClick={() => toast("Permissions updated.", "success")}>
          <Check aria-hidden="true" />
          Save Permissions
        </button>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Notifications
// ════════════════════════════════════════════════
function PanelNotifications({ toast }) {
  const [n, setN] = useState({ reg:true, payment:true, volume:true, errors:true, daily:false, login:true });
  const t = k => () => setN(p=>({...p,[k]:!p[k]}));
  return (
    <section className="panel">
      <PanelHead icon={Bell} title="Notification Preferences" subtitle="Choose what alerts admins receive" />
      <div className="panel-body">
        <ToggleRow title="New User Registration"  desc="Alert when a new user registers and needs approval"               checked={n.reg}     onChange={t("reg")} />
        <ToggleRow title="Failed Payment Alert"   desc="Notify on payment failures or disputed transactions"              checked={n.payment} onChange={t("payment")} />
        <ToggleRow title="High Shipment Volume"   desc="Alert when daily shipments exceed the configured limit"           checked={n.volume}  onChange={t("volume")} />
        <ToggleRow title="System Error Alerts"    desc="Immediate notification on critical system errors"                 checked={n.errors}  onChange={t("errors")} />
        <ToggleRow title="Daily Summary Email"    desc="Receive a daily digest of shipments, revenue and activity"        checked={n.daily}   onChange={t("daily")} />
        <ToggleRow title="Security Login Alerts"  desc="Email on new admin login from unrecognised device or IP"          checked={n.login}   onChange={t("login")} />
        <BtnRow label="Save Preferences" onSave={() => toast("Notification preferences saved.", "success")} />
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════
//  PANEL: System Info
// ════════════════════════════════════════════════
function PanelSystem({ toast }) {
  const rows = [
    { k:"System Status",           v:<span className="kv-val adm-ok"><span className="tone-dot tone-dot--delivered" aria-hidden="true" />Online — All systems operational</span> },
    { k:"Application Version",     v:"v2.4.1 (build 20260311)" },
    { k:"Database",                v:<span className="kv-val adm-ok"><span className="tone-dot tone-dot--delivered" aria-hidden="true" />Connected — MySQL 8.0.35</span> },
    { k:"Server Uptime",           v:"14 days, 6 hours, 42 minutes" },
    { k:"Server Environment",      v:"Production · Ubuntu 22.04 LTS" },
    { k:"Last Backup",             v:"Today, 03:00 AM — Successful" },
    { k:"Storage Used",            v:<span className="kv-val adm-storage"><span className="bar-track" aria-hidden="true"><span className="bar-fill" style={{ width: "68%", display: "block", background: "#c98a12" }} /></span>68% of 500 GB</span> },
    { k:"Active Admin Sessions",   v:"3" },
    { k:"Total Users",             v:"1,248" },
    { k:"Total Shipments (All Time)", v:"28,741" },
  ];
  return (
    <section className="panel">
      <PanelHead icon={Server} title="System Information" subtitle="Server status and diagnostics" />
      <div className="panel-body">
        <div className="kv">
          {rows.map(({ k, v }) => (
            <div className="kv-row" key={k}>
              <span className="kv-key">{k}</span>
              {typeof v === "string" ? <span className="kv-val num">{v}</span> : v}
            </div>
          ))}
        </div>
      </div>
      <div className="panel-foot" style={{ justifyContent: "flex-start" }}>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => toast("Running diagnostics…")}><Search aria-hidden="true" />Run Diagnostics</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => toast("Backup initiated.", "success")}><HardDrive aria-hidden="true" />Manual Backup</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => toast("Cache cleared.", "success")}><Trash2 aria-hidden="true" />Clear Cache</button>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Danger Zone
// ════════════════════════════════════════════════
function PanelDanger({ toast }) {
  const zones = [
    { icon:Trash2,    title:"Clear All Shipment History", desc:"Permanently deletes all shipment records from the database. This action cannot be undone. All tracking data, labels and payment records will be lost.", btn:"Clear Shipment Data" },
    { icon:Users,     title:"Reset All User Accounts",    desc:"Removes all user accounts and resets the user database to factory state. All user data, shipment history and payment records will be permanently deleted.", btn:"Reset User Database" },
    { icon:RotateCcw, title:"Full System Reset",           desc:"Resets the entire system to its default factory configuration. Every piece of data — users, shipments, settings, logs — will be wiped. This cannot be undone.", btn:"Factory Reset System" },
  ];
  return (
    <section className="panel panel--danger">
      <PanelHead icon={TriangleAlert} title="Danger Zone" subtitle="Irreversible system actions — proceed with caution" />
      <div className="panel-body">
        {zones.map(({ icon: Icon, title, desc, btn }) => (
          <div className="danger-row" key={title}>
            <div className="row" style={{ alignItems: "flex-start" }}>
              <span className="list-icon" style={{ background: "var(--danger-bg)", color: "var(--danger)" }}><Icon aria-hidden="true" /></span>
              <div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            </div>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => toast("Action cancelled — confirmation required.")}>
              {btn}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════
//  NAV ITEMS CONFIG
// ════════════════════════════════════════════════
const NAV_ITEMS = [
  { id:"general",       label:"General",             icon:Settings },
  { id:"profile",       label:"Admin Profile",       icon:User },
  { id:"security",      label:"Security",            icon:ShieldCheck },
  { divider: true },
  { id:"roles",         label:"Roles & Permissions", icon:Users },
  { id:"notifications", label:"Notifications",       icon:Bell },
  { id:"system",        label:"System Info",         icon:Server },
  { divider: true },
  { id:"danger",        label:"Danger Zone",         icon:TriangleAlert, danger:true },
];

// ════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════
export default function AdminSettingPage() {
  const [activePanel, setActivePanel] = useState("general");
  const [toastState,  setToastState]  = useState({ show:false, msg:"", type:"" });

  const showToast = useCallback((msg, type = "") => {
    setToastState({ show:true, msg, type });
    setTimeout(() => setToastState(t => ({ ...t, show:false })), 3000);
  }, []);

  const panels = {
    general:       <PanelGeneral       toast={showToast} />,
    profile:       <PanelProfile       toast={showToast} />,
    security:      <PanelSecurity      toast={showToast} />,
    roles:         <PanelRoles         toast={showToast} />,
    notifications: <PanelNotifications toast={showToast} />,
    system:        <PanelSystem        toast={showToast} />,
    danger:        <PanelDanger        toast={showToast} />,
  };

  return (
    <AppShell
      variant="admin"
      active="settings"
      title="System Settings"
      subtitle="Manage admin configuration, roles & preferences"
      counts={{ users: 5 }}
      actions={
        <>
          <button type="button" className="icon-btn" aria-label="Notifications, 3 new">
            <Bell aria-hidden="true" />
            <span className="dot-count" aria-hidden="true">3</span>
          </button>
          <span className="topbar-divider hide-sm" aria-hidden="true" />
          <span className="user-chip hide-sm"><span className="avatar" aria-hidden="true">A</span>Admin User</span>
        </>
      }
    >
      {/* Page header */}
      <section className="page-intro">
        <div>
          <h2>Admin Settings</h2>
          <p>System configuration · Access control · Preferences</p>
        </div>
      </section>

      {/* Settings layout */}
      <div className="settings-layout">

        {/* Side nav */}
        <nav className="settings-nav" aria-label="Settings sections">
          <div className="settings-nav-head"><h2>Settings Menu</h2></div>
          {NAV_ITEMS.map((item, i) =>
            item.divider
              ? <div key={i} className="settings-nav-sep" role="separator" />
              : (
                <button
                  type="button"
                  key={item.id}
                  className={item.danger ? "is-danger" : ""}
                  aria-current={activePanel === item.id ? "page" : undefined}
                  onClick={() => setActivePanel(item.id)}
                >
                  <item.icon aria-hidden="true" />
                  {item.label}
                </button>
              )
          )}
        </nav>

        {/* Active panel */}
        <div className="stack">
          {panels[activePanel]}
        </div>

      </div>

      <Toast toast={toastState} />
    </AppShell>
  );
}

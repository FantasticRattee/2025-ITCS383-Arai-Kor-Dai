import { useState } from "react";
import {
  User, Lock, Bell, MapPin, Palette, Globe, TriangleAlert, Camera, Building2, KeyRound,
  Smartphone, Mail, Phone, Laptop, Monitor, CircleCheck, House, Users, Plus, Radio,
  CalendarDays, Check, Download,
} from "lucide-react";
import AppShell, { initials } from "../components/AppShell";
import { Field, PanelHead } from "../components/ui";
import "./SettingPage.css";

// ════════════════════════════════════════════════
//  REUSABLE: Toggle Switch
// ════════════════════════════════════════════════
function Toggle({ checked, onChange, label }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={onChange} aria-label={label} />
      <span className="switch-track" />
    </label>
  );
}

// ════════════════════════════════════════════════
//  REUSABLE: Save Row
// ════════════════════════════════════════════════
function SaveRow({ msgId, label = "Save Changes", onSave }) {
  const [msg, setMsg] = useState("");
  function handleSave() {
    setMsg("Changes saved successfully!");
    if (onSave) onSave();
    setTimeout(() => setMsg(""), 3000);
  }
  return (
    <div className="set-save-row">
      <span className="field-ok" aria-live="polite">{msg && <><CircleCheck aria-hidden="true" />{msg}</>}</span>
      <button type="button" className="btn btn-primary" onClick={handleSave}>{label}</button>
    </div>
  );
}

// ════════════════════════════════════════════════
//  REUSABLE: Toggle Row
// ════════════════════════════════════════════════
function ToggleRow({ title, desc, checked, onChange }) {
  return (
    <div className="setting-row">
      <div>
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

// Simple labelled input bound to a state setter
function TextField({ id, label, className, ...input }) {
  return (
    <Field id={id} label={label} className={className}>
      <input id={id} className="input" {...input} />
    </Field>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Profile
// ════════════════════════════════════════════════
function ProfilePanel() {
  const [profile, setProfile] = useState({
    firstName: "Somchai", lastName: "Jaidee",
    email: "somchai@email.com", phone: "+66 81 234 5678",
    dob: "1990-04-15", idNum: "", bio: "",
    company: "", taxId: "", bizAddress: "",
  });
  const set = (k) => (e) => setProfile(p => ({ ...p, [k]: e.target.value }));

  return (
    <>
      {/* Profile Info */}
      <section className="panel">
        <PanelHead icon={User} title="Profile Information" subtitle="Update your personal details" />
        <div className="panel-body">
          <div className="set-avatar-row">
            <div className="set-avatar">
              <span className="avatar avatar--xl avatar--brand" aria-hidden="true">S</span>
              <span className="set-avatar-overlay" aria-hidden="true"><Camera /></span>
            </div>
            <div>
              <h3 className="set-avatar-name">Somchai Jaidee</h3>
              <p className="muted">somchai@email.com · Member since Jan 2023</p>
              <div className="row" style={{ marginTop: 10, gap: 8 }}>
                <button type="button" className="btn btn-secondary btn-sm">Upload Photo</button>
                <button type="button" className="btn btn-ghost btn-sm">Remove</button>
              </div>
            </div>
          </div>

          <hr className="divider" style={{ margin: "20px 0" }} />

          <div className="form-grid">
            <TextField id="p-first" label="First Name" type="text" value={profile.firstName} onChange={set("firstName")} />
            <TextField id="p-last" label="Last Name" type="text" value={profile.lastName} onChange={set("lastName")} />
            <TextField id="p-email" label="Email Address" type="email" value={profile.email} onChange={set("email")} />
            <TextField id="p-phone" label="Phone Number" type="tel" value={profile.phone} onChange={set("phone")} />
            <TextField id="p-dob" label="Date of Birth" type="date" value={profile.dob} onChange={set("dob")} />
            <TextField id="p-idnum" label="ID / Passport Number" type="text" placeholder="National ID or passport" value={profile.idNum} onChange={set("idNum")} />
            <Field id="p-bio" label="Bio / Notes" className="span-2">
              <textarea id="p-bio" className="textarea" placeholder="Add a short note about yourself…" value={profile.bio} onChange={set("bio")} />
            </Field>
          </div>
          <SaveRow label="Save Changes" />
        </div>
      </section>

      {/* Business Details */}
      <section className="panel">
        <PanelHead icon={Building2} title="Business Details" subtitle="Optional business information" />
        <div className="panel-body">
          <div className="form-grid">
            <TextField id="b-company" label="Company Name" type="text" placeholder="Your company (optional)" value={profile.company} onChange={set("company")} />
            <TextField id="b-tax" label="Tax ID" type="text" placeholder="Thai VAT / Tax ID" value={profile.taxId} onChange={set("taxId")} />
            <TextField id="b-addr" label="Business Address" className="span-2" type="text" placeholder="Full business address" value={profile.bizAddress} onChange={set("bizAddress")} />
          </div>
          <SaveRow label="Save Details" />
        </div>
      </section>
    </>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Security
// ════════════════════════════════════════════════
function SecurityPanel() {
  const [newPass, setNewPass] = useState("");
  const [strength, setStrength] = useState({ width: 0, color: "#FFD0D0", label: "" });

  function handlePassChange(e) {
    const v = e.target.value;
    setNewPass(v);
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    const colors = ["#FFD0D0","#ef4444","#f97316","#eab308","#16a34a"];
    const labels = ["","Weak","Fair","Good","Strong"];
    setStrength({ width: [0,25,50,75,100][score], color: colors[score] || "#FFD0D0", label: score > 0 ? labels[score] : "" });
  }

  const verified = <span className="tag"><CircleCheck className="ic-delivered" aria-hidden="true" />Verified</span>;

  return (
    <>
      {/* Security Overview */}
      <section className="panel">
        <PanelHead icon={Lock} title="Security Overview" subtitle="Your account protection status" />
        <ul className="list">
          {[
            { icon: KeyRound,   title: "Password",                  sub: "Last changed 45 days ago",               action: <button type="button" className="btn btn-secondary btn-sm">Change</button> },
            { icon: Smartphone, title: "Two-Factor Authentication", sub: "Adds an extra layer of security via SMS", action: <span className="tag tag--outline">Off</span> },
            { icon: Mail,       title: "Email Verified",            sub: "somchai@email.com",                      action: verified },
            { icon: Phone,      title: "Phone Verified",            sub: "+66 81 234 5678",                        action: verified },
          ].map(({ icon: Icon, title, sub, action }) => (
            <li className="list-row" key={title}>
              <span className="list-icon"><Icon aria-hidden="true" /></span>
              <div className="grow"><div className="cell-main">{title}</div><div className="cell-sub">{sub}</div></div>
              {action}
            </li>
          ))}
        </ul>
      </section>

      {/* Change Password */}
      <section className="panel">
        <PanelHead icon={KeyRound} title="Change Password" subtitle="Choose a strong, unique password" />
        <div className="panel-body">
          <div className="form-grid">
            <TextField id="s-cur" label="Current Password" className="span-2" type="password" placeholder="Enter current password" autoComplete="current-password" />
            <TextField id="s-new" label="New Password" type="password" placeholder="Minimum 8 characters" autoComplete="new-password" value={newPass} onChange={handlePassChange} />
            <TextField id="s-confirm" label="Confirm New Password" type="password" placeholder="Repeat new password" autoComplete="new-password" />
          </div>
          <div className="set-strength">
            <div className="row-between">
              <span className="eyebrow">Password Strength</span>
              <span className="set-strength-label" aria-live="polite">{strength.label}</span>
            </div>
            <div className="bar-track" style={{ marginTop: 8 }}>
              <div className="bar-fill" style={{ width: `${strength.width}%`, background: strength.color }} />
            </div>
          </div>
          <SaveRow label="Update Password" />
        </div>
      </section>

      {/* Active Sessions */}
      <section className="panel">
        <PanelHead icon={Monitor} title="Active Sessions" subtitle="Devices currently signed in" />
        <ul className="list">
          {[
            { icon: Laptop,     title: <>Chrome · Windows 11 <span className="tag set-current-tag">Current</span></>, sub: "Bangkok, Thailand · Active now", action: null },
            { icon: Smartphone, title: "Safari · iPhone 15",  sub: "Bangkok, Thailand · 2 days ago",   action: <button type="button" className="btn btn-danger btn-sm">Revoke</button> },
            { icon: Laptop,     title: "Firefox · macOS",     sub: "Chiang Mai, Thailand · 5 days ago", action: <button type="button" className="btn btn-danger btn-sm">Revoke</button> },
          ].map(({ icon: Icon, title, sub, action }, i) => (
            <li className="list-row" key={i}>
              <span className="list-icon"><Icon aria-hidden="true" /></span>
              <div className="grow"><div className="cell-main">{title}</div><div className="cell-sub">{sub}</div></div>
              {action}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Notifications
// ════════════════════════════════════════════════
function NotificationsPanel() {
  const [toggles, setToggles] = useState({
    dispatched: true, transit: true, outForDelivery: true, delivered: true, failedDelivery: false,
    paymentDue: true, paymentReceived: true, invoice: false,
    newServices: true, promotions: false,
    email: true, sms: true, push: false, line: false,
  });
  const toggle = (k) => () => setToggles(p => ({ ...p, [k]: !p[k] }));

  return (
    <>
      <section className="panel">
        <PanelHead icon={Bell} title="Notification Preferences" subtitle="Choose what you want to hear about" />
        <div className="panel-body">
          <div className="subhead">Shipment Updates</div>
          <ToggleRow title="Parcel Dispatched"       desc="When your shipment leaves the post office"       checked={toggles.dispatched}      onChange={toggle("dispatched")} />
          <ToggleRow title="In Transit Updates"      desc="Location changes and sorting hub arrivals"       checked={toggles.transit}         onChange={toggle("transit")} />
          <ToggleRow title="Out for Delivery"        desc="When your parcel is with the delivery agent"     checked={toggles.outForDelivery}  onChange={toggle("outForDelivery")} />
          <ToggleRow title="Delivery Confirmed"      desc="When your parcel is successfully delivered"      checked={toggles.delivered}       onChange={toggle("delivered")} />
          <ToggleRow title="Failed Delivery Attempt" desc="When the delivery agent cannot reach you"        checked={toggles.failedDelivery}  onChange={toggle("failedDelivery")} />

          <div className="subhead">Payments &amp; Billing</div>
          <ToggleRow title="Payment Due Reminder"    desc="Reminder before your payment deadline"           checked={toggles.paymentDue}      onChange={toggle("paymentDue")} />
          <ToggleRow title="Payment Received"        desc="Confirmation when payment is processed"          checked={toggles.paymentReceived} onChange={toggle("paymentReceived")} />
          <ToggleRow title="Invoice Available"       desc="When a new invoice is generated"                 checked={toggles.invoice}         onChange={toggle("invoice")} />

          <div className="subhead">Promotions &amp; News</div>
          <ToggleRow title="New Services & Features" desc="Updates about new post office services"          checked={toggles.newServices}     onChange={toggle("newServices")} />
          <ToggleRow title="Discount & Promotions"   desc="Special offers and seasonal deals"               checked={toggles.promotions}      onChange={toggle("promotions")} />
        </div>
      </section>

      <section className="panel">
        <PanelHead icon={Radio} title="Delivery Channels" subtitle="How you receive notifications" />
        <div className="panel-body">
          <ToggleRow title="Email Notifications" desc="Sent to somchai@email.com"     checked={toggles.email} onChange={toggle("email")} />
          <ToggleRow title="SMS Notifications"   desc="Sent to +66 81 234 5678"       checked={toggles.sms}   onChange={toggle("sms")} />
          <ToggleRow title="Push Notifications"  desc="Browser and mobile app alerts" checked={toggles.push}  onChange={toggle("push")} />
          <ToggleRow title="LINE Notifications"  desc="Connect LINE account to receive updates" checked={toggles.line} onChange={toggle("line")} />
          <SaveRow label="Save Preferences" />
        </div>
      </section>
    </>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Addresses
// ════════════════════════════════════════════════
function AddressesPanel() {
  const [showForm, setShowForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "", recipient: "", phone: "", province: "Bangkok", street: "", district: "", postal: "" });
  const set = (k) => (e) => setNewAddr(p => ({ ...p, [k]: e.target.value }));

  return (
    <>
      <section className="panel">
        <PanelHead icon={MapPin} title="Saved Addresses" subtitle="Manage your delivery addresses">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForm(s => !s)} aria-expanded={showForm}>
            <Plus aria-hidden="true" /> Add New
          </button>
        </PanelHead>
        <div className="panel-body">
          <ul className="set-addresses">
            <li className="set-address is-default">
              <span className="list-icon"><House aria-hidden="true" /></span>
              <div className="grow">
                <h4>Home <span className="tag tag--brand">Default</span></h4>
                <p>123/45 Sukhumvit Soi 11, Khlong Toei Nuea,<br />Watthana, Bangkok 10110</p>
              </div>
              <div className="set-address-actions">
                <button type="button" className="btn btn-secondary btn-sm">Edit</button>
                <button type="button" className="btn btn-danger btn-sm">Delete</button>
              </div>
            </li>
            <li className="set-address">
              <span className="list-icon"><Building2 aria-hidden="true" /></span>
              <div className="grow">
                <h4>Office</h4>
                <p>888 Silom Complex Tower, 18th Floor,<br />Bang Rak, Bangkok 10500</p>
              </div>
              <div className="set-address-actions">
                <button type="button" className="btn btn-ghost btn-sm">Set Default</button>
                <button type="button" className="btn btn-secondary btn-sm">Edit</button>
                <button type="button" className="btn btn-danger btn-sm">Delete</button>
              </div>
            </li>
            <li className="set-address">
              <span className="list-icon"><Users aria-hidden="true" /></span>
              <div className="grow">
                <h4>Family (Chiang Mai)</h4>
                <p>56 Nimmanhaemin Soi 7,<br />Chiang Mai 50200</p>
              </div>
              <div className="set-address-actions">
                <button type="button" className="btn btn-ghost btn-sm">Set Default</button>
                <button type="button" className="btn btn-secondary btn-sm">Edit</button>
                <button type="button" className="btn btn-danger btn-sm">Delete</button>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {showForm && (
        <section className="panel fade-up">
          <PanelHead icon={Plus} title="Add New Address" subtitle="Save a new delivery location" />
          <div className="panel-body">
            <div className="form-grid">
              <TextField id="a-label" label="Address Label" type="text" placeholder="e.g. Home, Office, Parents…" value={newAddr.label} onChange={set("label")} />
              <TextField id="a-recipient" label="Recipient Name" type="text" placeholder="Full name" value={newAddr.recipient} onChange={set("recipient")} />
              <TextField id="a-phone" label="Phone" type="tel" placeholder="+66 XX XXX XXXX" value={newAddr.phone} onChange={set("phone")} />
              <Field id="a-province" label="Province">
                <select id="a-province" className="select" value={newAddr.province} onChange={set("province")}>
                  {["Bangkok","Chiang Mai","Phuket","Khon Kaen","Hat Yai","Other"].map(p => <option key={p}>{p}</option>)}
                </select>
              </Field>
              <TextField id="a-street" label="Street Address" className="span-2" type="text" placeholder="House number, road, sub-district" value={newAddr.street} onChange={set("street")} />
              <TextField id="a-district" label="District" type="text" placeholder="District / Amphoe" value={newAddr.district} onChange={set("district")} />
              <TextField id="a-postal" label="Postal Code" type="text" inputMode="numeric" placeholder="5-digit code" value={newAddr.postal} onChange={set("postal")} />
            </div>
            <div className="set-save-row">
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={() => setShowForm(false)}>Save Address</button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Appearance
// ════════════════════════════════════════════════
function AppearancePanel() {
  const [theme, setTheme] = useState("ts-red");
  const [display, setDisplay] = useState({ compact: false, animations: true, showBalance: true, fontSize: "Medium (Default)" });
  const toggleD = (k) => () => setDisplay(p => ({ ...p, [k]: !p[k] }));

  const themes = [
    { cls: "ts-red",    label: "Thai Red", swatch: ["#c8102e", "#f3f5f7"] },
    { cls: "ts-dark",   label: "Midnight", swatch: ["#14181e", "#3d4651"] },
    { cls: "ts-ocean",  label: "Ocean",    swatch: ["#1d5bb8", "#e9f1fd"] },
    { cls: "ts-forest", label: "Forest",   swatch: ["#17703f", "#e7f5ed"] },
  ];

  return (
    <>
      <section className="panel">
        <PanelHead icon={Palette} title="Theme" subtitle="Choose your colour scheme" />
        <div className="panel-body">
          <div className="choice-grid set-themes" role="radiogroup" aria-label="Theme">
            {themes.map(t => (
              <label key={t.cls} className={`choice set-theme${theme === t.cls ? " is-selected" : ""}`}>
                <input type="radio" name="theme" checked={theme === t.cls} onChange={() => setTheme(t.cls)} />
                <span className="choice-check" aria-hidden="true">{theme === t.cls && <Check strokeWidth={3} />}</span>
                <span className="set-swatch" aria-hidden="true" style={{ background: `linear-gradient(90deg, ${t.swatch[0]} 0 55%, ${t.swatch[1]} 55% 100%)` }} />
                <span className="choice-title">{t.label}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <PanelHead icon={Monitor} title="Display" subtitle="Interface appearance options" />
        <div className="panel-body">
          <ToggleRow title="Compact Mode"                desc="Reduce spacing for a denser layout"          checked={display.compact}      onChange={toggleD("compact")} />
          <ToggleRow title="Animations"                  desc="Enable page transitions and hover effects"    checked={display.animations}   onChange={toggleD("animations")} />
          <ToggleRow title="Show Balance on Dashboard"   desc="Display your account balance by default"      checked={display.showBalance}  onChange={toggleD("showBalance")} />
          <div style={{ marginTop: 16, maxWidth: 320 }}>
            <Field id="ap-font" label="Font Size">
              <select id="ap-font" className="select" value={display.fontSize} onChange={e => setDisplay(p => ({ ...p, fontSize: e.target.value }))}>
                <option>Small</option>
                <option>Medium (Default)</option>
                <option>Large</option>
              </select>
            </Field>
          </div>
          <SaveRow label="Save Appearance" />
        </div>
      </section>
    </>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Language & Region
// ════════════════════════════════════════════════
function LanguagePanel() {
  const [lang, setLang] = useState("th");
  const [region, setRegion] = useState({ date: "DD/MM/YYYY", time: "24-hour", tz: "Asia/Bangkok (UTC+7)", currency: "Thai Baht (฿)", weight: "Kilograms (kg)", distance: "Kilometers (km)" });
  const setR = (k) => (e) => setRegion(p => ({ ...p, [k]: e.target.value }));

  const langs = [
    { code: "th", text: "ภาษาไทย" },
    { code: "en", text: "English"  },
    { code: "zh", text: "中文"     },
    { code: "ja", text: "日本語"   },
  ];

  const selects = [
    ["r-date", "Date Format", "date", ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]],
    ["r-time", "Time Format", "time", ["12-hour (AM/PM)", "24-hour"]],
    ["r-tz", "Timezone", "tz", ["Asia/Bangkok (UTC+7)", "Asia/Singapore (UTC+8)", "UTC"]],
    ["r-currency", "Currency Display", "currency", ["Thai Baht (฿)", "US Dollar ($)", "Euro (€)"]],
    ["r-weight", "Weight Unit", "weight", ["Kilograms (kg)", "Pounds (lbs)"]],
    ["r-distance", "Distance Unit", "distance", ["Kilometers (km)", "Miles (mi)"]],
  ];

  return (
    <>
      <section className="panel">
        <PanelHead icon={Globe} title="Language" subtitle="Select your preferred language" />
        <div className="panel-body">
          <div className="choice-grid set-langs" role="radiogroup" aria-label="Language">
            {langs.map(l => (
              <label key={l.code} className={`choice set-lang${lang === l.code ? " is-selected" : ""}`}>
                <input type="radio" name="lang" checked={lang === l.code} onChange={() => setLang(l.code)} />
                <span className="set-lang-code mono" aria-hidden="true">{l.code.toUpperCase()}</span>
                <span className="choice-title" lang={l.code}>{l.text}</span>
                <span className="choice-check" aria-hidden="true">{lang === l.code && <Check strokeWidth={3} />}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <PanelHead icon={CalendarDays} title="Regional Settings" subtitle="Date, time, and currency preferences" />
        <div className="panel-body">
          <div className="form-grid">
            {selects.map(([id, label, key, options]) => (
              <Field id={id} label={label} key={id}>
                <select id={id} className="select" value={region[key]} onChange={setR(key)}>
                  {options.map(o => <option key={o}>{o}</option>)}
                </select>
              </Field>
            ))}
          </div>
          <SaveRow label="Save Settings" />
        </div>
      </section>
    </>
  );
}

// ════════════════════════════════════════════════
//  PANEL: Danger Zone
// ════════════════════════════════════════════════
function DangerPanel({ onDelete }) {
  return (
    <section className="panel panel--danger">
      <PanelHead icon={TriangleAlert} title="Danger Zone" />
      <div className="panel-body">
        <div className="danger-row">
          <div>
            <h4>Export My Data</h4>
            <p>Download all your shipment history and account data as a CSV file</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm"><Download aria-hidden="true" />Export</button>
        </div>
        <div className="danger-row">
          <div>
            <h4>Deactivate Account</h4>
            <p>Temporarily disable your account. You can reactivate at any time.</p>
          </div>
          <button type="button" className="btn btn-danger btn-sm">Deactivate</button>
        </div>
        <div className="danger-row">
          <div>
            <h4 style={{ color: "var(--danger)" }}>Delete Account</h4>
            <p>Permanently delete your account and all associated data. This cannot be undone.</p>
          </div>
          <button type="button" className="btn btn-danger-solid btn-sm" onClick={onDelete}>
            Delete Account
          </button>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════
//  DELETE CONFIRM MODAL
// ════════════════════════════════════════════════
function DeleteModal({ onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal modal--sm" role="alertdialog" aria-modal="true" aria-labelledby="del-title" aria-describedby="del-desc">
        <div className="modal-center">
          <div className="modal-icon modal-icon--danger"><TriangleAlert aria-hidden="true" /></div>
          <h2 id="del-title">Delete Account?</h2>
          <p id="del-desc">
            This will permanently delete your account and all shipment data. This action <strong>cannot</strong> be undone.
          </p>
        </div>
        <div className="modal-foot">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-danger-solid" onClick={onClose}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════
const NAV_ITEMS = [
  { id: "profile",      icon: User,          label: "Profile"          },
  { id: "security",     icon: Lock,          label: "Security"         },
  { id: "notifications",icon: Bell,          label: "Notifications"    },
  { id: "addresses",    icon: MapPin,        label: "Saved Addresses"  },
  { divider: true },
  { id: "appearance",   icon: Palette,       label: "Appearance"       },
  { id: "language",     icon: Globe,         label: "Language & Region"},
  { divider: true },
  { id: "danger",       icon: TriangleAlert, label: "Danger Zone", danger: true },
];

export default function SettingPage() {
  const [activePanel, setActivePanel] = useState("profile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const panels = {
    profile:       <ProfilePanel />,
    security:      <SecurityPanel />,
    notifications: <NotificationsPanel />,
    addresses:     <AddressesPanel />,
    appearance:    <AppearancePanel />,
    language:      <LanguagePanel />,
    danger:        <DangerPanel onDelete={() => setShowDeleteModal(true)} />,
  };

  let storedName = "";
  try { storedName = localStorage.getItem("userName") || ""; } catch (_) {}

  return (
    <AppShell
      active="settings"
      title="Settings"
      subtitle="Manage your account preferences"
      actions={
        <>
          <button type="button" className="icon-btn" aria-label="Notifications (new)">
            <Bell aria-hidden="true" />
            <span className="set-bell-dot" aria-hidden="true" />
          </button>
          <span className="avatar avatar--brand hide-sm" aria-hidden="true">{storedName ? initials(storedName) : "S"}</span>
        </>
      }
    >
      <div className="settings-layout">

        {/* Settings nav */}
        <nav className="settings-nav" aria-label="Settings sections">
          <div className="settings-nav-head">
            <h2>Preferences</h2>
            <p>Account &amp; app settings</p>
          </div>
          {NAV_ITEMS.map((item, i) =>
            item.divider
              ? <div key={i} className="settings-nav-sep" role="separator" />
              : (
                <button
                  type="button"
                  key={item.id}
                  className={item.danger ? "is-danger" : ""}
                  aria-current={activePanel === item.id ? "page" : undefined}
                  onClick={() => { setActivePanel(item.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
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

      {/* Delete modal */}
      {showDeleteModal && <DeleteModal onClose={() => setShowDeleteModal(false)} />}
    </AppShell>
  );
}

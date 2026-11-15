import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Phone, MapPin, Hash, ClipboardList, Banknote, Map as MapIcon, Package, Mail, Zap, Stamp,
  GlassWater, Snowflake, ArrowUpFromLine, Layers, Droplets, CreditCard, Printer, Save, Check,
  PartyPopper,
} from "lucide-react";
import AppShell from "../components/AppShell";
import { Field, Control } from "../components/ui";
import "./CreateShipmentPage.css";

// ─── Province data ────────────────────────────────────────────────────────────
const PROVINCE_GROUPS = [
  { label: "── Bangkok Metropolitan", provinces: ["Bangkok","Nonthaburi","Pathum Thani","Samut Prakan","Nakhon Pathom","Samut Sakhon"] },
  { label: "── Central Region", provinces: ["Phra Nakhon Si Ayutthaya","Saraburi","Ang Thong","Sing Buri","Lopburi","Chai Nat","Suphan Buri","Ratchaburi","Kanchanaburi","Samut Songkhram","Phetchaburi","Prachuap Khiri Khan","Nakhon Sawan","Uthai Thani","Kamphaeng Phet"] },
  { label: "── Eastern Region", provinces: ["Chonburi","Rayong","Chanthaburi","Trat","Nakhon Nayok","Prachin Buri","Sa Kaeo","Chachoengsao"] },
  { label: "── Northern Region", provinces: ["Chiang Mai","Chiang Rai","Lampang","Lamphun","Mae Hong Son","Nan","Phayao","Phrae","Uttaradit","Sukhothai","Phitsanulok","Phichit","Phetchabun","Tak"] },
  { label: "── Northeastern Region", provinces: ["Nakhon Ratchasima","Khon Kaen","Udon Thani","Buriram","Surin","Si Sa Ket","Ubon Ratchathani","Yasothon","Roi Et","Maha Sarakham","Kalasin","Sakon Nakhon","Nakhon Phanom","Mukdahan","Amnat Charoen","Nong Khai","Bueng Kan","Nong Bua Lam Phu","Loei","Chaiyaphum"] },
  { label: "── Southern Region", provinces: ["Chumphon","Ranong","Surat Thani","Nakhon Si Thammarat","Krabi","Phang Nga","Phuket","Trang","Phatthalung","Songkhla","Satun","Pattani","Yala","Narathiwat"] },
];

const CLUSTER = {
  Bangkok:0,Nonthaburi:0,"Pathum Thani":0,"Samut Prakan":0,"Nakhon Pathom":0,"Samut Sakhon":0,
  "Phra Nakhon Si Ayutthaya":1,Saraburi:1,"Ang Thong":1,"Sing Buri":1,Lopburi:1,"Chai Nat":1,
  "Suphan Buri":1,Ratchaburi:1,Kanchanaburi:1,"Samut Songkhram":1,Phetchaburi:1,"Prachuap Khiri Khan":1,
  "Nakhon Sawan":1,"Uthai Thani":1,"Kamphaeng Phet":1,Chachoengsao:1,"Nakhon Nayok":1,"Prachin Buri":1,
  Chonburi:1,Rayong:1,"Sa Kaeo":1,Chanthaburi:1,Trat:1,
  Tak:2,Sukhothai:2,Phitsanulok:2,Phichit:2,Phetchabun:2,Uttaradit:2,Lampang:2,Lamphun:2,
  Phrae:2,Phayao:2,"Chiang Mai":2,"Chiang Rai":2,Nan:2,"Mae Hong Son":2,
  "Nakhon Ratchasima":3,Chaiyaphum:3,Buriram:3,Surin:3,"Si Sa Ket":3,"Ubon Ratchathani":3,
  Yasothon:3,"Amnat Charoen":3,"Maha Sarakham":3,"Roi Et":3,Kalasin:3,"Khon Kaen":3,
  "Udon Thani":3,Loei:3,"Nong Bua Lam Phu":3,"Sakon Nakhon":3,"Nakhon Phanom":3,
  Mukdahan:3,"Nong Khai":3,"Bueng Kan":3,
  Chumphon:4,Ranong:4,"Surat Thani":4,"Phang Nga":4,Phuket:4,Krabi:4,
  "Nakhon Si Thammarat":4,Phatthalung:4,Trang:4,
  Songkhla:5,Satun:5,Pattani:5,Yala:5,Narathiwat:5,
};
const CB = [
  [ 0, 18, 62, 58, 68, 88],
  [18,  0, 47, 42, 52, 72],
  [62, 47,  0, 57, 77, 97],
  [58, 42, 57,  0, 72, 92],
  [68, 52, 77, 72,  0, 28],
  [88, 72, 97, 92, 28,  0],
];
const RANK = {};
[
  ["Bangkok","Nonthaburi","Pathum Thani","Samut Prakan","Nakhon Pathom","Samut Sakhon"],
  ["Phra Nakhon Si Ayutthaya","Chachoengsao","Chonburi","Nakhon Nayok","Saraburi","Ang Thong","Sing Buri","Lopburi","Prachin Buri","Chai Nat","Suphan Buri","Ratchaburi","Rayong","Samut Songkhram","Kanchanaburi","Phetchaburi","Sa Kaeo","Nakhon Sawan","Uthai Thani","Prachuap Khiri Khan","Chanthaburi","Kamphaeng Phet","Trat"],
  ["Phitsanulok","Phichit","Tak","Sukhothai","Phetchabun","Uttaradit","Lamphun","Lampang","Chiang Mai","Phrae","Phayao","Nan","Chiang Rai","Mae Hong Son"],
  ["Nakhon Ratchasima","Chaiyaphum","Khon Kaen","Buriram","Maha Sarakham","Surin","Yasothon","Roi Et","Kalasin","Si Sa Ket","Ubon Ratchathani","Amnat Charoen","Loei","Nong Bua Lam Phu","Udon Thani","Nong Khai","Mukdahan","Sakon Nakhon","Bueng Kan","Nakhon Phanom"],
  ["Chumphon","Ranong","Surat Thani","Nakhon Si Thammarat","Phang Nga","Phuket","Phatthalung","Trang","Krabi"],
  ["Songkhla","Satun","Pattani","Yala","Narathiwat"],
].forEach(cluster => cluster.forEach((p, i) => { RANK[p] = i; }));

// ─── Postal code → Province auto-fill (prefix-based) ─────────────────────────
const PREFIX_TO_PROVINCE = {
  "10":"Bangkok","11":"Nonthaburi","12":"Pathum Thani",
  "13":"Phra Nakhon Si Ayutthaya","14":"Ang Thong","15":"Lopburi",
  "16":"Sing Buri","17":"Chai Nat","18":"Saraburi",
  "20":"Chonburi","21":"Rayong","22":"Chanthaburi","23":"Trat",
  "24":"Chachoengsao","25":"Prachin Buri","26":"Nakhon Nayok","27":"Sa Kaeo",
  "30":"Nakhon Ratchasima","31":"Buriram","32":"Surin","33":"Si Sa Ket",
  "34":"Ubon Ratchathani","35":"Yasothon","36":"Chaiyaphum","37":"Amnat Charoen",
  "38":"Bueng Kan","39":"Nong Bua Lam Phu",
  "40":"Khon Kaen","41":"Udon Thani","42":"Loei","43":"Nong Khai",
  "44":"Maha Sarakham","45":"Roi Et","46":"Kalasin","47":"Sakon Nakhon",
  "48":"Nakhon Phanom","49":"Mukdahan",
  "50":"Chiang Mai","51":"Lamphun","52":"Lampang","53":"Uttaradit",
  "54":"Phrae","55":"Nan","56":"Phayao","57":"Chiang Rai","58":"Mae Hong Son",
  "60":"Nakhon Sawan","61":"Uthai Thani","62":"Kamphaeng Phet","63":"Tak",
  "64":"Sukhothai","65":"Phitsanulok","66":"Phichit","67":"Phetchabun",
  "70":"Ratchaburi","71":"Kanchanaburi","72":"Suphan Buri","73":"Nakhon Pathom",
  "74":"Samut Sakhon","75":"Samut Songkhram","76":"Phetchaburi","77":"Prachuap Khiri Khan",
  "80":"Nakhon Si Thammarat","81":"Krabi","82":"Phang Nga","83":"Phuket",
  "84":"Surat Thani","85":"Ranong","86":"Chumphon",
  "90":"Songkhla","91":"Satun","92":"Trang","93":"Phatthalung",
  "94":"Pattani","95":"Yala","96":"Narathiwat",
};

function lookupProvince(zip) {
  if (!zip || zip.length !== 5) return null;
  return PREFIX_TO_PROVINCE[zip.substring(0, 2)] || null;
}

function routeKey(a, b) { return [a, b].sort().join("|||"); }
const ROUTE_PRICE = (() => {
  const map = {};
  const all = PROVINCE_GROUPS.flatMap(g => g.provinces);
  for (let i = 0; i < all.length; i++) {
    for (let j = i; j < all.length; j++) {
      const a = all[i], b = all[j];
      if (a === b) { map[routeKey(a, b)] = 0; continue; }
      const ca = CLUSTER[a] ?? 0, cb2 = CLUSTER[b] ?? 0;
      const base = CB[ca][cb2];
      const ra = RANK[a] ?? 0, rb = RANK[b] ?? 0;
      const offset = (ra * 5 + rb * 11 + (ra ^ rb) * 3) % 31;
      map[routeKey(a, b)] = base + offset;
    }
  }
  return map;
})();

function getRoutePrice(from, to) {
  if (!from || !to) return null;
  if (from === to) return 0;
  return ROUTE_PRICE[routeKey(from, to)] ?? null;
}

function generateTrackId() {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const r = String(Math.floor(Math.random() * 999) + 1).padStart(3, "0");
  return `PO-${d}${r}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const ProvinceSelect = ({ id, value, onChange, hasError }) => (
  <Control icon={MapIcon}>
    <select
      id={id}
      className="select"
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-invalid={hasError || undefined}
      aria-describedby={hasError ? `${id}-error` : undefined}
    >
      <option value="">Select province</option>
      {PROVINCE_GROUPS.map(g => (
        <optgroup key={g.label} label={g.label}>
          {g.provinces.map(p => <option key={p}>{p}</option>)}
        </optgroup>
      ))}
    </select>
  </Control>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const PKG_TYPES = [
  { type: "Parcel", price: "from ฿85", base: 85 },
  { type: "Letter", price: "from ฿18", base: 18 },
  { type: "Express", price: "from ฿210", base: 210 },
  { type: "Registered", price: "from ฿120", base: 120 },
];
const PKG_ICONS = { Parcel: Package, Letter: Mail, Express: Zap, Registered: Stamp };
const SERVICES = [
  { label: "Standard (3–5 days)", fee: 0 },
  { label: "Priority (2 days)", fee: 60 },
  { label: "Same Day", fee: 120 },
];
// Values are kept exactly as before (they are passed on to payment as "handling");
// the leading emoji is only stripped for display and replaced with an icon.
const CHIPS = ["🔴 Fragile", "❄️ Keep Cold", "☝️ This Side Up", "🚫 No Stack", "💧 Keep Dry"];
const CHIP_ICONS = [GlassWater, Snowflake, ArrowUpFromLine, Layers, Droplets];
const chipLabel = (chip) => chip.replace(/^\S+\s+/, "");

const EMPTY_FORM = {
  sname: "", sphone: "", saddr: "", sprov: "", szip: "",
  rname: "", rphone: "", raddr: "", rprov: "", rzip: "", rnotes: "",
  weight: "", plen: "", pwid: "", phei: "",
  contents: "", declval: "", insurance: false,
};
const REQUIRED_FIELDS = ["sname","sphone","saddr","sprov","szip","rname","rphone","raddr","rprov","rzip","weight","contents"];

export default function CreateShipmentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [pkgIdx, setPkgIdx] = useState(0);
  const [svcIdx, setSvcIdx] = useState(0);
  const [chips, setChips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [trackId] = useState(generateTrackId);

  const pkgBase = PKG_TYPES[pkgIdx].base;
  const svcFee = SERVICES[svcIdx].fee;

  const summary = useMemo(() => {
    const weight = parseFloat(form.weight) || 0;
    const wSurcharge = weight > 1 ? Math.round((weight - 1) * 15) : 0;
    const insFee = form.insurance ? 35 : 0;
    const routePrice = getRoutePrice(form.sprov, form.rprov);
    const destFee = routePrice ?? 0;
    const destKnown = routePrice !== null && form.sprov !== "" && form.rprov !== "";
    const total = pkgBase + svcFee + wSurcharge + destFee + insFee;
    let zoneColor = "#e65100";
    if (destKnown && form.sprov !== form.rprov) {
      zoneColor = destFee <= 25 ? "#2e7d32" : destFee <= 60 ? "#f57f17" : "#E60012";
    }
    return { weight, wSurcharge, insFee, destFee, destKnown, total, zoneColor };
  }, [form.weight, form.sprov, form.rprov, form.insurance, pkgBase, svcFee]);

  const [sAutoFilled, setSAutoFilled] = useState(false);
  const [rAutoFilled, setRAutoFilled] = useState(false);

  const set = useCallback((key, val) => {
    setForm(f => {
      const next = { ...f, [key]: val };
      // Auto-fill province when 5-digit zip is entered
      if (key === "szip" && val.length === 5) {
        const prov = lookupProvince(val);
        if (prov) { next.sprov = prov; setSAutoFilled(true); }
        else { setSAutoFilled(false); }
      } else if (key === "szip") { setSAutoFilled(false); }
      if (key === "rzip" && val.length === 5) {
        const prov = lookupProvince(val);
        if (prov) { next.rprov = prov; setRAutoFilled(true); }
        else { setRAutoFilled(false); }
      } else if (key === "rzip") { setRAutoFilled(false); }
      return next;
    });
  }, []);

  const toggleChip = (chip) =>
    setChips(cs => cs.includes(chip) ? cs.filter(c => c !== chip) : [...cs, chip]);

  const validate = () => {
    const newErrors = {};
    REQUIRED_FIELDS.forEach(k => { if (!form[k]?.toString().trim()) newErrors[k] = true; });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    const params = new URLSearchParams({
      trackId,
      total: `฿${summary.total}`,
      pkg: PKG_TYPES[pkgIdx].type,
      svc: SERVICES[svcIdx].label,
      sname: form.sname, sphone: form.sphone, saddr: form.saddr, sprov: form.sprov, szip: form.szip,
      rname: form.rname, rphone: form.rphone, raddr: form.raddr, rprov: form.rprov, rzip: form.rzip,
      weight: form.weight ? `${form.weight} kg` : "",
      dims: (form.plen && form.pwid && form.phei) ? `${form.plen}x${form.pwid}x${form.phei} cm` : "",
      contents: form.contents, declval: form.declval,
      insurance: form.insurance ? "Yes" : "No",
      handling: chips.join(", ") || "None",
    });
    setTimeout(() => {
      setLoading(false);
      navigate(`/payments?${params}`);
    }, 1000);
  };

  const handleReset = () => {
    setShowSuccess(false);
    setForm(EMPTY_FORM);
    setErrors({});
    setPkgIdx(0);
    setSvcIdx(0);
    setChips([]);
  };

  // Props shared by every text input: id, value binding, and error wiring.
  const bind = (key, extra = {}) => ({
    id: key,
    className: "input",
    value: form[key],
    onChange: e => set(key, e.target.value),
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
    ...extra,
  });

  return (
    <AppShell
      active="create"
      title="Create Shipment"
      subtitle="Fill in details to generate a new shipment label"
      back={{ href: "/dashboard", label: "Back" }}
      actions={
        <button type="button" className="btn btn-secondary btn-sm" aria-label="Save Draft">
          <Save aria-hidden="true" /><span className="hide-sm">Save Draft</span>
        </button>
      }
    >
      <div className="cs-grid">
        {/* ── Left column ── */}
        <div className="stack">

          {/* Sender */}
          <section className="panel" aria-labelledby="cs-sender">
            <div className="panel-head">
              <div className="panel-title">
                <span className="section-step" aria-hidden="true">1</span>
                <div><h2 id="cs-sender">Sender Information</h2><p>Who is sending this shipment?</p></div>
              </div>
            </div>
            <div className="panel-body">
              <div className="form-grid">
                <Field id="sname" label="Full Name" required error={errors.sname && "Sender name is required."}>
                  <Control icon={User}><input type="text" placeholder="Somchai Jaidee" autoComplete="name" {...bind("sname")} /></Control>
                </Field>
                <Field id="sphone" label="Phone" required error={errors.sphone && "Phone number required."}>
                  <Control icon={Phone}><input type="tel" placeholder="081-234-5678" autoComplete="tel" {...bind("sphone")} /></Control>
                </Field>
                <Field id="saddr" label="Street Address" required className="span-2" error={errors.saddr && "Address is required."}>
                  <Control icon={MapPin}><input type="text" placeholder="123 Sukhumvit Road, Khlong Toei" {...bind("saddr")} /></Control>
                </Field>
                <Field id="sprov" label="Province" required error={errors.sprov && "Province is required."}>
                  <ProvinceSelect id="sprov" value={form.sprov} onChange={v => set("sprov", v)} hasError={!!errors.sprov} />
                </Field>
                <Field
                  id="szip" label="Postal Code" required
                  error={errors.szip && "Postal code required."}
                  ok={sAutoFilled && `Province auto-filled: ${form.sprov}`}
                >
                  <Control icon={Hash} className={sAutoFilled ? "is-autofilled" : ""}>
                    <input type="text" inputMode="numeric" placeholder="10110" maxLength={5} {...bind("szip", { onChange: e => set("szip", e.target.value.replace(/\D/g, "")) })} />
                  </Control>
                </Field>
              </div>
            </div>
          </section>

          {/* Receiver */}
          <section className="panel" aria-labelledby="cs-receiver">
            <div className="panel-head">
              <div className="panel-title">
                <span className="section-step" aria-hidden="true">2</span>
                <div><h2 id="cs-receiver">Receiver Information</h2><p>Where is this shipment going?</p></div>
              </div>
            </div>
            <div className="panel-body">
              <div className="form-grid">
                <Field id="rname" label="Full Name" required error={errors.rname && "Receiver name is required."}>
                  <Control icon={User}><input type="text" placeholder="Nattapong Sriwan" {...bind("rname")} /></Control>
                </Field>
                <Field id="rphone" label="Phone" required error={errors.rphone && "Phone number required."}>
                  <Control icon={Phone}><input type="tel" placeholder="089-765-4321" {...bind("rphone")} /></Control>
                </Field>
                <Field id="raddr" label="Street Address" required className="span-2" error={errors.raddr && "Address is required."}>
                  <Control icon={MapPin}><input type="text" placeholder="45 Nimman Road, Suthep" {...bind("raddr")} /></Control>
                </Field>
                <Field id="rprov" label="Province" required error={errors.rprov && "Province is required."}>
                  <ProvinceSelect id="rprov" value={form.rprov} onChange={v => set("rprov", v)} hasError={!!errors.rprov} />
                </Field>
                <Field
                  id="rzip" label="Postal Code" required
                  error={errors.rzip && "Postal code required."}
                  ok={rAutoFilled && `Province auto-filled: ${form.rprov}`}
                >
                  <Control icon={Hash} className={rAutoFilled ? "is-autofilled" : ""}>
                    <input type="text" inputMode="numeric" placeholder="50200" maxLength={5} {...bind("rzip", { onChange: e => set("rzip", e.target.value.replace(/\D/g, "")) })} />
                  </Control>
                </Field>
                <Field id="rnotes" label="Delivery Notes" className="span-2">
                  <textarea id="rnotes" className="textarea" placeholder="Building name, landmark, special instructions…" rows={2} value={form.rnotes} onChange={e => set("rnotes", e.target.value)} />
                </Field>
              </div>
            </div>
          </section>

          {/* Package Details */}
          <section className="panel" aria-labelledby="cs-package">
            <div className="panel-head">
              <div className="panel-title">
                <span className="section-step" aria-hidden="true">3</span>
                <div><h2 id="cs-package">Package Details</h2><p>Type, size, weight &amp; service</p></div>
              </div>
            </div>
            <div className="panel-body">

              <div className="subhead" id="cs-pkg-type">Package Type</div>
              <div className="choice-grid cs-choices-4" role="radiogroup" aria-labelledby="cs-pkg-type">
                {PKG_TYPES.map((p, i) => {
                  const Icon = PKG_ICONS[p.type];
                  return (
                    <label key={p.type} className={`choice${pkgIdx === i ? " is-selected" : ""}`}>
                      <input type="radio" name="pkg-type" checked={pkgIdx === i} onChange={() => setPkgIdx(i)} />
                      <span className="choice-check" aria-hidden="true">{pkgIdx === i && <Check strokeWidth={3} />}</span>
                      <Icon className="choice-icon" aria-hidden="true" />
                      <span className="choice-title">{p.type}</span>
                      <span className="choice-sub num">{p.price}</span>
                    </label>
                  );
                })}
              </div>

              <div className="subhead" id="cs-service">Service Level</div>
              <div className="choice-grid cs-choices-3" role="radiogroup" aria-labelledby="cs-service">
                {SERVICES.map((s, i) => (
                  <label key={s.label} className={`choice choice--row${svcIdx === i ? " is-selected" : ""}`}>
                    <input type="radio" name="service" checked={svcIdx === i} onChange={() => setSvcIdx(i)} />
                    <span className="choice-check" aria-hidden="true">{svcIdx === i && <Check strokeWidth={3} />}</span>
                    <span className="choice-title">{s.label}</span>
                    <span className="choice-sub num">{s.fee ? `+฿${s.fee}` : "No surcharge"}</span>
                  </label>
                ))}
              </div>

              <div className="subhead">Dimensions &amp; Weight</div>
              <div className="form-grid-4">
                <Field id="weight" label="Weight (kg)" required error={errors.weight && "Required."}>
                  <input type="number" placeholder="1.5" min="0.1" step="0.1" {...bind("weight")} />
                </Field>
                <Field id="plen" label="Length (cm)">
                  <input type="number" placeholder="30" min="1" {...bind("plen")} />
                </Field>
                <Field id="pwid" label="Width (cm)">
                  <input type="number" placeholder="20" min="1" {...bind("pwid")} />
                </Field>
                <Field id="phei" label="Height (cm)">
                  <input type="number" placeholder="15" min="1" {...bind("phei")} />
                </Field>
              </div>

              <div className="subhead">Contents &amp; Handling</div>
              <div className="form-grid">
                <Field id="contents" label="Package Contents" required className="span-2" error={errors.contents && "Contents description required."}>
                  <Control icon={ClipboardList}><input type="text" placeholder="e.g. Clothing, Electronics, Documents…" {...bind("contents")} /></Control>
                </Field>
                <Field id="declval" label="Declared Value (฿)" className="span-2" hint="Used for insurance & customs purposes.">
                  <Control icon={Banknote}><input type="number" placeholder="500" min="0" {...bind("declval")} /></Control>
                </Field>
              </div>

              <div className="cs-handling">
                <span className="label" id="cs-handling-label">Special handling</span>
                <div className="chips" role="group" aria-labelledby="cs-handling-label">
                  {CHIPS.map((chip, i) => {
                    const Icon = CHIP_ICONS[i];
                    return (
                      <button
                        type="button"
                        key={chip}
                        className="chip"
                        aria-pressed={chips.includes(chip)}
                        onClick={() => toggleChip(chip)}
                      >
                        <Icon aria-hidden="true" />{chipLabel(chip)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="cs-insurance">
                <div>
                  <strong id="cs-ins-title">Add Insurance</strong>
                  <span>Covers up to declared value — +฿35</span>
                </div>
                <label className="switch">
                  <input type="checkbox" aria-labelledby="cs-ins-title" checked={form.insurance} onChange={e => set("insurance", e.target.checked)} />
                  <span className="switch-track" />
                </label>
              </div>
            </div>
          </section>
        </div>

        {/* ── Right column — Summary ── */}
        <aside className="cs-summary-wrap" aria-label="Shipment summary">
          <div className="panel cs-summary">
            <div className="panel-head">
              <div className="panel-title">
                <div><h2>Shipment Summary</h2><p>Live cost estimate</p></div>
              </div>
            </div>

            <div className="cs-label">
              <div className="eyebrow">Tracking ID (Auto-generated)</div>
              <div className="cs-label-id mono">{trackId}</div>
              <div className="cs-barcode" aria-hidden="true" />
            </div>

            <div className="panel-body cs-summary-body">
              <div className="cs-route">
                <div>
                  <span className="meta-label">From</span>
                  <span className="cs-route-val">{form.sprov || (form.sname ? form.sname.split(" ")[0] : "—")}</span>
                </div>
                <div className="cs-route-line" aria-hidden="true" />
                <div className="text-right">
                  <span className="meta-label">To</span>
                  <span className="cs-route-val">{form.rprov || (form.rname ? form.rname.split(" ")[0] : "—")}</span>
                </div>
              </div>

              <div className="kv kv--compact">
                <div className="kv-row"><span className="kv-key">Package</span><span className="kv-val">{PKG_TYPES[pkgIdx].type}</span></div>
                <div className="kv-row"><span className="kv-key">Service</span><span className="kv-val">{SERVICES[svcIdx].label.split("(")[0].trim()}</span></div>
                <div className="kv-row"><span className="kv-key">Weight</span><span className="kv-val num">{form.weight ? `${form.weight} kg` : "— kg"}</span></div>
                <div className="kv-row"><span className="kv-key">Base Fee</span><span className="kv-val num">฿{pkgBase}</span></div>
                <div className="kv-row"><span className="kv-key">Service Surcharge</span><span className="kv-val num">{svcFee ? `฿${svcFee}` : "฿0"}</span></div>
                <div className="kv-row"><span className="kv-key">Weight Surcharge</span><span className="kv-val num">{summary.wSurcharge ? `฿${summary.wSurcharge}` : "฿0"}</span></div>
                {summary.destKnown && (
                  <div className="kv-row">
                    <span className="kv-key">Route Fee</span>
                    <span className="kv-val num cs-zone">
                      <span className="tone-dot" style={{ background: summary.zoneColor }} aria-hidden="true" />
                      {form.sprov === form.rprov ? "฿0 — same province" : `฿${summary.destFee}`}
                    </span>
                  </div>
                )}
                <div className="kv-row"><span className="kv-key">Insurance</span><span className="kv-val num">{form.insurance ? "฿35" : "—"}</span></div>
              </div>

              <div className="cs-total">
                <span>Total</span>
                <span className="cs-total-amt num">฿{summary.total}</span>
              </div>

              <div className="stack-sm">
                <button type="button" className={`btn btn-primary btn-lg btn-block${loading ? " is-loading" : ""}`} onClick={handleSubmit} aria-busy={loading}>
                  {loading ? (
                    <><span className="spinner" aria-hidden="true" /><span className="sr-only">Processing</span></>
                  ) : (
                    <>
                      <span>Proceed to Payment</span>
                      <CreditCard aria-hidden="true" />
                    </>
                  )}
                </button>
                <button type="button" className="btn btn-secondary btn-block">
                  <Printer aria-hidden="true" />
                  Print Label Preview
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Success overlay */}
      {showSuccess && (
        <div className="modal-backdrop">
          <div className="modal modal--sm" role="dialog" aria-modal="true" aria-labelledby="cs-success-title">
            <div className="modal-center">
              <div className="modal-icon modal-icon--success"><PartyPopper aria-hidden="true" /></div>
              <h2 id="cs-success-title">Shipment Created!</h2>
              <p>Your shipment has been registered successfully. Use the tracking ID below to monitor its progress.</p>
              <div className="cs-success-id">
                <div className="eyebrow">Tracking ID</div>
                <div className="mono">{trackId}</div>
              </div>
            </div>
            <div className="modal-foot">
              <button type="button" className="btn btn-secondary" onClick={() => setShowSuccess(false)}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleReset}>New Shipment</button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

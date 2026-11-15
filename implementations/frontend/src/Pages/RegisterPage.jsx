import { useState, useRef } from "react";
import {
  Mail, User, CalendarDays, MapPin, Lock, ShieldCheck, Eye, EyeOff, IdCard, Camera, Lightbulb,
  CircleCheck, X, PackageSearch, Receipt, BellRing, ArrowRight, Upload,
} from "lucide-react";
import { Field, Control } from "../components/ui";
import "./RegisterPage.css";

const API = process.env.REACT_APP_API_URL || "https://two025-itcs383-arai-kor-dai-cyio.onrender.com/api";

// ════════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════════
function calcStrength(v) {
  if (!v) return { score: 0, label: "", color: "#ccc", bars: [] };
  let score = 0;
  if (v.length >= 8) score++;
  if (v.length >= 12) score++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  score = Math.min(score, 4);
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["#ccc", "#e53935", "#fb8c00", "#43a047", "#1b5e20"];
  const cls    = ["", "weak", "fair", "good", "strong"];
  return { score, label: labels[score] || "Too short", color: colors[score], barCls: cls[score] };
}

function formatDOB(v) {
  let d = v.replace(/\D/g, "").slice(0, 8);
  if (d.length >= 5) d = d.slice(0,2) + "/" + d.slice(2,4) + "/" + d.slice(4);
  else if (d.length >= 3) d = d.slice(0,2) + "/" + d.slice(2);
  return d;
}

function formatPhone(v) {
  let d = v.replace(/\D/g, "").slice(0, 10);
  if (d.length >= 7) d = d.slice(0,3) + " " + d.slice(3,6) + " " + d.slice(6);
  else if (d.length >= 4) d = d.slice(0,3) + " " + d.slice(3);
  return d;
}

// ════════════════════════════════════════════════
//  UPLOAD ZONE COMPONENT
// ════════════════════════════════════════════════
function UploadZone({ label, icon: Icon, sub, id, file, preview, error, onChange, onRemove }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef();

  function handleDrop(e) {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) onChange(f);
  }

  function openPicker() {
    if (!file) inputRef.current.click();
  }

  return (
    <div className="field">
      <span className="label" id={`${id}-label`}>
        {label}<span className="req" aria-hidden="true">*</span>
      </span>
      <div
        className={`reg-upload${drag ? " is-drag" : ""}${error ? " is-error" : ""}${file ? " is-done" : ""}`}
        role={file ? undefined : "button"}
        tabIndex={file ? undefined : 0}
        aria-labelledby={`${id}-label`}
        aria-describedby={error ? `${id}-error` : undefined}
        onClick={openPicker}
        onKeyDown={(e) => { if (!file && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openPicker(); } }}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: "none" }}
          tabIndex={-1}
          onChange={(e) => { if (e.target.files[0]) onChange(e.target.files[0]); }}
        />

        {!file ? (
          <div className="reg-upload-empty">
            <span className="list-icon"><Icon aria-hidden="true" /></span>
            <div>
              <div className="reg-upload-title">{label}</div>
              <div className="reg-upload-sub" dangerouslySetInnerHTML={{ __html: sub }} />
            </div>
            <span className="tag"><Upload aria-hidden="true" />Click or drag &amp; drop</span>
          </div>
        ) : (
          <div className="reg-upload-preview">
            <img src={preview} alt={`${label} preview`} />
            <div className="reg-upload-bar">
              <CircleCheck className="ic-delivered" aria-hidden="true" />
              <span className="reg-upload-name">{file.name}</span>
              <button
                type="button"
                className="control-btn"
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                title="Remove"
                aria-label={`Remove ${label}`}
              ><X aria-hidden="true" /></button>
            </div>
          </div>
        )}
      </div>
      {error && <p className="field-error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  );
}

// ════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════
export default function RegisterPage() {
  // Form state
  const [form, setForm] = useState({
    firstname: "", lastname: "", dob: "", gender: "",
    email: "", phone: "", address: "",
    password: "", confirm: "",
  });
  const [errors, setErrors]     = useState({});
  const [showPw, setShowPw]     = useState(false);
  const [showCf, setShowCf]     = useState(false);
  const [terms, setTerms]       = useState(false);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  // Upload state
  const [idFile,      setIdFile]      = useState(null);
  const [idPreview,   setIdPreview]   = useState("");
  const [selfieFile,  setSelfieFile]  = useState(null);
  const [selfiePreview, setSelfiePreview] = useState("");

  const strength = calcStrength(form.password);

  // ── Field change
  const setField = (k) => (e) => {
    let v = e.target.value;
    if (k === "dob")   v = formatDOB(v);
    if (k === "phone") v = formatPhone(v);
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: "" }));
  };

  // ── File handler
  function handleFile(file, setFile, setPreview, errKey) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrors(p => ({ ...p, [errKey]: "Only JPG, PNG, or WEBP images are accepted." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(p => ({ ...p, [errKey]: "File is too large. Maximum size is 5 MB." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    setFile(file);
    setErrors(p => ({ ...p, [errKey]: "" }));
  }

  // ── Validate
  function validate() {
    const errs = {};
    if (form.firstname.trim().length < 2) errs.firstname = "First name must be at least 2 characters.";
    if (form.lastname.trim().length < 2)  errs.lastname  = "Last name must be at least 2 characters.";
    if (form.dob && !/^\d{2}\/\d{2}\/\d{4}$/.test(form.dob)) errs.dob = "Please enter a valid date (DD/MM/YYYY).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Please enter a valid email address.";
    const phoneDigits = form.phone.replace(/\s/g, "");
    if (phoneDigits.length < 9 || phoneDigits.length > 10) errs.phone = "Please enter a valid Thai phone number (9–10 digits).";
    if (form.password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (form.confirm !== form.password) errs.confirm = "Passwords do not match.";
    if (!idFile)     errs.idcard  = "Please upload your National ID card photo.";
    if (!selfieFile) errs.selfie  = "Please upload a selfie holding your ID card.";
    if (!terms)      errs.terms   = "You must agree to the terms to continue.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Submit
  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch(`${API}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstname,
          lastName: form.lastname,
          email: form.email,
          password: form.password
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(p => ({ ...p, terms: data.error || "Registration failed" }));
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setErrors(p => ({ ...p, terms: "Network error: " + err.message }));
    } finally {
      setLoading(false);
    }
  }

  // Error wiring for an input
  const inv = (k) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `reg-${k}-error` : undefined,
  });

  // ── Success screen
  if (success) {
    return (
      <div className="auth">
        <div className="auth-card">
          <BrandPanel />
          <main className="auth-main">
            <div className="success-block" role="status">
              <div className="modal-icon modal-icon--success"><CircleCheck aria-hidden="true" /></div>
              <h2>Account Created!</h2>
              <p>Welcome to the Thai Post Office system.<br />Your account is ready to use.</p>
              <div className="reg-user-card">
                <span className="avatar avatar--lg avatar--brand" aria-hidden="true"><User /></span>
                <div>
                  <div className="cell-main">{form.firstname} {form.lastname}</div>
                  <div className="cell-sub">{form.email}</div>
                </div>
              </div>
              <a href="/login" className="btn btn-primary btn-lg">Go to Login <ArrowRight aria-hidden="true" /></a>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="auth">
      <div className="auth-card auth-card--wide">
        <BrandPanel />

        {/* ════ FORM PANEL ════ */}
        <main className="auth-main reg-main">
          <div className="auth-head">
            <h1>Create Account</h1>
            <p>Fill in your details below — all fields marked <span style={{ color: "var(--brand)", fontWeight: 700 }}>*</span> are required</p>
          </div>

          {/* PERSONAL INFO */}
          <div className="subhead">Personal Information</div>
          <div className="form-grid">
            <Field id="reg-firstname" label="First Name" required error={errors.firstname}>
              <Control icon={User}><input id="reg-firstname" className="input" type="text" autoComplete="given-name" placeholder="Somchai" value={form.firstname} onChange={setField("firstname")} {...inv("firstname")} /></Control>
            </Field>

            <Field id="reg-lastname" label="Last Name" required error={errors.lastname}>
              <Control icon={User}><input id="reg-lastname" className="input" type="text" autoComplete="family-name" placeholder="Jaidee" value={form.lastname} onChange={setField("lastname")} {...inv("lastname")} /></Control>
            </Field>

            <Field id="reg-dob" label="Date of Birth" required error={errors.dob}>
              <Control icon={CalendarDays}><input id="reg-dob" className="input" type="text" inputMode="numeric" placeholder="DD/MM/YYYY" maxLength={10} value={form.dob} onChange={setField("dob")} {...inv("dob")} /></Control>
            </Field>

            <Field id="reg-gender" label="Gender">
              <Control icon={User}>
                <select id="reg-gender" className="select" value={form.gender} onChange={setField("gender")}>
                  <option value="">Select gender</option>
                  <option>Male</option><option>Female</option>
                  <option>Non-binary</option><option>Prefer not to say</option>
                </select>
              </Control>
            </Field>
          </div>

          {/* CONTACT INFO */}
          <div className="subhead reg-subhead">Contact Information</div>
          <div className="form-grid">
            <Field id="reg-email" label="Email Address" required className="span-2" error={errors.email}>
              <Control icon={Mail}><input id="reg-email" className="input" type="email" autoComplete="email" placeholder="somchai@email.com" value={form.email} onChange={setField("email")} {...inv("email")} /></Control>
            </Field>

            <Field id="reg-phone" label="Phone Number" required className="span-2" error={errors.phone}>
              <Control leadText="+66"><input id="reg-phone" className="input num" type="text" inputMode="tel" autoComplete="tel-national" placeholder="8X XXX XXXX" maxLength={11} value={form.phone} onChange={setField("phone")} {...inv("phone")} /></Control>
            </Field>

            <Field id="reg-address" label="Address" className="span-2">
              <Control icon={MapPin}><input id="reg-address" className="input" type="text" autoComplete="street-address" placeholder="123 Silom Rd, Bang Rak, Bangkok" value={form.address} onChange={setField("address")} /></Control>
            </Field>
          </div>

          {/* ACCOUNT SECURITY */}
          <div className="subhead reg-subhead">Account Security</div>
          <div className="form-grid">
            {/* Password */}
            <Field id="reg-password" label="Password" required className="span-2" error={errors.password}>
              <Control
                icon={Lock}
                trail={
                  <button type="button" className="control-btn" onClick={() => setShowPw(s => !s)} aria-label={showPw ? "Hide password" : "Show password"} aria-pressed={showPw}>
                    {showPw ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                  </button>
                }
              >
                <input
                  id="reg-password"
                  className="input"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => { setField("password")(e); setErrors(p => ({ ...p, password: "" })); }}
                  {...inv("password")}
                />
              </Control>
              {form.password && (
                <div className="reg-strength" aria-live="polite">
                  <div className="reg-bars" aria-hidden="true">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`reg-bar${i <= strength.score ? " " + strength.barCls : ""}`} />
                    ))}
                  </div>
                  <div className="reg-hint" style={{ color: strength.color }}>{strength.label}</div>
                </div>
              )}
            </Field>

            {/* Confirm Password */}
            <Field id="reg-confirm" label="Confirm Password" required className="span-2" error={errors.confirm}>
              <Control
                icon={ShieldCheck}
                trail={
                  <button type="button" className="control-btn" onClick={() => setShowCf(s => !s)} aria-label={showCf ? "Hide password" : "Show password"} aria-pressed={showCf}>
                    {showCf ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                  </button>
                }
              >
                <input
                  id="reg-confirm"
                  className="input"
                  type={showCf ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  value={form.confirm}
                  onChange={setField("confirm")}
                  {...inv("confirm")}
                />
              </Control>
            </Field>
          </div>

          {/* IDENTITY VERIFICATION */}
          <div className="subhead reg-subhead">Identity Verification</div>

          <div className="alert">
            <Lightbulb aria-hidden="true" />
            <p>Upload clear photos of your <strong>National ID card</strong> and a photo of <strong>yourself holding the ID card</strong>. Accepted formats: JPG, PNG, WEBP · Max 5 MB each.</p>
          </div>

          <div className="form-grid" style={{ marginTop: 14 }}>
            <UploadZone
              id="reg-idcard"
              label="National ID Card" icon={IdCard}
              sub="Front side, full card visible<br>on a flat surface"
              file={idFile} preview={idPreview} error={errors.idcard}
              onChange={(f) => handleFile(f, setIdFile, setIdPreview, "idcard")}
              onRemove={() => { setIdFile(null); setIdPreview(""); }}
            />
            <UploadZone
              id="reg-selfie"
              label="Selfie Holding ID Card" icon={Camera}
              sub="Your face &amp; ID card<br>clearly visible together"
              file={selfieFile} preview={selfiePreview} error={errors.selfie}
              onChange={(f) => handleFile(f, setSelfieFile, setSelfiePreview, "selfie")}
              onRemove={() => { setSelfieFile(null); setSelfiePreview(""); }}
            />
          </div>

          {/* TERMS */}
          <div className="reg-terms">
            <label className="check" htmlFor="terms">
              <input
                type="checkbox"
                id="terms"
                checked={terms}
                onChange={(e) => { setTerms(e.target.checked); setErrors(p => ({ ...p, terms: "" })); }}
                aria-invalid={errors.terms ? true : undefined}
                aria-describedby={errors.terms ? "terms-error" : undefined}
              />
              <span>
                I agree to the <button type="button" className="link">Terms of Service</button> and <button type="button" className="link">Privacy Policy</button> of the Thai Post Office System.
              </span>
            </label>
            {errors.terms && <p className="field-error" id="terms-error" role="alert">{errors.terms}</p>}
          </div>

          {/* SUBMIT */}
          <button type="button" className={`btn btn-primary btn-lg btn-block reg-submit${loading ? " is-loading" : ""}`} onClick={handleSubmit} disabled={loading} aria-busy={loading}>
            {loading ? <><span className="spinner" aria-hidden="true" /><span className="sr-only">Creating account</span></> : "Create Account"}
          </button>

          <div className="auth-alt" style={{ marginTop: 14 }}>Already have an account? <a href="/login" className="link">Sign in</a></div>
        </main>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  BRAND PANEL
// ════════════════════════════════════════════════
function BrandPanel() {
  return (
    <aside className="auth-aside reg-aside">
      <div className="row">
        <span className="brand-mark"><Mail aria-hidden="true" /></span>
        <span>
          <span className="brand-name" style={{ display: "block" }}>Post Office</span>
          <span className="brand-sub" style={{ display: "block" }}>Management System</span>
        </span>
      </div>
      <div className="auth-aside-body">
        <h2>Create Account<span>Join our postal system</span></h2>
        <p>Register to track parcels, manage deliveries, and access your full shipment history.</p>
        <ul className="auth-points">
          {[
            { icon: PackageSearch, text: "Track all your shipments in real time"    },
            { icon: Receipt,       text: "Access full payment and delivery history" },
            { icon: BellRing,      text: "Get notified on every status update"      },
          ].map(({ icon: Icon, text }) => (
            <li key={text}><span className="ico"><Icon aria-hidden="true" /></span>{text}</li>
          ))}
        </ul>
      </div>
      <div className="auth-foot">© 2024 Thai Post Office System</div>
    </aside>
  );
}

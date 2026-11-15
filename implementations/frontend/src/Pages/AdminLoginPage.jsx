import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck, Users, IdCard, Lock, Eye, EyeOff, LogIn, User, ChartColumn, Package, Settings,
  KeyRound, LockKeyhole, CircleCheck, ChevronLeft, TriangleAlert, Crown,
} from "lucide-react";
import { Field, Control } from "../components/ui";

// ─── OTP input row ────────────────────────────────────────────────────────────
function OtpRow({ values, onChange, hasError }) {
  const ref0 = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const refs = [ref0, ref1, ref2, ref3, ref4, ref5];

  const handleInput = (i, val) => {
    const next = [...values];
    next[i] = val.slice(-1);
    onChange(next);
    if (val && i < 5) refs[i + 1].current?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !values[i] && i > 0) {
      refs[i - 1].current?.focus();
    }
  };

  return (
    <div className="otp" role="group" aria-label="6-digit verification code">
      {values.map((v, i) => (
        <input
          key={i}
          ref={refs[i]}
          className="otp-box"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${i + 1}`}
          aria-invalid={hasError || undefined}
          maxLength={1}
          value={v}
          onChange={e => handleInput(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
        />
      ))}
    </div>
  );
}

// ─── Step constants ───────────────────────────────────────────────────────────
const STEP_LOGIN   = 'login';
const STEP_2FA     = '2fa';
const STEP_SUCCESS = 'success';

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminLoginPage() {
  // ── React Router navigate hook ──
  const navigate = useNavigate();

  const [step, setStep]             = useState(STEP_LOGIN);
  const [adminLevel, setAdminLevel] = useState('superadmin');
  const [uid, setUid]               = useState('');
  const [pw, setPw]                 = useState('');
  const [pwVisible, setPwVisible]   = useState(false);
  const [staySignedIn, setStay]     = useState(false);
  const [errors, setErrors]         = useState({ uid: false, pw: false });
  const [alert, setAlert]           = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [otpLoading, setOtpLoading]     = useState(false);
  const [otp, setOtp]               = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError]     = useState(false);
  const loginAttempts               = useRef(0);

  const clearErrors = () => {
    setErrors({ uid: false, pw: false });
    setAlert('');
  };

  const handleLevelChange = (level) => {
    setAdminLevel(level);
    clearErrors();
  };

  // ── Step 1: Login submit ──
  const handleAdminLogin = useCallback(() => {
    clearErrors();
    const newErrors = { uid: !uid.trim(), pw: !pw.trim() };
    setErrors(newErrors);
    if (newErrors.uid || newErrors.pw) return;

    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
      loginAttempts.current += 1;

      if (loginAttempts.current === 1 && pw !== 'admin123' && uid !== 'admin') {
        setAlert(`Invalid credentials. ${2 - loginAttempts.current} attempt remaining before lockout.`);
        setErrors(e => ({ ...e, pw: true }));
        return;
      }

      setStep(STEP_2FA);
    }, 1400);
  }, [uid, pw]);

  // ── Step 2: OTP verify — navigates to AdminDashboardPage on success ──
  const verifyOtp = useCallback(() => {
    const code = otp.join('');
    if (code.length < 6) {
      setOtpError(true);
      setTimeout(() => setOtpError(false), 1200);
      return;
    }

    setOtpLoading(true);
    setTimeout(() => {
      setOtpLoading(false);
      setStep(STEP_SUCCESS);

      // ── Navigate to AdminDashboardPage after a short success flash ──
      setTimeout(() => {
        navigate('/admin/dashboard', {
          // Pass login context so the dashboard knows who logged in
          state: { adminLevel, uid },
        });
      }, 1200);
    }, 1500);
  }, [otp, navigate, adminLevel, uid]);

  const backToLogin = () => {
    setStep(STEP_LOGIN);
    loginAttempts.current = 0;
    setOtp(['', '', '', '', '', '']);
  };

  // ── Enter key handler ──
  useEffect(() => {
    const handler = (e) => {
      if (e.key !== 'Enter') return;
      if (step === STEP_LOGIN) handleAdminLogin();
      if (step === STEP_2FA)   verifyOtp();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [step, handleAdminLogin, verifyOtp]);

  const roleLabel = adminLevel === 'superadmin' ? 'Super Admin' : 'Staff Admin';

  return (
    <div className="auth">
      <div className="auth-card">

        {/* ── Left panel ── */}
        <aside className="auth-aside">
          <div className="stack-sm">
            <div className="row">
              <span className="brand-mark"><ShieldCheck aria-hidden="true" /></span>
              <span>
                <span className="brand-name" style={{ display: "block" }}>Post Office</span>
                <span className="brand-sub" style={{ display: "block" }}>Admin Portal</span>
              </span>
            </div>
            <span className="auth-badge"><span className="tone-dot" aria-hidden="true" />Restricted Access</span>
          </div>

          <div className="auth-aside-body">
            <h2>Admin<br />Control Centre</h2>
            <p>Secure access for authorised postal administration staff. All sessions are logged and monitored.</p>
            <ul className="auth-points">
              {[
                [ChartColumn, 'System-wide analytics & reports'],
                [Users,       'User account management'],
                [Package,     'All shipment oversight'],
                [Settings,    'System configuration & settings'],
                [KeyRound,    'Role & permission management'],
              ].map(([Icon, text]) => (
                <li key={text}><span className="ico"><Icon aria-hidden="true" /></span>{text}</li>
              ))}
            </ul>
          </div>

          <div className="stack-sm">
            <div className="auth-secure">
              <ShieldCheck aria-hidden="true" />
              <span>256-bit SSL · Session logged · 2FA enabled</span>
            </div>
            <div className="auth-foot">© 2024 Thai Post Office — Admin v2.4.1</div>
          </div>
        </aside>

        {/* ── Right form panel ── */}
        <main className="auth-main">

          {/* Step 1 — Login */}
          {step === STEP_LOGIN && (
            <div className="fade-up">
              <div className="auth-head">
                <h1>Admin Sign In</h1>
                <p>Restricted to authorised personnel only</p>
              </div>

              <div className="auth-form">
                {/* Access level tabs */}
                <div className="segmented" role="group" aria-label="Access level" style={{ display: "flex" }}>
                  <button
                    type="button"
                    style={{ flex: 1 }}
                    className={adminLevel === 'superadmin' ? 'is-active' : ''}
                    aria-pressed={adminLevel === 'superadmin'}
                    onClick={() => handleLevelChange('superadmin')}
                  >
                    <ShieldCheck aria-hidden="true" />
                    Super Admin
                  </button>
                  <button
                    type="button"
                    style={{ flex: 1 }}
                    className={adminLevel === 'staff' ? 'is-active' : ''}
                    aria-pressed={adminLevel === 'staff'}
                    onClick={() => handleLevelChange('staff')}
                  >
                    <Users aria-hidden="true" />
                    Staff Admin
                  </button>
                </div>

                {/* Error alert */}
                {alert && (
                  <div className="alert alert--danger" role="alert">
                    <TriangleAlert aria-hidden="true" />
                    <span>{alert}</span>
                  </div>
                )}

                {/* Admin ID */}
                <Field id="admin-uid" label="Admin ID / Username" required error={errors.uid && "Admin ID is required."}>
                  <Control icon={IdCard}>
                    <input
                      id="admin-uid"
                      className="input"
                      type="text"
                      placeholder="e.g. admin_001 or SA-2024"
                      value={uid}
                      onChange={e => setUid(e.target.value)}
                      autoComplete="username"
                      aria-invalid={errors.uid || undefined}
                      aria-describedby={errors.uid ? "admin-uid-error" : undefined}
                    />
                  </Control>
                </Field>

                {/* Password */}
                <Field id="admin-pw" label="Password" required error={errors.pw && "Password is required."}>
                  <Control
                    icon={Lock}
                    trail={
                      <button type="button" className="control-btn" onClick={() => setPwVisible(v => !v)} aria-label={pwVisible ? "Hide password" : "Show password"} aria-pressed={pwVisible}>
                        {pwVisible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                      </button>
                    }
                  >
                    <input
                      id="admin-pw"
                      className="input"
                      type={pwVisible ? 'text' : 'password'}
                      placeholder="Enter admin password"
                      value={pw}
                      onChange={e => setPw(e.target.value)}
                      autoComplete="current-password"
                      aria-invalid={errors.pw || undefined}
                      aria-describedby={errors.pw ? "admin-pw-error" : undefined}
                    />
                  </Control>
                </Field>

                {/* Meta row */}
                <div className="auth-meta">
                  <label className="check">
                    <input type="checkbox" checked={staySignedIn} onChange={e => setStay(e.target.checked)} />
                    <span>Stay signed in</span>
                  </label>
                  <button type="button" className="link">Reset access</button>
                </div>

                <button
                  type="button"
                  className={`btn btn-primary btn-lg btn-block${loginLoading ? ' is-loading' : ''}`}
                  onClick={handleAdminLogin}
                  aria-busy={loginLoading}
                >
                  {loginLoading ? (
                    <><span className="spinner" aria-hidden="true" /><span className="sr-only">Signing in</span></>
                  ) : (
                    <>
                      <span>Access Admin Portal</span>
                      <LogIn aria-hidden="true" />
                    </>
                  )}
                </button>

                <div className="or-divider"><span>back to</span></div>

                <a href="/login" className="btn btn-secondary btn-lg btn-block">
                  <User aria-hidden="true" />
                  User Login
                </a>
              </div>
            </div>
          )}

          {/* Step 2 — 2FA */}
          {step === STEP_2FA && (
            <div className="fade-up">
              <div className="auth-head">
                <h1>Verify Identity</h1>
                <p>Enter the 6-digit code from your authenticator app</p>
              </div>

              <div className="admin-2fa-intro">
                <div className="modal-icon"><LockKeyhole aria-hidden="true" /></div>
                <p>
                  A verification code has been sent to your authenticator. This step ensures your admin account is secure.
                </p>
              </div>

              <OtpRow values={otp} onChange={setOtp} hasError={otpError} />
              <p className="hint" style={{ justifyContent: 'center', margin: '10px 0 24px' }}>
                Try any 6 digits for this demo
              </p>

              <button
                type="button"
                className={`btn btn-primary btn-lg btn-block${otpLoading ? ' is-loading' : ''}`}
                onClick={verifyOtp}
                aria-busy={otpLoading}
              >
                {otpLoading ? (
                  <><span className="spinner" aria-hidden="true" /><span className="sr-only">Verifying</span></>
                ) : (
                  <>
                    <span>Verify &amp; Continue</span>
                    <CircleCheck aria-hidden="true" />
                  </>
                )}
              </button>

              <button type="button" className="btn btn-ghost btn-block" style={{ marginTop: 10 }} onClick={backToLogin}>
                <ChevronLeft aria-hidden="true" /> Back
              </button>
            </div>
          )}

          {/* Step 3 — Success flash before redirect */}
          {step === STEP_SUCCESS && (
            <div className="success-block" role="status">
              <div className="modal-icon modal-icon--success"><ShieldCheck aria-hidden="true" /></div>
              <h2>Access Granted</h2>
              <p>Welcome to the Admin Control Centre.<br />Redirecting to your dashboard…</p>
              <span className="tag tag--outline" style={{ marginTop: 14 }}>
                {adminLevel === 'superadmin' ? <Crown aria-hidden="true" /> : <User aria-hidden="true" />}
                {roleLabel}
              </span>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

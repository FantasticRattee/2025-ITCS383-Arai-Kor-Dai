import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail, User, Lock, Eye, EyeOff, UserPlus, ShieldCheck, ArrowRight, PackageSearch, History,
  Zap, CircleCheck,
} from "lucide-react";
import { Field, Control } from "../components/ui";

const API_URL = process.env.REACT_APP_API_URL || "https://two025-itcs383-arai-kor-dai-cyio.onrender.com/api";

export default function LoginPage() {
  const [pwVisible, setPwVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ username: false, password: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const clearErrors = () => setErrors({ username: false, password: false });

  const handleLogin = async () => {
  clearErrors();
  const newErrors = {
    username: !username.trim(),
    password: !password.trim(),
  };
  setErrors(newErrors);
  if (newErrors.username || newErrors.password) return;
  setLoading(true);
  try {
    const res = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: username.trim(), password: password.trim() }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      setLoading(false);
      setErrors({ username: true, password: true });
      return;
    }
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("userName", data.name);
    localStorage.setItem("userEmail", data.email);
    localStorage.setItem("userRole", data.role);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigate("/dashboard"), 1200);
  } catch (e) {
    setLoading(false);
    setErrors({ username: true, password: true });
  }
};


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") handleLogin();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, password]);

  return (
    <div className="auth">
      <div className="auth-card">

        {/* Left brand panel */}
        <aside className="auth-aside">
          <div className="row">
            <span className="brand-mark"><Mail aria-hidden="true" /></span>
            <span>
              <span className="brand-name" style={{ display: "block" }}>Post Office</span>
              <span className="brand-sub" style={{ display: "block" }}>Management System</span>
            </span>
          </div>

          <div className="auth-aside-body">
            <h2>
              Welcome back
              <span>Sign in to continue</span>
            </h2>
            <p>Manage parcels, track deliveries, and access postal records — all in one unified platform.</p>
            <ul className="auth-points">
              <li><span className="ico"><PackageSearch aria-hidden="true" /></span>Real-time parcel tracking</li>
              <li><span className="ico"><History aria-hidden="true" /></span>Full transaction history</li>
              <li><span className="ico"><ShieldCheck aria-hidden="true" /></span>Secure role-based access</li>
              <li><span className="ico"><Zap aria-hidden="true" /></span>Express delivery management</li>
            </ul>
          </div>

          <div className="auth-foot">© 2024 Thai Post Office System</div>
        </aside>

        {/* Right form panel */}
        <main className="auth-main">
          {!success ? (
            <>
              <div className="auth-head">
                <h1>Welcome Back</h1>
                <p>Sign in to your account to continue</p>
              </div>

              <div className="auth-form" id="loginForm">
                <Field id="login-username" label="Username" error={errors.username && "Please enter your username."}>
                  <Control icon={User}>
                    <input
                      id="login-username"
                      className="input"
                      type="text"
                      placeholder="Enter your username"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      aria-invalid={errors.username || undefined}
                      aria-describedby={errors.username ? "login-username-error" : undefined}
                    />
                  </Control>
                </Field>

                <Field id="login-password" label="Password" error={errors.password && "Please enter your password."}>
                  <Control
                    icon={Lock}
                    trail={
                      <button
                        type="button"
                        className="control-btn"
                        onClick={() => setPwVisible((v) => !v)}
                        title="Show/hide password"
                        aria-label={pwVisible ? "Hide password" : "Show password"}
                        aria-pressed={pwVisible}
                      >
                        {pwVisible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                      </button>
                    }
                  >
                    <input
                      id="login-password"
                      className="input"
                      type={pwVisible ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-invalid={errors.password || undefined}
                      aria-describedby={errors.password ? "login-password-error" : undefined}
                    />
                  </Control>
                </Field>

                <div className="auth-meta">
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>
                  <button type="button" className="link">Forgot password?</button>
                </div>

                <button
                  type="button"
                  className={`btn btn-primary btn-lg btn-block${loading ? " is-loading" : ""}`}
                  onClick={handleLogin}
                  aria-busy={loading}
                >
                  {loading ? <><span className="spinner" aria-hidden="true" /><span className="sr-only">Signing in</span></> : "Sign In"}
                </button>

                <div className="or-divider"><span>or</span></div>

                <a href="/register" className="btn btn-secondary btn-lg btn-block">
                  <UserPlus aria-hidden="true" />
                  Create New Account
                </a>

                <div className="auth-alt">
                  <a href="/admin/login" className="link">
                    <ShieldCheck aria-hidden="true" />
                    Admin Portal
                    <ArrowRight aria-hidden="true" />
                  </a>
                </div>
              </div>
            </>
          ) : (
            /* Success message */
            <div className="success-block" role="status">
              <div className="modal-icon modal-icon--success"><CircleCheck aria-hidden="true" /></div>
              <h2>Login Successful!</h2>
              <p>Redirecting to your dashboard…</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import {
  Mail, LayoutDashboard, PackageSearch, PackagePlus, History, CreditCard, Settings,
  LogOut, Menu, X, ChevronLeft, UserCheck, ChartColumn, ShieldCheck,
} from "lucide-react";

const USER_NAV = [
  { section: "Main" },
  { key: "dashboard", href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "tracking", href: "/tracking", label: "Track Parcel", icon: PackageSearch },
  { key: "create", href: "/create-shipment", label: "Create Shipment", icon: PackagePlus },
  { key: "history", href: "/history", label: "Shipment History", icon: History },
  { section: "Account" },
  { key: "payments", href: "/payments", label: "Payments", icon: CreditCard },
  { key: "settings", href: "/settings", label: "Settings", icon: Settings },
];

const ADMIN_NAV = [
  { section: "Main" },
  { key: "dashboard", href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { section: "Management" },
  { key: "users", href: "/admin/users", label: "User Approval", icon: UserCheck },
  { key: "reports", href: "/admin/reports", label: "Statistics & Reports", icon: ChartColumn },
  { section: "System" },
  { key: "settings", href: "/admin/settings", label: "Settings", icon: Settings },
];

export function initials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0] || "")[0] || "?").toUpperCase();
}

function storedUserName() {
  try {
    return localStorage.getItem("userName") || "";
  } catch (_) {
    return "";
  }
}

/**
 * Shared layout for every signed-in page.
 * variant: "user" | "admin"
 */
export default function AppShell({
  variant = "user",
  active,
  title,
  subtitle,
  actions,
  back,
  user,
  counts = {},
  contentClassName = "",
  children,
}) {
  const [open, setOpen] = useState(false);
  const isAdmin = variant === "admin";
  const nav = isAdmin ? ADMIN_NAV : USER_NAV;

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const person = isAdmin
    ? { name: "Admin User", sub: "admin_001", initial: "A", role: "SA", ...user }
    : { name: storedUserName() || "Guest", sub: "Member", ...user };

  return (
    <div className={`shell${isAdmin ? " shell--admin" : ""}`}>
      <a className="skip-link" href="#main-content">Skip to content</a>

      <aside id="app-sidebar" className={`sidebar${open ? " is-open" : ""}`} aria-label="Main navigation">
        {open && (
          <button type="button" className="icon-btn sidebar-close" aria-label="Close menu" onClick={() => setOpen(false)}>
            <X aria-hidden="true" />
          </button>
        )}
        <a className="sidebar-brand" href={isAdmin ? "/admin/dashboard" : "/dashboard"}>
          <span className="brand-mark">{isAdmin ? <ShieldCheck aria-hidden="true" /> : <Mail aria-hidden="true" />}</span>
          <span>
            <span className="brand-name" style={{ display: "block" }}>Post Office</span>
            <span className="brand-sub" style={{ display: "block" }}>{isAdmin ? "Admin Portal" : "Management System"}</span>
          </span>
        </a>

        <div className="sidebar-user">
          <span className={`avatar${isAdmin ? "" : " avatar--brand"}`} aria-hidden="true">{person.initial || initials(person.name)}</span>
          <div className="sidebar-user-text">
            <div className="sidebar-user-name">{person.name}</div>
            <div className="sidebar-user-sub">{person.sub}</div>
          </div>
          {person.role && <span className="role-tag">{person.role}</span>}
        </div>

        <nav className="sidebar-nav">
          {nav.map((item) =>
            item.section ? (
              <div className="nav-label" key={item.section}>{item.section}</div>
            ) : (
              <a
                key={item.key}
                href={item.href}
                className={`nav-item${active === item.key ? " is-active" : ""}`}
                aria-current={active === item.key ? "page" : undefined}
              >
                <item.icon aria-hidden="true" />
                <span>{item.label}</span>
                {counts[item.key] !== undefined && counts[item.key] !== null && (
                  <span className="nav-count">{counts[item.key]}</span>
                )}
              </a>
            )
          )}
        </nav>

        <div className="sidebar-foot">
          <a className="nav-item" href={isAdmin ? "/admin/login" : "/login"}>
            <LogOut aria-hidden="true" />
            <span>{isAdmin ? "Sign Out" : "Log Out"}</span>
          </a>
          <div className="sidebar-copy">© 2024 Thai Post Office System</div>
        </div>
      </aside>

      {open && <div className="scrim" onClick={() => setOpen(false)} aria-hidden="true" />}

      <div className="main">
        <header className="topbar">
          <button
            type="button"
            className="icon-btn menu-btn"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="app-sidebar"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          {back && (
            <a className="back-link" href={back.href} aria-label={back.label || "Back"}>
              <ChevronLeft aria-hidden="true" />
              <span className="back-text">{back.label || "Back"}</span>
            </a>
          )}
          <div className="topbar-title">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {actions && <div className="topbar-actions">{actions}</div>}
        </header>

        <main id="main-content" className={`content${contentClassName ? ` ${contentClassName}` : ""}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

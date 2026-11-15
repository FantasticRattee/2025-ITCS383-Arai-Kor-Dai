import { CircleAlert, CircleCheck, Inbox } from "lucide-react";

// Shipment-state badge: always an icon plus a text label, never colour alone.
// tone: pending | processing | transit | delivered | returned | neutral
export function StatusBadge({ tone = "neutral", icon: Icon, size, children }) {
  return (
    <span className={`status status--${tone}${size === "lg" ? " status--lg" : ""}`}>
      {Icon && <Icon aria-hidden="true" strokeWidth={2.2} />}
      {children}
    </span>
  );
}

// Form field wrapper: ties the label to the control by id and renders
// error / success / hint text underneath.
export function Field({ id, label, required, optional, error, ok, hint, className = "", children }) {
  return (
    <div className={`field${className ? ` ${className}` : ""}`}>
      {label && (
        <label className="label" htmlFor={id}>
          {label}
          {required && <span className="req" aria-hidden="true">*</span>}
          {optional && <span className="opt"> (optional)</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="field-error" id={id ? `${id}-error` : undefined} role="alert">
          <CircleAlert aria-hidden="true" />
          {error}
        </p>
      )}
      {ok && (
        <p className="field-ok">
          <CircleCheck aria-hidden="true" />
          {ok}
        </p>
      )}
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

// Input wrapper with an optional leading icon and trailing slot (e.g. a show/hide button).
export function Control({ icon: Icon, leadText, trail, className = "", children }) {
  const cls = ["control"];
  if (Icon) cls.push("has-lead");
  if (leadText) cls.push("has-lead-text");
  if (trail) cls.push("has-trail");
  if (className) cls.push(className);
  return (
    <div className={cls.join(" ")}>
      {Icon && <Icon className="lead" aria-hidden="true" />}
      {leadText && <span className="lead-text" aria-hidden="true">{leadText}</span>}
      {children}
      {trail && <span className="trail">{trail}</span>}
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title, children, tone, size }) {
  return (
    <div className={`empty${tone === "error" ? " empty--error" : ""}${size === "sm" ? " empty--sm" : ""}`} role={tone === "error" ? "alert" : undefined}>
      <div className="empty-icon"><Icon aria-hidden="true" /></div>
      {title && <h3>{title}</h3>}
      {children && <p>{children}</p>}
    </div>
  );
}

export function PanelHead({ icon: Icon, title, subtitle, children, plain, as: Tag = "h2" }) {
  return (
    <div className={`panel-head${plain ? " panel-head--plain" : ""}`}>
      <div className="panel-title">
        {Icon && <Icon aria-hidden="true" />}
        <div>
          <Tag>{title}</Tag>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

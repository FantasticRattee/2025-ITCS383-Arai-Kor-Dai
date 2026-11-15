import { useState, useMemo } from "react";
import {
  Bell, Search, FileDown, Users, Clock3, CircleCheck, CircleX, Check, X, Eye, UserCheck, UserX,
  ChevronLeft, ChevronRight, Inbox,
} from "lucide-react";
import AppShell from "../components/AppShell";
import { StatusBadge, EmptyState, PanelHead } from "../components/ui";
import "./Admin.css";

// ── Initial user data (replace with API call in production)
const INITIAL_USERS = [
  { id:1,  first:"Somchai",  last:"Jaidee",      email:"somchai@email.com",    phone:"081-234-5678", date:"11 Mar 2026", status:"pending"  },
  { id:2,  first:"Nattaya",  last:"Srisuk",      email:"nattaya@gmail.com",    phone:"089-876-5432", date:"11 Mar 2026", status:"pending"  },
  { id:3,  first:"Prayut",   last:"Wongsri",     email:"prayut.w@mail.com",    phone:"062-345-6789", date:"10 Mar 2026", status:"pending"  },
  { id:4,  first:"Malee",    last:"Thongdee",    email:"malee.t@email.co.th",  phone:"093-456-7890", date:"10 Mar 2026", status:"pending"  },
  { id:5,  first:"Krit",     last:"Suwan",       email:"krit.s@hotmail.com",   phone:"086-567-8901", date:"10 Mar 2026", status:"pending"  },
  { id:6,  first:"Anchalee", last:"Kaewsai",     email:"anchalee@email.com",   phone:"082-678-9012", date:"9 Mar 2026",  status:"approved" },
  { id:7,  first:"Wanchai",  last:"Pattana",     email:"wanchai.p@mail.com",   phone:"091-789-0123", date:"9 Mar 2026",  status:"approved" },
  { id:8,  first:"Siriporn", last:"Nilsuk",      email:"siri.n@email.co.th",   phone:"085-890-1234", date:"8 Mar 2026",  status:"approved" },
  { id:9,  first:"Prasert",  last:"Duangdee",    email:"prasert@email.com",    phone:"087-901-2345", date:"8 Mar 2026",  status:"rejected" },
  { id:10, first:"Nittaya",  last:"Charoenwong", email:"nittaya@gmail.com",    phone:"094-012-3456", date:"8 Mar 2026",  status:"approved" },
];

const AV_COLORS = ["av-red","av-blue","av-green","av-amber","av-purple"];

function getInitials(u) { return (u.first[0] + u.last[0]).toUpperCase(); }
function getAvColor(id)  { return AV_COLORS[(id - 1) % AV_COLORS.length]; }

function StatusBadge2({ status }) {
  const map   = { pending: "pending", approved: "delivered", rejected: "returned" };
  const icons = { pending: Clock3, approved: CircleCheck, rejected: CircleX };
  return (
    <StatusBadge tone={map[status]} icon={icons[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </StatusBadge>
  );
}

function UserCard({ user }) {
  return (
    <div className="ua-user-card">
      <span className={`avatar avatar--lg ua-av ${getAvColor(user.id)}`} aria-hidden="true">{getInitials(user)}</span>
      <div style={{ minWidth: 0 }}>
        <div className="cell-main">{user.first} {user.last}</div>
        <div className="cell-sub">{user.email}</div>
        <div className="cell-sub num">{user.phone}</div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  APPROVE MODAL
// ════════════════════════════════════════════════
function ApproveModal({ user, onClose, onConfirm }) {
  const [note, setNote] = useState("");
  if (!user) return null;
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="approve-title">
        <div className="modal-head">
          <div className="modal-icon modal-icon--success"><UserCheck aria-hidden="true" /></div>
          <div>
            <h2 id="approve-title">Approve Account</h2>
            <p>Grant access to the postal system</p>
          </div>
          <button type="button" className="icon-btn modal-close" onClick={onClose} aria-label="Close"><X aria-hidden="true" /></button>
        </div>
        <div className="modal-body">
          <UserCard user={user} />
          <dl className="ua-info">
            <div><dt>Registered</dt><dd className="num">{user.date}</dd></div>
            <div><dt>Current Status</dt><dd><StatusBadge2 status="pending" /></dd></div>
          </dl>
          <div className="field">
            <label className="label" htmlFor="approve-note">Note (optional)</label>
            <textarea id="approve-note" className="textarea" rows={3} placeholder="Add a note for this approval…" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
        <div className="modal-foot">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-dark" onClick={() => onConfirm("approved")}>
            <Check aria-hidden="true" />
            Approve Account
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  REJECT MODAL
// ════════════════════════════════════════════════
function RejectModal({ user, onClose, onConfirm }) {
  const [note, setNote] = useState("");
  if (!user) return null;
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="reject-title">
        <div className="modal-head">
          <div className="modal-icon modal-icon--danger"><UserX aria-hidden="true" /></div>
          <div>
            <h2 id="reject-title">Reject Account</h2>
            <p>Deny access to this user</p>
          </div>
          <button type="button" className="icon-btn modal-close" onClick={onClose} aria-label="Close"><X aria-hidden="true" /></button>
        </div>
        <div className="modal-body">
          <UserCard user={user} />
          <div className="field" style={{ marginTop: 16 }}>
            <label className="label" htmlFor="reject-note">Reason for rejection <span className="req" aria-hidden="true">*</span></label>
            <textarea id="reject-note" className="textarea" rows={3} placeholder="Provide a reason (e.g. incomplete info, duplicate account)…" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
        <div className="modal-foot">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-danger-solid" onClick={() => onConfirm("rejected")}>
            <X aria-hidden="true" />
            Reject Account
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  TOAST
// ════════════════════════════════════════════════
function Toast({ toast }) {
  const Icon = toast.type === "red" ? X : Check;
  return (
    <div className={`toast ${toast.type === "green" ? "toast--success" : toast.type === "red" ? "toast--danger" : ""} ${toast.show ? "show" : ""}`} role="status" aria-live="polite">
      <Icon aria-hidden="true" />
      <span>{toast.msg}</span>
    </div>
  );
}

// ════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════
export default function UserApprovalPage() {
  const [users, setUsers]         = useState(INITIAL_USERS);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("all");
  const [approveUser, setApproveUser] = useState(null);
  const [rejectUser, setRejectUser]   = useState(null);
  const [toast, setToast]         = useState({ show: false, msg: "", type: "" });

  // ── Derived stats
  const pending  = useMemo(() => users.filter(u => u.status === "pending").length,  [users]);
  const approved = useMemo(() => users.filter(u => u.status === "approved").length, [users]);
  const rejected = useMemo(() => users.filter(u => u.status === "rejected").length, [users]);

  // ── Filtered list
  const filtered = useMemo(() => users.filter(u => {
    const matchStatus = filter === "all" || u.status === filter;
    const matchSearch = `${u.first} ${u.last} ${u.email} ${u.phone}`.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  }), [users, search, filter]);

  // ── Show toast helper
  function showToast(msg, type = "") {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3200);
  }

  // ── Confirm approve/reject
  function confirmAction(action) {
    const targetUser = action === "approved" ? approveUser : rejectUser;
    setUsers(prev => prev.map(u => u.id === targetUser.id ? { ...u, status: action } : u));
    setApproveUser(null);
    setRejectUser(null);
    showToast(
      action === "approved"
        ? `${targetUser.first} ${targetUser.last} has been approved`
        : `${targetUser.first} ${targetUser.last} has been rejected`,
      action === "approved" ? "green" : "red"
    );
  }

  return (
    <AppShell
      variant="admin"
      active="users"
      title="User Approval"
      subtitle="Review and manage new account requests"
      back={{ href: "/admin/dashboard", label: "Back to Dashboard" }}
      counts={{ users: pending }}
      user={{ name: "Admin User", sub: "System Administrator", role: "Admin" }}
      actions={
        <>
          <button type="button" className="icon-btn" aria-label="Notifications, 5 new">
            <Bell aria-hidden="true" />
            <span className="dot-count" aria-hidden="true">5</span>
          </button>
          <span className="topbar-divider hide-sm" aria-hidden="true" />
          <span className="user-chip hide-sm"><span className="avatar" aria-hidden="true">A</span>Admin</span>
        </>
      }
    >
      {/* Page Header */}
      <section className="page-intro">
        <div>
          <h2>User Approval Queue</h2>
          <p>Wednesday, 11 March 2026</p>
        </div>
      </section>

      {/* Stats */}
      <section className="stat-strip mb-20" aria-label="Approval summary">
        {[
          { icon: Clock3,      cls: "ic-pending",   num: pending,  label: "Pending Review"  },
          { icon: CircleCheck, cls: "ic-delivered", num: approved, label: "Approved Today"  },
          { icon: CircleX,     cls: "ic-returned",  num: rejected, label: "Rejected Today"  },
          { icon: Users,       cls: "ic-muted",     num: 142,      label: "Total Users"     },
        ].map(({ icon: Icon, cls, num, label }) => (
          <div className="stat" key={label}>
            <div className="stat-label"><Icon className={cls} aria-hidden="true" />{label}</div>
            <div className="stat-value">{num}</div>
          </div>
        ))}
      </section>

      {/* Toolbar */}
      <div className="adm-toolbar">
        <div className="control has-lead grow">
          <Search className="lead" aria-hidden="true" />
          <input
            type="text"
            className="input"
            placeholder="Search by name, email, or phone…"
            aria-label="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="select"
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button type="button" className="btn btn-secondary">
          <FileDown aria-hidden="true" />
          Export
        </button>
      </div>

      {/* Table */}
      <section className="panel">
        <PanelHead icon={Users} title="Registration Requests" subtitle="Review new user accounts before granting access">
          <span className="tag num">{pending} pending</span>
        </PanelHead>

        <div className="table-wrap">
          <table className="table table--stack">
            <thead>
              <tr>
                <th scope="col">User</th><th scope="col">Phone</th>
                <th scope="col">Registered</th><th scope="col">Status</th><th scope="col" className="t-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr className="table-empty">
                  <td colSpan={5} data-label="">
                    <EmptyState icon={Inbox} title="No records found" />
                  </td>
                </tr>
              ) : filtered.map((u) => (
                <tr key={u.id}>
                  <td className="stack-head" data-label="User">
                    <div className="row" style={{ gap: 10 }}>
                      <span className={`avatar ua-av ${getAvColor(u.id)}`} aria-hidden="true">{getInitials(u)}</span>
                      <div style={{ minWidth: 0 }}>
                        <div className="cell-main">{u.first} {u.last}</div>
                        <div className="cell-sub">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td data-label="Phone" className="num nowrap">{u.phone}</td>
                  <td data-label="Registered" className="t-muted num nowrap">{u.date}</td>
                  <td data-label="Status"><StatusBadge2 status={u.status} /></td>
                  <td data-label="" className="ua-actions-cell">
                    <div className="ua-actions">
                      {u.status === "pending" ? (
                        <>
                          <button type="button" className="btn btn-success btn-sm" onClick={() => setApproveUser(u)}>
                            <Check aria-hidden="true" />
                            Approve
                          </button>
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => setRejectUser(u)}>
                            <X aria-hidden="true" />
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="muted ua-done">
                          {u.status === "approved" ? "Approved" : "Rejected"}
                        </span>
                      )}
                      <button type="button" className="btn btn-ghost btn-sm btn-icon" title="View details" aria-label={`View details for ${u.first} ${u.last}`}>
                        <Eye aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel-foot">
          <div className="muted num" style={{ fontSize: "var(--fs-sm)" }}>Showing 1–{Math.min(filtered.length, 10)} of {filtered.length} records</div>
          <nav className="pager" aria-label="Pagination">
            <button type="button" aria-label="Previous page"><ChevronLeft aria-hidden="true" /></button>
            <button type="button" className="is-active" aria-current="page">1</button>
            <button type="button">2</button>
            <button type="button" aria-label="Next page"><ChevronRight aria-hidden="true" /></button>
          </nav>
        </div>
      </section>

      {/* ════ MODALS ════ */}
      <ApproveModal user={approveUser} onClose={() => setApproveUser(null)} onConfirm={confirmAction} />
      <RejectModal  user={rejectUser}  onClose={() => setRejectUser(null)}  onConfirm={confirmAction} />

      {/* ════ TOAST ════ */}
      <Toast toast={toast} />
    </AppShell>
  );
}

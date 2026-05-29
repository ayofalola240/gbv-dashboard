import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiFilter,
  FiMoreHorizontal,
  FiPlus,
  FiSearch,
  FiX,
} from 'react-icons/fi';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { getUsers, createUser, updateUserRole, deleteUser } from '../services/userService';

// ─── Constants ────────────────────────────────────────────────────────────────

export const ROLES = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'nscdc_admin', label: 'NSCDC Admin' },
  { value: 'naptip_admin', label: 'NAPTIP Admin' },
  { value: 'fcta_admin', label: 'FCTA Admin' },
  { value: 'police_admin', label: 'Police Admin' },
  { value: 'viewer', label: 'Viewer' },
];

const ROLE_BADGE = {
  super_admin: 'bg-purple-50 text-purple-700',
  nscdc_admin: 'bg-blue-50 text-blue-700',
  naptip_admin: 'bg-amber-50 text-amber-700',
  fcta_admin: 'bg-green-50 text-green-700',
  police_admin: 'bg-teal-50 text-teal-700',
  viewer: 'bg-gray-100 text-gray-600',
};

const AVATAR_COLORS = [
  'bg-gray-700', 'bg-slate-700', 'bg-zinc-700',
  'bg-stone-700', 'bg-neutral-700', 'bg-gray-800',
];

function getAvatarColor(name = '') {
  const code = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

function getInitials(firstname = '', lastname = '') {
  return `${firstname[0] || ''}${lastname[0] || ''}`.toUpperCase();
}

function formatRole(roleValue) {
  return ROLES.find((r) => r.value === roleValue)?.label ?? roleValue ?? 'N/A';
}

// ─── Add / Edit Member Modal ────────────────────────────────────────────────

const MemberModal = ({ mode = 'add', existingUser = null, onClose, onSuccess }) => {
  const [firstName, setFirstName] = useState(existingUser?.firstname ?? '');
  const [lastName, setLastName] = useState(existingUser?.lastname ?? '');
  const [email, setEmail] = useState(existingUser?.email ?? '');
  const [phone, setPhone] = useState(existingUser?.phone ?? '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(existingUser?.role ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'add') {
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');
        await createUser({ firstname: firstName, lastname: lastName, email, phone, password, role });
      } else {
        await updateUserRole(existingUser._id, role);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const labelCls = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500';
  const inputCls =
    'w-full rounded-lg border border-border-color bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 placeholder-gray-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-border-color px-6 py-5">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              {mode === 'add' ? 'Add New Member' : 'Edit Role'}
            </h2>
            <p className="text-sm text-gray-500">
              {mode === 'add'
                ? 'Create an admin account and assign a role.'
                : `Update role for ${existingUser?.firstname} ${existingUser?.lastname}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Modal body */}
        <form onSubmit={handleSubmit} noValidate className="px-6 py-5">
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span className="mt-0.5 shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {mode === 'add' && (
            <>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>First Name <span className="text-red-500">*</span></label>
                  <input className={inputCls} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ada" required />
                </div>
                <div>
                  <label className={labelCls}>Last Name <span className="text-red-500">*</span></label>
                  <input className={inputCls} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Okafor" required />
                </div>
              </div>

              <div className="mb-4">
                <label className={labelCls}>Email Address <span className="text-red-500">*</span></label>
                <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" required />
              </div>

              <div className="mb-4">
                <label className={labelCls}>Phone Number</label>
                <input className={inputCls} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 800 000 0000" />
              </div>

              <div className="mb-4">
                <label className={labelCls}>Password <span className="text-red-500">*</span></label>
                <input className={inputCls} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required autoComplete="new-password" />
              </div>
            </>
          )}

          <div className="mb-6">
            <label className={labelCls}>Role & Agency Access <span className="text-red-500">*</span></label>
            <select
              className={`${inputCls} cursor-pointer appearance-none`}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select a role…</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            {role && role !== 'super_admin' && role !== 'viewer' && (
              <p className="mt-1.5 text-xs text-gray-500">
                This user will have access to the{' '}
                <strong>{formatRole(role).replace(' Admin', '')}</strong> agency dashboard.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border-color px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !role || (mode === 'add' && (!firstName || !lastName || !email || !password))}
              className="rounded-lg bg-primary-green px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-dark-green disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (mode === 'add' ? 'Creating…' : 'Saving…') : mode === 'add' ? 'Create Member' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Action Dropdown ─────────────────────────────────────────────────────────

const ActionMenu = ({ user, onEdit, onDelete, onClose }) => {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-8 z-20 w-40 overflow-hidden rounded-xl border border-border-color bg-white shadow-lg"
    >
      <button
        type="button"
        onClick={() => { onEdit(user); onClose(); }}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-light-green hover:text-primary-green"
      >
        Edit Role
      </button>
      <button
        type="button"
        onClick={() => { onDelete(user); onClose(); }}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
      >
        Remove Member
      </button>
    </div>
  );
};

// ─── Delete Confirmation ──────────────────────────────────────────────────────

const DeleteConfirmModal = ({ user, onConfirm, onClose, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
      <h3 className="text-lg font-extrabold text-gray-900">Remove Member</h3>
      <p className="mt-2 text-sm text-gray-600">
        Are you sure you want to remove{' '}
        <strong>{user.firstname} {user.lastname}</strong>? This action cannot be undone.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-border-color px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {loading ? 'Removing…' : 'Remove'}
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const SORT_FIELDS = { name: 'name', email: 'email', role: 'role', joined: 'joined' };

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterRef = useRef(null);

  const [sortField, setSortField] = useState('joined');
  const [sortDir, setSortDir] = useState('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionMenuUserId, setActionMenuUserId] = useState(null);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : data?.users ?? []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Close filter dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilterMenu(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteUser(deleteTarget._id);
      showToast(`${deleteTarget.firstname} ${deleteTarget.lastname} removed.`);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to remove member.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setCurrentPage(1);
  };

  // Filter + sort
  const processed = [...users]
    .filter((u) => {
      const name = `${u.firstname} ${u.lastname}`.toLowerCase();
      const matchSearch = !searchTerm || name.includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole = !roleFilter || u.role === roleFilter;
      return matchSearch && matchRole;
    })
    .sort((a, b) => {
      let aVal, bVal;
      if (sortField === 'name') { aVal = `${a.firstname} ${a.lastname}`; bVal = `${b.firstname} ${b.lastname}`; }
      else if (sortField === 'email') { aVal = a.email; bVal = b.email; }
      else if (sortField === 'role') { aVal = a.role; bVal = b.role; }
      else { aVal = a.createdAt; bVal = b.createdAt; }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(processed.length / itemsPerPage));
  const paginated = processed.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const startItem = processed.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, processed.length);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <FiChevronUp className="h-3 w-3 opacity-30" />;
    return sortDir === 'asc'
      ? <FiChevronUp className="h-3 w-3 text-primary-green" />
      : <FiChevronDown className="h-3 w-3 text-primary-green" />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Toast */}
        {toast && (
          <div
            className={`fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-semibold shadow-lg transition-all ${
              toast.type === 'error'
                ? 'border border-red-200 bg-red-50 text-red-700'
                : 'border border-green-200 bg-green-50 text-primary-green'
            }`}
          >
            <span>{toast.type === 'error' ? '⚠' : '✓'}</span>
            {toast.message}
          </div>
        )}

        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Roles &amp; Permissions</h1>
            <p className="mt-1 text-sm text-gray-500">
              Select admins to view the role &amp; permissions assigned
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-dark-green px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-green"
          >
            <FiPlus className="h-4 w-4" />
            Add A New Member
          </button>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-border-color bg-white shadow-sm">
          {/* Search + Filter bar */}
          <div className="flex items-center gap-3 border-b border-border-color px-5 py-4">
            <div className="relative flex-1">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Team Member"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full rounded-lg border border-border-color py-2.5 pl-9 pr-3 text-sm text-gray-900 outline-none transition-all focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 placeholder-gray-400"
              />
            </div>

            {/* Filter dropdown */}
            <div className="relative shrink-0" ref={filterRef}>
              <button
                type="button"
                onClick={() => setShowFilterMenu((v) => !v)}
                className="inline-flex items-center gap-2 rounded-lg border border-border-color bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
              >
                <FiFilter className="h-4 w-4" />
                {roleFilter ? formatRole(roleFilter) : 'All'}
                <FiChevronDown className="h-3.5 w-3.5" />
              </button>

              {showFilterMenu && (
                <div className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-xl border border-border-color bg-white shadow-lg">
                  <button
                    type="button"
                    onClick={() => { setRoleFilter(''); setShowFilterMenu(false); setCurrentPage(1); }}
                    className={`flex w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-light-green ${!roleFilter ? 'font-bold text-primary-green' : 'text-gray-700'}`}
                  >
                    All
                  </button>
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => { setRoleFilter(r.value); setShowFilterMenu(false); setCurrentPage(1); }}
                      className={`flex w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-light-green ${roleFilter === r.value ? 'font-bold text-primary-green' : 'text-gray-700'}`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-16 text-sm text-gray-500">
              Loading members…
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-16 text-sm text-red-500">
              {error}
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="font-semibold text-gray-500">No members found.</p>
              {(searchTerm || roleFilter) && (
                <button
                  type="button"
                  onClick={() => { setSearchTerm(''); setRoleFilter(''); }}
                  className="mt-2 text-sm font-semibold text-primary-green"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border-color bg-gray-50/60">
                  {[
                    { label: 'Team Member', field: 'name' },
                    { label: 'Email Address', field: 'email' },
                    { label: 'Role', field: 'role' },
                    { label: 'Joined', field: 'joined' },
                  ].map(({ label, field }) => (
                    <th
                      key={field}
                      onClick={() => handleSort(field)}
                      className="cursor-pointer select-none px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-800"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {label}
                        <SortIcon field={field} />
                      </span>
                    </th>
                  ))}
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {paginated.map((u) => {
                  const initials = getInitials(u.firstname, u.lastname);
                  const avatarColor = getAvatarColor(`${u.firstname}${u.lastname}`);
                  const roleBadge = ROLE_BADGE[u.role] ?? 'bg-gray-100 text-gray-600';
                  const joinedDate = u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : 'N/A';

                  return (
                    <tr key={u._id} className="transition-colors hover:bg-gray-50/60">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${avatarColor}`}
                          >
                            {initials}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {u.firstname} {u.lastname}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{u.email}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${roleBadge}`}>
                          {formatRole(u.role)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{joinedDate}</td>
                      <td className="px-5 py-4">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setActionMenuUserId((id) => (id === u._id ? null : u._id))}
                            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                          >
                            <FiMoreHorizontal className="h-5 w-5" />
                          </button>
                          {actionMenuUserId === u._id && (
                            <ActionMenu
                              user={u}
                              onEdit={(usr) => setEditUser(usr)}
                              onDelete={(usr) => setDeleteTarget(usr)}
                              onClose={() => setActionMenuUserId(null)}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {!loading && !error && processed.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-4 border-t border-border-color px-5 py-4 sm:flex-row">
              <p className="text-sm text-gray-500">
                Showing {startItem} to {endItem} of {processed.length} result{processed.length !== 1 ? 's' : ''}
              </p>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="rounded-lg border border-border-color bg-white px-2 py-1 text-sm font-semibold text-gray-700 outline-none focus:border-primary-green"
                  >
                    {[5, 10, 20, 50].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <span>per page</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-color text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40"
                  >
                    <FiChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, idx) =>
                      p === '…' ? (
                        <span key={`ellipsis-${idx}`} className="px-1 text-sm text-gray-400">…</span>
                      ) : (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setCurrentPage(p)}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                            currentPage === p
                              ? 'bg-dark-green text-white'
                              : 'border border-border-color text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-color text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40"
                  >
                    <FiChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <MemberModal
          mode="add"
          onClose={() => setShowAddModal(false)}
          onSuccess={() => { fetchUsers(); showToast('Member created successfully.'); }}
        />
      )}
      {editUser && (
        <MemberModal
          mode="edit"
          existingUser={editUser}
          onClose={() => setEditUser(null)}
          onSuccess={() => { fetchUsers(); showToast('Role updated successfully.'); }}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          user={deleteTarget}
          loading={deleteLoading}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default UserManagementPage;

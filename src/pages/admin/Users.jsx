import React, { useState, useEffect, useCallback } from "react";
import { getAdminUsers, updateUserStatus, deleteAdminUser } from "../../api/adminApi";
import { useToast } from "../../context/ToastContext";

const Users = () => {
  const { showSuccess, showError } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [direction, setDirection] = useState("desc");
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAdminUsers({
        search,
        status: statusFilter,
        page,
        size,
        sortBy,
        direction,
      });
      setData(response.data?.data || response.data);
    } catch (err) {
      showError("Failed to load users");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, page, size, sortBy, direction]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    setActionLoading(userId);
    try {
      await updateUserStatus(userId, newStatus);
      showSuccess(`User status updated to ${newStatus}`);
      fetchUsers();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId) => {
    setActionLoading(userId);
    try {
      await deleteAdminUser(userId);
      showSuccess("User deleted successfully");
      setDeleteConfirmId(null);
      fetchUsers();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setDirection("asc");
    }
    setPage(0);
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <span className="text-gray-300 ml-1">&#8645;</span>;
    return <span className="text-indigo-600 ml-1">{direction === "asc" ? "&#8593;" : "&#8595;"}</span>;
  };

  const statusColors = {
    ACTIVE: "bg-green-50 text-green-700 border-green-200",
    INACTIVE: "bg-yellow-50 text-yellow-700 border-yellow-200",
    BANNED: "bg-red-50 text-red-700 border-red-200",
    PENDING: "bg-gray-50 text-gray-700 border-gray-200",
  };

  const users = data?.users || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="mt-1 text-sm text-gray-500">Manage all registered users</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
        <StatCard label="Total" value={data?.totalUsers ?? 0} color="bg-blue-500" />
        <StatCard label="Active" value={data?.activeUsers ?? 0} color="bg-green-500" />
        <StatCard label="Inactive" value={data?.inactiveUsers ?? 0} color="bg-yellow-500" />
        <StatCard label="Banned" value={data?.bannedUsers ?? 0} color="bg-red-500" />
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-40">
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="BANNED">Banned</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Search
          </button>

          {/* Clear */}
          {(search || statusFilter) && (
            <button
              type="button"
              onClick={() => { setSearch(""); setStatusFilter(""); setPage(0); }}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-indigo-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-3 text-left font-medium text-gray-500">User</th>
                  <th
                    className="px-5 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-900"
                    onClick={() => handleSort("email")}
                  >
                    Email <SortIcon field="email" />
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Role</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Status</th>
                  <th
                    className="px-5 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-900"
                    onClick={() => handleSort("createdAt")}
                  >
                    Joined <SortIcon field="createdAt" />
                  </th>
                  <th className="px-5 py-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* User */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold shrink-0">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                          {user.phone && <p className="text-xs text-gray-400">{user.phone}</p>}
                        </div>
                      </div>
                    </td>
                    {/* Email */}
                    <td className="px-5 py-3.5 text-gray-600">{user.email}</td>
                    {/* Role */}
                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600">
                        {user.roles?.join(", ") || "CUSTOMER"}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[user.status] || statusColors.PENDING}`}>
                        {user.status}
                      </span>
                    </td>
                    {/* Joined */}
                    <td className="px-5 py-3.5 text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {/* Status Toggle Buttons */}
                        {user.status !== "ACTIVE" && (
                          <button
                            onClick={() => handleStatusUpdate(user.id, "ACTIVE")}
                            disabled={actionLoading === user.id}
                            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
                            title="Activate"
                          >
                            Activate
                          </button>
                        )}
                        {user.status !== "BANNED" && (
                          <button
                            onClick={() => handleStatusUpdate(user.id, "BANNED")}
                            disabled={actionLoading === user.id}
                            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="Ban"
                          >
                            Ban
                          </button>
                        )}
                        {user.status === "ACTIVE" && (
                          <button
                            onClick={() => handleStatusUpdate(user.id, "INACTIVE")}
                            disabled={actionLoading === user.id}
                            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-yellow-600 hover:bg-yellow-50 transition-colors disabled:opacity-50"
                            title="Deactivate"
                          >
                            Deactivate
                          </button>
                        )}

                        {/* Delete */}
                        {deleteConfirmId === user.id ? (
                          <div className="flex items-center gap-1 ml-1">
                            <button
                              onClick={() => handleDelete(user.id)}
                              disabled={actionLoading === user.id}
                              className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(user.id)}
                            className="rounded-lg px-2 py-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1"
                            title="Delete"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
            <p className="text-sm text-gray-500">
              Page {page + 1} of {totalPages} ({data?.totalElements} total)
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(0, Math.min(page - 2, totalPages - 5));
                const pageNum = start + i;
                if (pageNum >= totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      page === pageNum
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
    <div className="flex items-center gap-3">
      <div className={`h-3 w-3 rounded-full ${color}`} />
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default Users;

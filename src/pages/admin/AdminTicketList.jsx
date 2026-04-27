import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAdminTickets, getTicketStats } from "../../api/adminSupportApi";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

const STATUS_COLORS = {
  OPEN: "bg-blue-50 text-blue-700",
  IN_PROGRESS: "bg-yellow-50 text-yellow-700",
  RESOLVED: "bg-green-50 text-green-700",
  CLOSED: "bg-gray-100 text-gray-500",
};

const PRIORITY_COLORS = {
  LOW: "bg-slate-50 text-slate-600",
  MEDIUM: "bg-blue-50 text-blue-600",
  HIGH: "bg-orange-50 text-orange-600",
  URGENT: "bg-red-50 text-red-600",
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCategory = (cat) => {
  if (!cat) return "";
  return cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const AdminTicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [accessDenied, setAccessDenied] = useState(false);
  const [error, setError] = useState("");

  // Stats
  const [stats, setStats] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const response = await getTicketStats();
      setStats(response.data?.data || response.data);
    } catch {
      // Silently skip — stats are non-critical
    }
  }, []);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminTickets(page, 10, statusFilter || null);
      const data = response.data?.data || response.data;
      setTickets(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      if (err.response?.status === 403) {
        setAccessDenied(true);
      } else {
        setError("Failed to load tickets. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  if (accessDenied) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Access Denied</h2>
          <p className="text-sm text-gray-500">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and respond to customer support tickets</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="rounded-xl bg-white p-4 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Open</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.totalOpen}</p>
          </div>
          <div className="rounded-xl bg-white p-4 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.totalInProgress}</p>
          </div>
          <div className="rounded-xl bg-white p-4 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Resolved</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.totalResolved}</p>
          </div>
          <div className="rounded-xl bg-white p-4 border border-gray-100 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Closed</p>
            <p className="text-2xl font-bold text-gray-500 mt-1">{stats.totalClosed}</p>
          </div>
          <div className="rounded-xl bg-white p-4 border border-red-100 shadow-sm">
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">Urgent</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{stats.urgentCount}</p>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-4">
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="rounded-lg border border-gray-200 bg-white py-2 px-4 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-100 p-4 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <svg className="animate-spin h-8 w-8 text-indigo-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : tickets.length === 0 ? (
        <div className="rounded-xl bg-white p-12 border border-gray-100 shadow-sm text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <svg className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No support tickets found.</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tickets.map((ticket) => (
                    <tr key={ticket.ticketId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-medium text-gray-500">#{ticket.ticketId}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{ticket.subject}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-600">{formatCategory(ticket.category)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${PRIORITY_COLORS[ticket.priority] || "bg-gray-100 text-gray-600"}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[ticket.status] || "bg-gray-100 text-gray-600"}`}>
                          {ticket.status?.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-500">{formatDate(ticket.createdAt)}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          to={`/admin/support/${ticket.ticketId}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition-colors"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Page {page + 1} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminTicketList;

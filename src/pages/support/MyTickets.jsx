import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyTickets } from "../../api/supportApi";
import { useToast } from "../../context/ToastContext";

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

const MyTickets = () => {
  const { showError } = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await getMyTickets();
      const data = response.data?.data || response.data || [];
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      showError("Failed to load support tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-indigo-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">My Support Tickets</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
              <span className="material-symbols-outlined text-xl text-indigo-600">
                confirmation_number
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Support Tickets</h1>
              <p className="text-sm text-gray-500">
                {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Link
            to="/support/submit"
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            New Ticket
          </Link>
        </div>

        {/* Content */}
        {tickets.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 shadow-sm border border-gray-100 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <span className="material-symbols-outlined text-3xl text-gray-400">
                inbox
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              You have no support tickets yet.
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Need help? Submit a support ticket and we'll get back to you.
            </p>
            <Link
              to="/support/submit"
              className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Submit a Ticket
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.ticketId}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[220px]">
                          {ticket.subject}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {formatCategory(ticket.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                            STATUS_COLORS[ticket.status] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {ticket.status?.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                            PRIORITY_COLORS[ticket.priority] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">
                          {formatDate(ticket.createdAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/support/tickets/${ticket.ticketId}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3.5 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">
                            visibility
                          </span>
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;

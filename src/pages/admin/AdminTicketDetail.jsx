import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getAdminTicketDetail, updateTicketStatus, addAdminReply } from "../../api/adminSupportApi";

const STATUS_COLORS = {
  OPEN: "bg-blue-50 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-yellow-50 text-yellow-700 border-yellow-200",
  RESOLVED: "bg-green-50 text-green-700 border-green-200",
  CLOSED: "bg-gray-100 text-gray-500 border-gray-200",
};

const PRIORITY_COLORS = {
  LOW: "bg-slate-50 text-slate-600",
  MEDIUM: "bg-blue-50 text-blue-600",
  HIGH: "bg-orange-50 text-orange-600",
  URGENT: "bg-red-50 text-red-600",
};

const STATUS_OPTIONS = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

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

const AdminTicketDetail = () => {
  const { id } = useParams();

  // Ticket state
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  // Status update
  const [newStatus, setNewStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [statusSuccess, setStatusSuccess] = useState("");

  // Admin reply
  const [replyMessage, setReplyMessage] = useState("");
  const [replyError, setReplyError] = useState("");
  const [replySuccess, setReplySuccess] = useState("");
  const [replySending, setReplySending] = useState(false);

  useEffect(() => {
    fetchTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTicket = async () => {
    try {
      const response = await getAdminTicketDetail(id);
      const data = response.data?.data || response.data;
      setTicket(data);
      setMessages(data.messages || []);
      setNewStatus(data.status || "OPEN");
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      } else if (err.response?.status === 403) {
        setAccessDenied(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setStatusError("");
    setStatusSuccess("");
    setStatusUpdating(true);
    try {
      const response = await updateTicketStatus(id, {
        status: newStatus,
        adminNote: adminNote.trim() || null,
      });
      const data = response.data?.data || response.data;
      setTicket((prev) => ({ ...prev, status: data.status || newStatus }));
      setAdminNote("");
      setStatusSuccess("Status updated successfully.");
      setTimeout(() => setStatusSuccess(""), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || "";
      if (msg.toLowerCase().includes("cannot change status") || msg.toLowerCase().includes("transition")) {
        setStatusError("This status transition is not allowed.");
      } else {
        setStatusError(msg || "Failed to update status.");
      }
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAdminReply = async (e) => {
    e.preventDefault();
    setReplyError("");
    setReplySuccess("");

    if (!replyMessage.trim()) {
      setReplyError("Reply message is required.");
      return;
    }
    if (replyMessage.trim().length > 2000) {
      setReplyError("Message must not exceed 2000 characters.");
      return;
    }

    setReplySending(true);
    try {
      const response = await addAdminReply(id, { message: replyMessage.trim() });
      const msg = response.data?.data || response.data;
      setMessages((prev) => [...prev, msg]);
      setReplyMessage("");
      setReplySuccess("Reply sent and customer notified.");
      // Auto-update status to IN_PROGRESS if it was OPEN
      if (ticket?.status === "OPEN") {
        setTicket((prev) => ({ ...prev, status: "IN_PROGRESS" }));
        setNewStatus("IN_PROGRESS");
      }
      setTimeout(() => setReplySuccess(""), 4000);
    } catch (err) {
      setReplyError(err.response?.data?.message || "Failed to send reply.");
    } finally {
      setReplySending(false);
    }
  };

  // --- Render guards ---

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-indigo-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Access Denied</h2>
        <p className="text-sm text-gray-500">You do not have permission to view this ticket.</p>
      </div>
    );
  }

  if (notFound || !ticket) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Ticket not found.</h2>
        <Link to="/admin/support" className="text-sm text-indigo-600 hover:text-indigo-700 mt-2 inline-block">
          ← Back to Tickets
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-5 text-sm text-gray-500">
        <Link to="/admin/support" className="hover:text-indigo-600 transition-colors">
          Support Tickets
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Ticket #{id}</span>
      </nav>

      {/* Ticket Info Card */}
      <div className="rounded-xl bg-white p-5 border border-gray-100 shadow-sm mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{ticket.subject}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              #{ticket.ticketId || id} • {formatDate(ticket.createdAt)}
            </p>
          </div>
          <span className={`self-start rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[ticket.status] || "bg-gray-100 text-gray-600"}`}>
            {ticket.status?.replace(/_/g, " ")}
          </span>
        </div>

        {/* Description */}
        {ticket.description && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div>
            <span className="text-gray-400 text-xs uppercase font-semibold">Category:</span>{" "}
            <span className="text-gray-700 font-medium">{formatCategory(ticket.category)}</span>
          </div>
          <div>
            <span className="text-gray-400 text-xs uppercase font-semibold">Priority:</span>{" "}
            <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${PRIORITY_COLORS[ticket.priority] || "bg-gray-100 text-gray-600"}`}>
              {ticket.priority}
            </span>
          </div>
          <div>
            <span className="text-gray-400 text-xs uppercase font-semibold">Customer:</span>{" "}
            <span className="text-gray-700 font-medium">{ticket.customerName || "N/A"}</span>
          </div>
          {ticket.customerEmail && (
            <div>
              <span className="text-gray-400 text-xs uppercase font-semibold">Email:</span>{" "}
              <span className="text-gray-700">{ticket.customerEmail}</span>
            </div>
          )}
          {ticket.assignedAdmin && (
            <div>
              <span className="text-gray-400 text-xs uppercase font-semibold">Assigned Admin:</span>{" "}
              <span className="text-gray-700 font-medium">{ticket.assignedAdmin}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Messages */}
        <div className="lg:col-span-2 space-y-5">
          {/* Message Thread */}
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">Messages ({messages.length})</h2>
            </div>

            {messages.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-gray-400">No messages yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
                {messages.map((msg, index) => (
                  <div
                    key={msg.messageId || index}
                    className={`px-5 py-4 ${msg.isAdminReply || msg.adminReply ? "bg-indigo-50/30" : ""}`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-gray-900">
                        {msg.senderName || "Customer"}
                      </span>
                      {(msg.isAdminReply || msg.adminReply) && (
                        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                          Admin Reply
                        </span>
                      )}
                      <span className="text-xs text-gray-400 ml-auto">
                        {formatDate(msg.sentAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Admin Reply Form */}
          <div className="rounded-xl bg-white p-5 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Send Admin Reply</h3>
            <form onSubmit={handleAdminReply}>
              <textarea
                value={replyMessage}
                onChange={(e) => {
                  setReplyMessage(e.target.value);
                  if (replyError) setReplyError("");
                }}
                rows={4}
                maxLength={2000}
                placeholder="Type your reply to the customer..."
                className={`w-full rounded-lg border ${
                  replyError ? "border-red-300" : "border-gray-200"
                } bg-gray-50 py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors resize-vertical`}
              />
              <div className="flex items-center justify-between mt-2">
                <div>
                  {replyError && <p className="text-xs text-red-500">{replyError}</p>}
                  {replySuccess && <p className="text-xs text-green-600 font-medium">{replySuccess}</p>}
                  <p className="text-xs text-gray-400 mt-0.5">{replyMessage.length}/2000</p>
                </div>
                <button
                  type="submit"
                  disabled={replySending}
                  className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {replySending ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Reply
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Status Update */}
        <div className="space-y-5">
          <div className="rounded-xl bg-white p-5 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Update Status</h3>
            <form onSubmit={handleStatusUpdate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Admin Note (optional)</label>
                <input
                  type="text"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Reason for status change..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              {statusError && <p className="text-xs text-red-500">{statusError}</p>}
              {statusSuccess && <p className="text-xs text-green-600 font-medium">{statusSuccess}</p>}
              <button
                type="submit"
                disabled={statusUpdating}
                className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {statusUpdating ? "Updating..." : "Update Status"}
              </button>
            </form>
          </div>

          {/* Quick Info */}
          <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quick Info</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Messages</span>
                <span className="font-medium text-gray-700">{messages.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span className="font-medium text-gray-700">{formatDate(ticket.createdAt)}</span>
              </div>
              {ticket.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Updated</span>
                  <span className="font-medium text-gray-700">{formatDate(ticket.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTicketDetail;

import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getTicketById, addTicketMessage, closeTicket } from "../../api/supportApi";
import { useToast } from "../../context/ToastContext";

const STATUS_COLORS = {
  OPEN: "bg-blue-50 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-yellow-50 text-yellow-700 border-yellow-200",
  RESOLVED: "bg-green-50 text-green-700 border-green-200",
  CLOSED: "bg-gray-100 text-gray-500 border-gray-200",
};

const PRIORITY_COLORS = {
  LOW: "bg-slate-50 text-slate-600 border-slate-200",
  MEDIUM: "bg-blue-50 text-blue-600 border-blue-200",
  HIGH: "bg-orange-50 text-orange-600 border-orange-200",
  URGENT: "bg-red-50 text-red-600 border-red-200",
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

const TicketDetail = () => {
  const { id } = useParams();
  const { showSuccess, showError } = useToast();

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [closingTicket, setClosingTicket] = useState(false);
  const [closeError, setCloseError] = useState("");

  useEffect(() => {
    fetchTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTicket = async () => {
    try {
      const response = await getTicketById(id);
      const data = response.data?.data || response.data;
      setTicket(data);
      setMessages(data.messages || []);
    } catch (err) {
      showError("Failed to load ticket details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setMessageError("");

    if (!newMessage.trim()) {
      setMessageError("Message is required");
      return;
    }
    if (newMessage.trim().length > 2000) {
      setMessageError("Message must not exceed 2000 characters");
      return;
    }

    setSendingMessage(true);
    try {
      const response = await addTicketMessage(id, { message: newMessage.trim() });
      const msg = response.data?.data || response.data;
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
      showSuccess("Message sent successfully.");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send message.";
      setMessageError(msg);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleCloseTicket = async () => {
    setCloseError("");
    setClosingTicket(true);
    try {
      const response = await closeTicket(id);
      const data = response.data?.data || response.data;
      setTicket((prev) => ({ ...prev, status: data.status || "CLOSED" }));
      showSuccess("Ticket closed successfully.");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to close ticket.";
      setCloseError(msg);
    } finally {
      setClosingTicket(false);
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

  if (!ticket) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-gray-50 py-8 px-4">
        <div className="mx-auto max-w-3xl text-center py-16">
          <p className="text-gray-500">Ticket not found.</p>
          <Link
            to="/support/tickets"
            className="mt-4 inline-block text-sm text-indigo-600 hover:text-indigo-700"
          >
            ← Back to My Tickets
          </Link>
        </div>
      </div>
    );
  }

  const isClosed = ticket.status === "CLOSED";

  return (
    <div className="min-h-[calc(100vh-140px)] bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/support/tickets" className="hover:text-indigo-600 transition-colors">
            My Tickets
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Ticket #{id}</span>
        </nav>

        {/* Ticket Info Card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                {ticket.subject}
              </h1>
              <p className="text-sm text-gray-500">
                Ticket #{ticket.ticketId || id} • Created {formatDate(ticket.createdAt)}
              </p>
            </div>
            {!isClosed && (
              <button
                onClick={handleCloseTicket}
                disabled={closingTicket}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
              >
                {closingTicket ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <span className="material-symbols-outlined text-sm">lock</span>
                )}
                {closingTicket ? "Closing..." : "Close Ticket"}
              </button>
            )}
          </div>
          {closeError && (
            <p className="mb-4 text-xs text-red-500">{closeError}</p>
          )}

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400 uppercase">Category</span>
              <span className="text-sm font-medium text-gray-700">
                {formatCategory(ticket.category)}
              </span>
            </div>
            <span className="text-gray-200">|</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400 uppercase">Status</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  STATUS_COLORS[ticket.status] || "bg-gray-100 text-gray-600"
                }`}
              >
                {ticket.status?.replace(/_/g, " ")}
              </span>
            </div>
            <span className="text-gray-200">|</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400 uppercase">Priority</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  PRIORITY_COLORS[ticket.priority] || "bg-gray-100 text-gray-600"
                }`}
              >
                {ticket.priority}
              </span>
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-gray-400">
                forum
              </span>
              Messages ({messages.length})
            </h2>
          </div>

          {messages.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-gray-400">No messages yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {messages.map((msg, index) => (
                <div
                  key={msg.messageId || index}
                  className={`px-6 py-4 ${
                    msg.isAdminReply ? "bg-indigo-50/30" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-semibold text-gray-900">
                      {msg.senderName || "You"}
                    </span>
                    {msg.isAdminReply && (
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

        {/* Add Message */}
        {!isClosed && (
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-gray-400">
                reply
              </span>
              Add a Message
            </h3>
            <form onSubmit={handleSendMessage}>
              <textarea
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  if (messageError) setMessageError("");
                }}
                rows={4}
                maxLength={2000}
                placeholder="Type your message here..."
                className={`w-full rounded-lg border ${
                  messageError ? "border-red-300" : "border-gray-200"
                } bg-gray-50 py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors resize-vertical`}
              />
              <div className="flex items-center justify-between mt-2">
                <div>
                  {messageError && (
                    <p className="text-xs text-red-500">{messageError}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {newMessage.length}/2000 characters
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={sendingMessage}
                  className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {sendingMessage ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">send</span>
                      Send
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {isClosed && (
          <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 text-center">
            <span className="material-symbols-outlined text-2xl text-gray-400 mb-2">lock</span>
            <p className="text-sm text-gray-500">
              This ticket is closed. You cannot add new messages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;

import React, { useState } from "react";
import { processRefund } from "../../api/orderApi";
import { useToast } from "../../context/ToastContext";
import { formatPrice } from "../../utils/formatters";

const RefundModal = ({ isOpen, onClose, order, onRefundSuccess }) => {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    refundAmount: order?.totalAmount || 0,
    reason: "",
    fullRefund: true,
    notes: "",
  });

  if (!isOpen || !order) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "fullRefund") {
      setFormData((prev) => ({
        ...prev,
        fullRefund: checked,
        refundAmount: checked ? order.totalAmount : prev.refundAmount,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.reason.trim()) {
      showError("Please provide a reason for the refund");
      return;
    }

    if (formData.reason.trim().length < 10) {
      showError("Refund reason must be at least 10 characters");
      return;
    }

    if (!formData.fullRefund && formData.refundAmount > order.totalAmount) {
      showError("Refund amount cannot exceed order total");
      return;
    }

    if (!formData.fullRefund && formData.refundAmount <= 0) {
      showError("Refund amount must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      const response = await processRefund(order.id, {
        refundAmount: formData.fullRefund ? order.totalAmount : parseFloat(formData.refundAmount),
        reason: formData.reason.trim(),
        fullRefund: formData.fullRefund,
        notes: formData.notes.trim() || null,
      });

      showSuccess("Refund processed successfully");
      onRefundSuccess?.(response.data?.data || response.data);
      onClose();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to process refund");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Process Refund</h2>
            <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Order Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Order Total</span>
            <span className="text-lg font-bold text-gray-900">{formatPrice(order.totalAmount)}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-600">Current Status</span>
            <span className="text-sm font-medium text-gray-700">{order.orderStatus}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Refund Toggle */}
          <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              name="fullRefund"
              checked={formData.fullRefund}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <span className="font-medium text-gray-900">Full Refund</span>
              <p className="text-xs text-gray-500">Refund the entire order amount</p>
            </div>
          </label>

          {/* Refund Amount (if not full refund) */}
          {!formData.fullRefund && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Refund Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="refundAmount"
                  value={formData.refundAmount}
                  onChange={handleChange}
                  min="0.01"
                  max={order.totalAmount}
                  step="0.01"
                  className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Max: {formatPrice(order.totalAmount)}
              </p>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Refund Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={3}
              placeholder="Enter the reason for this refund..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
              required
              minLength={10}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.reason.length}/500 characters (min 10)
            </p>
          </div>

          {/* Notes (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Internal Notes <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional notes..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                `Refund ${formatPrice(formData.fullRefund ? order.totalAmount : formData.refundAmount)}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RefundModal;
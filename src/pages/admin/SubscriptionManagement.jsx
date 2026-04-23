import React, { useEffect, useState } from "react";
import { getAdminMemberships } from "../../api/membershipApi";
import { useToast } from "../../context/ToastContext";
import Loader from "../../components/common/Loader";

const SubscriptionManagement = () => {
  const { showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const load = async (p = 0) => {
    setLoading(true);
    try {
      const res = await getAdminMemberships({ page: p, size: 20 });
      const body = res.data?.data || res.data;
      setRows(body.content || []);
      setTotalPages(body.totalPages || 0);
      setPage(body.page ?? p);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to load memberships");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Memberships</h1>
      <p className="mt-1 text-sm text-gray-500">Customer subscription plans (store-wide discounts).</p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs font-bold uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Billing</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 text-gray-600">{r.id}</td>
                <td className="px-4 py-3">{r.customerEmail}</td>
                <td className="px-4 py-3 font-medium">{r.plan}</td>
                <td className="px-4 py-3">{r.billingPeriod}</td>
                <td className="px-4 py-3">{r.status}</td>
                <td className="px-4 py-3 text-gray-600">
                  {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <button
            type="button"
            disabled={page <= 0}
            onClick={() => load(page - 1)}
            className="text-sm font-semibold text-indigo-600 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500">Page {page + 1}</span>
          <button
            type="button"
            disabled={page >= totalPages - 1}
            onClick={() => load(page + 1)}
            className="text-sm font-semibold text-indigo-600 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagement;

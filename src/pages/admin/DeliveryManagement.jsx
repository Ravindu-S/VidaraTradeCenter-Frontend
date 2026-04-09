import React, { useState, useEffect } from "react";
import {
  getAdminOrders,
  createDeliveryTracking,
  updateDeliveryStatus,
  getOverdueDeliveries,
  getAdminDeliveryTracking,
} from "../../api/adminApi";
import { useToast } from "../../context/ToastContext";
import { formatDateShort } from "../../utils/formatters";
import DeliveryStatusBadge from "../../components/order/DeliveryStatusBadge";

const DeliveryManagement = () => {
  const { showSuccess, showError } = useToast();
  const [orders, setOrders] = useState([]);
  const [overdueOrders, setOverdueOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingForm, setTrackingForm] = useState({
    trackingNumber: "",
    courierName: "",
    estimatedDeliveryDate: "",
  });
  const [trackingMap, setTrackingMap] = useState({});

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTrackingForOrders = async (orderList) => {
    const trackingEntries = await Promise.all(
      orderList.map(async (order) => {
        try {
          const res = await getAdminDeliveryTracking(order.id);
          const tracking = res.data?.data || res.data;

            // If backend returns "not started", id will be null -> treat as no tracking
            if (!tracking?.id) {
              return [order.id, null];
            }

            return [order.id, tracking];
        } catch (err) {
          return [order.id, null];
        }
      })
    );

    return Object.fromEntries(trackingEntries);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, overdueRes] = await Promise.all([
        getAdminOrders({ size: 50 }),
        getOverdueDeliveries(),
      ]);

      const allOrders = ordersRes.data?.data?.orders || [];
      const eligibleOrders = allOrders.filter((order) =>
        ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"].includes(order.orderStatus)
      );

      const trackingData = await fetchTrackingForOrders(eligibleOrders);

      setOrders(eligibleOrders);
      setTrackingMap(trackingData);
      setOverdueOrders(overdueRes.data?.data || []);
    } catch (err) {
      showError("Failed to load delivery data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTracking = async (orderId) => {
    try {
      await createDeliveryTracking(orderId, trackingForm);
      showSuccess("Delivery tracking created");
      setSelectedOrder(null);
      setTrackingForm({
        trackingNumber: "",
        courierName: "",
        estimatedDeliveryDate: "",
      });
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to create tracking");
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateDeliveryStatus(orderId, newStatus);
      showSuccess(`Delivery status updated to ${newStatus}`);
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update status");
    }
  };

  const deliveryStatuses = [
    "PREPARING",
    "SHIPPED",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];

  const allShipments = orders.map((order) => ({
    ...order,
    deliveryTracking: trackingMap[order.id] || null,
  }));

  const inTransitCount = allShipments.filter(
    (item) => item.deliveryTracking
  ).length;

  const onTrackCount = Math.max(0, inTransitCount - overdueOrders.length);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-indigo-600" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Delivery Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage order deliveries
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tracked Deliveries</p>
              <p className="text-2xl font-bold text-gray-900">{inTransitCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{overdueOrders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">On Track</p>
              <p className="text-2xl font-bold text-gray-900">{onTrackCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "all"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          All Shipments
        </button>
        <button
          onClick={() => setActiveTab("overdue")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "overdue"
              ? "bg-red-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Overdue ({overdueOrders.length})
        </button>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {(activeTab === "all" ? allShipments : overdueOrders).length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === "overdue" ? "No overdue deliveries" : "No shipments to track"}
            </h3>
            <p className="text-gray-500">
              {activeTab === "overdue"
                ? "All deliveries are on schedule!"
                : "Orders that need shipping will appear here"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {(activeTab === "all" ? allShipments : overdueOrders).map((item) => {
              const tracking = item.deliveryTracking || null;
              const hasTracking = !!tracking && !!tracking.id;

              return (
                <div key={item.id || item.orderNumber} className="p-6 hover:bg-gray-50">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Order #{item.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDateShort(item.orderDate || item.createdAt)}
                      </p>

                      {hasTracking && tracking.trackingNumber && (
                        <p className="text-sm text-gray-600 mt-1">
                          Tracking: <span className="font-mono">{tracking.trackingNumber}</span>
                        </p>
                      )}

                      {hasTracking && tracking.courierName && (
                        <p className="text-sm text-gray-600">
                          Courier: {tracking.courierName}
                        </p>
                      )}

                      {hasTracking && tracking.estimatedDeliveryDate && (
                        <p className="text-sm text-gray-600">
                          Estimated Delivery:{" "}
                          <span className="font-medium">
                            {formatDateShort(tracking.estimatedDeliveryDate)}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <DeliveryStatusBadge
                        status={tracking?.status || "PREPARING"}
                      />

                      {hasTracking && activeTab === "all" && (
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleUpdateStatus(item.id, e.target.value);
                              e.target.value = "";
                            }
                          }}
                          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Update Status
                          </option>
                          {deliveryStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status.replace(/_/g, " ")}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  {!hasTracking && activeTab === "all" && selectedOrder === item.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-medium text-gray-900 mb-3">Add Tracking Information</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Tracking Number"
                          value={trackingForm.trackingNumber}
                          onChange={(e) =>
                            setTrackingForm((prev) => ({
                              ...prev,
                              trackingNumber: e.target.value,
                            }))
                          }
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Courier Name"
                          value={trackingForm.courierName}
                          onChange={(e) =>
                            setTrackingForm((prev) => ({
                              ...prev,
                              courierName: e.target.value,
                            }))
                          }
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                        <input
                          type="date"
                          value={trackingForm.estimatedDeliveryDate}
                          onChange={(e) =>
                            setTrackingForm((prev) => ({
                              ...prev,
                              estimatedDeliveryDate: e.target.value,
                            }))
                          }
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleCreateTracking(item.id)}
                          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                        >
                          Save Tracking
                        </button>
                        <button
                          onClick={() => setSelectedOrder(null)}
                          className="px-4 py-2 text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {!hasTracking && activeTab === "all" && selectedOrder !== item.id && (
                    <button
                      onClick={() => setSelectedOrder(item.id)}
                      className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      + Add Tracking Information
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryManagement;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from "../../api/addressApi";
import { useToast } from "../../context/ToastContext";

const Addresses = () => {
  const { showSuccess, showError } = useToast();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    label: "",
    recipientName: "",
    phone: "",
    isDefault: false,
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await getAddresses();
      const data = response.data?.data || response.data || [];
      setAddresses(Array.isArray(data) ? data : []);
    } catch (err) {
      showError("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.street.trim()) newErrors.street = "Street is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.recipientName.trim()) newErrors.recipientName = "Recipient name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        street: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state.trim() || null,
        zipCode: formData.zipCode.trim() || null,
        country: formData.country.trim(),
        label: formData.label.trim() || null,
        recipientName: formData.recipientName.trim(),
        phone: formData.phone.trim(),
        isDefault: formData.isDefault,
      };

      if (editingId) {
        await updateAddress(editingId, payload);
        showSuccess("Address updated successfully!");
      } else {
        await addAddress(payload);
        showSuccess("Address added successfully!");
      }

      resetForm();
      fetchAddresses();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to save address";
      showError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (address) => {
    setFormData({
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      zipCode: address.zipCode || "",
      country: address.country || "",
      label: address.label || "",
      recipientName: address.recipientName || "",
      phone: address.phone || "",
      isDefault: address.isDefault || address.default || false,
    });
    setEditingId(address.id);
    setShowForm(true);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await deleteAddress(id);
      showSuccess("Address deleted successfully!");
      setDeleteConfirmId(null);
      fetchAddresses();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete address";
      showError(message);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      showSuccess("Default address updated!");
      fetchAddresses();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to set default address";
      showError(message);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  };

  const labelOptions = ["Home", "Work", "Other"];

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
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/profile" className="hover:text-indigo-600 transition-colors">My Profile</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Addresses</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your shipping and billing addresses
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => { setShowForm(true); setEditingId(null); setFormData(emptyForm); setErrors({}); }}
              className="flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Address
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? "Edit Address" : "Add New Address"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Label Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Label</label>
                <div className="flex flex-wrap gap-2">
                  {labelOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, label: opt }))}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${
                        formData.label === opt
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient & Phone */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Recipient Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full rounded-lg border ${errors.recipientName ? "border-red-300" : "border-gray-200"} bg-gray-50 py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors`}
                  />
                  {errors.recipientName && <p className="mt-1 text-xs text-red-500">{errors.recipientName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full rounded-lg border ${errors.phone ? "border-red-300" : "border-gray-200"} bg-gray-50 py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors`}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>
              </div>

              {/* Street */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="123 Main Street, Apt 4B"
                  className={`w-full rounded-lg border ${errors.street ? "border-red-300" : "border-gray-200"} bg-gray-50 py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors`}
                />
                {errors.street && <p className="mt-1 text-xs text-red-500">{errors.street}</p>}
              </div>

              {/* City, State */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                    className={`w-full rounded-lg border ${errors.city ? "border-red-300" : "border-gray-200"} bg-gray-50 py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors`}
                  />
                  {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">State / Province</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="NY"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Zip, Country */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Zip / Postal Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="10001"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="United States"
                    className={`w-full rounded-lg border ${errors.country ? "border-red-300" : "border-gray-200"} bg-gray-50 py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors`}
                  />
                  {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
                </div>
              </div>

              {/* Default Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  id="isDefault"
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-600">
                  Set as default address
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {saving && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {saving ? "Saving..." : editingId ? "Update Address" : "Add Address"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address List */}
        {addresses.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 shadow-sm border border-gray-100 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No addresses yet</h3>
            <p className="mt-1 text-sm text-gray-500">Add your first address to get started</p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Address
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`relative rounded-2xl bg-white p-5 shadow-sm border transition-colors ${
                  (addr.isDefault || addr.default) ? "border-indigo-200 ring-1 ring-indigo-100" : "border-gray-100"
                }`}
              >
                {/* Default Badge */}
                {(addr.isDefault || addr.default) && (
                  <span className="absolute top-4 right-4 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                    Default
                  </span>
                )}

                {/* Label */}
                {addr.label && (
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-600">
                      {addr.label}
                    </span>
                  </div>
                )}

                {/* Recipient */}
                <p className="text-sm font-semibold text-gray-900">{addr.recipientName}</p>
                <p className="text-sm text-gray-500 mt-0.5">{addr.phone}</p>

                {/* Address Lines */}
                <div className="mt-3 text-sm text-gray-600 leading-relaxed">
                  <p>{addr.street}</p>
                  <p>
                    {addr.city}
                    {addr.state ? `, ${addr.state}` : ""}
                    {addr.zipCode ? ` ${addr.zipCode}` : ""}
                  </p>
                  <p>{addr.country}</p>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
                  <button
                    onClick={() => handleEdit(addr)}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>

                  {!(addr.isDefault || addr.default) && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Set Default
                    </button>
                  )}

                  {deleteConfirmId === addr.id ? (
                    <div className="ml-auto flex items-center gap-1">
                      <span className="text-xs text-red-600 mr-1">Delete?</span>
                      <button
                        onClick={() => handleDelete(addr.id)}
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(addr.id)}
                      className="ml-auto flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;

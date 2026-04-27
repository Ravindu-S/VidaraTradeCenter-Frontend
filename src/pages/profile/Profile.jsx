import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProfile, updateProfile } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const Profile = () => {
  const { user, login, token } = useAuth();
  const { showSuccess, showError } = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    profilePicture: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      const data = response.data?.data || response.data;
      setProfile(data);
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phone: data.phone || "",
        profilePicture: data.profilePicture || "",
      });
    } catch (err) {
      showError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }
    if (formData.phone && formData.phone.length > 20) {
      newErrors.phone = "Phone number must not exceed 20 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const response = await updateProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim() || null,
        profilePicture: formData.profilePicture.trim() || null,
      });
      const updated = response.data?.data || response.data;
      setProfile(updated);
      login(token, { ...user, firstName: updated.firstName, lastName: updated.lastName });
      setEditing(false);
      showSuccess("Profile updated successfully!");
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update profile";
      showError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      phone: profile.phone || "",
      profilePicture: profile.profilePicture || "",
    });
    setErrors({});
    setEditing(false);
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
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">My Profile</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar Card */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 text-center">
              {/* Avatar */}
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-3xl font-bold">
                {profile?.firstName?.charAt(0)?.toUpperCase()}
                {profile?.lastName?.charAt(0)?.toUpperCase()}
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                {profile?.firstName} {profile?.lastName}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{profile?.email}</p>
              <span className="mt-3 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                {profile?.role}
              </span>

              {/* Status */}
              <div className="mt-6 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${profile?.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`}></span>
                  <span className="text-sm text-gray-600">{profile?.status}</span>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-6 space-y-2">
                <Link
                  to="/profile/addresses"
                  className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  My Addresses
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Personal Information</h1>
                  <p className="text-sm text-gray-500 mt-1">Manage your personal details</p>
                </div>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                )}
              </div>

              {editing ? (
                /* Edit Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full rounded-lg border ${
                          errors.firstName ? "border-red-300" : "border-gray-200"
                        } bg-gray-50 py-3 px-4 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors`}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full rounded-lg border ${
                          errors.lastName ? "border-red-300" : "border-gray-200"
                        } bg-gray-50 py-3 px-4 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors`}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profile?.email || ""}
                      disabled
                      className="w-full rounded-lg border border-gray-200 bg-gray-100 py-3 px-4 text-sm text-gray-500 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-400">Email cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full rounded-lg border ${
                        errors.phone ? "border-red-300" : "border-gray-200"
                      } bg-gray-50 py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      {saving ? (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : null}
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* View Mode */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <InfoField label="First Name" value={profile?.firstName} />
                    <InfoField label="Last Name" value={profile?.lastName} />
                    <InfoField label="Email Address" value={profile?.email} />
                    <InfoField label="Phone Number" value={profile?.phone || "Not provided"} muted={!profile?.phone} />
                    <InfoField label="Member Since" value={formatDate(profile?.createdAt)} />
                    <InfoField label="Account Status" value={profile?.status} badge />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoField = ({ label, value, muted, badge }) => (
  <div>
    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</p>
    {badge ? (
      <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
        value === "ACTIVE" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
      }`}>
        {value}
      </span>
    ) : (
      <p className={`text-sm font-medium ${muted ? "text-gray-400 italic" : "text-gray-900"}`}>
        {value}
      </p>
    )}
  </div>
);

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default Profile;

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ClipboardList, Plus, UserCog } from "lucide-react";
import { canAccess } from "../utils/canAccess";
import { P } from "../constants/routePermissions.js";
import { adminTable } from "../components/AdminTableStyles";
import PageLoadingShell from "../components/PageLoadingShell";
import Loader from "../components/Loader";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[15px] text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15 disabled:cursor-not-allowed disabled:bg-slate-50";

const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600";

const sectionClass =
  "rounded-xl border border-slate-200/90 bg-slate-50/80 p-4 shadow-sm ring-1 ring-slate-900/[0.04]";

const EMPTY_FORM = {
  customerName: "",
  contact: "",
  customerEmail: "",
  brand: "",
  customerAddress: "",
  productDetails: "",
  quantity: "",
  condition: "",
  testRequirement: "",
  testMethod: "",
  documents: "",
  submittedBy: "",
  designation: "",
  returnable: "",
  srfNo: "",
  sampleDate: "",
  deliveryDate: "",
  conformity: "",
  receivedBy: "",
  submittedPerson: "",
};

const emptyNewCustomer = { name: "", phone: "", email: "", address: "" };

function formatObservationFilledAt(iso) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return null;
  }
}

export default function ServiceRequest() {
  const auth = useSelector((state) => state.auth);
  const { token } = auth;
  const navigate = useNavigate();
  const { id: editId } = useParams();
  const isEdit = Boolean(editId);

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingRecord, setLoadingRecord] = useState(() => isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [selectedServiceTypeId, setSelectedServiceTypeId] = useState("");
  const [engineerUserId, setEngineerUserId] = useState("");
  const [status, setStatus] = useState("submitted");
  const [observationUpdatedAt, setObservationUpdatedAt] = useState(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [customers, setCustomers] = useState([]);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customersFailed, setCustomersFailed] = useState(false);
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState(emptyNewCustomer);
  const [savingCustomer, setSavingCustomer] = useState(false);

  const canUseCustomerDirectory = Boolean(
    token && canAccess(auth, P.CUSTOMER_READ),
  );
  const canCreateCustomer = Boolean(
    token && canAccess(auth, P.CUSTOMER_CREATE),
  );

  const applyCustomer = useCallback((c) => {
    if (!c) return;
    setFormData((prev) => ({
      ...prev,
      customerName: c.name || "",
      contact: (c.phone || "").trim() || prev.contact,
      customerEmail: (c.email || "").trim() || prev.customerEmail,
      customerAddress: (c.address || "").trim() || prev.customerAddress,
    }));
    setSelectedCustomerId(String(c.id));
    setCustomerSearchQuery((c.name || "").trim());
  }, []);

  useEffect(() => {
    if (!isEdit) {
      setFormData({ ...EMPTY_FORM });
      setSelectedServiceTypeId("");
      setEngineerUserId("");
      setStatus("submitted");
      setObservationUpdatedAt(null);
    }
  }, [isEdit]);

  useEffect(() => {
    if (!token) {
      setLoadingOptions(false);
      setLoadingRecord(false);
      return;
    }
    let cancelled = false;
    const api = import.meta.env.VITE_API_URL;

    (async () => {
      setLoadingOptions(true);
      if (isEdit) setLoadingRecord(true);
      try {
        const [typesRes, engRes] = await Promise.all([
          axios.get(`${api}/service-types`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }),
          axios.get(`${api}/users/by-role/Engineer`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }),
        ]);
        if (cancelled) return;
        const types = Array.isArray(typesRes.data) ? typesRes.data : [];
        const eng = Array.isArray(engRes.data) ? engRes.data : [];
        setServiceTypes(types);
        setEngineers(eng);

        if (isEdit && editId) {
          const { data } = await axios.get(`${api}/service-requests/${editId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
          if (cancelled) return;
          const fd =
            data.form_data && typeof data.form_data === "object"
              ? data.form_data
              : {};
          setFormData({ ...EMPTY_FORM, ...fd });
          setStatus((data.status || "submitted").trim() || "submitted");
          setObservationUpdatedAt(data.observation_updated_at ?? null);
          setEngineerUserId(
            data.allotted_to_user_id != null
              ? String(data.allotted_to_user_id)
              : "",
          );
          const key = (data.service_type_key || "").trim();
          const st = types.find(
            (t) => t.name.trim().slice(0, 64) === key,
          );
          setSelectedServiceTypeId(st ? String(st.id) : "");
        }
      } catch (e) {
        console.error(e);
        if (isEdit && editId) {
          toast.error("Failed to load service request");
          navigate("/service-requests", { replace: true });
        } else {
          toast.error("Failed to load form options");
        }
      } finally {
        if (!cancelled) {
          setLoadingOptions(false);
          setLoadingRecord(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, isEdit, editId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "customerName" ||
      name === "contact" ||
      name === "customerEmail" ||
      name === "customerAddress"
    ) {
      setSelectedCustomerId("");
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!canUseCustomerDirectory || !token) {
      setCustomers([]);
      return;
    }
    const api = import.meta.env.VITE_API_URL;
    const headers = { Authorization: `Bearer ${token}` };
    let cancelled = false;
    const q = customerSearchQuery.trim();
    const t = setTimeout(async () => {
      try {
        const { data } = await axios.get(`${api}/customers`, {
          headers,
          params: q ? { q } : {},
          withCredentials: true,
        });
        if (!cancelled) {
          setCustomers(Array.isArray(data) ? data : []);
          setCustomersFailed(false);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setCustomers([]);
          setCustomersFailed(true);
        }
      }
    }, 280);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [token, canUseCustomerDirectory, customerSearchQuery]);

  const openAddCustomerModal = () => {
    setNewCustomerForm({
      ...emptyNewCustomer,
      name: customerSearchQuery.trim(),
    });
    setAddCustomerOpen(true);
  };

  const saveNewCustomer = async () => {
    const nm = String(newCustomerForm.name || "").trim();
    if (!nm) {
      toast.error("Customer name is required");
      return;
    }
    const api = import.meta.env.VITE_API_URL;
    try {
      setSavingCustomer(true);
      const { data } = await axios.post(
        `${api}/customers`,
        {
          name: nm,
          phone: String(newCustomerForm.phone || "").trim() || null,
          email: String(newCustomerForm.email || "").trim() || null,
          address: String(newCustomerForm.address || "").trim() || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      applyCustomer(data);
      setAddCustomerOpen(false);
      setNewCustomerForm(emptyNewCustomer);
      toast.success("Customer added");
      setCustomerSearchQuery(nm);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.detail || "Could not create customer",
      );
    } finally {
      setSavingCustomer(false);
    }
  };

  const customerOptions = useMemo(() => {
    return [...customers].sort((a, b) =>
      String(a.name || "").localeCompare(String(b.name || ""), undefined, {
        sensitivity: "base",
      }),
    );
  }, [customers]);

  const customerMatchDoneRef = useRef(false);
  useEffect(() => {
    customerMatchDoneRef.current = false;
  }, [editId]);

  useEffect(() => {
    if (!isEdit || customerMatchDoneRef.current) return;
    const nm = String(formData.customerName || "").trim().toLowerCase();
    if (!nm || customerOptions.length === 0) return;
    const hit = customerOptions.find(
      (c) => String(c.name || "").trim().toLowerCase() === nm,
    );
    if (hit) {
      setSelectedCustomerId(String(hit.id));
      customerMatchDoneRef.current = true;
    }
  }, [isEdit, formData.customerName, customerOptions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || loadingOptions || (isEdit && loadingRecord)) return;
    if (!selectedServiceTypeId) {
      toast.error("Select a service type");
      return;
    }
    const st = serviceTypes.find(
      (t) => String(t.id) === String(selectedServiceTypeId),
    );
    if (!st) {
      toast.error("Invalid service type");
      return;
    }
    const cn = String(formData.customerName || "").trim();
    const ct = String(formData.contact || "").trim();
    const pd = String(formData.productDetails || "").trim();
    if (!cn) {
      toast.error("Customer name is required");
      return;
    }
    if (!ct) {
      toast.error("Contact is required");
      return;
    }
    if (!/^[0-9+\-() ]{7,25}$/.test(ct)) {
      toast.error("Contact can only contain digits and + - ( )");
      return;
    }
    const digitsOnly = ct.replace(/\D/g, "");
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      toast.error("Contact number length should be between 7 and 15 digits");
      return;
    }
    if (!pd) {
      toast.error("Product details are required");
      return;
    }
    const em = String(formData.customerEmail || "").trim();
    if (!em) {
      toast.error("Customer email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      toast.error("Enter a valid customer email");
      return;
    }
    const key = st.name.trim().slice(0, 64);
    const api = import.meta.env.VITE_API_URL;
    const payload = {
      service_type_key: key,
      allotted_to_user_id: engineerUserId ? Number(engineerUserId) : null,
      status: isEdit ? (status || "submitted").trim() || "submitted" : "submitted",
      form_data: { ...formData },
    };
    if (!isEdit) {
      const ok = window.confirm(
        "Are you sure you want to create this service request?",
      );
      if (!ok) return;
    }
    try {
      setSubmitting(true);
      if (isEdit && editId) {
        await axios.put(`${api}/service-requests/${editId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        toast.success("Service request updated");
        navigate("/service-requests", { replace: true });
      } else {
        await axios.post(`${api}/service-requests`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        toast.success("Service request submitted");
        setFormData({ ...EMPTY_FORM });
        setEngineerUserId("");
        navigate("/service-requests", { replace: true });
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.detail ||
          (isEdit
            ? "Could not update service request"
            : "Could not submit service request"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const pageLoading = loadingOptions || (isEdit && loadingRecord);

  return (
    <PageLoadingShell loading={pageLoading} minHeight="min-h-[480px]">
      <form
        onSubmit={handleSubmit}
        className={`mx-auto max-w-5xl ${submitting ? "pointer-events-none opacity-70" : ""}`}
      >
        <div className={adminTable.wrap}>
          <div className="border-b border-slate-200 bg-slate-900 px-6 py-4">
            <div className="flex items-center gap-3 text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <ClipboardList className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-white">
                  {isEdit ? "Edit service request" : "Service request"}
                </h2>
                <p className="text-sm text-white/75">
                  {isEdit
                    ? "Update details, assignment, and status, then save."
                    : "Enter customer and job details, assign an engineer, then submit."}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 bg-white p-5 sm:p-6">
            {/* Assignment row — service type + engineer */}
            <div className={sectionClass}>
              <div className="mb-3 flex items-center gap-2 text-slate-900">
                <UserCog className="h-4 w-4" />
                <span className="text-sm font-semibold">Assignment</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="serviceType">
                    Service type *
                  </label>
                  <select
                    id="serviceType"
                    value={selectedServiceTypeId}
                    onChange={(e) => setSelectedServiceTypeId(e.target.value)}
                    disabled={submitting}
                    className={inputClass}
                  >
                    <option value="">Select service type</option>
                    {serviceTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="engineer">
                    Engineer
                  </label>
                  <select
                    id="engineer"
                    value={engineerUserId}
                    onChange={(e) => setEngineerUserId(e.target.value)}
                    disabled={submitting}
                    className={inputClass}
                  >
                    <option value="">— Optional —</option>
                    {engineers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username}
                        {u.email ? ` (${u.email})` : ""}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-slate-500">
                    Lists users with role &quot;Engineer&quot;. Add users under Users with
                    that role if empty.
                  </p>
                </div>
                {isEdit && (
                  <div className="md:col-span-2">
                    <label className={labelClass} htmlFor="sr-status">
                      Status
                    </label>
                    <select
                      id="sr-status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      disabled={submitting}
                      className={inputClass}
                    >
                      <option value="draft">draft</option>
                      <option value="submitted">allotted</option>
                      <option value="allotted">allotted</option>
                      <option value="in_progress">in_progress</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      If the engineer fills in observation sheets after this request
                      was <strong>completed</strong>, status returns to{" "}
                      <strong>in progress</strong> automatically.
                      {formatObservationFilledAt(observationUpdatedAt) ? (
                        <>
                          {" "}
                          Last observation sheet filled:{" "}
                          <span className="font-medium text-slate-800">
                            {formatObservationFilledAt(observationUpdatedAt)}
                          </span>
                          .
                        </>
                      ) : (
                        <> No observation fills recorded yet.</>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className={sectionClass}>
              <p className="mb-3 text-sm font-semibold text-slate-900">
                Customer
              </p>
              {canUseCustomerDirectory ? (
                <div className="mb-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                  <label className={labelClass} htmlFor="customer-search">
                    Find customer
                  </label>
                  <p className="mb-2 text-xs text-slate-500">
                    Search by name, pick from the list to fill details, or type
                    everything manually below. Use{" "}
                    <strong>New customer</strong> if they are not in the directory.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
                    <div className="min-w-0 flex-1 sm:max-w-xs">
                      <input
                        id="customer-search"
                        type="search"
                        value={customerSearchQuery}
                        onChange={(e) => setCustomerSearchQuery(e.target.value)}
                        placeholder="Search customer name…"
                        disabled={submitting}
                        className={inputClass}
                        autoComplete="off"
                      />
                    </div>
                    <div className="min-w-0 flex-[2] sm:min-w-[220px]">
                      <label className={labelClass} htmlFor="customer-pick">
                        Select customer
                      </label>
                      <select
                        id="customer-pick"
                        value={selectedCustomerId}
                        disabled={submitting}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (!v) {
                            setSelectedCustomerId("");
                            return;
                          }
                          const c = customerOptions.find(
                            (x) => String(x.id) === v,
                          );
                          if (c) applyCustomer(c);
                        }}
                        className={inputClass}
                      >
                        <option value="">
                          — Choose one or enter manually below —
                        </option>
                        {customerOptions.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                            {c.phone ? ` · ${c.phone}` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    {canCreateCustomer ? (
                      <button
                        type="button"
                        onClick={openAddCustomerModal}
                        disabled={submitting}
                        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" aria-hidden />
                        New customer
                      </button>
                    ) : null}
                  </div>
                  {customersFailed ? (
                    <p className="mt-2 text-xs text-amber-800">
                      Could not load customers. You can still type customer
                      details manually.
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="mb-3 text-xs text-slate-500">
                  You do not have customer directory access; enter customer
                  details manually.
                </p>
              )}
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className={labelClass}>Customer name *</label>
                  <input
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Contact *</label>
                  <input
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Customer email *</label>
                  <input
                    type="email"
                    name="customerEmail"
                    autoComplete="email"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    placeholder="For observation reports"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Brand</label>
                  <input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className={labelClass}>Customer address</label>
                <textarea
                  name="customerAddress"
                  value={formData.customerAddress}
                  onChange={handleChange}
                  rows={3}
                  className={`${inputClass} resize-y`}
                />
              </div>
            </div>

            <div className={sectionClass}>
              <p className="mb-3 text-sm font-semibold text-slate-900">Product</p>
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className={labelClass}>Product *</label>
                  <input
                    name="productDetails"
                    value={formData.productDetails}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Quantity</label>
                  <input
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Condition</label>
                  <input
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className={sectionClass}>
              <p className="mb-3 text-sm font-semibold text-slate-900">Testing</p>
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className={labelClass}>Test req.</label>
                  <input
                    name="testRequirement"
                    value={formData.testRequirement}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Method</label>
                  <input
                    name="testMethod"
                    value={formData.testMethod}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Documents</label>
                  <input
                    name="documents"
                    value={formData.documents}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className={sectionClass}>
              <p className="mb-3 text-sm font-semibold text-slate-900">People</p>
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className={labelClass}>Submitted by</label>
                  <input
                    name="submittedBy"
                    value={formData.submittedBy}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Designation</label>
                  <input
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Returnable</label>
                  <input
                    name="returnable"
                    value={formData.returnable}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className={sectionClass}>
              <p className="mb-3 text-sm font-semibold text-slate-900">Schedule</p>
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className={labelClass}>SRF no</label>
                  <input
                    name="srfNo"
                    value={formData.srfNo}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Sample date</label>
                  <input
                    type="date"
                    name="sampleDate"
                    value={formData.sampleDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Delivery date</label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Conformity
              </span>
              <label className="flex items-center gap-2 text-sm text-slate-800">
                <input
                  type="radio"
                  name="conformity"
                  value="Yes"
                  checked={formData.conformity === "Yes"}
                  onChange={handleChange}
                  className="accent-slate-900"
                />
                Yes
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-800">
                <input
                  type="radio"
                  name="conformity"
                  value="No"
                  checked={formData.conformity === "No"}
                  onChange={handleChange}
                  className="accent-slate-900"
                />
                No
              </label>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className={labelClass}>Received by</label>
                <input
                  name="receivedBy"
                  placeholder="Received by"
                  value={formData.receivedBy}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Submitted person</label>
                <input
                  name="submittedPerson"
                  placeholder="Submitted person"
                  value={formData.submittedPerson}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div
              className={`flex flex-wrap items-center gap-3 ${isEdit ? "justify-between" : ""}`}
            >
              {isEdit && (
                <button
                  type="button"
                  onClick={() => navigate("/service-requests")}
                  disabled={submitting}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={submitting || pageLoading}
                className={`${adminTable.btnAdd} flex min-h-[46px] min-w-[200px] flex-1 items-center justify-center gap-2 py-3 disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {submitting ? (
                  <>
                    <Loader size={22} className="text-white" />
                    {isEdit ? "Saving…" : "Submitting…"}
                  </>
                ) : isEdit ? (
                  "Save changes"
                ) : (
                  "Submit request"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {addCustomerOpen ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-customer-title"
          onClick={() => {
            if (!savingCustomer) setAddCustomerOpen(false);
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl ring-1 ring-slate-900/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="new-customer-title"
              className="text-lg font-semibold text-slate-900"
            >
              New customer
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Creates a directory entry and fills this request. Add email and
              phone on the main form if needed for reports.
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <label className={labelClass}>Name *</label>
                <input
                  value={newCustomerForm.name}
                  onChange={(e) =>
                    setNewCustomerForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className={inputClass}
                  disabled={savingCustomer}
                />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  value={newCustomerForm.phone}
                  onChange={(e) =>
                    setNewCustomerForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className={inputClass}
                  disabled={savingCustomer}
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={newCustomerForm.email}
                  onChange={(e) =>
                    setNewCustomerForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className={inputClass}
                  disabled={savingCustomer}
                />
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <textarea
                  value={newCustomerForm.address}
                  onChange={(e) =>
                    setNewCustomerForm((p) => ({
                      ...p,
                      address: e.target.value,
                    }))
                  }
                  rows={2}
                  className={`${inputClass} resize-y`}
                  disabled={savingCustomer}
                />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                disabled={savingCustomer}
                onClick={() => setAddCustomerOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingCustomer}
                onClick={saveNewCustomer}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-slate-800 disabled:opacity-50"
              >
                {savingCustomer ? "Saving…" : "Save customer"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PageLoadingShell>
  );
}

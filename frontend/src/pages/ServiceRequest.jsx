import React, { useState } from "react";

export default function ServiceRequest() {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inputClass =
    "w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400";

  const labelClass = "text-xs font-medium mb-0.5 block text-gray-600";

  return (
    <form className="p-3 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-4 shadow rounded">
        <h2 className="text-md font-semibold mb-3 text-center">
          Service Request
        </h2>

        {/* SECTION 1 */}
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Customer Name</label>
            <input name="customerName" onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Contact</label>
            <input name="contact" onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Brand</label>
            <input name="brand" onChange={handleChange} className={inputClass} />
          </div>
        </div>

        {/* Address (full width only one textarea) */}
        <div className="mt-2">
          <label className={labelClass}>Customer Address</label>
          <textarea
            name="customerAddress"
            onChange={handleChange}
            className={`${inputClass} h-16`}
          />
        </div>

        {/* SECTION 2 */}
        <div className="grid md:grid-cols-3 gap-3 mt-2">
          <div>
            <label className={labelClass}>Product</label>
            <input name="productDetails" onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Quantity</label>
            <input name="quantity" onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Condition</label>
            <input name="condition" onChange={handleChange} className={inputClass} />
          </div>
        </div>

        {/* SECTION 3 */}
        <div className="grid md:grid-cols-3 gap-3 mt-2">
          <div>
            <label className={labelClass}>Test Req.</label>
            <input name="testRequirement" onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Method</label>
            <input name="testMethod" onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Documents</label>
            <input name="documents" onChange={handleChange} className={inputClass} />
          </div>
        </div>

        {/* SECTION 4 */}
        <div className="grid md:grid-cols-3 gap-3 mt-2">
          <div>
            <label className={labelClass}>Submitted By</label>
            <input name="submittedBy" onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Designation</label>
            <input name="designation" onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Returnable</label>
            <input name="returnable" onChange={handleChange} className={inputClass} />
          </div>
        </div>

        {/* SECTION 5 */}
        <div className="grid md:grid-cols-3 gap-3 mt-2 items-end">
          <div>
            <label className={labelClass}>SRF No</label>
            <input name="srfNo" onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Sample Date</label>
            <input type="date" name="sampleDate" onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Delivery Date</label>
            <input type="date" name="deliveryDate" onChange={handleChange} className={inputClass} />
          </div>
        </div>

        {/* RADIO */}
        <div className="flex items-center gap-4 mt-3 text-sm">
          <span className="text-xs font-medium">Conformity:</span>
          <label>
            <input type="radio" name="conformity" value="Yes" onChange={handleChange} /> Yes
          </label>
          <label>
            <input type="radio" name="conformity" value="No" onChange={handleChange} /> No
          </label>
        </div>

        {/* FOOT */}
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          <input
            name="receivedBy"
            placeholder="Received By"
            onChange={handleChange}
            className={inputClass}
          />
          <input
            name="submittedPerson"
            placeholder="Submitted Person"
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <button className="mt-4 w-full bg-blue-600 text-white py-1.5 text-sm rounded">
          Submit
        </button>
      </div>
    </form>
  );
}
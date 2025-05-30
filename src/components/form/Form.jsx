// src/Form.jsx
import { useState } from "react";
import { motion } from "framer-motion";

const fields = [
  { name: "fullName", label: "Full Name", validate: (v) => v.length >= 3 },
  { name: "phone", label: "Phone", validate: (v) => /^\d{10}$/.test(v) },
  { name: "email", label: "Email", validate: (v) => /\S+@\S+\.\S+/.test(v) },
  { name: "city", label: "City", validate: (v) => v.length >= 3 },
  { name: "sport", label: "Favorite Sport", validate: (v) => v.trim() !== "" },
  { name: "team", label: "Favorite Team", validate: (v) => v.trim() !== "" },
  { name: "icon", label: "Favorite Sports Icon", validate: (v) => v.trim() !== "" },
];

function Form() {
  const [formData, setFormData] = useState({});
  const [currentField, setCurrentField] = useState(0);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [fields[currentField].name]: e.target.value });
  };

  const handleNext = () => {
    const value = formData[fields[currentField].name] || "";
    const isValid = fields[currentField].validate(value);

    if (!isValid) {
      setError(`Please enter a valid ${fields[currentField].label.toLowerCase()}`);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setFormData({ ...formData, [fields[currentField].name]: "" });
      return;
    }

    setError("");
    if (currentField + 1 < fields.length) {
      setCurrentField(currentField + 1);
    } else {
      setSubmitted(true);
      setEditMode(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setSubmitted(false);
    setCurrentField(0); // Start editing from first field again
    setError("");
  };

  const handleSave = () => {
    // Validate all fields before saving
    for (let i = 0; i < fields.length; i++) {
      const value = formData[fields[i].name] || "";
      if (!fields[i].validate(value)) {
        // If invalid, switch to that field for correction
        setCurrentField(i);
        setError(`Please enter a valid ${fields[i].label.toLowerCase()}`);
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }
    }
    setError("");
    setEditMode(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-blue-900 px-4">
      <div className="w-full max-w-xl p-12 bg-gray-900 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Performena</h1>
        {!submitted || editMode ? (
          editMode ? (
            // Edit mode: show all fields as inputs
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              {fields.map((f, idx) => (
                <div key={f.name} className="mb-4">
                  <label className="block mb-2 text-lg font-semibold text-blue-400">
                    {f.label}
                  </label>
                  <input
                    type="text"
                    value={formData[f.name] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [f.name]: e.target.value })
                    }
                    placeholder={f.label}
                    className={`w-full px-5 py-3 text-lg rounded-xl
                      bg-gray-800 text-white
                      border
                      focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 mb-2
                      ${
                        shake && currentField === idx
                          ? "animate-shake border-red-500 placeholder-red-400"
                          : "border-gray-700 placeholder-gray-400"
                      }
                    `}
                    autoComplete="off"
                  />
                  {/* Show error only for the current invalid field */}
                  {error && currentField === idx && (
                    <p className="text-red-500 mb-2">{error}</p>
                  )}
                </div>
              ))}
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setError("");
                  }}
                  className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            // Step-by-step input mode (original)
            currentField < fields.length && (
              <motion.div
                key={currentField}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <label className="block mb-2 text-lg font-semibold text-blue-400">
                  {fields[currentField].label}
                </label>
                <input
                  type="text"
                  value={formData[fields[currentField].name] || ""}
                  onChange={handleChange}
                  placeholder={fields[currentField].label}
                  className={`w-full px-5 py-3 text-lg rounded-xl
                    bg-gray-800 text-white
                    border
                    focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 mb-2
                    ${
                      shake
                        ? "animate-shake border-red-500 placeholder-red-400"
                        : "border-gray-700 placeholder-gray-400"
                    }
                  `}
                  autoComplete="off"
                />
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <button
                  onClick={handleNext}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Next
                </button>
              </motion.div>
            )
          )
        ) : (
          // Read-only summary view
          <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Submitted Information</h2>
            {fields.map((f) => (
              <div key={f.name} className="mb-4">
                <p className="text-lg font-semibold text-white mb-1">{f.label}</p>
                <p className="text-gray-300 text-base border-b border-gray-700 pb-2">
                  {formData[f.name]}
                </p>
              </div>
            ))}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
              >
                Edit
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Form;

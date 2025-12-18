import React, { useState } from "react";
import AnimatedDropdown from "../../../Layout/Common/AnimatedDropdown";
import { MdOutlineThumbUp } from "react-icons/md";
import { BsCheck2Square } from "react-icons/bs";

export default function AutoDownloadConfiguration() {
  const [pathType, setPathType] = useState("LOCAL"); // LOCAL | UNC
  const isUNC = pathType === "UNC";

  // ✅ Validation state
  const [clientName, setClientName] = useState("");
  const [downloadPath, setDownloadPath] = useState("");

  const [clientError, setClientError] = useState(false);
  const [pathError, setPathError] = useState(false);

  const handleCheck = () => {
    let hasError = false;

    if (!clientName.trim()) {
      setClientError(true);
      hasError = true;
    }

    if (!downloadPath.trim()) {
      setPathError(true);
      hasError = true;
    }

    if (hasError) return;

    // ✅ Success logic
    console.log("Valid Data:", { clientName, downloadPath });
  };

  return (
    <div className="bg-white p-8 pt-4">
      <div className="flex justify-end">
          <button
            className="flex items-center  gap-2 rounded bg-blue-500 px-3 py-1.5 text-white font-semibold"
          >
            <BsCheck2Square size={18}  />
            <span className="text-xs font-medium">Save</span>
          </button>
      </div>

      <div className="max-w-4xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* Source */}
          <div>
            <h2 className="mb-2 text-sm font-bold text-blue-600">Source</h2>
            <label className="mb-1 block text-gray-600 text-xs font-semibold">
              Instrument <span className="text-red-500">*</span>
            </label>
            <div className="w-80">
              <AnimatedDropdown options={["IN001 (IN001)"]} />
            </div>
          </div>

          {/* UNC Credentials */}
          <div>
            <h2 className="mb-2 text-sm font-bold text-blue-600">
              UNC Credentials
            </h2>
            <div className="grid grid-cols-2 gap-2 max-w-md">
              <div>
                <label className="mb-1 block text-gray-600 text-xs font-semibold">
                  Username
                </label>
                <input
                  disabled={!isUNC}
                  className="w-full border-b border-gray-400 text-xs font-semibold focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="mb-1 block text-gray-600 text-xs font-semibold">
                  Password
                </label>
                <input
                  disabled={!isUNC}
                  type="password"
                  className="w-full border-b border-gray-400 text-xs focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Schedule Path */}
          <div>
            <label className="mb-1 block text-gray-600 text-xs font-medium">
              Schedule Path <span className="text-red-500">*</span>
            </label>
            <div className="w-80">
              <AnimatedDropdown options={["Daily", "Weekly"]} />
            </div>
          </div>

          {/* Domain */}
          <div>
            <label className="mb-1 block text-gray-600 text-xs font-semibold">
              Domain
            </label>
            <div className="w-80">
              <AnimatedDropdown disabled={!isUNC} options={["NONE"]} />
            </div>
          </div>

          {/* Download */}
          <div>
            <h2 className="mb-4 text-sm font-bold text-blue-600">Download</h2>
            <label className="mb-1 block text-gray-600 text-xs font-semibold">
              Client Name <span className="text-red-500">*</span>
            </label>

            {/* 🔴 Client Name Error Border */}
            <div className={"w-80"}>
              <AnimatedDropdown
                  value={clientName}
                  options={["Client A", "Client B"]}
                  required
                  showError={clientError}   // ✅ THIS LINE
                  onChange={(e) => {
                    setClientName(e.target.value);
                    setClientError(false); // clears red line on change
                  }}
                />

            </div>
          </div>

          {/* Filter */}
          <div className="w-80">
            <label className="mb-1 block text-gray-600 text-xs font-semibold">
              Filter
            </label>
            <input
              defaultValue="*.*"
              className="w-full border-b py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Toggle Switches */}
          <div className="md:col-span-2 flex gap-8">
            <Toggle
              label="Local Path"
              checked={pathType === "LOCAL"}
              onChange={() => setPathType("LOCAL")}
            />
            <Toggle
              label="UNC Path"
              checked={pathType === "UNC"}
              onChange={() => setPathType("UNC")}
            />
          </div>

          {/* Download Path */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-gray-600 text-xs font-semibold">
              Download Path <span className="text-red-500">*</span>
            </label>
            <div className="flex w-[400px] gap-4">
              <input
                value={downloadPath}
                onChange={(e) => {
                  setDownloadPath(e.target.value);
                  setPathError(false);
                }}
                className={`flex-1 border-b py-1 focus:outline-none ${
                  pathError
                    ? "border-red-500"
                    : "border-gray-400 focus:border-blue-500"
                }`}
              />
              <button
                onClick={handleCheck}
                className="flex items-center gap-2 rounded bg-gray-600/10 px-2 py-1 text-blue-600 font-semibold"
              >
                <MdOutlineThumbUp size={20} />
                <span className="text-sm font-medium">Check</span>
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              NOTE:- Browse is not supported. Manually copy the path
            </p>
          </div>

          {/* Structure Type */}
          <div>
            <label className="mb-1 block text-gray-600 text-xs font-semibold">
              Download Structure Type <span className="text-red-500">*</span>
            </label>
            <div className="w-80">
              <AnimatedDropdown options={["Original", "File Only"]} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* Toggle Component */
function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs">{label}</span>
      <button
        onClick={onChange}
        className="relative h-5 w-10 rounded-full border bg-white"
      >
        <span
          className={`absolute top-[1px] h-4 w-4 rounded-full transition ${
            checked ? "left-5 bg-blue-400" : "left-1 bg-gray-400"
          }`}
        />
      </button>
    </div>
  );
}

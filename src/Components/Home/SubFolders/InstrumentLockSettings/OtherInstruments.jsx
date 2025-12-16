import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RefreshCw, Search, Check } from "lucide-react";

/* ----------------------------------------------------
   INFO BOX COMPONENT
---------------------------------------------------- */
const InfoBox = ({ data }) => (
  <div className="border border-gray-300 bg-white min-h-[170px] p-4 overflow-auto">
    {data.length === 0 ? null : (
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex">
            <label className="w-[45%] text-sm font-bold text-gray-800">
              {d.label}:
            </label>
            <span className="w-[45%] text-sm font-bold text-[#162ddc]">
              {d.value}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);

/* ----------------------------------------------------
   GRID COMPONENT
---------------------------------------------------- */
const Grid = ({ columns, data, onSelect, selectedKey, rowKey, onRowClick, showUTCColumn = true }) => {
  // Filter columns based on showUTCColumn prop
  const visibleColumns = showUTCColumn 
    ? columns 
    : columns.filter(col => col.field !== "sUTCCreatedOn");

  return (
    <div className="border border-gray-300 bg-white">
      {/* Header */}
      <div
        className="grid bg-[#f5f5f5] border-b border-gray-300"
        style={{ gridTemplateColumns: visibleColumns.map((c) => c.width).join(" ") }}
      >
        {visibleColumns.map((c, i) => (
          <div key={i} className="px-4 py-2.5 text-sm font-medium text-gray-700 border-r border-gray-300 last:border-r-0">
            {c.header}
          </div>
        ))}
      </div>

      {/* Search Row */}
      <div
        className="grid bg-white border-b border-gray-300"
        style={{ gridTemplateColumns: visibleColumns.map((c) => c.width).join(" ") }}
      >
        {visibleColumns.map((_, i) => (
          <div key={i} className="px-4 py-2 border-r border-gray-300 last:border-r-0">
            <Search size={16} className="text-gray-400" />
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="min-h-[150px] max-h-[300px] overflow-y-auto">
        {data.length === 0 ? (
          <div className="text-center text-sm text-gray-600 py-16">
            No data to display
          </div>
        ) : (
          data.map((row, i) => (
            <div
              key={i}
              onClick={() => {
                if (onSelect) onSelect(row);
                if (onRowClick) onRowClick(row);
              }}
              className={`grid cursor-pointer border-b border-gray-200 hover:bg-blue-50 ${
                selectedKey === row[rowKey] ? "bg-blue-50" : "bg-white"
              }`}
              style={{ gridTemplateColumns: visibleColumns.map((c) => c.width).join(" ") }}
            >
              {visibleColumns.map((c, j) => (
                <div key={j} className="px-4 py-2.5 text-sm text-gray-700 border-r border-gray-200 last:border-r-0">
                  {c.renderer ? c.renderer(row, c.field) : row[c.field]}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* ----------------------------------------------------
   MAIN PAGE
---------------------------------------------------- */
export default function OthersInstrumentsPage() {
  const { t } = useTranslation();

  const [lockedInstruments, setLockedInstruments] = useState([]);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileTags, setFileTags] = useState([]);
  const [featureStatus, setFeatureStatus] = useState(false);
  const [showUTCColumn, setShowUTCColumn] = useState(true); // Can be controlled via props or settings

  // Load initial data
  useEffect(() => {
    loadTemplateValidation();
  }, []);

  const loadTemplateValidation = async () => {
    try {
      const response = await makeAjaxCall("/InstrumentLock/ValidatingTemplateTobeLoad", {});
      
      if (response && response.length > 0) {
        const feature = response[0]["L67Status"];
        setFeatureStatus(feature);
        
        // Load locked instruments from other users
        loadOthersLockedInstruments(feature);
      }
    } catch (error) {
      console.error("Error loading template validation:", error);
    }
  };

  const loadOthersLockedInstruments = async (feature) => {
    try {
      const response = await makeAjaxCall("/InstrumentLock/LoadOtherUsersLockInstDetails", {
        sFeature: feature
      });
      
      if (response && Array.isArray(response)) {
        setLockedInstruments(response);
      }
    } catch (error) {
      console.error("Error loading others' locked instruments:", error);
    }
  };

  const handleInstrumentSelect = async (instrument) => {
    setSelectedInstrument(instrument);
    setSelectedFile(null);
    setFileTags([]);
    
    // Load files for this instrument
    loadInstrumentFiles(instrument);
  };

  const loadInstrumentFiles = async (instrument) => {
    try {
      const response = await makeAjaxCall("/InstrumentLock/InstrumentCaptureTagData", {
        sTaskID: instrument.sTaskID
      });
      
      if (response && Array.isArray(response)) {
        setFiles(response);
      }
    } catch (error) {
      console.error("Error loading instrument files:", error);
    }
  };

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    loadFileTags(file);
  };

  const loadFileTags = async (file) => {
    try {
      const response = await makeAjaxCall("/InstrumentLock/LoadCategoryValueForFiles", {
        sRecordNo: file.Reference,
        sTaskID: file["Task ID"],
        sFileName: file["File Name"]
      });
      
      if (response && Array.isArray(response)) {
        const tags = response.map(item => ({
          label: item.Category,
          value: item.Value
        }));
        setFileTags(tags);
      }
    } catch (error) {
      console.error("Error loading file tags:", error);
    }
  };

  const handleRefreshInstruments = () => {
    loadTemplateValidation();
  };

  const handleRefreshFiles = () => {
    if (selectedInstrument) {
      loadInstrumentFiles(selectedInstrument);
    }
  };

  // Helper function for AJAX calls
  const makeAjaxCall = async (url, passObjDet) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ passObj: passObjDet })
      });
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      return await response.json();
    } catch (error) {
      console.error("AJAX call failed:", error);
      throw error;
    }
  };

  // Renderer for instrument name with date
  const instrumentNameRenderer = (row, field) => {
    return (
      <div className="py-1">
        <div className="font-semibold text-gray-800">{row.sInstrumentAliasName}</div>
        <div className="text-xs text-gray-500">{row.sCreatedOn}</div>
      </div>
    );
  };

  // Renderer for file name with date
  const fileNameRenderer = (row, field) => {
    return (
      <div className="py-1">
        <div className="font-medium text-gray-800">{row.ActualFileName}</div>
        <div className="text-xs text-gray-500">{row["Created On"]}</div>
      </div>
    );
  };

  // Renderer for upload status
  const uploadStatusRenderer = (row, field) => {
    const status = row["Upload Status"]?.trim();
    if (!status) return null;
    
    const isUploaded = status === "Uploaded";
    return (
      <div className="flex items-center justify-center">
        <Check 
          className={isUploaded ? "text-green-500" : "text-orange-500"} 
          size={20} 
        />
      </div>
    );
  };

  return (
    <div className="p-6 bg-[#fafafa] min-h-screen font-sans">
      <div className="max-w-[1400px]">
        {/* Locked Instrument Details */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-[#4a6fa5]">
              {t("instrumentlocktag.lockedinstrumentdetails")}
            </h3>
            <button 
              onClick={handleRefreshInstruments}
              className="flex items-center gap-1 text-[#4a9fd8] text-sm font-medium"
            >
              <RefreshCw size={16} />
              {t("instrumentlocktag.refresh")}
            </button>
          </div>

          <Grid
            columns={[
              { 
                header: t("label.instrument") || "Instrument", 
                field: "sInstrumentAliasName", 
                width: "20%",
                renderer: instrumentNameRenderer
              },
              { 
                header: t("instrumentlocktag.lockeduser") || "Locked User", 
                field: "sUsername", 
                width: "20%" 
              },
              { 
                header: t("instrumentlocktag.LockedOn") || "Locked On", 
                field: "sCreatedOn", 
                width: "20%" 
              },
              {  
                header: t("instrumentlocktag.tasksourcepath") || "Task Source Path", 
                field: "sTaskSourcePath", 
                width: "20%" 
              },
              { 
                header: t("instrumentlocktag.templateName") || "Template Name", 
                field: "sTemplateName", 
                width: "20%" 
              },
            ]}
            data={lockedInstruments}
            onSelect={setSelectedInstrument}
            onRowClick={handleInstrumentSelect}
            selectedKey={selectedInstrument?.sTaskID}
            rowKey="sTaskID"
            showUTCColumn={showUTCColumn}
          />
        </div>

        {/* File Information */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-[#4a6fa5]">
              {t("instrumentlocktag.fileinformation")}
            </h3>
            <button 
              onClick={handleRefreshFiles}
              className="flex items-center gap-1 text-[#4a9fd8] text-sm font-medium"
            >
              <RefreshCw size={16} />
              {t("instrumentlocktag.refresh")}
            </button>
          </div>

          <Grid
            columns={[
              { 
                header: t("instrumentlocktag.filename") || "File Name", 
                field: "File Name", 
                width: "40%",
                renderer: fileNameRenderer
              },
              { 
                header: t("instrumentlocktag.uploadstatus") || "Upload Status", 
                field: "Upload Status", 
                width: "20%",
                renderer: uploadStatusRenderer
              },
              { 
                header: t("label.clientName") || "Client Name", 
                field: "Client Name", 
                width: "40%" 
              },
            ]}
            data={files}
            onSelect={handleFileSelect}
            selectedKey={selectedFile?.["File Name"]}
            rowKey="File Name"
          />
        </div>

        {/* File Tag Information */}
        {!featureStatus && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-[#4a6fa5] mb-2">
              {t("instrumentlocktag.filetagsinformation")}
            </h3>
            <InfoBox data={fileTags} />
          </div>
        )}
      </div>
    </div>
  );
}
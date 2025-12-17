import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { RefreshCw, Lock, Unlock, Check, Upload, X, Camera, Plus } from "lucide-react";
import GridLayout from "../../../Layout/Common/Home/Grid/GridLayout";

const FileUploadDropzone = ({ onFilesAdded, files, onRemoveFile, onUpload, onReset }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    onFilesAdded(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    onFilesAdded(selectedFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border border-gray-300 bg-white p-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="*/*"
        />
        <Plus className="mx-auto mb-4 text-gray-400" size={40} />
        <div className="text-gray-700">
          <span className="font-bold uppercase">{t("instrumentlocktag.dragdrop") || "Drag & Drop"}</span>
          <br />
          {t("instrumentlocktag.or") || "or"}{" "}
          <span className="text-blue-600 underline">
            {t("instrumentlocktag.clickhere") || "Click Here"}
          </span>
          {" "}{t("instrumentlocktag.tobrowseoraccesscamera") || "to browse or access camera"}
          {" "}<Camera className="inline" size={16} />
          {" "}{t("instrumentlocktag.toaddfile") || "to add file"}
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <div className="text-sm font-semibold text-gray-700 mb-2">
            Selected Files ({files.length})
          </div>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-700 truncate flex-1">{file.name}</span>
                <button
                  onClick={() => onRemoveFile(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
        >
          {t("button.reset") || "Reset"}
        </button>
        <button
          onClick={onUpload}
          disabled={files.length === 0}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Upload size={16} />
          {t("button.upload") || "Upload"}
        </button>
      </div>
    </div>
  );
};

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
   MAIN PAGE
---------------------------------------------------- */
export default function MyInstrumentsPage() {
  const { t } = useTranslation();

  const [lockedInstruments, setLockedInstruments] = useState([]);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileTags, setFileTags] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [showUploadZone, setShowUploadZone] = useState(true);
  const [featureStatus, setFeatureStatus] = useState(false);

  // Memoized column definitions
  const lockedInstrumentsColumns = useMemo(() => [
    {
      key: 'sInstrumentAliasName',
      label: t("label.instrument") || "Instrument",
      width: 300,
      render: (row, isSelected) => (
        <div className="py-1">
          <div className={`font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-800'}`}>
            {row.sInstrumentAliasName}
          </div>
          <div className="text-xs text-gray-500">{row.sCreatedOn}</div>
        </div>
      )
    },
    {
      key: 'Status',
      label: t("instrumentlocktag.status") || "Status",
      width: 150,
          noFilter: true, // ✅ DISABLES SEARCH INPUT

      render: (row, isSelected) => {
        const isLocked = row.Status === "Locked";
        return (
          <div className="flex items-center justify-center">
            {isLocked ? (
              <Lock className={`${isSelected ? 'text-gray-700' : 'text-gray-500'}`} size={24} />
            ) : (
              <Unlock className={`${isSelected ? 'text-gray-700' : 'text-gray-500'}`} size={24} />
            )}
          </div>
        );
      }
    },
    {
      key: 'sTaskSourcePath',
      label: t("instrumentlocktag.tasksourcepath") || "Task Source Path",
      width: 250,
      render: (row, isSelected) => (
        <span className={isSelected ? 'text-gray-900' : 'text-gray-700'}>
          {row.sTaskSourcePath}
        </span>
      )
    },
    {
      key: 'sTemplateName',
      label: t("instrumentlocktag.template") || "Template Name",
      width: 250,
      render: (row, isSelected) => (
        <span className={isSelected ? 'text-gray-900' : 'text-gray-700'}>
          {row.sTemplateName}
        </span>
      )
    }
  ], [t]);

  const filesColumns = useMemo(() => [
    {
      key: 'ActualFileName',
      label: t("instrumentlocktag.filename") || "File Name",
      width: 400,
      render: (row, isSelected) => (
        <div className="py-1">
          <div className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-800'}`}>
            {row.ActualFileName}
          </div>
          <div className="text-xs text-gray-500">{row["Created On"]}</div>
        </div>
      )
    },
    {
      key: 'Upload Status',
      label: t("instrumentlocktag.uploadstatus") || "Upload Status",
      width: 200,
    noFilter: true, // ✅ DISABLES SEARCH INPUT

      render: (row, isSelected) => {
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
      }
    },
    {
      key: 'Client Name',
      label: "Client Name",
      width: 400,
      render: (row, isSelected) => (
        <span className={isSelected ? 'text-gray-900' : 'text-gray-700'}>
          {row["Client Name"]}
        </span>
      )
    }
  ], [t]);

  // Detail panel renderers
  const renderInstrumentDetail = useCallback((instrument) => (
    <div className="p-4 space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <span className="font-semibold text-gray-700">Task ID:</span>
        <span className="font-medium text-gray-900">{instrument.sTaskID}</span>
        <span className="font-semibold text-gray-700">Status:</span>
        <span className={`font-medium ${instrument.Status === 'Locked' ? 'text-green-600' : 'text-orange-600'}`}>
          {instrument.Status}
        </span>
        <span className="font-semibold text-gray-700">Source Path:</span>
        <span className="text-gray-900 truncate">{instrument.sTaskSourcePath}</span>
        <span className="font-semibold text-gray-700">Template:</span>
        <span className="text-gray-900">{instrument.sTemplateName}</span>
      </div>
    </div>
  ), []);

  const renderFileDetail = useCallback((file) => (
    <div className="p-4 space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <span className="font-semibold text-gray-700">File Name:</span>
        <span className="font-medium text-gray-900">{file.ActualFileName}</span>
        <span className="font-semibold text-gray-700">Status:</span>
        <span className={`font-medium ${file["Upload Status"] === 'Uploaded' ? 'text-green-600' : 'text-orange-600'}`}>
          {file["Upload Status"]}
        </span>
        <span className="font-semibold text-gray-700">Client:</span>
        <span className="text-gray-900">{file["Client Name"]}</span>
      </div>
    </div>
  ), []);

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
        loadLockedInstruments(feature);
      }
    } catch (error) {
      console.error("Error loading template validation:", error);
    }
  };

  const loadLockedInstruments = async (feature) => {
    try {
      const response = await makeAjaxCall("/InstrumentLock/LoadCurrentUsersLockInstDetails", {
        sFeature: feature
      });
      if (response && Array.isArray(response)) {
        setLockedInstruments(response);
      }
    } catch (error) {
      console.error("Error loading locked instruments:", error);
    }
  };

  const handleInstrumentSelect = async (instrument) => {
    setSelectedInstrument(instrument);
    setSelectedFile(null);
    setFileTags([]);
    
    const shouldShow = instrument.Status === "Locked" && 
                      instrument.iCommunicationType === -2 && 
                      parseInt(instrument.sParsertype) === 0;
    setShowUploadZone(shouldShow);
    
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
    loadLockedInstruments(featureStatus);
  };

  const handleRefreshFiles = () => {
    if (selectedInstrument) {
      loadInstrumentFiles(selectedInstrument);
    }
  };

  const handleFilesAdded = (newFiles) => {
    setUploadFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleResetFiles = () => {
    setUploadFiles([]);
  };

  const handleUpload = async () => {
    if (!selectedInstrument || uploadFiles.length === 0) {
      alert("Please select files to upload");
      return;
    }
    try {
      const schedulerResponse = await makeAjaxCall("/ftpviewdata/checkSchedulerStatus", {
        sTaskID: selectedInstrument.sTaskID
      });
      if (schedulerResponse && schedulerResponse.Message) {
        alert(schedulerResponse.Message);
        return;
      }
      await uploadMultipleFiles();
    } catch (error) {
      console.error("Error checking scheduler status:", error);
    }
  };

  const uploadMultipleFiles = async () => {
    const formData = new FormData();
    uploadFiles.forEach((file, index) => {
      formData.append(index.toString(), file.name);
      formData.append(`uploadedFile${index}`, file);
    });
    formData.append("sTaskID", selectedInstrument.sTaskID);
    formData.append("sSiteCode", sessionStorage.getItem("sSiteCode") || "");
    formData.append("sUserID", sessionStorage.getItem("sUserID") || "");
    formData.append("sInstrumentID", selectedInstrument.sInstrumentID.split(":")[0]);
    formData.append("sSourcePath", selectedInstrument.sTaskSourcePath);
    formData.append("sClientID", selectedInstrument.sClientID);

    try {
      const response = await fetch("/multipart/uploadBrowseMultipleFiles", {
        method: "POST",
        body: formData
      });
      const result = await response.json();
      if (result.Rtn?.toLowerCase() === "success" || result.Rtn?.toLowerCase() === "partial success") {
        alert(result.Message || "Files uploaded successfully");
        if (result.InstrumentFileDetails) {
          setFiles(result.InstrumentFileDetails);
        }
        setUploadFiles([]);
      } else {
        alert(result.Message || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files");
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

  return (
    <div className="p-6 bg-[#fafafa] min-h-screen font-sans">
      <div className="max-w-[1400px] space-y-6">
        {/* Locked Instruments - GridLayout */}
        <div>
          <div className="flex justify-between items-center mb-4">
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
            <div className="h-[300px] w-full border p-0 bg-white">

          <GridLayout
            columns={lockedInstrumentsColumns}
            data={lockedInstruments}
            renderDetailPanel={renderInstrumentDetail}
            onRowSelect={handleInstrumentSelect}
          />
        </div>
        </div>

        {/* File Upload Zone */}
        {showUploadZone && (
          <div>
            <FileUploadDropzone
              onFilesAdded={handleFilesAdded}
              files={uploadFiles}
              onRemoveFile={handleRemoveFile}
              onUpload={handleUpload}
              onReset={handleResetFiles}
            />
          </div>
        )}

        {/* Files Table - GridLayout */}
        <div>
          <div className="flex justify-between items-center mb-4">
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
    <div className="h-[300px] w-full border p-0 bg-white">

          <GridLayout
            columns={filesColumns}
            data={files}
            renderDetailPanel={renderFileDetail}
            onRowSelect={handleFileSelect}
          />
        </div>
        </div>

        {/* File Tag Information */}
        {!featureStatus && (
          <div>
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


// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { useTranslation } from "react-i18next";
// import { RefreshCw, Search, Lock, Unlock, Check, Upload, X, Camera, Plus } from "lucide-react";

// const FileUploadDropzone = ({ onFilesAdded, files, onRemoveFile, onUpload, onReset }) => {
//   const { t } = useTranslation();
//   const fileInputRef = useRef(null);
//   const [isDragging, setIsDragging] = useState(false);

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
    
//     const droppedFiles = Array.from(e.dataTransfer.files);
//     onFilesAdded(droppedFiles);
//   };

//   const handleFileSelect = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     onFilesAdded(selectedFiles);
//   };

//   const handleClick = () => {
//     fileInputRef.current?.click();
//   };

//   return (
//     <div className="border border-gray-300 bg-white p-4">
//       <div
//         className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
//           isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
//         }`}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//         onClick={handleClick}
//       >
//         <input
//           ref={fileInputRef}
//           type="file"
//           multiple
//           onChange={handleFileSelect}
//           className="hidden"
//           accept="*/*"
//         />
        
//         <Plus className="mx-auto mb-4 text-gray-400" size={40} />
        
//         <div className="text-gray-700">
//           <span className="font-bold uppercase">{t("instrumentlocktag.dragdrop") || "Drag & Drop"}</span>
//           <br />
//           {t("instrumentlocktag.or") || "or"}{" "}
//           <span className="text-blue-600 underline">
//             {t("instrumentlocktag.clickhere") || "Click Here"}
//           </span>
//           {" "}{t("instrumentlocktag.tobrowseoraccesscamera") || "to browse or access camera"}
//           {" "}<Camera className="inline" size={16} />
//           {" "}{t("instrumentlocktag.toaddfile") || "to add file"}
//         </div>
//       </div>

//       {files.length > 0 && (
//         <div className="mt-4">
//           <div className="text-sm font-semibold text-gray-700 mb-2">
//             Selected Files ({files.length})
//           </div>
//           <div className="space-y-2">
//             {files.map((file, index) => (
//               <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
//                 <span className="text-sm text-gray-700 truncate flex-1">{file.name}</span>
//                 <button
//                   onClick={() => onRemoveFile(index)}
//                   className="ml-2 text-red-500 hover:text-red-700"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="flex justify-end gap-2 mt-4">
//         <button
//           onClick={onReset}
//           className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
//         >
//           {t("button.reset") || "Reset"}
//         </button>
//         <button
//           onClick={onUpload}
//           disabled={files.length === 0}
//           className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
//         >
//           <Upload size={16} />
//           {t("button.upload") || "Upload"}
//         </button>
//       </div>
//     </div>
//   );
// };

// const InfoBox = ({ data }) => (
//   <div className="border border-gray-300 bg-white min-h-[170px] p-4 overflow-auto">
//     {data.length === 0 ? null : (
//       <div className="space-y-2">
//         {data.map((d, i) => (
//           <div key={i} className="flex">
//             <label className="w-[45%] text-sm font-bold text-gray-800">
//               {d.label}:
//             </label>
//             <span className="w-[45%] text-sm font-bold text-[#162ddc]">
//               {d.value}
//             </span>
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
// );

// const Grid = ({ columns, data, onSelect, selectedKey, rowKey, onRowClick }) => (
//   <div className="border border-gray-300 bg-white">
//     {/* Header */}
//     <div
//       className="grid bg-[#f5f5f5] border-b border-gray-300"
//       style={{ gridTemplateColumns: columns.map((c) => c.width).join(" ") }}
//     >
//       {columns.map((c, i) => (
//         <div key={i} className="px-4 py-2.5 text-sm font-medium text-gray-700 border-r border-gray-300 last:border-r-0">
//           {c.header}
//         </div>
//       ))}
//     </div>

//     {/* Search Row */}
//     <div
//       className="grid bg-white border-b border-gray-300"
//       style={{ gridTemplateColumns: columns.map((c) => c.width).join(" ") }}
//     >
//       {columns.map((_, i) => (
//         <div key={i} className="px-4 py-2 border-r border-gray-300 last:border-r-0">
//           <Search size={16} className="text-gray-400" />
//         </div>
//       ))}
//     </div>

//     {/* Rows */}
//     <div className="min-h-[150px] max-h-[300px] overflow-y-auto">
//       {data.length === 0 ? (
//         <div className="text-center text-sm text-gray-600 py-16">
//           No data to display
//         </div>
//       ) : (
//         data.map((row, i) => (
//           <div
//             key={i}
//             onClick={() => {
//               if (onSelect) onSelect(row);
//               if (onRowClick) onRowClick(row);
//             }}
//             className={`grid cursor-pointer border-b border-gray-200 hover:bg-blue-50 ${
//               selectedKey === row[rowKey] ? "bg-blue-50" : "bg-white"
//             }`}
//             style={{ gridTemplateColumns: columns.map((c) => c.width).join(" ") }}
//           >
//             {columns.map((c, j) => (
//               <div key={j} className="px-4 py-2.5 text-sm text-gray-700 border-r border-gray-200 last:border-r-0">
//                 {c.renderer ? c.renderer(row, c.field) : row[c.field]}
//               </div>
//             ))}
//           </div>
//         ))
//       )}
//     </div>
//   </div>
// );

// /* ----------------------------------------------------
//    MAIN PAGE
// ---------------------------------------------------- */
// export default function MyInstrumentsPage() {
//   const { t } = useTranslation();

//   const [lockedInstruments, setLockedInstruments] = useState([]);
//   const [selectedInstrument, setSelectedInstrument] = useState(null);
//   const [files, setFiles] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [fileTags, setFileTags] = useState([]);
//   const [uploadFiles, setUploadFiles] = useState([]);
//   const [showUploadZone, setShowUploadZone] = useState(true);
//   const [featureStatus, setFeatureStatus] = useState(false);

//   // Load initial data
//   useEffect(() => {
//     loadTemplateValidation();
//   }, []);

//   const loadTemplateValidation = async () => {
//     try {
//       const response = await makeAjaxCall("/InstrumentLock/ValidatingTemplateTobeLoad", {});
      
//       if (response && response.length > 0) {
//         const feature = response[0]["L67Status"];
//         setFeatureStatus(feature);
        
//         // Load locked instruments
//         loadLockedInstruments(feature);
//       }
//     } catch (error) {
//       console.error("Error loading template validation:", error);
//     }
//   };

//   const loadLockedInstruments = async (feature) => {
//     try {
//       const response = await makeAjaxCall("/InstrumentLock/LoadCurrentUsersLockInstDetails", {
//         sFeature: feature
//       });
      
//       if (response && Array.isArray(response)) {
//         setLockedInstruments(response);
//       }
//     } catch (error) {
//       console.error("Error loading locked instruments:", error);
//     }
//   };

// const handleInstrumentSelect = async (instrument) => {
//     setSelectedInstrument(instrument);
//     setSelectedFile(null);
//     setFileTags([]);
    
//     // Check if upload zone should be enabled/disabled based on instrument type
//     // Only enable for SDMS instruments that are locked
//     const shouldShow = instrument.Status === "Locked" && 
//                       instrument.iCommunicationType === -2 && 
//                       parseInt(instrument.sParsertype) === 0;
//     setShowUploadZone(shouldShow);
    
//     // Load files for this instrument
//     loadInstrumentFiles(instrument);
//   };

//   const loadInstrumentFiles = async (instrument) => {
//     try {
//       const response = await makeAjaxCall("/InstrumentLock/InstrumentCaptureTagData", {
//         sTaskID: instrument.sTaskID
//       });
      
//       if (response && Array.isArray(response)) {
//         setFiles(response);
//       }
//     } catch (error) {
//       console.error("Error loading instrument files:", error);
//     }
//   };

//   const handleFileSelect = async (file) => {
//     setSelectedFile(file);
//     loadFileTags(file);
//   };

//   const loadFileTags = async (file) => {
//     try {
//       const response = await makeAjaxCall("/InstrumentLock/LoadCategoryValueForFiles", {
//         sRecordNo: file.Reference,
//         sTaskID: file["Task ID"],
//         sFileName: file["File Name"]
//       });
      
//       if (response && Array.isArray(response)) {
//         const tags = response.map(item => ({
//           label: item.Category,
//           value: item.Value
//         }));
//         setFileTags(tags);
//       }
//     } catch (error) {
//       console.error("Error loading file tags:", error);
//     }
//   };

//   const handleRefreshInstruments = () => {
//     loadLockedInstruments(featureStatus);
//   };

//   const handleRefreshFiles = () => {
//     if (selectedInstrument) {
//       loadInstrumentFiles(selectedInstrument);
//     }
//   };

//   const handleFilesAdded = (newFiles) => {
//     setUploadFiles(prev => [...prev, ...newFiles]);
//   };

//   const handleRemoveFile = (index) => {
//     setUploadFiles(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleResetFiles = () => {
//     setUploadFiles([]);
//   };

//   const handleUpload = async () => {
//     if (!selectedInstrument || uploadFiles.length === 0) {
//       alert("Please select files to upload");
//       return;
//     }

//     // Check scheduler status first
//     try {
//       const schedulerResponse = await makeAjaxCall("/ftpviewdata/checkSchedulerStatus", {
//         sTaskID: selectedInstrument.sTaskID
//       });

//       if (schedulerResponse && schedulerResponse.Message) {
//         alert(schedulerResponse.Message);
//         return;
//       }

//       // Proceed with upload
//       await uploadMultipleFiles();
//     } catch (error) {
//       console.error("Error checking scheduler status:", error);
//     }
//   };

//   const uploadMultipleFiles = async () => {
//     const formData = new FormData();
    
//     uploadFiles.forEach((file, index) => {
//       formData.append(index.toString(), file.name);
//       formData.append(`uploadedFile${index}`, file);
//     });

//     formData.append("sTaskID", selectedInstrument.sTaskID);
//     formData.append("sSiteCode", sessionStorage.getItem("sSiteCode") || "");
//     formData.append("sUserID", sessionStorage.getItem("sUserID") || "");
//     formData.append("sInstrumentID", selectedInstrument.sInstrumentID.split(":")[0]);
//     formData.append("sSourcePath", selectedInstrument.sTaskSourcePath);
//     formData.append("sClientID", selectedInstrument.sClientID);

//     try {
//       const response = await fetch("/multipart/uploadBrowseMultipleFiles", {
//         method: "POST",
//         body: formData
//       });

//       const result = await response.json();
      
//       if (result.Rtn?.toLowerCase() === "success" || result.Rtn?.toLowerCase() === "partial success") {
//         alert(result.Message || "Files uploaded successfully");
        
//         // Refresh file list
//         if (result.InstrumentFileDetails) {
//           setFiles(result.InstrumentFileDetails);
//         }
        
//         // Clear upload files
//         setUploadFiles([]);
//       } else {
//         alert(result.Message || "Upload failed");
//       }
//     } catch (error) {
//       console.error("Error uploading files:", error);
//       alert("Error uploading files");
//     }
//   };

//   // Helper function for AJAX calls
//   const makeAjaxCall = async (url, passObjDet) => {
//     try {
//       const response = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ passObj: passObjDet })
//       });
      
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error("AJAX call failed:", error);
//       throw error;
//     }
//   };

//   // Renderer for instrument name with date
//   const instrumentNameRenderer = (row, field) => {
//     return (
//       <div className="py-1">
//         <div className="font-semibold text-gray-800">{row.sInstrumentAliasName}</div>
//         <div className="text-xs text-gray-500">{row.sCreatedOn}</div>
//       </div>
//     );
//   };

//   // Renderer for lock status
//   const lockStatusRenderer = (row, field) => {
//     const isLocked = row.Status === "Locked";
//     return (
//       <div className="flex items-center justify-center">
//         {isLocked ? (
//           <Lock className="text-gray-500" size={24} />
//         ) : (
//           <Unlock className="text-gray-500" size={24} />
//         )}
//       </div>
//     );
//   };

//   // Renderer for file name with date
//   const fileNameRenderer = (row, field) => {
//     return (
//       <div className="py-1">
//         <div className="font-medium text-gray-800">{row.ActualFileName}</div>
//         <div className="text-xs text-gray-500">{row["Created On"]}</div>
//       </div>
//     );
//   };

//   // Renderer for upload status
//   const uploadStatusRenderer = (row, field) => {
//     const status = row["Upload Status"]?.trim();
//     if (!status) return null;
    
//     const isUploaded = status === "Uploaded";
//     return (
//       <div className="flex items-center justify-center">
//         <Check 
//           className={isUploaded ? "text-green-500" : "text-orange-500"} 
//           size={20} 
//         />
//       </div>
//     );
//   };

//   return (
//     <div className="p-6 bg-[#fafafa] min-h-screen font-sans">
//       <div className="max-w-[1400px]">
//         {/* Locked Instrument Details */}
//         <div className="mb-6">
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="text-sm font-medium text-[#4a6fa5]">
//               {t("instrumentlocktag.lockedinstrumentdetails")}
//             </h3>
//             <button 
//               onClick={handleRefreshInstruments}
//               className="flex items-center gap-1 text-[#4a9fd8] text-sm font-medium"
//             >
//               <RefreshCw size={16} />
//               {t("instrumentlocktag.refresh")}
//             </button>
//           </div>

//           <Grid
//             columns={[
//               { 
//                 header: t("label.instrument") || "Instrument", 
//                 field: "sInstrumentAliasName", 
//                 width: "30%",
//                 renderer: instrumentNameRenderer
//               },
//               { 
//                 header: t("instrumentlocktag.status") || "Status", 
//                 field: "Status", 
//                 width: "20%",
//                 renderer: lockStatusRenderer
//               },
//               { 
//                 header: t("instrumentlocktag.tasksourcepath") || "Task Source Path", 
//                 field: "sTaskSourcePath", 
//                 width: "25%" 
//               },
//               { 
//                 header: t("instrumentlocktag.template") || "Template Name", 
//                 field: "sTemplateName", 
//                 width: "25%" 
//               },
//             ]}
//             data={lockedInstruments}
//             onSelect={setSelectedInstrument}
//             onRowClick={handleInstrumentSelect}
//             selectedKey={selectedInstrument?.sTaskID}
//             rowKey="sTaskID"
//           />
//         </div>

//         {/* File Upload Zone - Only shown for SDMS locked instruments */}
//         {showUploadZone && (
//           <div className="mb-6">
//             <FileUploadDropzone
//               onFilesAdded={handleFilesAdded}
//               files={uploadFiles}
//               onRemoveFile={handleRemoveFile}
//               onUpload={handleUpload}
//               onReset={handleResetFiles}
//             />
//           </div>
//         )}

//         {/* File Information */}
//         <div className="mb-6">
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="text-sm font-medium text-[#4a6fa5]">
//               {t("instrumentlocktag.fileinformation")}
//             </h3>
//             <button 
//               onClick={handleRefreshFiles}
//               className="flex items-center gap-1 text-[#4a9fd8] text-sm font-medium"
//             >
//               <RefreshCw size={16} />
//               {t("instrumentlocktag.refresh")}
//             </button>
//           </div>

//           <Grid
//             columns={[
//               { 
//                 header: t("instrumentlocktag.filename") || "File Name", 
//                 field: "File Name", 
//                 width: "40%",
//                 renderer: fileNameRenderer
//               },
//               { 
//                 header: t("instrumentlocktag.uploadstatus") || "Upload Status", 
//                 field: "Upload Status", 
//                 width: "20%",
//                 renderer: uploadStatusRenderer
//               },
//               { 
//                 header: "Client Name", 
//                 field: "Client Name", 
//                 width: "40%" 
//               },
//             ]}
//             data={files}
//             onSelect={handleFileSelect}
//             selectedKey={selectedFile?.["File Name"]}
//             rowKey="File Name"
//           />
//         </div>

//         {/* File Tag Information */}
//         {!featureStatus && (
//           <div className="mb-6">
//             <h3 className="text-sm font-medium text-[#4a6fa5] mb-2">
//               {t("instrumentlocktag.filetagsinformation")}
//             </h3>
//             <InfoBox data={fileTags} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
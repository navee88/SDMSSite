import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { RefreshCw, Search } from "lucide-react";
import AnimatedDropdown from "../../../Layout/Common/AnimatedDropdown";


const InfoBox = ({ data }) => (
  <div className="border border-gray-300 bg-white min-h-[100px] p-4">
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


const Grid = ({ columns, data, onSelect, selectedKey, rowKey, onRowClick }) => (
  <div className="border border-gray-300 bg-white">
    {/* Header */}
    <div
      className="grid bg-[#f5f5f5] border-b border-gray-300"
      style={{ gridTemplateColumns: columns.map((c) => c.width).join(" ") }}
    >
      {columns.map((c, i) => (
        <div key={i} className="px-4 py-2.5 text-sm font-medium text-gray-700 border-r border-gray-300 last:border-r-0">
          {c.header}
        </div>
      ))}
    </div>

    {/* Search Row */}
    <div
      className="grid bg-white border-b border-gray-300"
      style={{ gridTemplateColumns: columns.map((c) => c.width).join(" ") }}
    >
      {columns.map((_, i) => (
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
            style={{ gridTemplateColumns: columns.map((c) => c.width).join(" ") }}
          >
            {columns.map((c, j) => (
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

const FileViewer = ({ src, fileType, supportedExtensions }) => {
  const isSupported = supportedExtensions.includes(fileType?.toLowerCase());
  
  return (
    
    <div className="border border-gray-300 bg-white min-h-[200px]">
      {src && isSupported ? (
        <iframe
          src={`${src}#toolbar=0&navpanes=0`}
          className="w-full h-[200px] border-none"
          title="File Viewer"
        />
      ) : src && !isSupported ? (
        <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
          <div className="text-center">
            <h2 className="text-lg">File format not supported for preview</h2>
          </div>
        </div>
      ) : null}
    </div>
  );
};


export default function InstrumentDataPage() {
  const { t } = useTranslation();

  const [instrument, setInstrument] = useState("");
  const [tab, setTab] = useState("merge");
  const [instruments, setInstruments] = useState([]);
  
  const [instrumentTags, setInstrumentTags] = useState([]);
  const [mergeRows, setMergeRows] = useState([]);
  const [selectedMerge, setSelectedMerge] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileTags, setFileTags] = useState([]);
  const [parsedData, setParsedData] = useState([]);
  const [mergeFileRawData, setMergeFileRawData] = useState([]);
  const [nullDataRows, setNullDataRows] = useState([]);
  
  const [fileViewerSrc, setFileViewerSrc] = useState("");
  const [fileViewerType, setFileViewerType] = useState("");
  const [supportedExtensions, setSupportedExtensions] = useState([]);
  
  const [oldRawDataID, setOldRawDataID] = useState(" ");
  const [newRawDataID, setNewRawDataID] = useState("");
  const [nullDataRawID, setNullDataRawID] = useState("");
  
  const refreshTimerRef = useRef(null);

  // Load initial data and instruments
  useEffect(() => {
    loadTemplateValidation();
    
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, []);

  // Handle instrument change
  useEffect(() => {
    if (instrument) {
      handleInstrumentChange();
    }
  }, [instrument]);

  const loadTemplateValidation = async () => {
    try {
      const response = await makeAjaxCall("/InstrumentLock/ValidatingTemplateTobeLoad", {});
      
      if (response && response.length > 0) {
        const featureStatus = response[0]["L67Status"];
        
        if (response[1] && response[1]["sFileExtensionList"]) {
          setSupportedExtensions(response[1]["sFileExtensionList"].split(","));
        }
        
        // Load instruments
        loadInstruments(featureStatus);
      }
    } catch (error) {
      console.error("Error loading template validation:", error);
    }
  };

  const loadInstruments = async (featureStatus) => {
    try {
      const response = await makeAjaxCall("/InstrumentLock/LoadInterfaceLockInstrumentNameCombo", {
        sFeature: featureStatus
      });
      
      if (response && Array.isArray(response)) {
        setInstruments(response);
      }
    } catch (error) {
      console.error("Error loading instruments:", error);
    }
  };

  const handleInstrumentChange = async () => {
    if (!instrument) return;
    
    // Clear selections
    setSelectedFile(null);
    setFileViewerSrc("");
    setFileTags([]);
    setParsedData([]);
    
    const selectedInstrument = instruments.find(inst => inst.nInterInstrumentID === instrument);
    
    if (selectedInstrument) {
      // Load instrument tags
      loadInstrumentTags(selectedInstrument);
      
      // Load latest merged files
      loadLatestMergedFiles(selectedInstrument);
      
      // Load file information
      loadFileInformation(selectedInstrument);
      
      // Check merge count for auto-refresh
      checkMergeCount(selectedInstrument);
    }
  };

  const loadInstrumentTags = async (selectedInstrument) => {
    try {
      const response = await makeAjaxCall("/InstrumentLock/CurrentLockInstrumentTagInfo", {
        sInstrumentID: selectedInstrument.sInstrumentID,
        sSiteCode: sessionStorage.getItem("sSiteCode")
      });
      
      if (response && Array.isArray(response)) {
        const tags = response.map(item => ({
          label: item.Category,
          value: item.Value
        }));
        setInstrumentTags(tags);
      }
    } catch (error) {
      console.error("Error loading instrument tags:", error);
    }
  };

  const loadLatestMergedFiles = async (selectedInstrument) => {
    try {
      const response = await makeAjaxCall("/InstrumentLock/LoadMergeFileDetails", {
        sInstrumentID: selectedInstrument.sInstrumentID,
        sLockID: selectedInstrument.sLockID
      });
      
      if (response && Array.isArray(response)) {
        setMergeRows(response);
      }
    } catch (error) {
      console.error("Error loading merged files:", error);
    }
  };

  const loadFileInformation = async (selectedInstrument) => {
    try {
      const response = await makeAjaxCall("/InstrumentLock/InstrumentCaptureTagData", {
        sInstrumentID: selectedInstrument.sInstrumentID,
        sTaskID: selectedInstrument.sTaskID
      });
      
      if (response && Array.isArray(response)) {
        setFiles(response);
      }
    } catch (error) {
      console.error("Error loading file information:", error);
    }
  };

  const checkMergeCount = async (selectedInstrument) => {
    try {
      const response = await makeAjaxCall("/InstrumentLock/MergeCountForAutoRefresh", {
        nInterfaceInstID: selectedInstrument.nInterInstrumentID
      });
      
      if (response && response.MergeCount > 1) {
        // Start auto-refresh timer
        if (refreshTimerRef.current) {
          clearInterval(refreshTimerRef.current);
        }
        
        refreshTimerRef.current = setInterval(() => {
          loadLatestMergedFiles(selectedInstrument);
        }, 1000);
      }
    } catch (error) {
      console.error("Error checking merge count:", error);
    }
  };

  const handleMergeRowSelect = async (row) => {
    setSelectedMerge(row);
    setNewRawDataID(row.sRawDataID);
    
    try {
      const response = await makeAjaxCall("/InstrumentLock/MergeFileDatas", {
        nRawData: row.sRawDataID,
        LockID: row.sLockID,
        nSequenceNo: row.nSequenceNo,
        nMergeFileCount: row.nMergeFileCount,
        nInstrumentID: row.nInstrumentID
      });
      
      if (response) {
        if (response.NullDataStatus === "Created") {
          setMergeFileRawData([]);
          if (response.CreatedList) {
            alert(response.CreatedList + " " + response.Message);
            setNullDataRawID(response.CreatedList);
          }
        } else {
          if (oldRawDataID === row.sRawDataID || oldRawDataID === " ") {
            setOldRawDataID(row.sRawDataID);
            if (response.MergeData && Array.isArray(response.MergeData)) {
              setMergeFileRawData(response.MergeData);
            }
          } else {
            setOldRawDataID(row.sRawDataID);
            setMergeFileRawData(response.MergeData || []);
          }
        }
      }
    } catch (error) {
      console.error("Error loading merge file data:", error);
    }
  };

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    
    // Load file viewer
    loadFileViewer(file);
    
    // Load file tags
    loadFileTags(file);
    
    // Load parsed data
    loadParsedData(file);
  };

  const loadFileViewer = async (file) => {
    try {
      const response = await makeAjaxCall("/InstrumentLock/InterFaceInstrumentFileDownLoad", {
        sRecordNo: file.Reference,
        sTaskID: file["Task ID"],
        sUploadStatus: file["Upload Status"]?.trim(),
        sBrowserURL: window.location.origin
      });
      
      if (response && response.Rtn?.toLowerCase() === "success") {
        const urlPath = response.ServerDataViewURL;
        const fileExtension = urlPath.split(".").pop();
        setFileViewerType(fileExtension);
        setFileViewerSrc(urlPath);
      } else if (response && response.Rtn?.toLowerCase() === "failed") {
        alert(response.Message);
        setFileViewerSrc("");
      }
    } catch (error) {
      console.error("Error loading file viewer:", error);
    }
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

  const loadParsedData = async (file) => {
    try {
      const response = await makeAjaxCall("/InstrumentLock/getParsedDataDetails", {
        sRecordNo: file.Reference,
        sTaskID: file["Task ID"],
        sFileName: file["File Name"]
      });
      
      if (response && Array.isArray(response)) {
        const parsed = response.map(item => {
          let fieldName = item.FieldName.split("]");
          if (fieldName && fieldName.length > 0) {
            fieldName = fieldName[1];
          }
          return {
            label: fieldName,
            value: item.FieldValue
          };
        });
        setParsedData(parsed);
      }
    } catch (error) {
      console.error("Error loading parsed data:", error);
    }
  };

  const loadNullData = async () => {
    const selectedInstrument = instruments.find(inst => inst.nInterInstrumentID === instrument);
    
    if (!selectedInstrument) {
      alert(t("instrumentlocktag.noinstrumentsfound") || "No Instruments Found");
      return;
    }
    
    try {
      const response = await makeAjaxCall("/InstrumentLock/FetchNullDataBasedOnInstrument", {
        nInterfaceInstID: selectedInstrument.nInterInstrumentID,
        sLockID: selectedInstrument.sLockID
      });
      
      if (response && Array.isArray(response)) {
        setNullDataRows(response);
      }
    } catch (error) {
      console.error("Error loading null data:", error);
    }
  };

  const handleNullDataAcknowledgement = async (row) => {
    if (!row) {
      alert(t("instrumentlocktag.norecordsfound") || "No Records Found");
      return;
    }
    
    try {
      const response = await makeAjaxCall("/InstrumentLock/NullDataAcknowledgement", {
        nInterfaceInstID: row.nInstrumentID,
        sRawData: row.sRawDataID,
        sLockID: row.sLockID
      });
      
      if (response) {
        // Reload null data grid
        loadNullData();
      }
    } catch (error) {
      console.error("Error acknowledging null data:", error);
    }
  };

  const handleRefreshLatestFiles = () => {
    const selectedInstrument = instruments.find(inst => inst.nInterInstrumentID === instrument);
    if (selectedInstrument) {
      loadLatestMergedFiles(selectedInstrument);
      setMergeFileRawData([]);
    }
  };

  const handleRefreshFileInfo = () => {
    const selectedInstrument = instruments.find(inst => inst.nInterInstrumentID === instrument);
    if (selectedInstrument) {
      loadFileInformation(selectedInstrument);
    }
  };

  const handleRefreshNullData = () => {
    loadNullData();
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
    if (newTab === "null") {
      loadNullData();
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

  const handleInstrumentDropdownChange = (e) => {
    setInstrument(e.target.value);
  };

  // Renderer for upload status
  const uploadStatusRenderer = (row, field) => {
    const status = row[field]?.trim() || "";
    return (
      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
        status.toLowerCase() === "success" ? "bg-green-100 text-green-800" :
        status.toLowerCase() === "failed" ? "bg-red-100 text-red-800" :
        "bg-yellow-100 text-yellow-800"
      }`}>
        {status}
      </span>
    );
  };

  // Renderer for file name with date
  const fileNameRenderer = (row, field) => {
    const fileName = row[field] || "";
    const createdOn = row["Created On"] || "";
    return (
      <div>
        <div className="font-medium">{fileName}</div>
        {createdOn && <div className="text-xs text-gray-500">{createdOn}</div>}
      </div>
    );
  };

  return (
    <div className="p-6 bg-[#fafafa] min-h-screen font-sans">
      <div className="max-w-[1400px]">
        {/* Instrument Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#4a6fa5] mb-1">
            {t("label.instrument")} <span className="text-red-500">*</span>
          </label>
          <div className="w-80 mt-1">
            <AnimatedDropdown
              label=""
              name="instrument"
              value={instrument}
              options={instruments}
              displayKey="sInstrumentAliasName"
              valueKey="nInterInstrumentID"
              onChange={handleInstrumentDropdownChange}
              isSearchable={true}
            />
          </div>
        </div>

        {/* Instrument Tag Information */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-[#4a6fa5] mb-2">
            {t("instrumentlocktag.instrumenttagsinformation")}
          </h3>
          <InfoBox data={instrumentTags} />
        </div>

        {/* Latest Merged File Information */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-[#4a6fa5]">
              {t("instrumentlocktag.latestmergedfileinformation")}
            </h3>
            <div className="flex gap-6">
              <button
                className={`text-sm font-medium pb-1 ${
                  tab === "merge"
                    ? "text-[#4a9fd8] border-b-2 border-[#4a9fd8]"
                    : "text-gray-600"
                }`}
                onClick={() => handleTabChange("merge")}
              >
                {t("instrumentlocktag.mergedata")}
              </button>
              <button
                className={`text-sm font-medium pb-1 ${
                  tab === "null"
                    ? "text-[#4a9fd8] border-b-2 border-[#4a9fd8]"
                    : "text-gray-600"
                }`}
                onClick={() => handleTabChange("null")}
              >
                {t("instrumentlocktag.viewnulldata")}
              </button>
            </div>
          </div>

          {tab === "merge" ? (
            <>
              <div className="flex justify-end mb-2">
                <button 
                  onClick={handleRefreshLatestFiles}
                  className="flex items-center gap-1 text-[#4a9fd8] text-sm font-medium"
                >
                  <RefreshCw size={16} />
                  {t("instrumentlocktag.refresh")}
                </button>
              </div>

              <Grid
                columns={[
                  { header: t("instrumentlocktag.rawdataid"), field: "sRawDataID", width: "33.33%" },
                  { header: t("instrumentlocktag.sequenceno"), field: "nSequenceNo", width: "33.33%" },
                  { header: t("instrumentlocktag.mergefilecount"), field: "nMergeFileCount", width: "33.34%" },
                ]}
                data={mergeRows}
                onSelect={setSelectedMerge}
                onRowClick={handleMergeRowSelect}
                selectedKey={selectedMerge?.sRawDataID}
                rowKey="sRawDataID"
              />
            </>
          ) : (
            <>
              <div className="flex justify-end mb-2 gap-2">
                <button 
                  onClick={() => handleNullDataAcknowledgement(nullDataRows.find(r => r.selected))}
                  className="flex items-center gap-1 text-[#4a9fd8] text-sm font-medium px-3 py-1 border border-[#4a9fd8] rounded"
                >
                  {t("instrumentlocktag.proceedacknowledgement")}
                </button>
                <button 
                  onClick={handleRefreshNullData}
                  className="flex items-center gap-1 text-[#4a9fd8] text-sm font-medium"
                >
                  <RefreshCw size={16} />
                  {t("instrumentlocktag.refresh")}
                </button>
              </div>

              <Grid
                columns={[
                  { header: t("instrumentlocktag.rawdataid"), field: "sRawDataID", width: "25%" },
                  { header: t("instrumentlocktag.sequenceno"), field: "nSequenceNo", width: "15%" },
                  { header: t("instrumentlocktag.mergefilecount"), field: "nMergeFileCount", width: "15%" },
                  { header: t("instrumentlocktag.lockid"), field: "sLockID", width: "25%" },
                  { header: t("instrumentlocktag.instrumentid"), field: "nInstrumentID", width: "20%" },
                ]}
                data={nullDataRows}
                onSelect={(row) => setNullDataRows(prev => prev.map(r => ({ ...r, selected: r === row })))}
                selectedKey={nullDataRows.find(r => r.selected)?.sRawDataID}
                rowKey="sRawDataID"
              />
            </>
          )}
        </div>

        {/* Merged File Raw Data */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-[#4a6fa5] mb-2">
            {t("instrumentlocktag.mergedfilerawdata")}
          </h3>
          <InfoBox data={mergeFileRawData.map(item => ({
            label: item.label || item.Category,
            value: item.value || item.Value
          }))} />
        </div>

        {/* File Information */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-[#4a6fa5]">
              {t("instrumentlocktag.fileinformation")}
            </h3>
            <button 
              onClick={handleRefreshFileInfo}
              className="flex items-center gap-1 text-[#4a9fd8] text-sm font-medium"
            >
              <RefreshCw size={16} />
              {t("instrumentlocktag.refresh")}
            </button>
          </div>

          <Grid
            columns={[
              { header: t("instrumentlocktag.filename"), field: "File Name", width: "40%", renderer: fileNameRenderer },
              { header: t("instrumentlocktag.uploadstatus"), field: "Upload Status", width: "30%", renderer: uploadStatusRenderer },
              { header: "Client Name", field: "Client Name", width: "30%" },
            ]}
            data={files}
            onSelect={handleFileSelect}
            selectedKey={selectedFile?.["File Name"]}
            rowKey="File Name"
          />
        </div>

        {/* File Tag Information */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-[#4a6fa5] mb-2">
            {t("instrumentlocktag.filetagsinformation")}
          </h3>
          <InfoBox data={fileTags} />
        </div>

        {/* File Raw Data */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-[#4a6fa5] mb-2">
            {t("instrumentlocktag.filerawdata")}
          </h3>
          <FileViewer 
            src={fileViewerSrc} 
            fileType={fileViewerType}
            supportedExtensions={supportedExtensions}
          />
        </div>

        {/* Parsed Data */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-[#4a6fa5] mb-2">
            {t("instrumentlocktag.parseddata")}
          </h3>
          <InfoBox data={parsedData} />
        </div>
      </div>
    </div>
  );
}
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RefreshCw, ChevronDown, X, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AnimatedDropdown from '../../../Layout/Common/AnimatedDropdown';

// Dropdown Component (Underline style like in image)
const Dropdown = ({ label, value, options, onChange, disabled, required, error, displayKey, valueKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt[valueKey] === value);

  return (
    <div className="mb-4" ref={dropdownRef}>
      <label className="block text-sm text-[#4a5f7d] mb-1 font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full h-9 px-0 pb-1 text-sm text-left bg-transparent border-0 border-b-2 flex items-center justify-between outline-none
            ${error ? 'border-red-400' : 'border-blue-400'}
            ${disabled ? 'cursor-not-allowed text-gray-400' : 'hover:border-blue-500 text-gray-900'}
          `}
        >
          <span className={selectedOption ? 'font-medium text-gray-700' : 'text-gray-400'}>
            {selectedOption ? selectedOption[displayKey] : ''}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
            {options.map((option, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onChange(option[valueKey]);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 text-sm cursor-pointer ${value === option[valueKey] ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
              >
                {option[displayKey]}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Section Header Component
const SectionHeader = ({ title, rightContent }) => (
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-sm font-semibold text-[#4a5f7d]">{title}</h3>
    {rightContent && <div className="flex items-center gap-2">{rightContent}</div>}
  </div>
);

// Tab Link Component
const TabLink = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`text-sm font-semibold transition-colors px-2 py-1
      ${active 
        ? 'text-blue-600 border-b-2 border-blue-600' 
        : 'text-blue-500 hover:text-blue-700'
      }
    `}
  >
    {label}
  </button>
);

// Refresh Button Component
const RefreshButton = ({ onClick, label }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1 text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors"
  >
    <RefreshCw className="w-4 h-4" />
    {label}
  </button>
);

// Info Display Component
const InfoDisplay = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 p-3">
      {data.map((item, idx) => (
        <div key={idx} className="flex items-start">
          <label className="w-[45%] text-sm font-bold text-gray-700">
            {item.label}:
          </label>
          <span className="w-[55%] text-sm font-bold text-[#162ddc]">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// Grid Component with search icons
const DataGrid = ({ columns, data, onRowSelect, selectedRow, rowKey = 'id' }) => {
  return (
    <div className="border border-gray-300 bg-white">
      {/* Header */}
      <div className="grid gap-px bg-gray-300" style={{ gridTemplateColumns: columns.map(c => c.width || '1fr').join(' ') }}>
        {columns.map((col, idx) => (
          <div key={idx} className="bg-gray-100 px-4 py-2">
            <div className="text-sm font-semibold text-gray-700">{col.header}</div>
          </div>
        ))}
      </div>

      {/* Search Row */}
      <div className="grid gap-px bg-gray-300 border-t border-gray-300" style={{ gridTemplateColumns: columns.map(c => c.width || '1fr').join(' ') }}>
        {columns.map((col, idx) => (
          <div key={idx} className="bg-white px-4 py-2 flex items-center">
            {col.searchable !== false && (
              <Search className="w-4 h-4 text-gray-400" />
            )}
          </div>
        ))}
      </div>

      {/* Data Rows */}
      <div className="min-h-[200px] max-h-[300px] overflow-y-auto">
        {data.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
            No data to display
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {data.map((row, idx) => (
              <div
                key={idx}
                onClick={() => onRowSelect && onRowSelect(row)}
                className={`grid gap-px cursor-pointer transition-colors ${
                  selectedRow && selectedRow[rowKey] === row[rowKey] ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
                style={{ gridTemplateColumns: columns.map(c => c.width || '1fr').join(' ') }}
              >
                {columns.map((col, colIdx) => (
                  <div key={colIdx} className="px-4 py-2.5">
                    {col.render ? col.render(row) : (
                      <span className="text-sm text-gray-900">{row[col.field]}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Audit Trail Modal
const AuditTrailModal = ({ isOpen, onClose, onSubmit, t }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }
    onSubmit({ username, password, reason });
    setUsername('');
    setPassword('');
    setReason('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-20">
      <div className="bg-white rounded shadow-xl w-[400px]">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">Audit Trail Verification</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5">
          {error && (
            <div className="mb-3 p-2 bg-red-50 text-red-600 text-sm rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1 font-bold">{t('login.username')}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-8 px-2 text-sm border border-gray-300 rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1 font-bold">{t('login.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-8 px-2 text-sm border border-gray-300 rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1 font-bold">Reason (Optional)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-20 px-2 py-1 text-sm border border-gray-300 rounded"
                placeholder="Enter reason..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
          >
            {t('button.submit')}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50"
          >
            {t('button.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const InstrumentDataPage = () => {
  const { t } = useTranslation();

  // State management
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [activeTab, setActiveTab] = useState('merge');
  const [instrumentTagInfo, setInstrumentTagInfo] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileTagInfo, setFileTagInfo] = useState([]);
  const [mergeData, setMergeData] = useState([]);
  const [selectedMergeRow, setSelectedMergeRow] = useState(null);
  const [mergeFileRawData, setMergeFileRawData] = useState([]);
  const [nullData, setNullData] = useState([]);
  const [selectedNullRow, setSelectedNullRow] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [showAuditModal, setShowAuditModal] = useState(false);

  // Mock instruments
  const [instruments] = useState([
    { nInterInstrumentID: 1, sInstrumentAliasName: 'HPLC-001', sInstrumentID: 'INST001' },
    { nInterInstrumentID: 2, sInstrumentAliasName: 'GC-002', sInstrumentID: 'INST002' },
    { nInterInstrumentID: 3, sInstrumentAliasName: 'MS-003', sInstrumentID: 'INST003' }
  ]);

  // Mock data
  const mockFileList = [
    { Reference: '001', 'Task ID': 'TASK001', 'File Name': 'sample_001.txt', 'Upload Status': 'Uploaded', 'Client Name': 'Client A' },
    { Reference: '002', 'Task ID': 'TASK001', 'File Name': 'sample_002.txt', 'Upload Status': 'Processing', 'Client Name': 'Client B' }
  ];

  const mockMergeData = [
    { sRawDataID: 'RAW001', nSequenceNo: 1, nMergeFileCount: 5, sLockID: 'LOCK001', nInstrumentID: 1 },
    { sRawDataID: 'RAW002', nSequenceNo: 2, nMergeFileCount: 3, sLockID: 'LOCK001', nInstrumentID: 1 }
  ];

  // Event handlers
  const handleInstrumentChange = useCallback((value) => {
    setSelectedInstrument(value);
    
    setInstrumentTagInfo([
      { label: 'Sample', value: 'Sample-001' },
      { label: 'Test', value: 'Test-XYZ' }
    ]);

    setFileList(mockFileList);
    setMergeData(mockMergeData);
    setSelectedFile(null);
    setSelectedMergeRow(null);
  }, []);

  const handleFileSelect = useCallback((file) => {
    setSelectedFile(file);
    
    setFileTagInfo([
      { label: 'Sample ID', value: file.Reference },
      { label: 'Status', value: file['Upload Status'] }
    ]);

    setParsedData([
      { label: 'Field 1', value: '123.45' },
      { label: 'Field 2', value: '678.90' }
    ]);
  }, []);

  const handleMergeRowSelect = useCallback((row) => {
    setSelectedMergeRow(row);
    
    setMergeFileRawData([
      { label: 'Raw Data ID', value: row.sRawDataID },
      { label: 'Sequence', value: row.nSequenceNo.toString() }
    ]);
  }, []);

  const handleNullRowSelect = useCallback((row) => {
    setSelectedNullRow(row);
  }, []);

  const handleNullDataAck = useCallback(() => {
    if (!selectedNullRow) {
      alert('Please select a row');
      return;
    }
    setShowAuditModal(true);
  }, [selectedNullRow]);

  const handleAuditSubmit = useCallback((auditData) => {
    console.log('Audit submitted:', auditData);
    setShowAuditModal(false);
    setNullData(prev => prev.filter(d => d.sRawDataID !== selectedNullRow.sRawDataID));
    setSelectedNullRow(null);
    alert('Acknowledged successfully');
  }, [selectedNullRow]);

  // Column definitions
  const mergeColumns = [
    { header: 'Rawdata ID', field: 'sRawDataID', width: '25%' },
    { header: 'Sequence No', field: 'nSequenceNo', width: '20%' },
    { header: 'Merge File Count', field: 'nMergeFileCount', width: '20%' },
    { header: 'LockID', field: 'sLockID', width: '20%' },
    { header: 'InstrumentID', field: 'nInstrumentID', width: '15%' }
  ];

  const fileColumns = [
    { header: 'Filename', field: 'File Name', width: '40%' },
    { header: 'Upload Status', field: 'Upload Status', width: '30%' },
    { header: 'Client Name', field: 'Client Name', width: '30%' }
  ];

  const nullColumns = [
    { header: 'Rawdata ID', field: 'sRawDataID', width: '20%' },
    { header: 'Sequence No', field: 'nSequenceNo', width: '15%' },
    { header: 'Merge File Count', field: 'nMergeFileCount', width: '20%' },
    { header: 'LockID', field: 'sLockID', width: '20%' },
    { header: 'InstrumentID', field: 'nInstrumentID', width: '25%' }
  ];

  return (
    <div className="flex flex-col w-full font-sans bg-white">
      <div className="px-6 py-6">
        <div className="max-w-[1400px]">
          
          {/* Instrument Selection */}
          <div className="mb-6 max-w-[340px]">
            <AnimatedDropdown
              label={t('label.instrument')}
              value={selectedInstrument}
              options={instruments}
              onChange={handleInstrumentChange}
              displayKey="sInstrumentAliasName"
              valueKey="nInterInstrumentID"
              required
            />
          </div>

          {/* Instrument Tag Information */}
          <div className="mb-6">
            <SectionHeader title={t('instrumentlocktag.instrumenttagsinformation')} />
            <div className="border border-gray-300 bg-white min-h-[100px]">
              <InfoDisplay data={instrumentTagInfo} />
            </div>
          </div>

          {/* Latest Merged File Information */}
          <div className="mb-6">
            <SectionHeader 
              title={t('instrumentlocktag.latestmergedfileinformation')}
              rightContent={
                <>
                  <TabLink
                    label="MergeData"
                    active={activeTab === 'merge'}
                    onClick={() => setActiveTab('merge')}
                  />
                  <TabLink
                    label="ViewNullData"
                    active={activeTab === 'null'}
                    onClick={() => {
                      setActiveTab('null');
                      setNullData([
                        { sRawDataID: 'NULL001', nSequenceNo: 1, nMergeFileCount: 2, sLockID: 'LOCK001', nInstrumentID: 1 }
                      ]);
                    }}
                  />
                </>
              }
            />

            {activeTab === 'merge' ? (
              <div>
                <div className="flex justify-end mb-2">
                  <RefreshButton onClick={() => {}} label={t('instrumentlocktag.refresh')} />
                </div>
                <DataGrid
                  columns={mergeColumns}
                  data={mergeData}
                  onRowSelect={handleMergeRowSelect}
                  selectedRow={selectedMergeRow}
                  rowKey="sRawDataID"
                />
              </div>
            ) : (
              <div>
                <div className="flex justify-end gap-3 mb-2">
                  <button
                    onClick={handleNullDataAck}
                    className="text-blue-600 text-sm font-semibold hover:text-blue-700"
                  >
                    Acknowledgement
                  </button>
                  <RefreshButton onClick={() => {}} label={t('instrumentlocktag.refresh')} />
                </div>
                <DataGrid
                  columns={nullColumns}
                  data={nullData}
                  onRowSelect={handleNullRowSelect}
                  selectedRow={selectedNullRow}
                  rowKey="sRawDataID"
                />
              </div>
            )}
          </div>

          {/* Merged File Raw Data */}
          {selectedMergeRow && (
            <div className="mb-6">
              <SectionHeader title={t('instrumentlocktag.mergedfilerawdata')} />
              <div className="border border-gray-300 bg-white min-h-[200px]">
                <InfoDisplay data={mergeFileRawData} />
              </div>
            </div>
          )}

          {/* File Information */}
          <div className="mb-6">
            <SectionHeader 
              title={t('instrumentlocktag.fileinformation')}
              rightContent={<RefreshButton onClick={() => {}} label={t('instrumentlocktag.refresh')} />}
            />
            <DataGrid
              columns={fileColumns}
              data={fileList}
              onRowSelect={handleFileSelect}
              selectedRow={selectedFile}
              rowKey="Reference"
            />
          </div>

          {/* File Tag Information */}
          {selectedFile && (
            <div className="mb-6">
              <SectionHeader title={t('instrumentlocktag.filetagsinformation')} />
              <div className="border border-gray-300 bg-white min-h-[100px]">
                <InfoDisplay data={fileTagInfo} />
              </div>
            </div>
          )}

          {/* File Raw Data */}
          {selectedFile && (
            <div className="mb-6">
              <SectionHeader title={t('instrumentlocktag.filerawdata')} />
              <div className="border border-gray-300 bg-white h-[200px] flex items-center justify-center text-gray-400">
                File viewer placeholder
              </div>
            </div>
          )}

          {/* Parsed Data */}
          {selectedFile && (
            <div className="mb-6">
              <SectionHeader title={t('instrumentlocktag.parseddata')} />
              <div className="border border-gray-300 bg-white min-h-[200px]">
                <InfoDisplay data={parsedData} />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Audit Trail Modal */}
      <AuditTrailModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        onSubmit={handleAuditSubmit}
        t={t}
      />
    </div>
  );
};

export default InstrumentDataPage;
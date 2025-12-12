import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Lock, Unlock, ChevronDown, X, Loader2, Edit, QrCode } from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:8094/SDMS_WebService/';

// Helper function to get session values
const getSessionValue = (key, type = 1) => {
  if (type === 1) {
    return sessionStorage.getItem(key) || '';
  } else {
    const value = sessionStorage.getItem(key);
    return value ? value : '';
  }
};

// API Helper
const makeAPICall = async (endpoint, passObjDet, auditTrailValues = null) => {
  try {
    const userDetails = {
      appname: "SDMS",
      ActiveUserDetails: {
        sUsername: getSessionValue('sUsername') || 'Administrator',
        sUserID: getSessionValue('sUserID') || 'U1',
        sTenantID: getSessionValue('sTenantID') || ''
      }
    };
    
    let fullPassObj = { ...passObjDet, ...userDetails };
    
    // Add audit trail values if present
    if (auditTrailValues) {
      fullPassObj.AuditTrailValues = auditTrailValues;
    }
    
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passObj: JSON.stringify(fullPassObj) })
    });
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Format XML text helper
const formatXMLText = (text) => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// Underline Dropdown Component
const UnderlineDropdown = ({ 
  label, 
  value, 
  options, 
  onChange, 
  disabled, 
  required, 
  error, 
  loading,
  width,
  className = ''
}) => {
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

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`mb-4 ${className}`} ref={dropdownRef} style={width ? { width } : {}}>
      <label className="block text-sm text-[#405f7d] mb-0" style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
          disabled={disabled || loading}
          className={`w-full h-8 px-0 text-sm text-left bg-transparent border-0 border-b-2 flex items-center justify-between outline-none
            ${error ? 'border-red-400' : 'border-gray-300'}
            ${disabled || loading ? 'cursor-not-allowed text-gray-400' : 'hover:border-gray-400 text-gray-900'}
          `}
        >
          <span className={selectedOption ? 'font-medium' : 'text-gray-400'}>
            {loading ? 'Loading...' : (selectedOption?.label || '')}
          </span>
          {loading ? (
            <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
          ) : (
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </button>

        {isOpen && !disabled && !loading && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 text-sm cursor-pointer
                  ${value === option.value ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}
                `}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Underline Text Input
const UnderlineTextInput = ({ label, value, onChange, disabled, required, error, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    <label className="block text-[#405f7d] mb-1" style={{ fontFamily: 'Roboto', fontWeight: 'bold', fontSize:'0.87rem' }}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full h-8 px-0 text-sm bg-transparent border-0 border-b-2 outline-none font-medium
        ${error ? 'border-red-400' : 'border-gray-300'}
        ${disabled ? 'cursor-not-allowed text-gray-400' : 'hover:border-gray-400 focus:border-blue-500 text-gray-900'}
      `}
    />
  </div>
);

// Merge File Count Row Component
const MergeFileCountRow = ({ mergeCount, currentCount, onMergeChange, disabled, showMergeFields }) => {
  if (!showMergeFields) return null;
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <label className="text-sm text-[#405f7d] min-w-[140px]" style={{ fontFamily: 'Roboto', fontWeight: 'bold',fontSize:'0.8rem' }}>
            Merge File Count
          </label>
          <input
            type="number"
            value={mergeCount}
            onChange={(e) => onMergeChange(e.target.value)}
            disabled={disabled}
            min="0"
            max="10000"
            className="w-20 h-8 px-2 text-sm text-center border border-gray-300 rounded bg-white hover:border-gray-400"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-sm text-[#405f7d] min-w-[160px]" style={{ fontFamily: 'Roboto', fontWeight: 'bold',fontSize:'0.8rem' }}>
            Current Upload File Count
          </label>
          <input
            type="number"
            value={currentCount}
            disabled={true}
            min="0"
            className="w-20 h-8 px-2 text-sm text-center border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};

// Inline Checkbox
const InlineCheckbox = ({ label, checked, onChange, disabled }) => (
  <div className="flex items-center mb-4 gap-0">
    <label className="text-sm text-[#405f7d] min-w-[140px]" style={{ fontFamily: 'Roboto', fontWeight: 'bold',fontSize:'0.8rem' }}>
      {label}
    </label>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer"
    />
  </div>
);

// Tag Grid with Tooltip Support
const TagGrid = ({ tags, onTagValueClick, loading, isLocked }) => {
  const [tooltipOpen, setTooltipOpen] = useState(null);
  const tooltipRef = useRef(null);

  const handleTooltipClick = (index, event) => {
    if (tooltipOpen === index) {
      setTooltipOpen(null);
    } else {
      setTooltipOpen(index);
      // Position tooltip near click
      if (tooltipRef.current) {
        tooltipRef.current.style.top = `${event.clientY - 250}px`;
        tooltipRef.current.style.left = `${event.clientX - 275}px`;
      }
    }
  };

  const closeTooltip = () => {
    setTooltipOpen(null);
  };

  return (
    <div className="border border-gray-300 rounded relative">
      <div className="grid grid-cols-2 bg-gray-100 border-b border-gray-300">
        <div className="px-4 py-2 text-sm text-gray-700 border-r border-gray-300" style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>
          TagName
        </div>
        <div className="px-4 py-2 text-sm text-gray-700" style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>
          TagValue
        </div>
      </div>
      
      <div className="bg-white min-h-[250px]">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : tags.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-gray-400">No tags available</div>
        ) : (
          tags.map((tag, idx) => (
            <div 
              key={idx} 
              className={`grid grid-cols-2 border-b border-gray-200 last:border-b-0 ${
                !tag.value ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="px-4 py-2.5 text-sm text-gray-900 border-r border-gray-300 flex items-center">
                {tag.tagName}
                {tag.required && <span className="text-red-500 ml-1">*</span>}
              </div>
              <div className="px-4 py-2.5 text-sm text-gray-900 flex items-center justify-between group">
                <span className="flex-1">{tag.value || ''}</span>
                {tag.editable && !isLocked && tag.L58Order === 0 && (
                  <button
                    onClick={(e) => handleTooltipClick(idx, e)}
                    className="ml-2 text-gray-600 hover:text-blue-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                {tag.editable && !isLocked && tag.L58Order === 1 && tag.L58ValueStatus === true && (
                  <button
                    onClick={(e) => handleTooltipClick(idx, e)}
                    className="ml-2 text-gray-600 hover:text-blue-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tooltip Popup */}
      {tooltipOpen !== null && (
        <div 
          ref={tooltipRef}
          className="fixed z-[100] bg-white border border-gray-300 rounded shadow-lg w-[350px]"
          style={{ top: '100px', left: '100px' }}
        >
          <TagTooltip 
            tag={tags[tooltipOpen]}
            onClose={closeTooltip}
            onSubmit={(value) => {
              onTagValueClick(tooltipOpen, value);
              closeTooltip();
            }}
          />
        </div>
      )}
    </div>
  );
};

// Tag Tooltip Component
const TagTooltip = ({ tag, onClose, onSubmit }) => {
  const [selectedValue, setSelectedValue] = useState(tag.value || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState(tag.options || []);
  const [loading, setLoading] = useState(false);

  // Fetch tag values if not already loaded
  useEffect(() => {
    if (tag.options && tag.options.length === 0) {
      fetchTagValues();
    }
  }, [tag]);

  const fetchTagValues = async () => {
    setLoading(true);
    try {
      // Call API to get tag values based on hierarchy
      const passObj = {
        sInstrumentID: tag.instrumentID,
        sTemplateID: tag.templateID,
        sUserID: tag.userID,
        nTagID: tag.L58TagID,
        sTagValueID: tag.valueID || ''
      };
      
      // Make API call
      // const response = await makeAPICall('/InstrumentLock/LoadCategoryTagValueAndID', { passObjDet: passObj });
      // setOptions(response.list || []);
      
    } catch (error) {
      console.error('Error fetching tag values:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opt.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold">Select {tag.tagName}</h4>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-8 px-2 text-sm border border-gray-300 rounded"
        />
      </div>
      
      <div className="max-h-48 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : filteredOptions.length === 0 ? (
          <div className="text-center py-4 text-sm text-gray-500">No options available</div>
        ) : (
          filteredOptions.map((option, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedValue(option.value)}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                selectedValue === option.value ? 'bg-blue-50 border border-blue-200' : ''
              }`}
            >
              {option.label}
            </div>
          ))
        )}
      </div>
      
      <div className="flex justify-end gap-2 mt-3 pt-3 border-t">
        <button
          onClick={() => onSubmit(selectedValue)}
          disabled={!selectedValue}
          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:bg-gray-300"
        >
          Submit
        </button>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Barcode Scanner Component
const BarcodeScanner = ({ onScanComplete }) => {
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Only image files are accepted');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target.result);
      // In a real implementation, you would use a barcode/QR code library here
      // For now, we'll simulate scanning
      setTimeout(() => {
        // Simulate scanned value
        const simulatedCode = 'SCANNED12345';
        onScanComplete(simulatedCode);
        setPreviewImage(null);
        e.target.value = ''; // Reset input
      }, 1000);
    };
    reader.readAsDataURL(file);
  };

  return (
    <button
      type="button"
      onClick={handleFileSelect}
      className="ml-2 p-2 text-gray-600 hover:text-blue-600 border border-gray-300 rounded hover:border-blue-400"
      title="Scan Barcode"
    >
      <QrCode className="w-5 h-5" />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </button>
  );
};

// Audit Trail Modal
const AuditTrailModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }
    
    const auditTrailValues = {
      username,
      password,
      reason: reason || 'Instrument Lock/Unlock Operation'
    };
    
    onSubmit(auditTrailValues);
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
              <label className="block text-sm text-gray-600 mb-1" style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-8 px-2 text-sm border border-gray-300 rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1" style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-8 px-2 text-sm border border-gray-300 rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1" style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>
                Reason (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-20 px-2 py-1 text-sm border border-gray-300 rounded"
                placeholder="Enter reason for this operation..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:bg-gray-300"
          >
            {loading ? 'Verifying...' : 'Submit'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const InstrumentLockTag = () => {
  // State management
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    client: false,
    instrument: false,
    path: false,
    tags: false,
    tagValues: false
  });

  const [formData, setFormData] = useState({
    client: '',
    instrument: '',
    path: '',
    limsOrder: '',
    fileName: '',
    template: '',
    mergeFileCount: '1',
    currentFileCount: '0',
    unlockAfterCapture: false,
    protocolID: '',
    interfaceOrderID: '',
    lockID: '',
    autoUnlock: ''
  });

  const [errors, setErrors] = useState({});
  const [isLocked, setIsLocked] = useState(false);
  const [showMergeFields, setShowMergeFields] = useState(true);
  const [showUnlockOption, setShowUnlockOption] = useState(true);
  const [auditTrailModalOpen, setAuditTrailModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingAuditValues, setPendingAuditValues] = useState(null);

  // Dropdown options
  const [clientOptions, setClientOptions] = useState([]);
  const [instrumentOptions, setInstrumentOptions] = useState([]);
  const [pathOptions, setPathOptions] = useState([]);
  const [limsOrderOptions, setLimsOrderOptions] = useState([]);
  const [templateOptions, setTemplateOptions] = useState([]);

  // Tags data
  const [tags, setTags] = useState([]);

  // Refs
  const deactiveScheduleDataRef = useRef(null);
  const interfaceInstrumentIDRef = useRef(null);

  // Initialize component
  useEffect(() => {
    initializeComponent();
    loadPreferences();
  }, []);

  const initializeComponent = async () => {
    // Load client combo
    await loadClientCombo();
    
    // Load user combo
    await loadUserCombo();
    
    // Load template combo
    await loadTemplateCombo();
    
    // Check for deactive schedule data
    const deactiveData = getSessionValue('GActSchedulerData', 0);
    if (deactiveData) {
      deactiveScheduleDataRef.current = JSON.parse(deactiveData);
      if (deactiveScheduleDataRef.current.L06ClientID) {
        setFormData(prev => ({ ...prev, client: deactiveScheduleDataRef.current.L06ClientID }));
      }
    }
  };

  const loadPreferences = async () => {
    try {
      const response = await makeAPICall('/InstrumentLock/MergeFileAndAutounlock', {});
      
      if (response.MergeCount?.[0]?.L67Status === false) {
        setShowMergeFields(true);
      } else {
        setShowMergeFields(false);
      }
      
      if (response.AutoUnlock?.[0]?.L67Status === false) {
        setShowUnlockOption(true);
      } else {
        setShowUnlockOption(false);
      }
      
      if (response.MergeCountValue) {
        sessionStorage.setItem('MergeCount', response.MergeCountValue[0].L42ValueSettings);
      }
      
      if (response.AutoUnlockValue && response.AutoUnlockValue[0].L42ValueSettings == 1) {
        setFormData(prev => ({ ...prev, unlockAfterCapture: true }));
        sessionStorage.setItem('UnlockAfterCapture', '1');
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const loadClientCombo = async () => {
    setLoadingStates(prev => ({ ...prev, client: true }));
    try {
      const sClientID = deactiveScheduleDataRef.current?.L06ClientID || null;
      const sTaskStatus = deactiveScheduleDataRef.current?.TaskType !== "ScheduleCreation" ? 'D' : 'A';
      
      const response = await makeAPICall('/InstrumentLock/clientlockcombo', {
        sClientID,
        sTaskStatus
      });
      
      const options = response.map(item => ({
        value: item.sClientID,
        label: item.sClientName
      }));
      setClientOptions(options);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, client: false }));
    }
  };

  const loadUserCombo = async () => {
    try {
      const response = await makeAPICall('/InstrumentLock/LockUserCombo', {});
      // Store user options if needed
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadTemplateCombo = async () => {
    try {
      const response = await makeAPICall('/InstrumentLock/LockTemplateCombo', {});
      
      const options = response.map(item => ({
        value: item.sTemplateID,
        label: item.sTemplateName
      }));
      setTemplateOptions(options);
      
      // Check if template has feature
      if (response[0]?.L67Status === true) {
        // Hide right panel for default template
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  // Handle client change
  const handleClientChange = async (value) => {
    setFormData(prev => ({ ...prev, client: value }));
    
    // Clear dependent fields
    setFormData(prev => ({ 
      ...prev, 
      instrument: '',
      path: '',
      template: '',
      limsOrder: ''
    }));
    setTags([]);
    
    if (value) {
      await loadInstrumentCombo(value);
    }
  };

  const loadInstrumentCombo = async (clientID) => {
    setLoadingStates(prev => ({ ...prev, instrument: true }));
    try {
      const sScheduleID = deactiveScheduleDataRef.current?.L13ScheduleID || '';
      let serviceCall = '/InstrumentLock/LockInstrumentCombo';
      
      if (deactiveScheduleDataRef.current) {
        if (deactiveScheduleDataRef.current.TaskType === "ScheduleCreation") {
          serviceCall = '/InstrumentLock/LockActiveParsingInstrumentCombo';
        } else {
          serviceCall = '/InstrumentLock/LockDeactiveParsingInstrumentCombo';
        }
      }
      
      const response = await makeAPICall(serviceCall, {
        sClientID: clientID,
        sScheduleID
      });
      
      const options = response.map(item => ({
        value: item.L11InstrumentID,
        label: `${item.L11InstrumentAliasName} (${item.L11InstrumentName})`
      }));
      setInstrumentOptions(options);
    } catch (error) {
      console.error('Error loading instruments:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, instrument: false }));
    }
  };

  // Handle instrument change
  const handleInstrumentChange = async (value) => {
    setFormData(prev => ({ ...prev, instrument: value }));
    setErrors(prev => ({ ...prev, instrument: false }));
    
    // Parse interface instrument ID
    const splitVal = value.split(':');
    interfaceInstrumentIDRef.current = splitVal[1]?.trim();
    
    if (value) {
      // Disable LIMS order combo initially
      setFormData(prev => ({ ...prev, limsOrder: '' }));
      
      // Load path combo
      await loadPathCombo(value);
      
      // Check for protocol and file name
      await checkProtocolAndFileName(value);
    }
  };

  const loadPathCombo = async (instrumentID) => {
    setLoadingStates(prev => ({ ...prev, path: true }));
    try {
      const sScheduleID = deactiveScheduleDataRef.current?.L13ScheduleID || '';
      let serviceCall = '/InstrumentLock/LockPathCombo';
      
      if (deactiveScheduleDataRef.current) {
        if (deactiveScheduleDataRef.current.TaskType === "ScheduleCreation") {
          serviceCall = '/InstrumentLock/LockActiveInstrumentPathCombo';
        } else {
          serviceCall = '/InstrumentLock/LockDeactiveInstrumentPathCombo';
        }
      }
      
      const response = await makeAPICall(serviceCall, {
        sInstrumentID: instrumentID,
        sScheduleID
      });
      
      const options = response.map(item => ({
        value: item.sTaskID,
        label: item.sTaskSourcePath,
        originalItem: item
      }));
      setPathOptions(options);
      
      // Auto-select if only one option
      if (options.length === 1) {
        setFormData(prev => ({ ...prev, path: options[0].value }));
        // Load data for selected path
        await loadPathFileUserTemplate(options[0].value);
      }
    } catch (error) {
      console.error('Error loading paths:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, path: false }));
    }
  };

  const checkProtocolAndFileName = async (instrumentID) => {
    try {
      const response = await makeAPICall('/InstrumentLock/LoadProtocol', {
        sInstrumentID: instrumentID
      });
      
      if (response.LimsOrder?.length > 0 && parseInt(interfaceInstrumentIDRef.current) > 0) {
        setFormData(prev => ({ ...prev, protocolID: response.LimsOrder[0].PROTOCOLID }));
        await loadLimsOrderForInterfacer(parseInt(interfaceInstrumentIDRef.current));
      } else {
        setFormData(prev => ({ ...prev, protocolID: '1' }));
        await loadLimsOrder(instrumentID);
      }
      
      // Check file name and parser type
      sessionStorage.setItem('FileName', response.FileName || '');
      sessionStorage.setItem('L11ParserType', response.L11ParserType || '');
      
      const isInterfaceInstrument = parseInt(interfaceInstrumentIDRef.current) > 0;
      const hasFileName = response.FileName === "true";
      
      if (isInterfaceInstrument && hasFileName) {
        // Enable filename input, disable LIMS order
        setFormData(prev => ({ ...prev, fileName: '' }));
      } else {
        // Disable filename input
        setFormData(prev => ({ ...prev, fileName: '' }));
      }
    } catch (error) {
      console.error('Error checking protocol:', error);
    }
  };

  const loadLimsOrder = async (instrumentID) => {
    try {
      const response = await makeAPICall('/InstrumentLock/lockLimsordercombo', {
        nInterfaceInstID: parseInt(interfaceInstrumentIDRef.current) || 0
      });
      
      if (response.length > 0) {
        const options = response.map(item => ({
          value: item.nOrderID,
          label: item.LIMSOrder
        }));
        setLimsOrderOptions(options);
      } else {
        setLimsOrderOptions([]);
      }
    } catch (error) {
      console.error('Error loading LIMS orders:', error);
    }
  };

  const loadLimsOrderForInterfacer = async (interfaceInstID) => {
    try {
      const response = await makeAPICall('/InstrumentLock/lockLimsordercombo', {
        nInterfaceInstID: interfaceInstID
      });
      
      const options = response.map(item => ({
        value: item.nOrderID,
        label: item.LIMSOrder
      }));
      setLimsOrderOptions(options);
    } catch (error) {
      console.error('Error loading LIMS orders for interfacer:', error);
    }
  };

  // Handle path change
  const handlePathChange = async (value) => {
    setFormData(prev => ({ ...prev, path: value }));
    setErrors(prev => ({ ...prev, path: false }));
    
    if (value) {
      await loadPathFileUserTemplate(value);
    }
  };

  const loadPathFileUserTemplate = async (pathID) => {
    try {
      const selectedInstrument = instrumentOptions.find(opt => opt.value === formData.instrument);
      const nLLProStatus = selectedInstrument?.originalItem?.L11LLProStatus === true ? 1 : 0;
      
      const response = await makeAPICall('/InstrumentLock/OnChangeInstrumentCombo', {
        sInstrumentID: formData.instrument,
        nLLProStatus,
        nProtocolStatus: formData.protocolID ? parseInt(formData.protocolID) : 0,
        nProtocolStatusfile: sessionStorage.getItem('FileName') === "true" ? 101 : 0
      });
      
      if (response.oResInstChange) {
        bindDataOnFieldControl(response.oResInstChange);
      }
    } catch (error) {
      console.error('Error loading path details:', error);
    }
  };

  const bindDataOnFieldControl = (data) => {
    // Update form data with response
    if (data.sFileName) {
      setFormData(prev => ({ ...prev, fileName: data.sFileName }));
    }
    
    if (data.nMergeFileCount) {
      const mergeCount = data.nMergeFileCount === 1 || data.nMergeFileCount === 0 
        ? sessionStorage.getItem('MergeCount') || '1'
        : data.nMergeFileCount.toString();
      setFormData(prev => ({ ...prev, mergeFileCount: mergeCount }));
      
      if (data.sTaskID != null) {
        sessionStorage.setItem('LockedMergeCount', data.nMergeFileCount.toString());
      }
    }
    
    if (data.nCurMergeFileNo > 0) {
      setFormData(prev => ({ ...prev, currentFileCount: data.nCurMergeFileNo.toString() }));
    }
    
    if (data.nAutoUnlock) {
      setFormData(prev => ({ ...prev, unlockAfterCapture: data.nAutoUnlock === 1 }));
    }
    
    if (data.sTaskID) {
      setFormData(prev => ({ ...prev, path: data.sTaskID }));
    }
    
    if (data.nInterFaceOrderID) {
      setFormData(prev => ({ ...prev, interfaceOrderID: data.nInterFaceOrderID.toString() }));
    }
    
    if (data.sLockID) {
      setFormData(prev => ({ ...prev, lockID: data.sLockID }));
    }
    
    if (data.nOrderID) {
      setFormData(prev => ({ ...prev, limsOrder: data.nOrderID.toString() }));
    }
    
    if (data.sUserID) {
      // Check if current user matches
      const currentUserID = getSessionValue('sUserID');
      const isCurrentUser = data.sUserID === currentUserID;
      const isAdmin = getSessionValue('sUsername') === 'SDMSADMIN';
      
      setIsLocked(true);
      
      if (isCurrentUser || isAdmin) {
        // User can update/unlock
      } else {
        // User cannot modify
        setIsLocked(true);
      }
      
      // Show update button, hide lock button
    } else {
      setIsLocked(false);
      // Show lock button, hide update button
    }
    
    if (data.sTemplateID) {
      setFormData(prev => ({ ...prev, template: data.sTemplateID }));
      // Load tags for template
      loadTagsForTemplate(data.sTemplateID);
    }
    
    // Check for auto-lock status
    if (data.sLockType === "A") {
      // Instrument is auto-locked
      setIsLocked(true);
    }
  };

  // Handle template change
  const handleTemplateChange = async (value) => {
    setFormData(prev => ({ ...prev, template: value }));
    setErrors(prev => ({ ...prev, template: false }));
    
    if (value) {
      await loadTagsForTemplate(value);
    }
  };

  const loadTagsForTemplate = async (templateID) => {
    setLoadingStates(prev => ({ ...prev, tags: true }));
    try {
      const response = await makeAPICall('/InstrumentLock/LoadTagCategory', {
        sInstrumentID: formData.instrument,
        sTemplateID: templateID,
        sUserID: formData.path
      });
      
      const tagData = response.map(item => ({
        tagName: item.L58TagName,
        value: item.Value || '',
        required: item.L58Order === 0,
        editable: true,
        options: [],
        L58TagID: item.L58TagID,
        ValueID: item.ValueID || '',
        L58Order: item.L58Order,
        L58ValueStatus: item.L58ValueStatus,
        instrumentID: formData.instrument,
        templateID: templateID,
        userID: formData.path
      }));
      
      setTags(tagData);
    } catch (error) {
      console.error('Error loading tags:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, tags: false }));
    }
  };

  // Handle tag value click
  const handleTagValueClick = async (index, value = null) => {
    const tag = tags[index];
    
    if (value) {
      // Update tag value directly
      setTags(prev => prev.map((t, idx) => 
        idx === index ? { ...t, value, ValueID: value } : t
      ));
      return;
    }
    
    // For hierarchy tags (L58Order === 0), need to fetch values based on previous tags
    if (tag.L58Order === 0) {
      await loadTagValuesForHierarchy(index);
    } else if (tag.L58Order === 1 && tag.L58ValueStatus === true) {
      await loadTagValuesForNonHierarchy(index);
    }
  };

  const loadTagValuesForHierarchy = async (index) => {
    setLoadingStates(prev => ({ ...prev, tagValues: true }));
    try {
      const tag = tags[index];
      
      // Check if all previous required tags have values
      for (let i = 0; i < index; i++) {
        if (tags[i].required && !tags[i].value) {
          alert(`Please select value for: ${tags[i].tagName}`);
          return;
        }
      }
      
      // Get previous tag's value ID if exists
      const prevTagValueID = index > 0 ? tags[index - 1].ValueID : '';
      
      const response = await makeAPICall('/InstrumentLock/LoadCategoryTagValueAndID', {
        sInstrumentID: formData.instrument,
        sTemplateID: formData.template,
        sUserID: formData.path,
        nTagID: tag.L58TagID,
        sTagValueID: prevTagValueID
      });
      
      if (response.list) {
        const options = response.list.map(item => ({
          value: item.sTagValueID,
          label: item.sTagValue
        }));
        
        // Show modal or tooltip with options
        setTags(prev => prev.map((t, idx) => 
          idx === index ? { ...t, options } : t
        ));
        
        // In real implementation, you would open a modal here
        // For now, we'll just update with first option if exists
        if (options.length > 0) {
          setTags(prev => prev.map((t, idx) => 
            idx === index ? { ...t, value: options[0].label, ValueID: options[0].value } : t
          ));
        }
      }
    } catch (error) {
      console.error('Error loading tag values:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, tagValues: false }));
    }
  };

  const loadTagValuesForNonHierarchy = async (index) => {
    setLoadingStates(prev => ({ ...prev, tagValues: true }));
    try {
      const tag = tags[index];
      
      const response = await makeAPICall('/InstrumentLock/LoadNonHierarchyTagValue', {
        sInstrumentID: formData.instrument,
        sTemplateID: formData.template,
        sUserID: formData.path,
        nTagID: tag.L58TagID
      });
      
      if (response.list) {
        const options = response.list.map(item => ({
          value: item.sTagValueID,
          label: item.sTagValue
        }));
        
        setTags(prev => prev.map((t, idx) => 
          idx === index ? { ...t, options } : t
        ));
        
        // Show modal with options
        // In real implementation, open a modal
      }
    } catch (error) {
      console.error('Error loading non-hierarchy tag values:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, tagValues: false }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.instrument) newErrors.instrument = true;
    if (!formData.path) newErrors.path = true;
    if (!formData.template) newErrors.template = true;
    if (!formData.fileName) newErrors.fileName = true;
    
    // Check required tags
    const missingTags = tags.filter(tag => tag.required && !tag.value);
    if (missingTags.length > 0) {
      alert(`Please select value for: ${missingTags[0].tagName}`);
      return false;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Build XML for SDMS
  const buildXML = () => {
    const templateLabel = templateOptions.find(opt => opt.value === formData.template)?.label || '';
    
    let xMasterXml = '<Sheet1><Row>';
    xMasterXml += `<Template>${formatXMLText(templateLabel)}</Template>`;
    
    let xDetailsXml = '<Sheet1>';
    xDetailsXml += `<Row><Category>Template</Category><Value>${formatXMLText(templateLabel)}</Value></Row>`;
    
    tags.forEach(tag => {
      if (tag.value) {
        xMasterXml += `<${tag.tagName}>${formatXMLText(tag.value)}</${tag.tagName}>`;
        xDetailsXml += `<Row><Category>${tag.tagName}</Category><Value>${formatXMLText(tag.value)}</Value></Row>`;
      }
    });
    
    xMasterXml += '</Row></Sheet1>';
    xDetailsXml += '</Sheet1>';
    
    return { xMasterXml, xDetailsXml };
  };

  // Check interface connection before lock/update
  const checkInterfaceConnection = async (action) => {
    if (!formData.instrument) return;
    
    const splitVal = formData.instrument.split(':');
    const interfaceInstID = parseInt(splitVal[1]?.trim());
    
    if (interfaceInstID > 0) {
      setPendingAction(action);
      
      try {
        const response = await makeAPICall('/InstrumentLock/InterfaceConnectionChecking', {
          InterfaceInstID: interfaceInstID
        });
        
        if (response[0]?.AccessStatus === 1) {
          // Interface is connected
          if (action === 'lock') {
            await handleLockInternal();
          } else if (action === 'update') {
            await handleUpdateInternal();
          }
        } else {
          // Interface not connected, show confirmation
          if (window.confirm('Interface is not connected. Do you want to continue?')) {
            if (action === 'lock') {
              await handleLockInternal(false);
            } else if (action === 'update') {
              await handleUpdateInternal(false);
            }
          }
        }
      } catch (error) {
        console.error('Error checking interface connection:', error);
      }
    } else {
      // Non-interface instrument
      if (action === 'lock') {
        await handleLockInternal();
      } else if (action === 'update') {
        await handleUpdateInternal();
      }
    }
  };

  // Handle lock with audit trail if needed
  const handleLock = async () => {
    if (!validateForm()) return;
    
    // Check if audit trail is required
    const hasDeactiveData = deactiveScheduleDataRef.current && 
                           deactiveScheduleDataRef.current.TaskType !== "ScheduleCreation";
    
    if (hasDeactiveData) {
      setPendingAction('lock');
      setAuditTrailModalOpen(true);
    } else {
      await checkInterfaceConnection('lock');
    }
  };

  const handleLockInternal = async (interfaceConnected = true) => {
    try {
      setLoading(true);
      const { xMasterXml, xDetailsXml } = buildXML();
      
      const lockinstdetails = {
        sInstrumentID: formData.instrument,
        sTaskID: formData.path,
        sTemplateID: formData.template,
        sFileName: formData.fileName,
        nMergeFileCount: parseInt(formData.mergeFileCount) || 1,
        nAutoUnlock: formData.unlockAfterCapture ? 1 : 0,
        xMasterXml,
        xDetailsXml,
        nLLProStatus: sessionStorage.getItem('FileName') === "true" ? 1 : 0,
        nProtocolStatus: formData.protocolID ? parseInt(formData.protocolID) : 0,
        nInterFaceOrderID: formData.interfaceOrderID ? parseInt(formData.interfaceOrderID) : 0,
        sTaskSourcePath: pathOptions.find(opt => opt.value === formData.path)?.label || '',
        sScheduleID: pathOptions.find(opt => opt.value === formData.path)?.originalItem?.L13ScheduleID || '',
        sUserID: getSessionValue('sUserID'),
        audittrailforinterfaceinstrument: !interfaceConnected
      };
      
      const passObj = {
        lockinstdetails,
        sValidation: 'CheckAndInsert',
        sSendLabel: 'Lock',
        lInstTagValue: tags.map(tag => ({
          L58TagID: tag.L58TagID,
          L58TagName: tag.tagName,
          Value: tag.value,
          ValueID: tag.ValueID,
          L58Order: tag.L58Order,
          L58ValueStatus: tag.L58ValueStatus
        })),
        sInstrumentName: instrumentOptions.find(opt => opt.value === formData.instrument)?.label || '',
        sTemplateName: templateOptions.find(opt => opt.value === formData.template)?.label || ''
      };
      
      // Add audit trail values if present
      if (pendingAuditValues) {
        passObj.AuditTrailValues = pendingAuditValues;
        setPendingAuditValues(null);
      }
      
      // Add LIMS order data if present
      if (formData.limsOrder && !formData.interfaceOrderID) {
        const selectedLimsOrder = limsOrderOptions.find(opt => opt.value === formData.limsOrder);
        if (selectedLimsOrder) {
          passObj.ManualOrder = false;
          passObj.LIMSobj = { nOrderID: formData.limsOrder };
        }
      }
      
      const response = await makeAPICall('/InstrumentLock/LockInstrument', passObj);
      
      if (response.oResObj?.bStatus === true) {
        alert(`Instrument locked successfully!`);
        setIsLocked(true);
        
        // Clear form for next lock
        setFormData(prev => ({
          ...prev,
          fileName: '',
          mergeFileCount: sessionStorage.getItem('MergeCount') || '1'
        }));
        setTags(prev => prev.map(tag => ({ ...tag, value: '', ValueID: '' })));
      } else {
        if (response.oResObj?.sInformation === "Entering Duplicate Tag Values") {
          // Retry with Insert validation
          passObj.sValidation = 'Insert';
          const retryResponse = await makeAPICall('/InstrumentLock/LockInstrument', passObj);
          
          if (retryResponse.oResObj?.bStatus === true) {
            alert(`Instrument locked successfully!`);
            setIsLocked(true);
          } else {
            alert(retryResponse.oResObj?.sInformation || 'Lock failed');
          }
        } else {
          alert(response.oResObj?.sInformation || 'Lock failed');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error locking instrument');
    } finally {
      setLoading(false);
    }
  };

  // Handle update
  const handleUpdate = async () => {
    if (!validateForm()) return;
    
    await checkInterfaceConnection('update');
  };

  const handleUpdateInternal = async (interfaceConnected = true) => {
    try {
      setLoading(true);
      const { xMasterXml, xDetailsXml } = buildXML();
      
      const lockinstdetails = {
        sInstrumentID: formData.instrument,
        sTaskID: formData.path,
        sTemplateID: formData.template,
        sFileName: formData.fileName,
        nMergeFileCount: parseInt(formData.mergeFileCount) || 1,
        nAutoUnlock: formData.unlockAfterCapture ? 1 : 0,
        xMasterXml,
        xDetailsXml,
        nLLProStatus: sessionStorage.getItem('FileName') === "true" ? 1 : 0,
        nProtocolStatus: formData.protocolID ? parseInt(formData.protocolID) : 0,
        nInterFaceOrderID: formData.interfaceOrderID ? parseInt(formData.interfaceOrderID) : 0,
        sTaskSourcePath: pathOptions.find(opt => opt.value === formData.path)?.label || '',
        sScheduleID: pathOptions.find(opt => opt.value === formData.path)?.originalItem?.L13ScheduleID || '',
        sUserID: getSessionValue('sUserID'),
        audittrailforinterfaceinstrument: !interfaceConnected
      };
      
      const passObj = {
        lockinstdetails,
        sValidation: 'CheckAndInsert',
        sSendLabel: 'Update',
        lInstTagValue: tags.map(tag => ({
          L58TagID: tag.L58TagID,
          L58TagName: tag.tagName,
          Value: tag.value,
          ValueID: tag.ValueID,
          L58Order: tag.L58Order,
          L58ValueStatus: tag.L58ValueStatus
        })),
        sInstrumentName: instrumentOptions.find(opt => opt.value === formData.instrument)?.label || '',
        sTemplateName: templateOptions.find(opt => opt.value === formData.template)?.label || ''
      };
      
      const response = await makeAPICall('/InstrumentLock/LockInstrument', passObj);
      
      if (response.oResObj?.bStatus === true) {
        alert(`Instrument updated successfully!`);
      } else {
        alert(response.oResObj?.sInformation || 'Update failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating instrument');
    } finally {
      setLoading(false);
    }
  };

  // Handle unlock
  const handleUnlock = async () => {
    if (!window.confirm('Are you sure you want to unlock this instrument?')) {
      return;
    }
    
    // Check if force unlock might be needed
    setPendingAction('unlock');
    setAuditTrailModalOpen(true);
  };

  const handleUnlockInternal = async (auditTrailValues = null, forceUnlock = false) => {
    try {
      setLoading(true);
      
      const unlockObjDet = {
        sInstrumentID: formData.instrument,
        sTaskID: formData.path,
        sFileName: formData.fileName,
        sTemplateID: formData.template,
        nProtocolStatus: formData.protocolID ? parseInt(formData.protocolID) : 0,
        sTaskSourcePath: pathOptions.find(opt => opt.value === formData.path)?.label || '',
        sScheduleID: pathOptions.find(opt => opt.value === formData.path)?.originalItem?.L13ScheduleID || '',
        nInterFaceOrderID: formData.interfaceOrderID ? parseInt(formData.interfaceOrderID) : 0,
        nMergeFileCount: parseInt(formData.mergeFileCount) || 1,
        sUserID: getSessionValue('sUserID'),
        mergebreak: forceUnlock ? "false" : "true"
      };
      
      const passObj = {
        unlockObjDet,
        sInstrumentName: instrumentOptions.find(opt => opt.value === formData.instrument)?.label || '',
        sTemplateName: templateOptions.find(opt => opt.value === formData.template)?.label || '',
        mergebreak: forceUnlock ? "false" : "true"
      };
      
      // Add LIMS order if present
      if (formData.limsOrder) {
        passObj.limsObj = { nOrderID: formData.limsOrder };
      }
      
      // Add audit trail values
      if (auditTrailValues) {
        passObj.AuditTrailValues = auditTrailValues;
      }
      
      const response = await makeAPICall('/InstrumentLock/UnLockInstrument', passObj);
      
      if (response.oResObj?.bStatus === true) {
        alert(`Instrument unlocked successfully!`);
        setIsLocked(false);
        
        // Reset form
        setFormData(prev => ({
          ...prev,
          fileName: '',
          mergeFileCount: sessionStorage.getItem('MergeCount') || '1',
          limsOrder: ''
        }));
        setTags(prev => prev.map(tag => ({ ...tag, value: '', ValueID: '' })));
        
        // Reload template to refresh tags
        if (formData.template) {
          await loadTagsForTemplate(formData.template);
        }
      } else if (response.oResObj?.bForceUnlock === true) {
        // Force unlock required
        if (window.confirm('Force unlock required. Continue?')) {
          await handleUnlockInternal(auditTrailValues, true);
        }
      } else {
        alert(response.oResObj?.sInformation || 'Unlock failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error unlocking instrument');
    } finally {
      setLoading(false);
    }
  };

  // Handle barcode scan
  const handleBarcodeScan = (scannedValue) => {
    setFormData(prev => ({ ...prev, limsOrder: scannedValue }));
    
    // Search in LIMS order options
    const foundOption = limsOrderOptions.find(opt => 
      opt.value.toString() === scannedValue || 
      opt.label.includes(scannedValue)
    );
    
    if (foundOption) {
      setFormData(prev => ({ ...prev, limsOrder: foundOption.value }));
    }
  };

  // Handle audit trail submission
  const handleAuditTrailSubmit = (auditValues) => {
    setPendingAuditValues(auditValues);
    setAuditTrailModalOpen(false);
    
    // Execute pending action
    if (pendingAction === 'lock') {
      checkInterfaceConnection('lock');
    } else if (pendingAction === 'update') {
      checkInterfaceConnection('update');
    } else if (pendingAction === 'unlock') {
      handleUnlockInternal(auditValues);
    }
  };

  // Handle merge count change with validation
  const handleMergeCountChange = (value) => {
    const numValue = parseInt(value);
    if (numValue > 10000) {
      alert('Merge count cannot exceed 10000');
      setFormData(prev => ({ ...prev, mergeFileCount: '10000' }));
    } else {
      setFormData(prev => ({ ...prev, mergeFileCount: value }));
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
          <div className="bg-white rounded-lg shadow-xl px-6 py-4 flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-sm text-[#616161]">Loading...</span>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 gap-0">
          {/* Left Panel */}
  <div className="max-w-[350px] "> {/* Add max-width here */}
            <UnderlineDropdown
              label="Client"
              value={formData.client}
              options={clientOptions}
              onChange={handleClientChange}
              disabled={isLocked}
              loading={loadingStates.client}
            />

            <UnderlineDropdown 
              label="Instrument"
              value={formData.instrument}
              options={instrumentOptions}
              onChange={handleInstrumentChange}
              disabled={isLocked}
              required
              error={errors.instrument}
              loading={loadingStates.instrument}
            />

            <UnderlineDropdown
              label="Path"
              value={formData.path}
              options={pathOptions}
              onChange={handlePathChange}
              disabled={isLocked}
              required
              error={errors.path}
              loading={loadingStates.path}
            />

            <div className="mb-4">
              <label className="block text-sm text-[#405f7d] mb-1" style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>
                LIMS Order
              </label>
              <div className="flex items-center">
                <div className="flex-1">
                  <UnderlineTextInput
                    value={formData.limsOrder}
                    options={limsOrderOptions}
                    onChange={(value) => setFormData(prev => ({ ...prev, limsOrder: value }))}
                    disabled={isLocked || formData.interfaceOrderID}
                    className="!mb-0"
                  />
                </div>
              </div>
            </div>

            <UnderlineTextInput className="block text-sm text-[#405f7d] mb-1" style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}
              label="Filename"
              value={formData.fileName}
              onChange={(value) => setFormData(prev => ({ ...prev, fileName: value }))}
              disabled={isLocked || parseInt(interfaceInstrumentIDRef.current) === 0}
              required
              error={errors.fileName}
            />

            {/* Merge File Count Fields */}
            <MergeFileCountRow
              mergeCount={formData.mergeFileCount}
              currentCount={formData.currentFileCount}
              onMergeChange={handleMergeCountChange}
              disabled={isLocked}
              showMergeFields={showMergeFields}
            />

            {showUnlockOption && (
              <InlineCheckbox
                label="Unlock after Capture"
                checked={formData.unlockAfterCapture}
                onChange={(value) => setFormData(prev => ({ ...prev, unlockAfterCapture: value }))}
                disabled={isLocked}
              />
            )}
          </div>

          {/* Right Panel */}
          <div>
            <UnderlineDropdown
              label="Template"
              value={formData.template}
              options={templateOptions}
              onChange={handleTemplateChange}
              disabled={isLocked}
              required
              error={errors.template}
            />

            <div className="mt-6">
              <TagGrid
                tags={tags}
                onTagValueClick={handleTagValueClick}
                loading={loadingStates.tags}
                isLocked={isLocked}
              />
            </div>
          </div>
        </div>

        {/* Hidden fields */}
        <div className="hidden">
          <input type="text" id="ProtocolID" value={formData.protocolID} readOnly />
          <input type="text" id="InterfaceOrderID" value={formData.interfaceOrderID} readOnly />
          <input type="text" id="LockID" value={formData.lockID} readOnly />
          <input type="text" id="UnlockAfterCapture" value={formData.unlockAfterCapture ? '1' : '0'} readOnly />
        </div>

        {/* Bottom Buttons */}
{/* Bottom Buttons */}
<div className="flex justify-end gap-3 mt-12 pt-6 border-t border-gray-200">
  {!isLocked ? (
    <button
      onClick={handleLock}
      disabled={loading}
      className="flex items-center  gap-2 px-3 py-2 bg-[#2883fe] text-white text-sm font-medium rounded hover:bg-blue-700 disabled:bg-gray-300"
    >
      <Lock className="w-4 h-4" />
      Lock
    </button>
  ) : (
    <button
      onClick={handleUpdate}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 disabled:bg-gray-300"
    >
      <Edit className="w-4 h-4" />
      Update
    </button>
  )}
  
  <button
    onClick={handleUnlock}
    disabled={loading || !isLocked}
    className="flex items-center gap-2 px-3 py-2 bg-blue-400 text-white text-sm font-medium rounded hover:bg-blue-500 disabled:bg-[#85bcfa9f]"
  >
    <Unlock className="w-4 h-4" />
    Unlock
  </button>
</div>
      </div>

      {/* Audit Trail Modal */}
      <AuditTrailModal
        isOpen={auditTrailModalOpen}
        onClose={() => setAuditTrailModalOpen(false)}
        onSubmit={handleAuditTrailSubmit}
        loading={loading}
      />
    </div>
  );
};

export default InstrumentLockTag;
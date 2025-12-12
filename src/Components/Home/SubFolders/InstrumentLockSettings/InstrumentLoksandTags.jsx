import React, { useState, useRef, useEffect } from 'react';
import { 
  Lock, Unlock, RefreshCw, Edit, QrCode, Upload, X, ChevronUp, ChevronDown
} from 'lucide-react';

// Reusable Components
const Dropdown = ({ label, value, options, onChange, disabled, required, error, className = "" }) => (
  <div className={`flex flex-col ${className}`}>
    <label className={`text-xs font-semibold text-slate-700 mb-1.5 ${required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}`}>
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-3 py-2 text-sm border rounded bg-white transition-colors
        ${error ? 'border-red-500' : 'border-slate-300'}
        ${disabled ? 'bg-slate-100 cursor-not-allowed' : 'hover:border-blue-400 focus:border-blue-500 focus:outline-none'}
      `}
    >
      <option value="">Select {label}</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const TextInput = ({ label, value, onChange, disabled, required, error, placeholder, className = "" }) => (
  <div className={`flex flex-col ${className}`}>
    <label className={`text-xs font-semibold text-slate-700 mb-1.5 ${required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}`}>
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full px-3 py-2 text-sm border rounded transition-colors
        ${error ? 'border-red-500' : 'border-slate-300'}
        ${disabled ? 'bg-slate-100 cursor-not-allowed' : 'hover:border-blue-400 focus:border-blue-500 focus:outline-none'}
      `}
    />
  </div>
);

const NumberInput = ({ label, value, onChange, disabled, min, max, className = "" }) => (
  <div className={`flex flex-col ${className}`}>
    <label className="text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      min={min}
      max={max}
      className={`w-full px-3 py-2 text-sm border border-slate-300 rounded transition-colors
        ${disabled ? 'bg-slate-100 cursor-not-allowed' : 'hover:border-blue-400 focus:border-blue-500 focus:outline-none'}
      `}
    />
  </div>
);

const Checkbox = ({ label, checked, onChange, disabled }) => (
  <label className="flex items-center gap-2 cursor-pointer select-none">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
    />
    <span className="text-sm font-medium text-slate-700">{label}</span>
  </label>
);

const ActionButton = ({ icon: Icon, label, onClick, disabled, variant = "primary" }) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    secondary: "bg-slate-600 hover:bg-slate-700 text-white"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded transition-all shadow-sm
        ${disabled ? 'bg-slate-300 cursor-not-allowed opacity-50' : variants[variant]}
      `}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
};

// Tag Grid Component
const TagGrid = ({ tags, onTagValueClick }) => (
  <div className="border border-slate-300 rounded overflow-hidden">
    <div className="bg-slate-100 border-b border-slate-300">
      <div className="grid grid-cols-2 text-xs font-bold text-slate-700">
        <div className="px-4 py-2 border-r border-slate-300">Tag Name</div>
        <div className="px-4 py-2">Tag Value</div>
      </div>
    </div>
    <div className="max-h-[290px] overflow-y-auto">
      {tags.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-slate-500">No tags to display</div>
      ) : (
        tags.map((tag, idx) => (
          <div key={idx} className="grid grid-cols-2 border-b border-slate-200 hover:bg-slate-50">
            <div className="px-4 py-3 text-sm border-r border-slate-200">
              {tag.tagName}
              {tag.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            <div className="px-4 py-3 text-sm flex items-center justify-between group">
              <span className="flex-1">{tag.value || '-'}</span>
              {tag.editable && (
                <button
                  onClick={() => onTagValueClick(idx)}
                  className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-700 transition-opacity"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

// Tag Value Modal
const TagValueModal = ({ tag, onClose, onSubmit }) => {
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-2xl w-[400px] max-h-[500px] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Select {tag?.tagName}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {tag?.options?.map((option, idx) => (
              <label key={idx} className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors">
                <input
                  type="radio"
                  name="tagValue"
                  value={option.value}
                  checked={selectedValue === option.value}
                  onChange={(e) => setSelectedValue(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={() => {
              if (selectedValue) {
                onSubmit(selectedValue);
                onClose();
              }
            }}
            disabled={!selectedValue}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-600 text-sm font-medium rounded hover:bg-slate-50 transition-colors"
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
  const [isExpanded, setIsExpanded] = useState(true);
  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedTagIndex, setSelectedTagIndex] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    client: '',
    instrument: '',
    path: '',
    limsOrder: '',
    fileName: '',
    username: '',
    template: '',
    mergeFileCount: '1',
    currentFileCount: '0',
    unlockAfterCapture: false
  });

  const [errors, setErrors] = useState({});
  const [isLocked, setIsLocked] = useState(false);
  const [showMergeFields, setShowMergeFields] = useState(true);
  const [showUnlockOption, setShowUnlockOption] = useState(true);

  // Mock Data
  const [clientOptions] = useState([
    { value: 'C001', label: 'Client A' },
    { value: 'C002', label: 'Client B' },
    { value: 'C003', label: 'Client C' }
  ]);

  const [instrumentOptions] = useState([
    { value: 'I001:0', label: 'Instrument 1' },
    { value: 'I002:1', label: 'Instrument 2 (Interface)' },
    { value: 'I003:0', label: 'Instrument 3' }
  ]);

  const [pathOptions] = useState([
    { value: 'P001', label: 'C:\\Data\\Path1' },
    { value: 'P002', label: 'C:\\Data\\Path2' }
  ]);

  const [limsOrderOptions] = useState([
    { value: 'L001', label: 'Order-001' },
    { value: 'L002', label: 'Order-002' }
  ]);

  const [templateOptions] = useState([
    { value: 'T001', label: 'Template A' },
    { value: 'T002', label: 'Template B' }
  ]);

  const [tags, setTags] = useState([
    { tagName: 'Batch', value: '', required: true, editable: true, options: [
      { value: 'B001', label: 'Batch 001' },
      { value: 'B002', label: 'Batch 002' }
    ]},
    { tagName: 'Sample Type', value: '', required: true, editable: true, options: [
      { value: 'ST001', label: 'Type A' },
      { value: 'ST002', label: 'Type B' }
    ]},
    { tagName: 'Analyst', value: '', required: false, editable: true, options: [
      { value: 'A001', label: 'John Doe' },
      { value: 'A002', label: 'Jane Smith' }
    ]}
  ]);

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  // Handle tag value selection
  const handleTagValueClick = (index) => {
    setSelectedTagIndex(index);
    setShowTagModal(true);
  };

  const handleTagValueSubmit = (value) => {
    setTags(prev => prev.map((tag, idx) => 
      idx === selectedTagIndex 
        ? { ...tag, value: tag.options.find(opt => opt.value === value)?.label || value }
        : tag
    ));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.instrument) newErrors.instrument = true;
    if (!formData.path) newErrors.path = true;
    if (!formData.fileName && formData.instrument.split(':')[1] !== '0') newErrors.fileName = true;
    if (!formData.template) newErrors.template = true;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Lock
  const handleLock = () => {
    if (!validateForm()) {
      alert('Please fill all required fields');
      return;
    }

    // Validate required tags
    const missingTags = tags.filter(tag => tag.required && !tag.value);
    if (missingTags.length > 0) {
      alert(`Please select value for: ${missingTags[0].tagName}`);
      return;
    }

    console.log('Lock Data:', { formData, tags });
    alert('Instrument locked successfully!');
    setIsLocked(true);
  };

  // Handle Update
  const handleUpdate = () => {
    if (!validateForm()) {
      alert('Please fill all required fields');
      return;
    }

    console.log('Update Data:', { formData, tags });
    alert('Instrument updated successfully!');
  };

  // Handle Unlock
  const handleUnlock = () => {
    if (window.confirm('Are you sure you want to unlock this instrument?')) {
      console.log('Unlock Data:', formData);
      alert('Instrument unlocked successfully!');
      setIsLocked(false);
      
      // Reset form
      setFormData({
        ...formData,
        fileName: '',
        mergeFileCount: '1',
        currentFileCount: '0'
      });
    }
  };

  // Handle barcode scan (placeholder)
  const handleBarcodeScan = () => {
    alert('Barcode scanning functionality - Implementation pending');
  };

  return (
    <div className="flex flex-col w-full font-sans">
      {/* Header Section */}
      <div className="bg-[#f0f4f8] px-4 pt-4 pb-2 relative rounded-t-md">
        {isExpanded ? (
          <div className="mb-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <Dropdown
                  label="Client"
                  value={formData.client}
                  options={clientOptions}
                  onChange={(val) => handleFieldChange('client', val)}
                />

                <Dropdown
                  label="Instrument"
                  value={formData.instrument}
                  options={instrumentOptions}
                  onChange={(val) => handleFieldChange('instrument', val)}
                  required
                  error={errors.instrument}
                />

                <Dropdown
                  label="Path"
                  value={formData.path}
                  options={pathOptions}
                  onChange={(val) => handleFieldChange('path', val)}
                  disabled={!formData.instrument}
                  required
                  error={errors.path}
                />

                <div className="flex gap-2 items-end">
                  <Dropdown
                    label="LIMS Order"
                    value={formData.limsOrder}
                    options={limsOrderOptions}
                    onChange={(val) => handleFieldChange('limsOrder', val)}
                    disabled={!formData.instrument}
                    className="flex-1"
                  />
                  <button
                    onClick={handleBarcodeScan}
                    className="p-2.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                    title="Scan Barcode"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                </div>

                <TextInput
                  label="File Name"
                  value={formData.fileName}
                  onChange={(val) => handleFieldChange('fileName', val)}
                  disabled={formData.instrument.split(':')[1] === '0'}
                  required={formData.instrument.split(':')[1] !== '0'}
                  error={errors.fileName}
                  placeholder="Enter file name"
                />

                {showMergeFields && (
                  <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                      label="Merge File Count"
                      value={formData.mergeFileCount}
                      onChange={(val) => handleFieldChange('mergeFileCount', val)}
                      min={0}
                      max={10000}
                      disabled={formData.instrument.split(':')[1] === '0'}
                    />
                    <NumberInput
                      label="Current Upload File Count"
                      value={formData.currentFileCount}
                      onChange={(val) => handleFieldChange('currentFileCount', val)}
                      disabled={true}
                    />
                  </div>
                )}

                {showUnlockOption && (
                  <div className="pt-2">
                    <Checkbox
                      label="Unlock After Capture"
                      checked={formData.unlockAfterCapture}
                      onChange={(val) => handleFieldChange('unlockAfterCapture', val)}
                    />
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <Dropdown
                  label="Template"
                  value={formData.template}
                  options={templateOptions}
                  onChange={(val) => handleFieldChange('template', val)}
                  disabled={!formData.path}
                  required
                  error={errors.template}
                />

                <div className="mt-4">
                  <label className="text-xs font-semibold text-slate-700 mb-2 block">Tag Values</label>
                  <TagGrid tags={tags} onTagValueClick={handleTagValueClick} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Instrument:</span>
              <span className="text-xs text-slate-800">{formData.instrument || 'Not Selected'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Path:</span>
              <span className="text-xs text-slate-800">{formData.path || 'Not Selected'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Template:</span>
              <span className="text-xs text-slate-800">{formData.template || 'Not Selected'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Status:</span>
              <span className={`text-xs font-semibold ${isLocked ? 'text-green-600' : 'text-slate-500'}`}>
                {isLocked ? 'Locked' : 'Unlocked'}
              </span>
            </div>
          </div>
        )}

        {/* <button
          className="absolute right-4 -bottom-3 z-10 bg-[#f0f4f8] hover:bg-slate-200 p-0.5 rounded shadow-sm transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-blue-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-blue-600" />
          )}
        </button> */}
      </div>

      {/* Action Buttons */}
      <div className="bg-white px-4 py-4 border-t border-slate-200 flex justify-end gap-3">
        {!isLocked ? (
          <ActionButton
            icon={Lock}
            label="Lock"
            onClick={handleLock}
            variant="success"
          />
        ) : (
          <ActionButton
            icon={Edit}
            label="Update"
            onClick={handleUpdate}
            variant="primary"
          />
        )}
        
        <ActionButton
          icon={Unlock}
          label="Unlock"
          onClick={handleUnlock}
          variant="secondary"
          disabled={!isLocked}
        />
      </div>

      {/* Tag Value Modal */}
      {showTagModal && selectedTagIndex !== null && (
        <TagValueModal
          tag={tags[selectedTagIndex]}
          onClose={() => setShowTagModal(false)}
          onSubmit={handleTagValueSubmit}
        />
      )}
    </div>
  );
};

export default InstrumentLockTag;
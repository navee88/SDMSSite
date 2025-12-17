import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Lock, Unlock, ChevronDown, X, Edit, CheckSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Underline Dropdown Component
const AnimatedDropdown = ({ label, value, options, onChange, disabled, required, error, className = '' }) => {
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
    <div className={`mb-4 ${className}`} ref={dropdownRef}>
      <label className="block text-sm text-[#405f7d] mb-0 font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full h-8 px-0 text-sm text-left bg-transparent border-0 border-b-2 flex items-center justify-between outline-none
            ${error ? 'border-red-400' : 'border-gray-300'}
            ${disabled ? 'cursor-not-allowed text-gray-400' : 'hover:border-gray-400 text-gray-900'}
          `}
        >
          <span className={selectedOption ? 'font-medium' : 'text-gray-400'}>
            {selectedOption?.label || ''}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 text-sm cursor-pointer ${value === option.value ? 'bg-[#fff] text-blue-700' : 'hover:bg-gray-50'}`}
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
    <label className="block text-[#405f7d] mb-1 font-semibold text-sm">
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
const MergeFileCountRow = ({ mergeCount, currentCount, onMergeChange, disabled, showMergeFields, t }) => {
  if (!showMergeFields) return null;
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <label className="text-sm text-[#405f7d] min-w-[140px] font-semibold">
            {t('instrumentlocktag.mergefilecount')}
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
          <label className="text-sm text-[#405f7d] min-w-[160px] font-semibold">
            {t('instrumentlocktag.currentuploadfilecount')}
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
    <label className="text-sm text-[#405f7d] min-w-[140px] font-semibold">
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

// Tag Grid Component
const TagGrid = ({ tags, onTagValueClick, isLocked, t }) => {
  const [tooltipOpen, setTooltipOpen] = useState(null);
  const tooltipRef = useRef(null);

  const handleTooltipClick = (index, event) => {
    if (tooltipOpen === index) {
      setTooltipOpen(null);
    } else {
      setTooltipOpen(index);
      if (tooltipRef.current) {
        tooltipRef.current.style.top = `${event.clientY - 250}px`;
        tooltipRef.current.style.left = `${event.clientX - 275}px`;
      }
    }
  };

  return (
    <div className="border border-gray-300 rounded relative">
      <div className="grid grid-cols-2 bg-gray-100 border-b border-gray-300">
        <div className="px-4 py-2 text-sm text-gray-700 border-r border-gray-300 font-semibold">
          TagName
        </div>
        <div className="px-4 py-2 text-sm text-gray-700 font-semibold">
          TagValue
        </div>
      </div>
      
      <div className="bg-white min-h-[250px]">
        {tags.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-gray-400">No tags available</div>
        ) : (
          tags.map((tag, idx) => (
            <div 
              key={idx} 
              className={`grid grid-cols-2 border-b border-gray-200 last:border-b-0 ${!tag.value ? 'bg-[#fff]' : 'hover:bg-gray-50'}`}
            >
              <div className="px-4 py-2.5 text-sm text-gray-900 border-r border-gray-300 flex items-center">
                {tag.tagName}
                {tag.required && <span className="text-red-500 ml-1">*</span>}
              </div>
              <div className="px-4 py-2.5 text-sm text-gray-900 flex items-center justify-between group">
                <span className="flex-1">{tag.value || ''}</span>
                {tag.editable && !isLocked && (
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

      {tooltipOpen !== null && (
        <div 
          ref={tooltipRef}
          className="fixed z-[100] bg-white border border-gray-300 rounded shadow-lg w-[350px]"
          style={{ top: '100px', left: '100px' }}
        >
          <TagTooltip 
            tag={tags[tooltipOpen]}
            onClose={() => setTooltipOpen(null)}
            onSubmit={(value) => {
              onTagValueClick(tooltipOpen, value);
              setTooltipOpen(null);
            }}
            t={t}
          />
        </div>
      )}
    </div>
  );
};

// Tag Tooltip Component
const TagTooltip = ({ tag, onClose, onSubmit, t }) => {
  const [selectedValue, setSelectedValue] = useState(tag.value || '');
  const [searchTerm, setSearchTerm] = useState('');

  const options = tag.options || [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold">{t('instrumentlocktag.pleaseselect')} {tag.tagName} {t('instrumentlocktag.value')}</h4>
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
        {filteredOptions.length === 0 ? (
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
          {t('button.submit')}
        </button>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
        >
          {t('button.cancel')}
        </button>
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
      setError(t('login.enterusername') + ' and ' + t('login.password'));
      return;
    }
    onSubmit({ username, password, reason: reason || 'Instrument Lock/Unlock Operation' });
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
              <label className="block text-sm text-gray-600 mb-1 font-semibold">{t('login.username')}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-8 px-2 text-sm border border-gray-300 rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1 font-semibold">{t('login.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-8 px-2 text-sm border border-gray-300 rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1 font-semibold">Reason (Optional)</label>
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
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <CheckSquare className="w-3.5 h-3.5" />
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

// Main Component - Following ServerData Structure
const InstrumentLockTag = () => {
  // Translation hook (similar to login page)
  const { t } = useTranslation();

  // State management (similar to ServerData)
  const [formData, setFormData] = useState({
    client: '',
    instrument: '',
    path: '',
    limsOrder: '',
    fileName: '',
    template: '',
    mergeFileCount: '1',
    currentFileCount: '0',
    unlockAfterCapture: false
  });

  const [errors, setErrors] = useState({});
  const [isLocked, setIsLocked] = useState(false);
  const [showMergeFields] = useState(true);
  const [showUnlockOption] = useState(true);
  const [auditTrailModalOpen, setAuditTrailModalOpen] = useState(false);
const [auditAction, setAuditAction] = useState(null); // 'lock' | 'unlock'

  // Options data (similar to ServerData's configuration)
  const [clientOptions] = useState([
    { value: 'client1', label: 'Client A' },
    { value: 'client2', label: 'Client B' },
    { value: 'client3', label: 'Client C' }
  ]);

  const [instrumentOptions] = useState([
    { value: 'inst1', label: 'HPLC-001 (Waters Alliance)' },
    { value: 'inst2', label: 'GC-002 (Agilent 7890)' },
    { value: 'inst3', label: 'MS-003 (Thermo Q-Exactive)' }
  ]);

  const [pathOptions] = useState([
    { value: 'path1', label: 'C:/Data/Instrument01/Raw' },
    { value: 'path2', label: 'C:/Data/Instrument02/Raw' },
    { value: 'path3', label: 'C:/Data/Instrument03/Raw' }
  ]);

  const [limsOrderOptions] = useState([
    { value: 'order1', label: 'LO-2024-001' },
    { value: 'order2', label: 'LO-2024-002' },
    { value: 'order3', label: 'LO-2024-003' }
  ]);

  const [templateOptions] = useState([
    { value: 'template1', label: 'Standard Analysis Template' },
    { value: 'template2', label: 'QC Template' },
    { value: 'template3', label: 'Custom Template' }
  ]);

  const [tags, setTags] = useState([
    { tagName: 'Sample', value: '', required: true, editable: true, options: [] },
    { tagName: 'Test', value: '', required: true, editable: true, options: [] }
  ]);

  // Event handlers (similar to ServerData's handlers)
  const handleClientChange = useCallback((value) => {
    setFormData(prev => ({ ...prev, client: value }));
  }, []);

  const handleInstrumentChange = useCallback((value) => {
    setFormData(prev => ({ ...prev, instrument: value }));
    setErrors(prev => ({ ...prev, instrument: false }));
  }, []);

  const handlePathChange = useCallback((value) => {
    setFormData(prev => ({ ...prev, path: value }));
    setErrors(prev => ({ ...prev, path: false }));
  }, []);

  const handleTemplateChange = useCallback((value) => {
    setFormData(prev => ({ ...prev, template: value }));
    setErrors(prev => ({ ...prev, template: false }));
  }, []);

  const handleMergeCountChange = useCallback((value) => {
    const numValue = parseInt(value);
    if (numValue > 10000) {
      alert('Merge count cannot exceed 10000');
      setFormData(prev => ({ ...prev, mergeFileCount: '10000' }));
    } else {
      setFormData(prev => ({ ...prev, mergeFileCount: value }));
    }
  }, []);

  const handleTagValueClick = useCallback((index, value) => {
    setTags(prev => prev.map((t, idx) => 
      idx === index ? { ...t, value } : t
    ));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.instrument) newErrors.instrument = true;
    if (!formData.path) newErrors.path = true;
    if (!formData.template) newErrors.template = true;
    if (!formData.fileName) newErrors.fileName = true;
    
    const missingTags = tags.filter(tag => tag.required && !tag.value);
    if (missingTags.length > 0) {
      alert(`${t('instrumentlocktag.pleaseselect')} ${missingTags[0].tagName} ${t('instrumentlocktag.value')}`);
      return false;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, tags, t]);

const handleLock = useCallback(() => {
  if (!validateForm()) return;
  setAuditAction('lock');
  setAuditTrailModalOpen(true);
}, [validateForm]);

const handleUnlock = useCallback(() => {
  if (!window.confirm(`${t('instrumentlocktag.unlock')}?`)) return;
  setAuditAction('unlock');
  setAuditTrailModalOpen(true);
}, [t]);


  const handleUpdate = useCallback(() => {
    if (!validateForm()) return;
    alert(t('instrumentlocktag.instrumentupdatedsuccessfully'));
  }, [validateForm, t]);

const handleAuditTrailSubmit = useCallback((auditValues) => {
  console.log('Audit trail submitted:', auditValues);

  setAuditTrailModalOpen(false);

  if (auditAction === 'lock') {
    setIsLocked(true);
    alert(t('instrumentlocktag.instrumentlockedsuccessfully'));
  }

  if (auditAction === 'unlock') {
    setIsLocked(false);
    alert(t('instrumentlocktag.instrumentunlockedsuccessfully'));
  }

  setAuditAction(null);
}, [auditAction, t]);

const PrimaryButton = ({ icon: Icon, label, onClick, disabled }) => (
  <button
    onClick={!disabled ? onClick : undefined}
    disabled={disabled}
    className={`flex items-center gap-1 px-2.5 py-2 transition-all text-[11px] font-bold rounded shadow-sm whitespace-nowrap
      ${disabled 
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-white text-blue-600 hover:bg-blue-50 hover:scale-90'}
    `}
  >
    <Icon className="w-4 h-4 stroke-[3]" />
    <span>{label}</span>
  </button>
);

  // Render (following ServerData structure)
  return (
    <div className="flex flex-col w-full font-roboto rounded-md">
      {/* Main Content Area */}
      <div className="bg-white px-6 py-6">
        <div className="max-w-[1300px]">
          <div className="grid grid-cols-2 gap-0">
            {/* Left Panel */}
            <div className="max-w-[400px]">
              <AnimatedDropdown
                label={t('label.client')}
                value={formData.client}
                options={clientOptions}
                onChange={handleClientChange}
                disabled={isLocked}
              />

              <AnimatedDropdown 
                label={t('label.instrument')}
                value={formData.instrument}
                options={instrumentOptions}
                onChange={handleInstrumentChange}
                disabled={isLocked}
                required
                error={errors.instrument}
              />

              <AnimatedDropdown
                label={t('instrumentlocktag.path')}
                value={formData.path}
                options={pathOptions}
                onChange={handlePathChange}
                disabled={isLocked}
                required
                error={errors.path}
              />

              <UnderlineTextInput
                label={t('instrumentlocktag.limsorder')}
                value={formData.limsOrder}
                options={limsOrderOptions}
                onChange={(value) => setFormData(prev => ({ ...prev, limsOrder: value }))}
                disabled={isLocked}
              />

              <UnderlineTextInput
                label={t('instrumentlocktag.filename')}
                value={formData.fileName}
                onChange={(value) => setFormData(prev => ({ ...prev, fileName: value }))}
                disabled={isLocked}
                required
                error={errors.fileName}
              />

              <MergeFileCountRow
                mergeCount={formData.mergeFileCount}
                currentCount={formData.currentFileCount}
                onMergeChange={handleMergeCountChange}
                disabled={isLocked}
                showMergeFields={showMergeFields}
                t={t}
              />

              {showUnlockOption && (
                <InlineCheckbox
                  label={t('instrumentlocktag.unlockaftercapture')}
                  checked={formData.unlockAfterCapture}
                  onChange={(value) => setFormData(prev => ({ ...prev, unlockAfterCapture: value }))}
                  disabled={isLocked}
                />
              )}
            </div>

            {/* Right Panel */}
            <div>
              <AnimatedDropdown
              
                label={t('instrumentlocktag.template')}
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
                  isLocked={isLocked}
                  t={t}
                />
              </div>
            </div>
          </div>

          {/* Bottom Buttons */}
<div className="flex justify-end gap-2 mt-8 pt-6 border-t border-gray-200">
  {!isLocked ? (
    <PrimaryButton
      icon={Lock}
      label={t('instrumentlocktag.lock')}
      onClick={handleLock}
    />
  ) : (
    <PrimaryButton
      icon={Edit}
      label={t('button.update')}
      onClick={handleUpdate}
    />
  )}

  {isLocked && (
    <PrimaryButton
      icon={Unlock}
      label={t('instrumentlocktag.unlock')}
      onClick={handleUnlock}
    />
  )}
</div>

        </div>
      </div>

      {/* Audit Trail Modal */}
      <AuditTrailModal
        isOpen={auditTrailModalOpen}
        onClose={() => setAuditTrailModalOpen(false)}
        onSubmit={handleAuditTrailSubmit}
        t={t}
      />
    </div>
  );
};

export default InstrumentLockTag;
import React, { useState, useRef, useEffect } from 'react';
import {
  Filter, RotateCcw, RefreshCw, Settings, ChevronUp, ChevronDown, X, CheckSquare,
  FolderDown, Upload, FolderUp, FileClock, History, Tag, FileText, FolderOpen, Download,
  CheckCircle, List, MoreVertical, MousePointer2, Calendar
} from 'lucide-react';

import AnimatedDropdown from '../../../../Layout/Common/AnimatedDropdown';
import UsersPage from '../../../../Layout/Common/Home/Userpage';
import FtpLayout from '../../../../Layout/Common/Home/Grid/FtpLayout';

const ACTION_ICONS = {
  "Open": FolderOpen,
  "File Download": Download,
  "Restore": RotateCcw,
  "Folder Download": FolderDown,
  "File Upload": Upload,
  "Folder Upload": FolderUp,
  "Version History": FileClock,
  "Workflow History": History,
  "Tag": Tag,
  "Audit Trail History": List,
  "Attribute": FileText,
  "Multi-File Select": MousePointer2,
  "Work Complete": CheckCircle
};

const ALL_ACTION_ORDER = [
  "Open",
  "File Download",
  "Restore",
  "Folder Download",
  "File Upload",
  "Folder Upload",
  "Version History",
  "Work Complete",
  "Workflow History",
  "Tag",
  "Audit Trail History",
  "Attribute",
  "Multi-File Select"
];

const CUSTOM_FILTERS = ["Instrument", "Workflow Status", "Task Status"];
const CUSTOM_COLUMNS = ["Parser Status"];

const CheckboxItem = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between py-2 hover:bg-slate-50 px-2 rounded cursor-pointer group transition-colors mr-2">
    <span className="text-slate-700 font-medium text-sm select-none group-hover:text-blue-700">{label}</span>
    <input
      type="checkbox"
      checked={!!checked}
      onChange={() => onChange(label)}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
    />
  </label>
);

const PrimaryButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1 px-2.5 py-2 hover:scale-90 transition-all bg-white text-blue-600 text-[11px] font-bold rounded shadow-sm border border-transparent hover:bg-blue-50  whitespace-nowrap"
  >
    <Icon className="w-4 h-4 stroke-[3]" />
    <span>{label}</span>
  </button>
);

const ActionButton = ({ icon: Icon, label, disabled, onClick, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-1.5 px-2 py-2 text-[11px] font-bold rounded  whitespace-nowrap hover:scale-90 transition-all
      ${disabled
        ? "bg-slate-100 text-slate-300 cursor-not-allowed"
        : "bg-[#f1f5f9] text-[#1d8cf8] hover:bg-blue-100"
      }
      ${className}
    `}
  >
    {Icon && <Icon className="w-3.5 h-3.5" />}
    <span>{label}</span>
  </button>
);

const SummaryItem = ({ label, value }) => (
  <div className="flex items-center gap-1 text-xs">
    <span className="font-medium text-slate-800">{value}</span>
  </div>
);

const DatePicker = ({ label, value, onChange, max }) => (
  <div className="flex flex-col w-full">
    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
    <input
      type="date"
      value={value}
      max={max}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent border-b border-slate-300 pb-1 text-sm text-slate-800 font-medium focus:outline-none focus:border-blue-500"
    />
  </div>
);



const ConfigModal = ({ onClose, currentVisibility, onSave }) => {
  const [tempVisibility, setTempVisibility] = useState({ ...currentVisibility });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({ x: e.clientX - dragStartPos.current.x, y: e.clientY - dragStartPos.current.y });
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const toggleVisibility = (label) => {
    setTempVisibility(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleSubmit = () => {
    onSave(tempVisibility);
    onClose();
  };

  const scrollbarStyles = {
    scrollbarWidth: 'thin',
    scrollbarColor: '#cbd5e1 #f1f5f9'
  };

  return (
    <>
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}
      </style>

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
        <div
          style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
          className="bg-white w-[650px] max-w-[95%] rounded-md shadow-2xl flex flex-col max-h-[90vh] border border-slate-200"
        >
          <div
            onMouseDown={handleMouseDown}
            className="flex items-center justify-between px-6 py-3 border-b border-slate-100 cursor-move bg-slate-50/50 rounded-t-md select-none"
          >
            <h2 className="text-xl font-semibold text-blue-700">Configuration</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 pt-[20px] overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-blue-800 font-bold mb-3">Custom Filter</h3>
                  <div className="space-y-1">
                    {CUSTOM_FILTERS.map(item => (
                      <CheckboxItem
                        key={item}
                        label={item}
                        checked={tempVisibility[item]}
                        onChange={toggleVisibility}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-blue-800 font-bold mb-3">Custom Column</h3>
                  <div className="space-y-1">
                    {CUSTOM_COLUMNS.map(item => (
                      <CheckboxItem
                        key={item}
                        label={item}
                        checked={tempVisibility[item]}
                        onChange={toggleVisibility}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:border-l md:border-slate-200 md:pl-8 flex flex-col">
                <h3 className="text-blue-800 font-bold mb-3">Custom Actions</h3>
                <div
                  className="space-y-1 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar"
                  style={scrollbarStyles}
                >
                  {ALL_ACTION_ORDER.map(item => (
                    <CheckboxItem
                      key={item}
                      label={item}
                      checked={tempVisibility[item]}
                      onChange={toggleVisibility}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t text-[13px] border-slate-100 bg-slate-50/50 rounded-b-md mt-4">
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-sm">
              <CheckSquare className="w-3.5 h-3.5" /> Submit
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 text-slate-600 font-medium rounded hover:bg-slate-50 transition-colors shadow-sm">
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ServerData = () => {
  const today = getCurrentDate();
  const [hideEmpty, setHideEmpty] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [showConfig, setShowConfig] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);
  const [recordsDuration, setRecordsDuration] = useState("Current Date");
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  const menuRef = useRef(null);
  const actionContainerRef = useRef(null);
  const buttonRefs = useRef([]);

  const [configState, setConfigState] = useState({
    "Restore": true,
    "Folder Download": true,
    "File Upload": true,
    "Folder Upload": true,
    "Version History": true,
    "Work Complete": true,
    "Workflow History": true,
    "Tag": true,
    "Open": true,
    "File Download": true,
    "Audit Trail History": true,
    "Attribute": true,
    "Multi-File Select": true,
    "Instrument": true,
    "Workflow Status": true,
    "Task Status": true,
    "Parser Status": false
  });

  const enabledActions = ALL_ACTION_ORDER.filter(action => configState[action]);

  useEffect(() => {
    const calculateVisibleActions = () => {
      if (!actionContainerRef.current) return;

      const containerWidth = actionContainerRef.current.offsetWidth;
      const reservedSpace = 140;
      const availableWidth = containerWidth - reservedSpace;

      let accumulatedWidth = 0;
      let count = 0;

      for (let i = 0; i < buttonRefs.current.length; i++) {
        const button = buttonRefs.current[i];
        if (!button) continue;

        const buttonWidth = button.offsetWidth + 8;

        if (accumulatedWidth + buttonWidth <= availableWidth) {
          accumulatedWidth += buttonWidth;
          count++;
        } else {
          break;
        }
      }

      setVisibleCount(Math.max(1, count));
    };

    calculateVisibleActions();

    window.addEventListener('resize', calculateVisibleActions);

    const timer = setTimeout(calculateVisibleActions, 100);

    return () => {
      window.removeEventListener('resize', calculateVisibleActions);
      clearTimeout(timer);
    };
  }, [configState, enabledActions.length]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const visibleActions = enabledActions.slice(0, visibleCount);
  const overflowActions = enabledActions.slice(visibleCount);

  const isCustomDate = recordsDuration === "Custom Date";

  const handleDurationChange = (value) => {
    const actualValue = value?.target?.value || value?.value || value;
    setRecordsDuration(actualValue);
  };

  return (
    <div className="flex flex-col w-full font-sans rounded-md">

      <div className="bg-[#f0f4f8] px-4 pt-4 pb-2 relative rounded-t-md z-20">
        {isOpen ? (
          <div className="flex flex-wrap items-end gap-3.5 mb-2">
            <div className="w-60">
              <AnimatedDropdown
                label="Storage Group"
                value="File01"
                options={["File01", "File02", "File03"]}
                onChange={(value) => console.log(value)}
                isSearchable={true}
              />
            </div>
            <div className="w-60">
              <AnimatedDropdown
                label="Client"
                value="All"
                options={["All", "Client A", "Client B"]}
                onChange={(value) => console.log(value)}
                isSearchable={true}
              />
            </div>

            {configState["Instrument"] && (
              <div className="w-60">
                <AnimatedDropdown
                  label="Instrument"
                  value=""
                  options={["Inst 1", "Inst 2","Apple","Samsung"]}
                  onChange={(value) => console.log(value)}
                  // isSearchable={true}
                   allowFreeInput={true}  
                />
              </div>
            )}
            {configState["Task Status"] && (
              <div className="w-60">
                <AnimatedDropdown
                  label="Task Status"
                  value="All"
                  options={["All", "Pending", "Completed", "Retire"]}
                  onChange={(value) => console.log(value)}
                  isSearchable={true}
                />
              </div>
            )}
            {configState["Workflow Status"] && (
              <div className="w-60">
                <AnimatedDropdown
                  label="Workflow Status"
                  value="All"
                  options={["All", "Not Completed", "Completed", "Reviewed", "Not Satisfied", "Verified", "Not Effective", "Approved", "NotApproved"]}
                  onChange={(value) => console.log(value)}
                  isSearchable={true}
                />
              </div>
            )}

            <div className="w-60">
              <AnimatedDropdown
                label="Records Duration"
                value={recordsDuration}
                options={["Current Date", "Last 7 Days", "Last 1 Month", "Last 1 Year", "Custom Date"]}
                onChange={handleDurationChange}
                isSearchable={true}
              />
            </div>

            {isCustomDate && (
              <>
                <div className="w-52 pb-4">
                  <DatePicker
                    label="From"
                    value={fromDate}
                    onChange={setFromDate}
                    max={today}
                  />
                </div>
                <div className="w-52 pb-4">
                  <DatePicker
                    label="To"
                    value={toDate}
                    onChange={setToDate}
                    max={today}
                  />
                </div>
              </>
            )}

            <label className="flex items-center gap-2 cursor-pointer select-none pb-4">
              <span className="text-xs font-bold text-slate-600">Hide Empty Folder</span>
              <div
                onClick={() => setHideEmpty(!hideEmpty)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors
                  ${hideEmpty ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-300'}
                `}
              >
                {hideEmpty && <CheckSquare className="w-3 h-3 text-white" />}
              </div>
            </label>

            <div className="flex items-end gap-2 pb-2">
              <PrimaryButton icon={Filter} label="Filter" />
              <PrimaryButton icon={RotateCcw} label="Reset" />
              <PrimaryButton icon={RefreshCw} label="Refresh" />
              <PrimaryButton icon={Settings} label="Configuration" onClick={() => setShowConfig(true)} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-600">Storage Group:</span>
              <span className="font-medium text-xs text-slate-800">File01</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-600">Client:</span>
              <span className="font-medium text-xs text-slate-800">All</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-600">Instrument:</span>
              <span className="font-medium text-xs text-slate-800">All</span>
            </div>
            <div className="flex items-center gap-2">
              {/* <span className="font-bold text-xs text-slate-600">From:</span> */}
              <span className="font-medium text-xs text-slate-800">{isCustomDate ? `From ${fromDate} to ${toDate}` : recordsDuration}</span>
            </div>
          </div>
        )}

        <button
          className="absolute right-4 -bottom-3 z-10 bg-[#f0f4f8] hover:bg-slate-200 p-0.5 rounded shadow-sm cursor-pointer transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-blue-600" />}
        </button>
      </div>

      <div className="bg-white px-3 py-2">
        <div ref={actionContainerRef} className="flex items-center flex-wrap gap-2 justify-start relative">
          <div className="invisible absolute pointer-events-none flex gap-2">
            {enabledActions.map((actionName, index) => {
              const IconComponent = ACTION_ICONS[actionName];
              const isDisabled = actionName === "Version History" || actionName === "Work Complete";
              return (
                <div
                  key={`measure-${actionName}`}
                  ref={(el) => (buttonRefs.current[index] = el)}
                >
                  <ActionButton
                    icon={IconComponent}
                    label={actionName}
                    disabled={isDisabled}
                  />
                </div>
              );
            })}
          </div>

          {visibleActions.map((actionName) => {
            const IconComponent = ACTION_ICONS[actionName];
            const isDisabled = actionName === "Version History" || actionName === "Work Complete";

            return (
              <ActionButton
                key={actionName}
                icon={IconComponent}
                label={actionName}
                disabled={isDisabled}
              />
            );
          })}

          <div className="h-4 w-px bg-slate-200 mx-1"></div>
          <ActionButton icon={RefreshCw} label="Refresh" />

          {overflowActions.length > 0 && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`p-1.5 rounded transition-colors 
                    ${showMenu ? 'bg-blue-100 text-blue-600' : 'bg-[#f1f5f9] text-[#1d8cf8] hover:bg-blue-100'}
                  `}
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-xl py-1 z-50">
                  {overflowActions.map((actionName) => {
                    const IconComponent = ACTION_ICONS[actionName];
                    const isDisabled = actionName === "Version History" || actionName === "Work Complete";
                    return (
                      <button
                        key={actionName}
                        disabled={isDisabled}
                        className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 
                              ${isDisabled
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-700 hover:bg-slate-50'
                          }
                            `}
                      >
                        {IconComponent && <IconComponent className={`w-3.5 h-3.5 ${isDisabled ? 'text-slate-300' : 'text-blue-500'}`} />}
                        {actionName}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
        
        <div><FtpLayout /> </div>

        {/* <UsersPage /> */}
       

      {showConfig && (
        <ConfigModal
          currentVisibility={configState}
          onSave={setConfigState}
          onClose={() => setShowConfig(false)}
        />
      )}
    </div>
  );
};

export default ServerData;

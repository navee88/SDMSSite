import React, { useState, useEffect, useMemo, useRef } from 'react';
import GridLayout from './GridLayout'; // Adjust path if needed
import { FaEye, FaLink, FaFileExport } from "react-icons/fa";

// ----------------------------------------------------------------------
// 1. UPDATED RIGHT PANEL
// ----------------------------------------------------------------------
const FileDetailPanel = ({ selectedFile }) => {
  const [activeTab, setActiveTab] = useState('info');

  // --- VERTICAL RESIZE STATE ---
  const [tagsHeightPercent, setTagsHeightPercent] = useState(50); // 50% default
  const [isResizingTags, setIsResizingTags] = useState(false);
  const tagsContainerRef = useRef(null);

  // --- COLUMNS ---
  const tagsColumns = useMemo(() => [
    { key: 'category', label: 'Category', width: 100 },
    { key: 'value', label: 'Value', width: 150 },
    { key: 'createdBy', label: 'Created By', width: 120 },
    { key: 'createdOn', label: 'Created On', width: 120 },
  ], []);

  const parsedDataColumns = useMemo(() => [
    { key: 'fieldName', label: 'Field Name', width: 150 },
    { key: 'fieldValue', label: 'Field Value', width: 250 },
  ], []);

  const tagsData = []; 
  const parsedData = [];

  const tabs = [
    { id: 'info', label: 'File Information' },
    { id: 'viewer', label: 'File Viewer' },
    { id: 'tags', label: 'Tags & Parsed Data' },
  ];

  const getValue = (key) => selectedFile ? selectedFile[key] : '-';

  // --- VERTICAL RESIZE EFFECT ---
  useEffect(() => {
    if (!isResizingTags) return;

    const handleMouseMove = (e) => {
      if (!tagsContainerRef.current) return;
      
      const containerRect = tagsContainerRef.current.getBoundingClientRect();
      const relativeY = e.clientY - containerRect.top;
      const totalHeight = containerRect.height;
      
      // Calculate percentage
      let newPercent = (relativeY / totalHeight) * 100;
      
      // Clamp between 20% and 80% to prevent total collapse
      newPercent = Math.max(20, Math.min(80, newPercent));
      
      setTagsHeightPercent(newPercent);
    };

    const handleMouseUp = () => {
      setIsResizingTags(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizingTags]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-200 mb-0 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-semibold transition-colors relative whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-blue-600 bg-blue-50/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-hidden relative"> 
        
    
        {activeTab === 'info' && (
         
            <div className="flex flex-col border border-gray-100 rounded-lg shadow-sm bg-white divide-y divide-gray-100">
               <InfoRow label="Filename" value={getValue('username')} highlight />
               <InfoRow label="Size" value={selectedFile ? "2.4 MB" : '-'} />
               <InfoRow label="Contains" value={selectedFile ? "User Data" : '-'} />
               <InfoRow label="Login Username" value={getValue('username')} />
               <InfoRow label="Client Name" value={getValue('fullName')} />
               <InfoRow 
                 label="Status" 
                 value={getValue('userStatus')}
                 customValue={selectedFile ? (
                   <span className={`px-2 py-0.5 rounded text-xs font-medium w-max ${
                     selectedFile.userStatus === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                   }`}>
                     {selectedFile.userStatus}
                   </span>
                 ) : null}
               />
               <InfoRow label="Parser Status" value={selectedFile ? "Completed" : '-'} />
               <InfoRow label="Created On" value={selectedFile ? "2023-01-15" : '-'} />
               <InfoRow label="Task Type" value={getValue('TasksName')} />
               <InfoRow 
                 label="Share Link" 
                 customValue={selectedFile ? (
                   <div className="flex items-center gap-2 text-blue-600 cursor-pointer hover:underline text-sm">
                     <FaLink /> <span>Generate Link</span>
                   </div>
                 ) : <span className="text-gray-400 text-sm">-</span>}
               />
            </div>
        )}

        {/* TAB 2: VIEWER */}
        {activeTab === 'viewer' && (
           <div className="h-full overflow-y-auto p-4">
             <div className="flex items-center justify-center h-full min-h-[200px] text-gray-400 bg-gray-50 rounded border border-dashed border-gray-300">
               <div className="text-center">
                 <FaEye className="mx-auto mb-2 text-2xl" />
                 <span>{selectedFile ? "Preview not available" : "No file selected"}</span>
               </div>
             </div>
           </div>
        )}

        {/* TAB 3: TAGS & PARSED DATA (RESIZABLE) */}
        {activeTab === 'tags' && (
          <div ref={tagsContainerRef} className="flex flex-col h-full overflow-hidden px-1 pb-2">
            
            {/* Top Grid: Tags */}
            <div 
              style={{ height: `${tagsHeightPercent}%` }}
              className="flex flex-col min-h-[100px] border-b border-gray-200"
            >
              <div className="text-blue-800 font-bold py-2 px-2 text-sm shrink-0">Tags</div>
              <div className="flex-1  border-gray-200 rounded overflow-hidden relative">
                <div className="absolute inset-0">
                  <GridLayout 
                    columns={tagsColumns} 
                    data={tagsData} 
                    hidePagination={true} 
                  />
                </div>
              </div>
            </div>

            {/* Vertical Resizer */}
            <div 
              onMouseDown={() => setIsResizingTags(true)}
              className="h-4 flex items-center justify-center cursor-row-resize hover:bg-gray-50 shrink-0 z-10 transition-colors"
            >
               <div className={`w-12 h-1 rounded-full transition-colors ${isResizingTags ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            </div>

            {/* Bottom Grid: Parsed Data */}
            <div 
              style={{ height: `${100 - tagsHeightPercent}%` }}
              className="flex flex-col min-h-[100px]"
            >
              <div className="flex items-center justify-between py-1 px-2 shrink-0">
                <div className="text-blue-800 font-bold text-sm">Parsed Data</div>
                <div className="flex gap-2">
                   <button className="text-xs text-blue-600 font-medium hover:underline">Multi-Fields &raquo;</button>
                   <button className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs border border-blue-100 hover:bg-blue-100">
                     <FaFileExport /> Export
                   </button>
                </div>
              </div>
              <div className="flex-1 border border-gray-200 rounded overflow-hidden relative">
                 <div className="absolute inset-0">
                  <GridLayout 
                    columns={parsedDataColumns} 
                    data={parsedData} 
                    hidePagination={true}
                  />
                 </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

// UPDATED INFO ROW: Displays as Row (Label : Value) instead of Stacked
const InfoRow = ({ label, value, customValue, highlight, truncate }) => (
  <div className="flex flex-row items-baseline p-3 hover:bg-gray-50 transition-colors">
    <span className="text-sm font-semibold text-teal-900 w-36 shrink-0">{label}</span>
    <div className="flex-1 min-w-0">
      {customValue ? customValue : (
        <span className={`text-sm block ${highlight ? 'font-medium text-gray-900' : 'text-gray-600'} ${truncate ? 'truncate' : ''}`}>
          {value || '-'}
        </span>
      )}
    </div>
  </div>
);


// ----------------------------------------------------------------------
// 2. MAIN LAYOUT
// ----------------------------------------------------------------------
function FtpLayout() {
  const [leftWidth, setLeftWidth] = useState(250);
  const [isMiddleCollapsed, setIsMiddleCollapsed] = useState(false); 
  const [rightWidth, setRightWidth] = useState(400); 
  
  const [userData, setUserData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  
  const [dragging, setDragging] = useState(null);
  const containerRef = useRef(null);
  
  const isLeftCollapsed = leftWidth === 0;

  const toggleLeft = () => setLeftWidth(isLeftCollapsed ? 250 : 0);
  const toggleMiddlePanel = () => setIsMiddleCollapsed(!isMiddleCollapsed);

  useEffect(() => {
    if (!dragging) return;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const mouseRelativeX = e.clientX - containerRect.left;
      const containerWidth = containerRect.width;
      const SNAP_THRESHOLD = 50;

      if (dragging === 'left') {
        let newLeft = mouseRelativeX;
        if (newLeft < SNAP_THRESHOLD) newLeft = 0;
        newLeft = Math.min(newLeft, containerWidth - rightWidth - 50); 
        setLeftWidth(newLeft);
      }

      if (dragging === 'right') {
        let newRight = containerWidth - mouseRelativeX;
        
        if (isMiddleCollapsed && newRight < containerWidth - 100) {
           setIsMiddleCollapsed(false);
        }

        if (newRight < SNAP_THRESHOLD) newRight = 0;
        newRight = Math.min(newRight, containerWidth - leftWidth - 50);
        setRightWidth(newRight);
      }
    };

    const handleMouseUp = () => {
      setDragging(null);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [dragging, leftWidth, rightWidth, isMiddleCollapsed]);

  const startDragLeft = () => setDragging('left');
  const startDragRight = () => setDragging('right');

  // Mock Data
  useEffect(() => {
    setTimeout(() => {
      setUserData([
        { id: '1', username: 'report_2023.pdf', fullName: 'John Doe', profileName: 'Admin', userGroupName: 'Admins', userStatus: 'Active', TasksName: 'Upload' },
        { id: '2', username: 'assets_main.zip', fullName: 'Alex Smith', profileName: 'Editor', userGroupName: 'Editors', userStatus: 'Active', TasksName: 'Download' },
      ]);
    }, 500);
  }, []);

  const userColumns = useMemo(() => [
    { key: 'username', label: 'Filename', width: 200, render: (r) => <span className="font-medium">{r.username}</span> },
    { key: 'profileName', label: 'Owner', width: 120 },
    { key: 'userStatus', label: 'Status', width: 100 },
  ], []);

  return (
    <div ref={containerRef} className="flex h-[600px] w-full ms-1 bg-gray-50 border border-gray-300 overflow-hidden select-none">
      
      {/* 1. LEFT PANEL */}
      <div 
        style={{ width: leftWidth }} 
        className={`bg-white border-r border-gray-200 flex flex-col shrink-0 transition-[width] duration-0 ${leftWidth === 0 ? 'overflow-hidden' : ''}`}
      >
         {leftWidth > 30 && (
            <div className="p-4 text-sm text-gray-600">
               <div className="font-bold mb-2">Explorer</div>
               <div className="pl-2 border-l-2 border-blue-500 bg-blue-50 py-1 text-blue-700">File02</div>
            </div>
         )}
      </div>

      {/* 2. LEFT RESIZER */}
      <div className="w-[4px] hover:w-[6px] bg-gray-200 hover:bg-blue-400 cursor-col-resize flex items-center justify-center z-10 relative" onMouseDown={startDragLeft}>
         <button 
           onClick={(e) => { e.stopPropagation(); toggleLeft(); }}
           className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-8 bg-gray-300 hover:bg-blue-500 text-white text-[10px] rounded-r flex items-center justify-center shadow-sm z-20"
         >
            {isLeftCollapsed ? '>' : '<'}
         </button>
      </div>

      {/* 3. MIDDLE PANEL (The Grid) */}
      <div className={`flex-col bg-white min-w-0 transition-all duration-300 ${isMiddleCollapsed ? 'hidden w-0' : 'flex flex-1'}`}>
         <GridLayout 
           columns={userColumns} 
           data={userData} 
           onRowClick={setSelectedRow}
         />
      </div>

      {/* 4. RIGHT RESIZER */}
      <div className="w-[4px] hover:w-[6px] bg-gray-200 cursor-col-resize flex items-center justify-center z-10 relative" onMouseDown={startDragRight}>
         <button 
           onClick={(e) => { e.stopPropagation(); toggleMiddlePanel(); }}
           className="absolute top-3 left-1/2 -translate-x-1/2 w-1.5 h-[25px] bg-blue-800 hover:bg-blue-500 text-white text-[10px]  flex items-center justify-center shadow-sm z-20"
         />
      </div>

      {/* 5. RIGHT PANEL */}
      <div 
        style={{ width: isMiddleCollapsed ? 'auto' : rightWidth }} 
        className={`bg-white border-l border-gray-200 flex flex-col shrink-0 ${isMiddleCollapsed ? 'flex-1' : ''} ${rightWidth === 0 && !isMiddleCollapsed ? 'hidden' : ''}`}
      >
        <FileDetailPanel selectedFile={selectedRow} />
      </div>

    </div>
  );
}

export default FtpLayout;

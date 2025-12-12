import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useOnClickOutside, useDebounceValue, useLocalStorage } from 'usehooks-ts';
import { AiOutlineSortAscending } from "react-icons/ai";
import { TbSortDescendingLetters } from "react-icons/tb";
import { CgPlayListRemove } from "react-icons/cg";

const SearchIcon = () => (
  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const ArrowDownIcon = () => (
  <svg className="w-3 h-3 text-gray-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const TableHeaderCell = ({
  colKey,
  label,
  width,
  isActive,
  onToggle,
  onSort,
  sortConfig,
  isLast,
  onResizeStart
}) => {
  const containerRef = useRef();

  useOnClickOutside(containerRef, () => {
    if (isActive) onToggle(null);
  });

  return (
    <th
      className="sticky top-0 z-10 px-4 py-3 text-[14px] font-bold text-gray-600 capitalize tracking-wider bg-white border-b border-gray-200 group hover:bg-gray-50 cursor-pointer select-none"
      style={{
        width: width,
        minWidth: width,
        transform: 'translateZ(0)',
        willChange: 'transform'
      }}
    >
      <div
        ref={containerRef}
        className="flex items-center justify-between h-full"
        onClick={() => onToggle(isActive ? null : colKey)}
      >
        <span className="truncate">{label}</span>
        <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${sortConfig.key === colKey ? 'opacity-100' : ''}`}>
          <ArrowDownIcon />
        </div>

        {isActive && (
          <div
            className={`absolute top-full mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 py-1 text-left font-normal normal-case ${
              isLast ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => onSort(colKey, 'asc')} className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sort Ascending <span className='text-[20px] text-green-900'><AiOutlineSortAscending /></span></button>
            <button onClick={() => onSort(colKey, 'desc')} className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sort Descending <span className='text-[20px] text-green-900'><TbSortDescendingLetters /></span></button>
            <div className="border-t border-gray-500 my-1 border-1"></div>
            <button onClick={() => onSort(null, 'asc')} className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Remove Sort <span className='text-[20px] text-red-500'><CgPlayListRemove /></span></button>
          </div>
        )}
      </div>

      <div
        onMouseDown={(e) => onResizeStart(e, colKey)}
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-400 z-30"
      />
    </th>
  );
};

const DetailsLayout = ({ columns, data, renderDetailPanel }) => {
  const [selectedItem, setSelectedItem] = useState(data[0]);
  const [filters, setFilters] = useState({});
  const [debouncedFilters] = useDebounceValue(filters, 300);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [activeMenuColumn, setActiveMenuColumn] = useState(null);

  const [colWidths, setColWidths] = useState(() =>
    columns.reduce((acc, col) => ({ ...acc, [col.key]: col.width || 150 }), {})
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useLocalStorage('commonTableRows', 10);

  useEffect(() => {
    if (data.length > 0 && !selectedItem) setSelectedItem(data[0]);
  }, [data]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedFilters, sortConfig]);

  const processedData = useMemo(() => {
    let result = [...data];
    result = result.filter(row =>
      Object.keys(debouncedFilters).every(key => {
        if (!debouncedFilters[key]) return true;
        const cellValue = row[key] ? String(row[key]).toLowerCase() : '';
        return cellValue.includes(debouncedFilters[key].toLowerCase());
      })
    );
    if (sortConfig.key) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [data, debouncedFilters, sortConfig]);

  const totalPages = Math.ceil(processedData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = processedData.slice(indexOfFirstRow, indexOfLastRow);

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
    setActiveMenuColumn(null);
  };

  const startResize = (e, colKey) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = colWidths[colKey];

    const onMouseMove = (moveEvent) => {
      setColWidths(prev => ({
        ...prev,
        [colKey]: Math.max(50, startWidth + (moveEvent.clientX - startX))
      }));
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'col-resize';
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

      <div className="flex w-full p-4 gap-4 overflow-hidden">
       <div
          className={`flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-w-0 ${
            !renderDetailPanel || processedData.length === 0 ? 'w-full' : 'w-1/2'
          }`}
        >
          <div
            className="custom-scrollbar"
            style={{
              maxHeight: '600px',
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: '#cbd5e1 #f1f5f9',
            }}
          >
            <table className="table-fixed border-separate border-spacing-0 w-full">
              <thead className="bg-white sticky top-0 z-10">
                <tr>
                  {columns.map((col, index) => (
                    <TableHeaderCell
                      key={col.key}
                      colKey={col.key}
                      label={col.label}
                      width={colWidths[col.key]}
                      isActive={activeMenuColumn === col.key}
                      onToggle={setActiveMenuColumn}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                      isLast={index === columns.length - 1}
                      onResizeStart={startResize}
                    />
                  ))}
                </tr>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="sticky top-[41px] z-20 px-2 py-2 bg-gray-50 border-b border-gray-200"
                      style={{
                        transform: 'translateZ(0)',
                        willChange: 'transform',
                      }}
                    >
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full pl-2 pr-7 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          value={filters[col.key] || ''}
                          onChange={(e) => setFilters({ ...filters, [col.key]: e.target.value })}
                        />
                        <div className="absolute right-2 top-1.5"><SearchIcon /></div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row, rowIndex) => {
                  const isSelected = selectedItem && row.id === selectedItem.id;
                  return (
                    <tr
                      key={row.id || rowIndex}
                      onClick={() => setSelectedItem(row)}
                      className={`cursor-pointer transition-colors text-sm hover:bg-gray-50 ${
                        isSelected ? 'bg-blue-50' : 'bg-white'
                      }`}
                    >
                      {columns.map((col) => (
                        <td
                          key={`${row.id}-${col.key}`}
                          className={`px-4 py-3 truncate border-b border-gray-100 border-l-4 ${
                            isSelected && col.key === columns[0].key
                              ? 'border-l-blue-600'
                              : 'border-l-transparent'
                          }`}
                        >
                          {col.render ? col.render(row, isSelected) : row[col.key]}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs sm:text-sm shrink-0">
            <div className="flex items-center gap-2 text-gray-600">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="border border-gray-300 rounded px-1 py-0.5 bg-white focus:outline-none focus:border-blue-500"
              >
                {[10, 20, 30, 40, 50].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                {processedData.length > 0 ? indexOfFirstRow + 1 : 0}-{Math.min(indexOfLastRow, processedData.length)} of {processedData.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={currentPage === 1}
                  className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          </div>
        </div>

    {renderDetailPanel && processedData.length > 0 && (
          <div className="w-1/2 bg-white rounded-lg shadow-sm border border-gray-200 p-8 overflow-y-auto custom-scrollbar">
            {selectedItem
              ? renderDetailPanel(selectedItem)
              : <div className="text-gray-400 text-center mt-10">Select an item to view details</div>
            }
          </div>
        )}

      </div>
    </>
  );
};

export default DetailsLayout;

import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";

const AnimatedDropdown = ({ 
  label, 
  name, 
  value, 
  options = [], 
  onChange, 
  displayKey = null, 
  valueKey = null,
  direction = "down",
  isSearchable = false 
}) => {

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1); 
  
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null); 
  const optionsRefs = useRef([]); 

  const getValue = (opt) => (valueKey && typeof opt === 'object' ? opt[valueKey] : opt);
  const getLabel = (opt) => (displayKey && typeof opt === 'object' ? opt[displayKey] : opt);

  const getDisplayValue = () => {
    if (!value) return "Select...";
    const selectedOption = options.find(opt => getValue(opt) === value);
    return selectedOption ? getLabel(selectedOption) : value;
  };

  const filteredOptions = useMemo(() => {
    const matches = options.filter(opt => {
      if (!searchTerm) return true;
      const labelText = getLabel(opt).toString().toLowerCase();
      return labelText.includes(searchTerm.toLowerCase());
    });

    const uniqueOptions = [];
    const seenLabels = new Set();

    matches.forEach(opt => {
      const labelText = getLabel(opt);
      if (!seenLabels.has(labelText)) {
        seenLabels.add(labelText);
        uniqueOptions.push(opt);
      }
    });

    return uniqueOptions;
  }, [options, searchTerm, displayKey, valueKey]);


  useEffect(() => {
    setFocusedIndex(-1);
  }, [searchTerm, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && isSearchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, isSearchable]);

  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && optionsRefs.current[focusedIndex]) {
      optionsRefs.current[focusedIndex].scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [focusedIndex, isOpen]);

  const handleSelect = (opt) => {
    const newValue = getValue(opt);
    const eventMock = {
        target: {
            name: name,
            value: newValue
        }
    };
    onChange(eventMock);
    setIsOpen(false);
    setSearchTerm("");
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleSelect(filteredOptions[focusedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "Tab":
         setIsOpen(false);
         break;
      default:
        break;
    }
  };

  const containerClasses = direction === "up" 
    ? "bottom-full mb-1 origin-bottom"
    : "top-full mt-1 origin-top";

  const transformClasses = isOpen
    ? "opacity-100 scale-y-100 translate-y-0"
    : `opacity-0 scale-y-95 pointer-events-none ${direction === "up" ? "translate-y-2" : "-translate-y-2"}`;

  const thinScrollbarStyle = {
    scrollbarWidth: 'thin',
    scrollbarColor: '#CBD5E1 transparent',
  };

  return (
    <div 
      className="relative mb-4 group" 
      ref={dropdownRef}
      onKeyDown={handleKeyDown} 
    >
      <style>{`
        .thin-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .thin-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .thin-scrollbar::-webkit-scrollbar-thumb {
          background-color: #CBD5E1;
          border-radius: 20px;
        }
        .thin-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #94A3B8;
        }
      `}</style>

      <label className="text-sm font-medium text-gray-600 mb-3 block">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between 
            bg-transparent border-b-2 text-sm font-semibold pb-1 text-left
            transition-colors duration-200 ease-in-out outline-none focus:border-blue-500
            ${isOpen ? 'border-blue-500 text-blue-600' : 'border-gray-300 text-gray-700 hover:border-blue-400'}
          `}
        >
          <span className="truncate pr-2">{getDisplayValue()}</span>
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} 
          />
        </button>

        <div 
          className={`
            absolute left-0 w-full bg-white shadow-xl rounded-md border border-slate-100 z-50 
            overflow-hidden transition-all duration-200 ease-out flex flex-col
            ${containerClasses}
            ${transformClasses}
          `}
        >

          {isSearchable && (
            <div className="p-2 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
              <div className="relative">
                <Search className="absolute left-2 top-1.5 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  onKeyDown={(e) => {
                     if(e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter'){
                        e.preventDefault(); 
                        handleKeyDown(e);
                     }
                  }}
                />
              </div>
            </div>
          )}

          <div 
            ref={listRef}
            className="max-h-40 overflow-y-auto py-1 thin-scrollbar"
            style={thinScrollbarStyle} 
          >
            {filteredOptions.map((opt, i) => {
                const optValue = getValue(opt);
                const optLabel = getLabel(opt);
                const isSelected = optValue === value;
                const isFocused = i === focusedIndex;

                return (
                  <div 
                    key={i}
                    ref={el => optionsRefs.current[i] = el} 
                    onClick={() => handleSelect(opt)}
                    onMouseEnter={() => setFocusedIndex(i)} 
                    className={`
                      px-3 py-2 text-sm cursor-pointer flex items-center justify-between
                      transition-colors duration-150
                      ${isSelected ? 'bg-blue-50 text-blue-600 font-semibold' : ''}
                      ${isFocused && !isSelected ? 'bg-slate-100 text-slate-900' : ''}
                      ${!isSelected && !isFocused ? 'text-slate-700' : ''}
                    `}
                  >
                    <span className="truncate">{optLabel}</span>
                  </div>
                );
            })}
            {filteredOptions.length === 0 && (
                <div className="px-3 py-2 text-xs text-gray-400 italic text-center">No results found</div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default React.memo(AnimatedDropdown);

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
  isSearchable = false,
  allowFreeInput = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const optionsRefs = useRef([]);


  const getValue = (opt) =>
    valueKey && typeof opt === "object" ? opt[valueKey] : opt;

  const getLabel = (opt) =>
    displayKey && typeof opt === "object" ? opt[displayKey] : opt;

  const getDisplayValue = () => {
    if (!value) return "";
    const selected = options.find(opt => getValue(opt) === value);
    return selected ? getLabel(selected) : value;
  };


  const filteredOptions = useMemo(() => {
    if ((!isSearchable && !allowFreeInput) || !searchTerm) return options;

    return options.filter(opt =>
      getLabel(opt)
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, isSearchable, allowFreeInput]);


  useEffect(() => {
    if (isOpen && isSearchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, isSearchable]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm("");
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (focusedIndex >= 0 && optionsRefs.current[focusedIndex]) {
      optionsRefs.current[focusedIndex].scrollIntoView({
        block: "nearest",
        behavior: "smooth"
      });
    }
  }, [focusedIndex]);


  const handleSelect = (opt) => {
    onChange({
      target: {
        name,
        value: getValue(opt)
      }
    });

    setIsOpen(false);
    setSearchTerm("");
    setFocusedIndex(-1);
  };

 
  const acceptFreeInput = () => {
    if (!allowFreeInput || !searchTerm.trim()) return;

    onChange({
      target: {
        name,
        value: searchTerm.trim()
      }
    });

    setIsOpen(false);
    setFocusedIndex(-1);
  };

 
  const handleKeyDown = (e) => {
    if (!isOpen && ["Enter", "ArrowDown"].includes(e.key)) {
      setIsOpen(true);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex(prev =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;

      case "Enter":
        e.preventDefault();

        if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleSelect(filteredOptions[focusedIndex]);
          return;
        }
        break;

      case "Escape":
        setIsOpen(false);
        break;

      default:
        break;
    }
  };

  const containerClasses =
    direction === "up" ? "bottom-full mb-1" : "top-full mt-1";

 
  return (
    <div
      className="relative mb-4"
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <label className="text-sm font-medium text-gray-600 mb-1 block">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          readOnly={!allowFreeInput}
          value={isOpen && allowFreeInput ? searchTerm : getDisplayValue()}
          placeholder=""
          onFocus={() => {
            if (allowFreeInput) {
              setIsOpen(true);
              setSearchTerm("");
            }
          }}
          onClick={() => {
            if (!allowFreeInput) {
              setIsOpen(prev => !prev);
            }
          }}
          onChange={(e) => {
            if (!allowFreeInput) return;

            const val = e.target.value;
            setSearchTerm(val);
            setIsOpen(true);

            onChange({
              target: { name, value: val }
            });
          }}
          className={`
            w-full border-b-2 bg-transparent pb-1 text-sm font-semibold
            outline-none cursor-pointer
            ${isOpen ? "border-blue-500 text-blue-600" : "border-gray-300"}
          `}
        />

        <ChevronDown
          onClick={() => setIsOpen(prev => !prev)}
          className={`absolute right-0 top-1 w-4 h-4 cursor-pointer transition-transform
            ${isOpen ? "rotate-180 text-blue-500" : "text-gray-400"}`}
        />
      </div>

    
      {isOpen && (
        <div
          className={`
            absolute z-50 w-full bg-white shadow-xl rounded-md border
            max-h-52 flex flex-col ${containerClasses}
          `}
        >
          {isSearchable && (
            <div className="p-2 border-b bg-slate-50">
              <div className="relative">
                <Search className="absolute left-2 top-1.5 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-2 py-1 text-xs border rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div className="overflow-y-auto">
            {filteredOptions.map((opt, i) => {
              const isSelected = getValue(opt) === value;

              return (
                <div
                  key={i}
                  ref={(el) => (optionsRefs.current[i] = el)}
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={() => setFocusedIndex(i)}
                  className={`
                    px-3 py-2 text-sm cursor-pointer flex items-center
                    border-l-4 transition-all
                    ${isSelected
                      ? "border-blue-500 bg-blue-50 text-blue-600 font-semibold"
                      : "border-transparent"}
                    ${i === focusedIndex && !isSelected
                      ? "bg-slate-100"
                      : ""}
                  `}
                >
                  {getLabel(opt)}
                </div>
              );
            })}

            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-xs text-gray-400 text-center">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(AnimatedDropdown);

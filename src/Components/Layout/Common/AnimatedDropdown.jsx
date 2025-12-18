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
  allowFreeInput = false,
  disabled = false,
  required = false,
  showError = false
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

  const hasError = required && showError && !value;

  useEffect(() => {
    if (isOpen && isSearchable && searchInputRef.current && !disabled) {
      searchInputRef.current.focus();
    }
  }, [isOpen, isSearchable, disabled]);

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

  const handleSelect = (opt) => {
    if (disabled) return;

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

  const containerClasses =
    direction === "up" ? "bottom-full mb-1" : "top-full mt-1";

  return (
    <div className="relative mb-4" ref={dropdownRef}>
      {label && (
        <label className="mb-1 block text-xs font-semibold text-gray-600">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type="text"
          disabled={disabled}
          readOnly={!allowFreeInput || disabled}
          value={isOpen && allowFreeInput ? searchTerm : getDisplayValue()}
          onFocus={() => {
            if (disabled) return;
            if (allowFreeInput) {
              setIsOpen(true);
              setSearchTerm("");
            }
          }}
          onClick={() => {
            if (disabled) return;
            if (!allowFreeInput) setIsOpen(prev => !prev);
          }}
          onChange={(e) => {
            if (disabled || !allowFreeInput) return;

            const val = e.target.value;
            setSearchTerm(val);
            setIsOpen(true);

            onChange({
              target: { name, value: val }
            });
          }}
          className={`
            w-full border-b-2 bg-transparent pb-1 text-sm font-semibold outline-none
            ${
              disabled
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : hasError
                  ? "border-red-500 text-red-600"
                  : isOpen
                    ? "border-blue-500 text-blue-600"
                    : "border-gray-300"
            }
          `}
        />

        <ChevronDown
          onClick={() => !disabled && setIsOpen(prev => !prev)}
          className={`
            absolute right-0 top-1 h-4 w-4
            ${
              disabled
                ? "text-gray-300"
                : isOpen
                  ? "rotate-180 text-blue-500"
                  : "text-gray-400"
            }
          `}
        />
      </div>

      {isOpen && !disabled && (
        <div
          className={`
            absolute z-50 w-full bg-white shadow-xl rounded-md border
            max-h-52 flex flex-col ${containerClasses}
          `}
        >
          {isSearchable && (
            <div className="border-b bg-slate-50 p-2">
              <div className="relative">
                <Search className="absolute left-2 top-1.5 h-4 w-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded border py-1 pl-8 pr-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="overflow-y-auto">
            {filteredOptions.map((opt, i) => (
              <div
                key={i}
                ref={(el) => (optionsRefs.current[i] = el)}
                onClick={() => handleSelect(opt)}
                onMouseEnter={() => setFocusedIndex(i)}
                className="cursor-pointer px-3 py-2 text-sm hover:bg-slate-100"
              >
                {getLabel(opt)}
              </div>
            ))}

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

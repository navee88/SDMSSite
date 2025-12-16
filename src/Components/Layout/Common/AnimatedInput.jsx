const AnimatedInput = ({ 
  label, 
  value, 
  onChange, 
  name, 
  labelColor = "text-gray-600",   // default color
  labelSize = "text-sm",          // default size
  labelWeight = "font-medium"     // default weight
}) => {
  return (
    <div className="relative mb-4">
      <label className={`${labelSize} ${labelWeight} ${labelColor} mb-3 block`}>
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="
          w-full bg-transparent border-b-2 text-sm font-semibold pb-1
          transition-colors duration-200 ease-in-out outline-none
          border-gray-300 text-gray-700
          focus:border-blue-500 focus:text-600
          hover:border-blue-400
        "
      />
    </div>
  );
};

export default AnimatedInput;

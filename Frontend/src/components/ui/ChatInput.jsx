import React from "react";

// This is a standard functional component. No forwardRef.
function ChatInput({
  value,
  onChange,
  onSubmit, // This prop will be a function to call when "Enter" is pressed
  disabled,
  placeholder,
  // Props for Dropdown 1
  mode,
  onModeChange,
  modeOptions,
  // Props for Dropdown 2
  subdivision,
  onSubdivisionChange,
  subdivisionOptions,
}) {
  // This function handles the "Shift + Enter" vs "Enter" logic
  const handleKeyDown = (e) => {
    // If "Enter" is pressed WITHOUT "Shift"
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Stop it from adding a new line
      if (onSubmit) {
        onSubmit(); // Call the submit function passed from the parent
      }
    }
    // If "Shift + Enter" is pressed, it will just add a new line normally.
  };

  return (
    // This is the main container, styled to look like one big input
    <div
      className={`w-full flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden 
                  focus-within:ring-2 focus-within:ring-blue-500 
                  ${disabled ? "bg-gray-100" : ""}`}
    >
      {/* 1. The Text Area */}
      <textarea
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        autoFocus={true}
        className="w-full px-3 py-2 outline-none resize-none duration-200"
        style={{ minHeight: "80px" }}
        autoComplete="off"
      />

      {/* 2. The Toolbar for Dropdowns */}
      <div className="flex items-center space-x-2 p-2 border-t border-gray-100 bg-gray-50">
        <select
          value={mode}
          onChange={onModeChange}
          disabled={disabled}
          className="text-sm rounded border-gray-300 shadow-sm"
        >
          {modeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={subdivision}
          onChange={onSubdivisionChange}
          disabled={disabled}
          className="text-sm rounded border-gray-300 shadow-sm"
        >
          {subdivisionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ChatInput;

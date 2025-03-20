import React from "react";

const Loader = ({
  size = "md",
  color = "primary",
  text = "Loading...",
  showText = true,
  fullScreen = false,
  overlay = false,
  className = "",
}) => {
  // Size mappings
  const sizeMap = {
    xs: "w-4 h-4 border-2",
    sm: "w-6 h-6 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  };

  // Color mappings - using a more refined color palette
  const colorMap = {
    primary: "border-blue-600",
    secondary: "border-purple-600",
    success: "border-green-500",
    danger: "border-red-500",
    warning: "border-yellow-500",
    info: "border-cyan-500",
    light: "border-gray-300",
    dark: "border-gray-800",
    white: "border-white",
  };

  // Text size based on spinner size
  const textSizeMap = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const sizeClass = sizeMap[size] || sizeMap.md;
  const colorClass = colorMap[color] || colorMap.primary;
  const textSizeClass = textSizeMap[size] || textSizeMap.md;

  // If fullScreen, create a fixed position loader
  if (fullScreen) {
    return (
      <div className='fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50'>
        <div
          className={`${sizeClass} border-t-transparent ${colorClass} rounded-full animate-spin`}
        ></div>
        {showText && (
          <p className={`mt-4 ${textSizeClass} font-medium text-white`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  // If overlay, create a positioned overlay within its container
  if (overlay) {
    return (
      <div className='absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-10'>
        <div
          className={`${sizeClass} border-t-transparent ${colorClass} rounded-full animate-spin`}
        ></div>
        {showText && (
          <p className={`mt-3 ${textSizeClass} font-medium text-gray-700`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  // Default inline loader
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClass} border-t-transparent ${colorClass} rounded-full animate-spin`}
      ></div>
      {showText && (
        <p className={`mt-2 ${textSizeClass} font-medium text-gray-700`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;

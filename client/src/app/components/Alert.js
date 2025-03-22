// components/ui/Alert.jsx
'use client'; // Mark as client component

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cva } from 'class-variance-authority';

const alertVariants = cva(
  "fixed z-50 flex items-start p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300",
  {
    variants: {
      variant: {
        success: "bg-green-50 border-green-500 text-green-800",
        error: "bg-red-50 border-red-500 text-red-800",
        warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
        info: "bg-blue-50 border-blue-500 text-blue-800",
      },
      position: {
        topRight: "top-4 right-4",
        topLeft: "top-4 left-4",
        bottomRight: "bottom-4 right-4",
        bottomLeft: "bottom-4 left-4",
      },
    },
    defaultVariants: {
      variant: "success",
      position: "topRight",
    },
  }
);

const iconMap = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
  warning: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />
};

/**
 * Alert Component for displaying notifications in Next.js applications
 */
const Alert = ({ 
  variant = 'success', 
  message, 
  isOpen = true, 
  onClose, 
  autoCloseTime = 5000,
  position = "topRight",
  showIcon = true 
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  
  // Handle auto-close
  useEffect(() => {
    setIsVisible(isOpen);
    
    let timer;
    if (isOpen && autoCloseTime > 0) {
      timer = setTimeout(() => {
        handleClose();
      }, autoCloseTime);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, autoCloseTime]);
  
  // Handle close button click
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) setTimeout(onClose, 300); // Allow animation to complete
  };
  
  if (!isVisible) return null;
  
  const positionClasses = {
    topRight: "translate-x-full",
    topLeft: "-translate-x-full",
    bottomRight: "translate-x-full",
    bottomLeft: "-translate-x-full"
  };
  
  return (
    <div 
      className={`${alertVariants({ variant, position })} max-w-md transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : positionClasses[position]}`}
      role="alert"
    >
      {showIcon && (
        <div className="flex-shrink-0 mr-3">
          {iconMap[variant]}
        </div>
      )}
      
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      
      <button 
        onClick={handleClose}
        className="ml-4 flex-shrink-0 hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Alert;
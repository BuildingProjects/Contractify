// context/alert-context.jsx
"use client"; // Mark as client component

import React, { createContext, useContext, useState, useCallback } from "react";
import Alert from "../components/Alert";
// import Alert from "@/components/ui/Alert";

const AlertContext = createContext(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  // Generate unique ID for each alert
  const generateId = () =>
    `alert-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  // Show alert function
  const showAlert = useCallback((message, options = {}) => {
    const id = generateId();
    const alertConfig = {
      id,
      message,
      variant: options.variant || "success",
      autoCloseTime: options.autoCloseTime ?? 5000,
      position: options.position || "topRight",
      showIcon: options.showIcon ?? true,
    };

    setAlerts((prev) => [...prev, alertConfig]);

    return id;
  }, []);

  // Hide alert function
  const hideAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  // Shorthand functions for different alert types
  const success = useCallback(
    (message, options) =>
      showAlert(message, { variant: "success", ...options }),
    [showAlert]
  );

  const error = useCallback(
    (message, options) => showAlert(message, { variant: "error", ...options }),
    [showAlert]
  );

  const warning = useCallback(
    (message, options) =>
      showAlert(message, { variant: "warning", ...options }),
    [showAlert]
  );

  const info = useCallback(
    (message, options) => showAlert(message, { variant: "info", ...options }),
    [showAlert]
  );

  const value = {
    showAlert,
    hideAlert,
    success,
    error,
    warning,
    info,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      <div className='alert-container'>
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            variant={alert.variant}
            message={alert.message}
            isOpen={true}
            autoCloseTime={alert.autoCloseTime}
            position={alert.position}
            showIcon={alert.showIcon}
            onClose={() => hideAlert(alert.id)}
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
};

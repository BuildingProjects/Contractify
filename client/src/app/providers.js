// app/providers.jsx
"use client";

import { AlertProvider } from "./context/alert-context";

// import { AlertProvider } from "@/context/alert-context";

export function Providers({ children }) {
  return <AlertProvider>{children}</AlertProvider>;
}

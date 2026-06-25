"use client";

import { createContext, useContext, useState } from "react";
import Toast from "./Toast";

type ToastType = "success" | "error" | "info";

const ToastContext = createContext<any>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState({
    message: "",
    type: "success" as ToastType
  });

  function showToast(message: string, type: ToastType = "success") {
    setToast({ message, type });

    setTimeout(() => {
      setToast({ message: "", type: "success" });
    }, 3500);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

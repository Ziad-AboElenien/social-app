import { createContext, useMemo, useState } from "react";
import AlertModal from "../Components/ui/AlertModal/AlertModal";

export const UIContext = createContext(null);

export default function UIProvider({ children }) {
  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  function showAlert({ title, message, type = "info" }) {
    setAlert({ isOpen: true, title, message, type });
  }

  function closeAlert() {
    setAlert((prev) => ({ ...prev, isOpen: false }));
  }

  const value = useMemo(() => ({ showAlert, closeAlert }), []);

  return (
    <UIContext.Provider value={value}>
      {children}
      <AlertModal
        isOpen={alert.isOpen}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onClose={closeAlert}
      />
    </UIContext.Provider>
  );
}


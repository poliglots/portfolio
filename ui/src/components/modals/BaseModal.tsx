import { useEffect } from "react";

interface BaseModalProps {
  isActive: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Shared modal wrapper handling escape key, body scroll lock, and overlay.
 */
export default function BaseModal({ isActive, onClose, children }: BaseModalProps) {
  useEffect(() => {
    if (!isActive) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isActive, onClose]);

  if (!isActive) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="m-dialog" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

/**
 * News reader variant of BaseModal.
 */
export function BaseReaderModal({ isActive, onClose, children }: BaseModalProps) {
  useEffect(() => {
    if (!isActive) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isActive, onClose]);

  if (!isActive) return null;

  return (
    <div className="m-overlay" onClick={onClose}>
      <div className="m-reader" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// @/components/ui/PropertyDetailsModal.jsx
import React, { useEffect } from 'react';

const PropertyDetailsModal = ({ open, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (open) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-0 md:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Modal Content */}
      <div
        className="bg-background rounded-none md:rounded-lg w-full h-full md:w-auto md:h-auto md:max-w-2xl md:max-h-[90vh] shadow-xl flex flex-col relative overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal on content click
      >
        {children}
      </div>
    </div>
  );
};

export default PropertyDetailsModal;

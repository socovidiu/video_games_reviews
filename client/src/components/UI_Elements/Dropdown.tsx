import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface DropdownProps {
  isOpen: boolean;
  anchorRef: React.RefObject<HTMLDivElement>; // Reference to the button
  children: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ isOpen, anchorRef, children }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY, // Position below the button
        left: rect.left + window.scrollX, // Align with the button
        width: rect.width, // Ensure width matches the button
      });
    }
  }, [isOpen, anchorRef]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        width: position.width,
      }}
      className="bg-white text-black shadow-lg rounded-lg z-50 overflow-hidden"
    >
      {children}
    </div>,
    document.body
  );
};

export default Dropdown;

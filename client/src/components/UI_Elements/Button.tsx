import React from "react";


interface ButtonProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  type = "button",
  className = "",
  disabled = false,
  children,
}) => {
  const baseClasses = "px-4 py-2 rounded-md transition focus:outline-none";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${className} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      {children}
    </button>
  );
};

export default Button;

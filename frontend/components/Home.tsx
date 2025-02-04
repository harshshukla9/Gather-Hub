"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { useRouter } from "next/navigation";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
}) => {
  const baseStyles =
    "flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none";

  const variantStyles = {
    primary: "bg-black text-white hover:bg-gray-900",
    secondary: "bg-gray-700 text-white hover:bg-gray-800",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
    ghost: "text-gray-700 hover:bg-gray-200",
  };

  const sizeStyles = {
    sm: "px-3 py-1 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;

export function HomePage() {
  const router = useRouter();

  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        Unlock your space <br />
        Create a room or join one instantly!
        <div className="flex justify-center mt-8">
        <Button
          onClick={() => router.push(`/CreateRoom`)}
          className="bg-black text-white font-bold text-xl rounded-full px-6 py-3 hover:scale-110 transition-transform"
          variant="primary"
          size="md"
        >
          Join Room
        </Button>
      </div>
      </motion.h1>

    
    </LampContainer>
  );
}

import React, { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = "", ...props }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-xs p-5 ${className}`} {...props}>
      {title && <h3 className="text-base font-semibold text-slate-800 mb-3">{title}</h3>}
      {children}
    </div>
  );
};

import React from 'react';
import { MoreVertical, Info } from 'lucide-react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  fullHeight?: boolean;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, icon, headerAction, fullHeight, className = '' }) => {
  return (
    <div className={`bg-[#161e2d] border border-slate-700 rounded-lg shadow-sm flex flex-col ${fullHeight ? 'h-full' : ''} ${className}`}>
      <div className="px-5 py-3 border-b border-slate-700 flex justify-between items-center bg-gradient-to-r from-[#161e2d] to-[#1c2639]">
        <div className="flex items-center gap-2">
            {icon && <span className="text-gray-400">{icon}</span>}
            <h3 className="font-bold text-lg text-white tracking-tight">{title}</h3>
            <span className="text-gray-500 text-xs ml-1 cursor-help flex items-center gap-0.5">
                Info <Info size={10} />
            </span>
        </div>
        <div className="flex items-center gap-2">
            {headerAction}
            <button className="text-gray-400 hover:text-white p-1 rounded hover:bg-slate-700">
                <MoreVertical size={16} />
            </button>
        </div>
      </div>
      <div className="p-5 flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Card;
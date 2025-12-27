import React from 'react';
import { Search, Bell, Settings, HelpCircle, Grid, Linkedin } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-[#232f3e] text-white h-[52px] flex items-center px-4 justify-between fixed w-full top-0 z-50 shadow-md">
      <div className="flex items-center gap-4">
        <button className="p-1 hover:bg-slate-700 rounded text-gray-300">
            <div className="font-bold text-xl flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                    <Grid size={20} className="text-white" />
                </div>
                <span className="hidden md:block">Console</span>
            </div>
        </button>
        <div className="relative hidden md:block">
            <span className="font-bold text-lg ml-2">Services</span>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-4 hidden sm:block">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for services, features, blogs, docs, and more"
            className="w-full bg-[#161e2d] border border-gray-600 rounded text-sm px-3 py-1.5 pl-9 focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
          />
          <Search className="absolute left-2.5 top-1.5 text-gray-500" size={16} />
          <span className="absolute right-2 top-1.5 text-gray-500 text-xs border border-gray-600 px-1 rounded">Alt+S</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-gray-300 text-sm">
        <a href="https://linkedin.com/in/jan-andrzejczyk" target="_blank" rel="noopener noreferrer" className="hover:text-white" title="Connect on LinkedIn">
            <Linkedin size={18} />
        </a>
        <button className="hover:text-white"><Bell size={18} /></button>
        <button className="hover:text-white"><HelpCircle size={18} /></button>
        <button className="hover:text-white"><Settings size={18} /></button>
        
        <div className="flex items-center gap-2 px-2 py-1 hover:bg-slate-700 rounded cursor-pointer border border-transparent hover:border-gray-500 transition-colors">
          <span className="text-orange-500 font-medium">Jan Andrzejczyk</span>
          <span className="hidden lg:block text-xs bg-red-600 text-white px-1 rounded">Admin</span>
        </div>

        <div className="hidden md:flex items-center gap-2 px-2 py-1 hover:bg-slate-700 rounded cursor-pointer">
          <span className="font-medium text-white">Global</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
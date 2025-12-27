import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-300 font-sans">
      <Navbar />
      <div className="pt-[52px] flex">
        <main className="flex-1 p-4 overflow-y-auto min-h-[calc(100vh-52px)]">
           <div className="max-w-[1600px] mx-auto">
             {children}
           </div>
           
           <footer className="mt-12 border-t border-gray-700 pt-6 pb-12 text-xs text-gray-500 flex flex-wrap gap-6 px-4">
                <a href="#" className="hover:underline hover:text-cyan-400">Feedback</a>
                <a href="#" className="hover:underline hover:text-cyan-400">Support</a>
                <a href="#" className="hover:underline hover:text-cyan-400">Privacy</a>
                <a href="#" className="hover:underline hover:text-cyan-400">Terms</a>
                <a href="#" className="hover:underline hover:text-cyan-400">Cookie Preferences</a>
                <span className="ml-auto">© 2025, Jan's Cloud Portfolio, Inc. or its affiliates.</span>
           </footer>
        </main>
      </div>
    </div>
  );
};

export default Layout;
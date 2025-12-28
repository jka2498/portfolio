import React from 'react';
import { useProjects } from '../../hooks/useProjects';
import { Project } from '../../types';
import Card from '../Card';
import { Folder, Search, Loader2 } from 'lucide-react';

interface S3WidgetProps {
  onProjectClick?: (project: Project) => void;
}

const S3Widget: React.FC<S3WidgetProps> = ({ onProjectClick }) => {
  const { projects, loading, error } = useProjects();

  return (
    <Card 
        title="Buckets (Projects)" 
        headerAction={
            <button className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold py-1.5 px-3 rounded shadow-sm transition-colors">
                Create bucket
            </button>
        }
    >
      <div className="space-y-4">
        <div className="relative">
             <Search className="absolute left-2.5 top-2 text-gray-500" size={14} />
             <input type="text" placeholder="Find buckets by name" className="w-full bg-[#0f1117] border border-gray-600 rounded pl-8 pr-3 py-1.5 text-sm text-gray-300 focus:border-orange-500 focus:outline-none" />
        </div>
        
        <ul className="divide-y divide-gray-800 border border-gray-700 rounded bg-[#0f1117] min-h-[100px]">
          {loading && (
             <li className="p-8 flex justify-center text-gray-500">
                  <div className="flex items-center gap-2">
                       <Loader2 className="animate-spin" size={20} />
                       <span>Loading buckets...</span>
                  </div>
             </li>
          )}

          {error && (
             <li className="p-8 flex justify-center text-red-400">
                  <span>{error}</span>
             </li>
          )}

          {!loading && !error && projects.map((proj) => (
            <li 
                key={proj.bucketName} 
                className="p-3 hover:bg-[#1f2937] transition-colors flex items-center justify-between group cursor-pointer"
                onClick={() => onProjectClick && onProjectClick(proj)}
            >
               <div className="flex items-start gap-3">
                    <Folder className="text-orange-500 mt-0.5 fill-orange-500/10" size={18} />
                    <div>
                        <div className="text-cyan-500 font-medium text-sm group-hover:underline font-mono">
                            {proj.bucketName}
                        </div>
                    </div>
               </div>
               <div className="flex items-center">
                 <span className={`text-[10px] px-1.5 py-0.5 rounded border ${proj.access === 'Public' ? 'border-red-800 bg-red-900/20 text-red-400' : 'border-green-800 bg-green-900/20 text-green-400'}`}>
                    {proj.access}
                 </span>
               </div>
            </li>
          ))}
        </ul>
        <div className="text-right">
             <a href="#" className="text-cyan-500 text-xs hover:underline">View all buckets</a>
        </div>
      </div>
    </Card>
  );
};

export default S3Widget;
import React, { useState } from 'react';
import { Project } from '../types';
import { 
    ArrowLeft, Search, Copy, ExternalLink, Info, 
    FileText, Folder, FileJson, FileCode, FileImage, 
    Download, RefreshCw, MoreVertical, ChevronDown 
} from 'lucide-react';

interface BucketDetailsProps {
  project: Project;
  onBack: () => void;
}

const BucketDetails: React.FC<BucketDetailsProps> = ({ project, onBack }) => {
  const [activeTab, setActiveTab] = useState('Objects');
  const tabs = ['Objects', 'Metadata', 'Properties', 'Permissions', 'Metrics', 'Management', 'Access Points'];

  const getFileIcon = (type: string) => {
      switch(type) {
          case 'folder': return <Folder size={16} className="text-orange-500 fill-orange-500/20" />;
          case 'json': return <FileJson size={16} className="text-gray-400" />;
          case 'yaml': 
          case 'yml': return <FileCode size={16} className="text-gray-400" />;
          case 'png': 
          case 'jpg': return <FileImage size={16} className="text-purple-400" />;
          default: return <FileText size={16} className="text-gray-400" />;
      }
  };

  return (
    <div className="flex flex-col h-full text-sm">
      {/* Breadcrumb & Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
           <span className="hover:text-cyan-500 cursor-pointer" onClick={onBack}>Amazon S3</span>
           <span>{'>'}</span>
           <span className="hover:text-cyan-500 cursor-pointer" onClick={onBack}>Buckets</span>
           <span>{'>'}</span>
           <span className="text-gray-300">{project.bucketName}</span>
        </div>
        
        <div className="flex items-start gap-3">
             <div className="mt-1">
                <div className="w-10 h-10 bg-green-700/20 rounded flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-green-500 rounded-sm"></div>
                </div>
             </div>
             <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    {project.bucketName} <span className="text-xs font-normal text-cyan-500 px-1">Info</span>
                </h1>
                <div className="text-xs text-gray-400 mt-1 flex gap-4">
                    <span>Region: <span className="text-gray-300">{project.region}</span></span>
                    <span>Access: <span className={`px-1 rounded ${project.access === 'Public' ? 'bg-red-900/30 text-red-400 border border-red-900' : 'bg-green-900/30 text-green-400 border border-green-900'}`}>{project.access}</span></span>
                </div>
             </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6 flex gap-6 text-sm">
          {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-1 border-b-2 transition-colors ${activeTab === tab ? 'border-orange-500 text-orange-500 font-bold' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1">
          {activeTab === 'Objects' && (
              <div className="space-y-4">
                 
                 {/* S3 Toolbar */}
                 <div className="flex flex-wrap items-center gap-2 mb-4">
                     <button className="bg-white text-gray-900 font-bold px-3 py-1.5 rounded text-xs border border-gray-300 hover:bg-gray-100 flex items-center gap-1 disabled:opacity-50">
                         <RefreshCw size={14} />
                     </button>
                     <button className="bg-white text-gray-900 font-bold px-3 py-1.5 rounded text-xs border border-gray-300 hover:bg-gray-100 flex items-center gap-1 disabled:opacity-50">
                         <Copy size={14} /> Copy S3 URI
                     </button>
                     <button className="bg-white text-gray-900 font-bold px-3 py-1.5 rounded text-xs border border-gray-300 hover:bg-gray-100 flex items-center gap-1 disabled:opacity-50">
                         <Copy size={14} /> Copy URL
                     </button>
                     <button className="bg-white text-gray-900 font-bold px-3 py-1.5 rounded text-xs border border-gray-300 hover:bg-gray-100 flex items-center gap-1 disabled:opacity-50">
                         <Download size={14} /> Download
                     </button>
                     <button className="bg-white text-gray-900 font-bold px-3 py-1.5 rounded text-xs border border-gray-300 hover:bg-gray-100 flex items-center gap-1 disabled:opacity-50">
                         Open <ExternalLink size={12} className="ml-0.5" />
                     </button>
                     <button className="bg-white text-gray-900 font-bold px-3 py-1.5 rounded text-xs border border-gray-300 hover:bg-gray-100 flex items-center gap-1 disabled:opacity-50">
                         Delete
                     </button>
                     <button className="bg-white text-gray-900 font-bold px-3 py-1.5 rounded text-xs border border-gray-300 hover:bg-gray-100 flex items-center gap-1">
                         Actions <ChevronDown size={14} />
                     </button>
                     <div className="flex-1"></div>
                     <button className="bg-white text-gray-900 font-bold px-3 py-1.5 rounded text-xs border border-gray-300 hover:bg-gray-100">
                         Create folder
                     </button>
                     <button className="bg-orange-600 text-white font-bold px-3 py-1.5 rounded text-xs hover:bg-orange-500">
                         Upload
                     </button>
                 </div>

                 {/* S3 Search / Filter */}
                 <div className="space-y-2">
                     <p className="text-gray-400 text-xs">Objects are the fundamental entities stored in Amazon S3. You can use <span className="text-cyan-500 underline">Amazon S3 inventory</span> to list all objects.</p>
                     
                     <div className="flex gap-4">
                         <div className="relative flex-1">
                             <input 
                                type="text" 
                                placeholder="Find objects by prefix" 
                                className="w-full bg-[#0f1117] border border-gray-600 rounded px-3 py-1.5 pl-9 text-gray-300 focus:border-orange-500 focus:outline-none placeholder-gray-500" 
                             />
                             <Search className="absolute left-2.5 top-2 text-gray-500" size={14} />
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-4 bg-gray-600 rounded-full relative cursor-pointer">
                                <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                            </div>
                            <span className="text-gray-300 text-xs font-bold">Show versions</span>
                         </div>
                     </div>
                 </div>

                 {/* Object Table */}
                 <div className="border border-gray-700 rounded bg-[#0f1117] overflow-hidden">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                       <thead className="bg-slate-800 text-gray-400 font-semibold border-b border-gray-700 text-xs">
                         <tr>
                           <th className="p-3 w-8"><input type="checkbox" className="rounded bg-gray-700 border-gray-600" /></th>
                           <th className="p-3">Name</th>
                           <th className="p-3">Type</th>
                           <th className="p-3">Last modified</th>
                           <th className="p-3 text-right">Size</th>
                           <th className="p-3">Storage class</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-800">
                         {project.objects.map((obj, idx) => (
                            <tr key={idx} className="hover:bg-[#1f2937] group cursor-pointer">
                               <td className="p-3"><input type="checkbox" className="rounded bg-gray-700 border-gray-600" /></td>
                               <td className="p-3 font-medium text-cyan-500 group-hover:underline flex items-center gap-2">
                                   {getFileIcon(obj.type)}
                                   {obj.name}
                               </td>
                               <td className="p-3 text-gray-400">{obj.type}</td>
                               <td className="p-3 text-gray-400">{obj.lastModified}</td>
                               <td className="p-3 text-gray-400 text-right">{obj.size}</td>
                               <td className="p-3 text-gray-400">{obj.storageClass}</td>
                            </tr>
                         ))}
                         {/* Fake "filler" row for authentic empty space feel */}
                         <tr className="h-full">
                             <td colSpan={6} className="p-8"></td>
                         </tr>
                       </tbody>
                    </table>
                 </div>
              </div>
          )}

          {activeTab === 'Properties' && (
              <div className="space-y-6 max-w-5xl">
                  
                  {/* Bucket Overview Card */}
                  <div className="border border-gray-700 rounded bg-[#161e2d]">
                      <div className="p-4 border-b border-gray-700">
                          <h3 className="text-lg font-bold text-white">Bucket overview</h3>
                      </div>
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-y-6">
                           <div>
                               <div className="text-xs text-gray-400 mb-1">Region</div>
                               <div className="text-sm text-gray-200">{project.region}</div>
                           </div>
                           <div>
                               <div className="text-xs text-gray-400 mb-1">Resource Name (RN)</div>
                               <div className="text-sm text-gray-200 flex items-center gap-2 font-mono bg-black/20 p-1 w-fit rounded">
                                   <Box size={14} className="text-green-500" /> {project.arn} <Copy size={12} className="cursor-pointer text-gray-500 hover:text-white" />
                               </div>
                           </div>
                           <div>
                               <div className="text-xs text-gray-400 mb-1">Creation date</div>
                               <div className="text-sm text-gray-200">{project.creationDate}</div>
                           </div>
                      </div>
                  </div>

                  {/* Description Card (Simulating Static Website Hosting or Intelligent Tiering card style) */}
                  <div className="border border-gray-700 rounded bg-[#161e2d]">
                      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                          <h3 className="text-lg font-bold text-white">Project Description</h3>
                          <button className="bg-white text-gray-900 font-bold px-3 py-1.5 rounded text-xs border border-gray-300 hover:bg-gray-100">Edit</button>
                      </div>
                      <div className="p-4">
                           <div className="text-sm text-gray-300 leading-relaxed mb-4">
                               {project.description}
                           </div>
                           <div className="text-xs text-gray-500">
                               Project Status: <span className="text-green-400 font-medium">{project.tags['Status'] || 'Active'}</span>
                           </div>
                      </div>
                  </div>

                  {/* Tags Card */}
                  <div className="border border-gray-700 rounded bg-[#161e2d]">
                      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                          <h3 className="text-lg font-bold text-white">Tags</h3>
                          <button className="bg-white text-gray-900 font-bold px-3 py-1.5 rounded text-xs border border-gray-300 hover:bg-gray-100">Edit</button>
                      </div>
                      <div className="p-4">
                           <p className="text-xs text-gray-400 mb-4">You can use tags to track project technologies, methodologies and status.</p>
                           
                           <div className="border border-gray-700 rounded overflow-hidden">
                               <table className="w-full text-left text-sm">
                                   <thead className="bg-slate-800 text-gray-400 font-semibold border-b border-gray-700 text-xs">
                                       <tr>
                                           <th className="p-2 border-r border-gray-700">Key</th>
                                           <th className="p-2">Value</th>
                                       </tr>
                                   </thead>
                                   <tbody className="divide-y divide-gray-800">
                                       {Object.entries(project.tags).map(([k, v]) => (
                                           <tr key={k}>
                                               <td className="p-2 border-r border-gray-800 text-gray-300">{k}</td>
                                               <td className="p-2 text-gray-400">{v}</td>
                                           </tr>
                                       ))}
                                   </tbody>
                               </table>
                           </div>
                      </div>
                  </div>

                  {/* Server Access Logging (Fake) */}
                  <div className="border border-gray-700 rounded bg-[#161e2d]">
                      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                          <h3 className="text-lg font-bold text-white">Server access logging</h3>
                          <button className="bg-white text-gray-900 font-bold px-3 py-1.5 rounded text-xs border border-gray-300 hover:bg-gray-100">Edit</button>
                      </div>
                      <div className="p-4">
                           <div className="text-xs text-gray-400 mb-1">Server access logging</div>
                           <div className="text-sm text-gray-200">Disabled</div>
                           <div className="text-xs text-gray-500 mt-1">Log requests for access to your bucket.</div>
                      </div>
                  </div>

              </div>
          )}
          
          {activeTab !== 'Objects' && activeTab !== 'Properties' && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                  <Info size={40} className="mb-4 opacity-50" />
                  <p>No {activeTab.toLowerCase()} data available for this project.</p>
                  <button className="mt-4 text-cyan-500 hover:underline" onClick={() => setActiveTab('Objects')}>Return to Objects</button>
              </div>
          )}
      </div>
    </div>
  );
};

// Helper icon
const Box = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
);

export default BucketDetails;
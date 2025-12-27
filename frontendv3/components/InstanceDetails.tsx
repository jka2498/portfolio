import React, { useState } from 'react';
import { Experience } from '../types';
import { ArrowLeft, RefreshCw, Copy, ExternalLink, Info, CheckCircle2, ChevronDown, ChevronUp, Search } from 'lucide-react';

interface InstanceDetailsProps {
  instance: Experience;
  onBack: () => void;
}

const InstanceDetails: React.FC<InstanceDetailsProps> = ({ instance, onBack }) => {
  const [activeTab, setActiveTab] = useState('Details');

  const tabs = ['Details', 'Status and alarms', 'Monitoring', 'Security', 'Networking', 'Storage', 'Tags'];

  return (
    <div className="flex flex-col h-full text-sm">
      {/* Breadcrumb & Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
           <span className="hover:text-cyan-500 cursor-pointer" onClick={onBack}>EC2</span>
           <span>{'>'}</span>
           <span className="hover:text-cyan-500 cursor-pointer" onClick={onBack}>Instances</span>
           <span>{'>'}</span>
           <span className="text-gray-300">{instance.id}</span>
        </div>
        
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
               <button onClick={onBack} className="p-1 hover:bg-slate-700 rounded-full mr-1">
                   <ArrowLeft size={20} className="text-gray-400" />
               </button>
               <h1 className="text-2xl font-bold text-white">{instance.id}</h1>
               <span className="text-gray-500">({instance.role})</span>
            </div>
            
            <div className="flex gap-2">
                <button className="bg-white text-gray-900 font-bold px-3 py-1.5 rounded text-xs border border-gray-300 hover:bg-gray-100">
                    Connect
                </button>
                <button className="bg-white text-gray-900 font-bold px-3 py-1.5 rounded text-xs border border-gray-300 hover:bg-gray-100 flex items-center gap-1">
                    Instance state <ChevronDown size={14} />
                </button>
                <button className="bg-white text-gray-900 font-bold px-3 py-1.5 rounded text-xs border border-gray-300 hover:bg-gray-100 flex items-center gap-1">
                    Actions <ChevronDown size={14} />
                </button>
                <button className="bg-orange-600 text-white font-bold px-3 py-1.5 rounded text-xs hover:bg-orange-500 flex items-center gap-1">
                    Launch instance <ChevronDown size={14} />
                </button>
            </div>
        </div>
      </div>

      {/* Instance Summary Bar */}
      <div className="bg-[#0f1117] border border-gray-700 rounded-sm mb-6 p-4">
         <div className="flex items-center gap-8 overflow-x-auto">
             <div className="flex flex-col gap-1 min-w-[120px]">
                 <span className="text-xs text-gray-400">Instance ID</span>
                 <div className="flex items-center gap-1 text-gray-200">
                     <span className="font-mono text-xs">{instance.id}</span>
                     <Copy size={12} className="text-gray-500 cursor-pointer hover:text-white" />
                 </div>
             </div>
             <div className="flex flex-col gap-1 min-w-[120px]">
                 <span className="text-xs text-gray-400">Public IPv4 address</span>
                 <div className="flex items-center gap-1 text-gray-200">
                     <span className="font-mono text-xs">00.111.222.333</span>
                     <ExternalLink size={12} className="text-cyan-500 cursor-pointer" />
                 </div>
             </div>
             <div className="flex flex-col gap-1 min-w-[120px]">
                 <span className="text-xs text-gray-400">Instance state</span>
                 <div className="flex items-center gap-1.5">
                     {instance.state === 'running' ? (
                         <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                     ) : (
                         <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                     )}
                     <span className="text-gray-200 font-medium capitalize">{instance.state}</span>
                 </div>
             </div>
             <div className="flex flex-col gap-1 min-w-[120px]">
                 <span className="text-xs text-gray-400">Instance type</span>
                 <span className="text-gray-200 font-mono text-xs">{instance.type}</span>
             </div>
             <div className="flex flex-col gap-1 min-w-[120px]">
                 <span className="text-xs text-gray-400">Alarm status</span>
                 <span className="text-gray-400 text-xs">No alarms</span>
             </div>
              <div className="flex flex-col gap-1 min-w-[120px]">
                 <span className="text-xs text-gray-400">Availability Zone</span>
                 <span className="text-gray-200 text-xs">{instance.az}</span>
             </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-4 flex gap-6 text-sm">
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
          {activeTab === 'Details' && (
              <div className="space-y-6">
                 
                 {/* Instance Summary Collapsible Header Style */}
                 <div className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                     <ChevronDown size={20} />
                     <h2>Instance summary</h2>
                     <span className="text-cyan-500 text-xs font-normal ml-2 cursor-pointer">Info</span>
                 </div>

                 {/* Key Value Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-12 px-2">
                    {/* Column 1 */}
                    <div className="space-y-4">
                        <div>
                            <div className="text-xs text-gray-500 mb-0.5">Instance ID</div>
                            <div className="flex items-center gap-1 text-gray-200 text-xs font-mono">{instance.id} <Copy size={12} /></div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-0.5">Role Name</div>
                            <div className="text-sm text-gray-200">{instance.role}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-0.5">Launch Time</div>
                            <div className="text-sm text-gray-200">{instance.launchTime}</div>
                        </div>
                    </div>

                    {/* Column 2 */}
                     <div className="space-y-4">
                        <div>
                            <div className="text-xs text-gray-500 mb-0.5">Public IPv4 address</div>
                            <div className="text-sm text-cyan-500 cursor-pointer hover:underline">00.111.222.333</div>
                        </div>
                         <div>
                            <div className="text-xs text-gray-500 mb-0.5">Private IP DNS name (IPv4 only)</div>
                            <div className="text-sm text-gray-200 font-mono">ip-111-22-333-444.{instance.az}.compute.internal</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-0.5">Instance type</div>
                            <div className="text-sm text-gray-200 font-mono">{instance.type}</div>
                        </div>
                    </div>

                    {/* Column 3 */}
                     <div className="space-y-4">
                        <div>
                            <div className="text-xs text-gray-500 mb-0.5">Instance state</div>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${instance.state === 'running' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                <span className="text-sm text-gray-200 capitalize">{instance.state}</span>
                            </div>
                        </div>
                         <div>
                            <div className="text-xs text-gray-500 mb-0.5">VPC ID</div>
                            <div className="text-sm text-cyan-500 cursor-pointer hover:underline">vpc-01a112a22b334cdd5</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-0.5">Subnet ID</div>
                            <div className="text-sm text-cyan-500 cursor-pointer hover:underline">subnet-01a112a22b334cdd5</div>
                        </div>
                    </div>

                    {/* Column 4 */}
                    <div className="space-y-4">
                        <div>
                            <div className="text-xs text-gray-500 mb-0.5">Platform</div>
                            <div className="text-sm text-gray-200">{instance.tags['Platform'] || 'Linux/UNIX'}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-0.5">AMI ID</div>
                            <div className="text-sm text-cyan-500 cursor-pointer hover:underline">ami-01a112a22b334cdd5</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-0.5">Monitoring</div>
                            <div className="text-sm text-gray-200">Basic</div>
                        </div>
                    </div>
                 </div>

                 <hr className="border-gray-700 my-6" />

                 {/* Role Description - Styled like User Data or Tags */}
                 <div className="px-2">
                     <div className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                        <ChevronDown size={20} />
                        <h2>Work Experience Details</h2>
                     </div>
                     
                     <div className="bg-[#161e2d] border border-gray-700 rounded p-4 font-mono text-xs text-gray-300">
                        <div className="text-gray-500 mb-2"># User Data / Responsibilities</div>
                        <ul className="space-y-3">
                            {instance.description.map((bullet, idx) => (
                                <li key={idx} className="flex gap-2">
                                    <span className="text-orange-500 shrink-0">{'>'}</span>
                                    <span className="leading-relaxed">{bullet}</span>
                                </li>
                            ))}
                        </ul>
                     </div>
                 </div>

              </div>
          )}

          {activeTab === 'Tags' && (
              <div className="space-y-4">
                 <div className="flex justify-between items-center mb-4">
                    <div className="relative max-w-sm w-full">
                        <input 
                            type="text" 
                            placeholder="Find tags by key or value" 
                            className="w-full bg-[#0f1117] border border-gray-600 rounded px-3 py-1.5 pl-9 text-gray-300 focus:border-orange-500 focus:outline-none placeholder-gray-500" 
                        />
                        <Search className="absolute left-2.5 top-1.5 text-gray-500" size={16} />
                    </div>
                    <button className="bg-white text-gray-900 font-bold px-3 py-1.5 rounded text-xs border border-gray-300 hover:bg-gray-100">
                        Manage tags
                    </button>
                 </div>

                 <div className="border border-gray-700 rounded bg-[#0f1117] overflow-hidden">
                    <table className="w-full text-left text-sm">
                       <thead className="bg-slate-800 text-gray-400 font-semibold border-b border-gray-700">
                         <tr>
                           <th className="p-3 border-r border-gray-700 w-1/3">Key</th>
                           <th className="p-3">Value</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-800">
                         {Object.entries(instance.tags).map(([key, value]) => (
                            <tr key={key} className="hover:bg-[#1f2937]">
                               <td className="p-3 border-r border-gray-800 font-medium text-gray-300">{key}</td>
                               <td className="p-3 text-gray-400">{value}</td>
                            </tr>
                         ))}
                       </tbody>
                    </table>
                 </div>
                 <div className="text-xs text-gray-500 mt-2">
                    Tags help you categorize resources. You can apply tags to your instances, images, and other resources.
                 </div>
              </div>
          )}
          
          {activeTab !== 'Details' && activeTab !== 'Tags' && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                  <Info size={40} className="mb-4 opacity-50" />
                  <p>No {activeTab.toLowerCase()} data available for this instance.</p>
                  <button className="mt-4 text-cyan-500 hover:underline" onClick={() => setActiveTab('Details')}>Return to Details</button>
              </div>
          )}
      </div>
    </div>
  );
};

export default InstanceDetails;
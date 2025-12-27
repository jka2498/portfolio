import React from 'react';
import { RECENT_SERVICES } from '../../constants';
import { Server, HardDrive, Shield, Activity, Database, Globe } from 'lucide-react';
import Card from '../Card';

const iconMap: Record<string, React.ReactNode> = {
  Server: <Server size={20} />,
  HardDrive: <HardDrive size={20} />,
  Shield: <Shield size={20} />,
  Activity: <Activity size={20} />,
  Database: <Database size={20} />,
  Globe: <Globe size={20} />,
};

const RecentServicesWidget: React.FC = () => {
  return (
    <Card title="Recently visited">
      {/* Increased grid columns for large screens to 3 since this widget now spans 2/3 of the page */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-8">
        {RECENT_SERVICES.map((service) => (
          <div 
            key={service.id} 
            className="group flex items-start gap-3 p-2 rounded hover:bg-[#232f3e] cursor-pointer transition-colors border border-transparent hover:border-slate-600"
          >
            <div className="mt-0.5 p-1.5 rounded bg-slate-800 text-orange-500 group-hover:text-orange-400 group-hover:bg-slate-700">
              {iconMap[service.icon]}
            </div>
            <div>
              <div className="text-cyan-500 font-semibold text-sm group-hover:underline group-hover:text-cyan-400">
                {service.name}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{service.description}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-slate-700">
        <a href="#" className="text-cyan-500 text-sm font-medium hover:underline hover:text-cyan-400 flex items-center gap-1">
            View all services
        </a>
      </div>
    </Card>
  );
};

export default RecentServicesWidget;
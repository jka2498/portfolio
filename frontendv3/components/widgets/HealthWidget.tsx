import React from 'react';
import Card from '../Card';
import { CheckCircle2, Calendar } from 'lucide-react';

const HealthWidget: React.FC = () => {
  return (
    <Card title="Cloud Health (Bio)" className="h-full">
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-gray-700">
            <span className="text-sm text-gray-300">Open issues</span>
            <span className="text-sm font-mono text-white">0 <span className="text-gray-500 text-xs ml-1">Past 7 days</span></span>
        </div>
        
        <div className="space-y-3">
             <div className="flex items-start gap-3">
                <div className="mt-1">
                    <CheckCircle2 size={16} className="text-green-500" />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-gray-200">System Operational</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        Backend Software Engineer with 5+ years of experience building, operating, and improving cloud‑native systems using Java, AWS, and Python. Strong focus on automation, production reliability, and ownership of critical backend services.
                    </p>
                </div>
             </div>

             <div className="flex items-start gap-3 mt-4">
                <div className="mt-1">
                    <Calendar size={16} className="text-gray-500" />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-gray-200">Scheduled Changes</h4>
                    <p className="text-xs text-gray-400 mt-1">
                        Recent certification: <span className="text-cyan-500 cursor-pointer hover:underline">AWS Certified Developer Associate</span>.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Upcoming certification: <span className="text-cyan-500 cursor-pointer hover:underline">AWS Certified AI Practioner</span>.
                    </p>
                </div>
             </div>
        </div>
      </div>
    </Card>
  );
};

export default HealthWidget;
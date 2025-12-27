import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SKILL_DATA } from '../../constants';
import Card from '../Card';

const CostExplorerWidget: React.FC = () => {
  return (
    <Card 
        title="Cost and usage (Skills)" 
        headerAction={
             <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></span>
                <span className="text-xs text-gray-400">Forecast</span>
             </div>
        }
    >
      <div className="h-full flex flex-col">
        <div className="mb-4 flex justify-between items-end">
            <div>
                <p className="text-xs text-gray-400 mb-1">Current proficiency score</p>
                <div className="text-2xl font-bold text-white tracking-tight">92.5%</div>
            </div>
            <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">Forecasted growth</p>
                <div className="text-lg font-bold text-green-400">+12%</div>
            </div>
        </div>

        <div className="h-[200px] w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SKILL_DATA} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#9ca3af', fontSize: 10 }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis 
                hide 
                domain={[0, 100]}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', fontSize: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="forecast" stackId="a" fill="rgba(59, 130, 246, 0.2)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="usage" stackId="b" radius={[2, 2, 0, 0]}>
                 {SKILL_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#60a5fa'} />
                 ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 bg-blue-900/10 border border-blue-900/30 p-2 rounded flex items-start gap-2">
            <div className="mt-0.5 text-blue-400">ⓘ</div>
            <p>Forecast predicts high demand for <span className="font-semibold text-blue-300">Generative AI</span> skills in the next quarter.</p>
        </div>
      </div>
    </Card>
  );
};

export default CostExplorerWidget;
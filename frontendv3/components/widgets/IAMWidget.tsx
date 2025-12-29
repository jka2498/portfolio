import React from 'react';
import Card from '../Card';
import { useCv } from '../../hooks/useCv';
import { Shield, Users, Key, AlertTriangle, Download, Linkedin, ExternalLink, Loader2 } from 'lucide-react';

const IAMWidget: React.FC = () => {
  const { cvUrl, loading, loadCvUrl } = useCv();

  const handleDownload = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (cvUrl) {
      return;
    }

    event.preventDefault();
    const url = await loadCvUrl();
    if (url) {
      window.open(url, '_blank', 'noreferrer');
    }
  };

  return (
    <Card 
        title="IAM Security (About)"
        headerAction={
            <a
                href={cvUrl || "#"}
                download={cvUrl ? undefined : "CV.pdf"} // If it's a signed URL, let browser handle headers, else fallback
                target="_blank"
                rel="noreferrer"
                onClick={handleDownload}
                className={`flex items-center gap-1.5 bg-[#161e2d] hover:bg-[#232f3e] text-gray-300 hover:text-white text-xs font-bold py-1.5 px-3 rounded border border-gray-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Download CV"
                aria-disabled={loading}
            >
                {loading ? <Loader2 size={12} className="animate-spin" /> : <Download size={15} />}
                <span>CV Report</span>
            </a>
        }
    >
      <div className="space-y-4">
        
        <div className="flex items-center gap-4 bg-[#0f1117] p-3 rounded border border-gray-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                JA
            </div>
            <div>
                <div className="text-sm font-bold text-white">Jan Andrzejczyk</div>
                <div className="text-xs text-gray-400">Account ID: 11-2345-6789</div>
            </div>
            <div className="ml-auto text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-800">
                Active
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1f2937] p-3 rounded border border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                    <Shield size={14} className="text-green-500" />
                    <span className="text-xs text-gray-400">Certifications</span>
                </div>
                <div className="font-semibold text-sm text-green-400">AWS Certified</div>
            </div>
            <div className="bg-[#1f2937] p-3 rounded border border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                    <Key size={14} className="text-yellow-500" />
                    <span className="text-xs text-gray-400">Access Keys</span>
                </div>
                <div className="font-semibold text-sm text-white">Rotated 7d ago</div>
            </div>
        </div>

        <div className="pt-2 border-t border-slate-700">
             <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">User Groups (Focus Areas)</h4>
             <ul className="space-y-1">
                <li className="flex items-center gap-2 text-sm text-cyan-500 hover:underline cursor-pointer">
                    <Users size={14} className="text-gray-500" /> Cloud-Architecture
                </li>
                <li className="flex items-center gap-2 text-sm text-cyan-500 hover:underline cursor-pointer">
                    <Users size={14} className="text-gray-500" /> Backend-Engineering
                </li>
                <li className="flex items-center gap-2 text-sm text-cyan-500 hover:underline cursor-pointer">
                    <Users size={14} className="text-gray-500" /> Reliability-Engineering
                </li>
             </ul>
        </div>
        
        <div className="pt-2 border-t border-slate-700">
             <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Federated Identities</h4>
             <a href="https://www.linkedin.com/in/jan-andrzejczyk-61ba6012a/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded hover:bg-[#1f2937] transition-colors group cursor-pointer border border-transparent hover:border-slate-600">
                <div className="flex items-center gap-2">
                    <Linkedin size={16} className="text-blue-500" />
                    <span className="text-sm text-gray-300 group-hover:text-white">LinkedIn</span>
                </div>
                <ExternalLink size={12} className="text-gray-500 group-hover:text-cyan-500" />
             </a>
        </div>

        <div className="flex items-start gap-2 bg-yellow-900/10 border border-yellow-800/30 p-2 rounded text-xs text-yellow-500">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <p>
                Root user has open-to-work permissions enabled. Contact{' '}
                <a
                    href="mailto:jkandrzej@googlemail.com"
                    className="underline hover:text-yellow-300"
                >
                    jkandrzej@googlemail.com
                </a>
                .
            </p>
        </div>
      </div>
    </Card>
  );
};

export default IAMWidget;

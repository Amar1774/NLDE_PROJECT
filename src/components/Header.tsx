import React from 'react';
import { Brain, Download, RefreshCw, GraduationCap, FileCode, CheckCircle2 } from 'lucide-react';
import { downloadProjectZip } from '../utils/zipExport.ts';

interface HeaderProps {
  onRetrain: () => void;
  isTraining: boolean;
  onNavigate: (page: string) => void;
  currentPage: string;
  totalRecords: number;
}

export const Header: React.FC<HeaderProps> = ({
  onRetrain,
  isTraining,
  onNavigate,
  currentPage,
  totalRecords
}) => {
  const [downloadingZip, setDownloadingZip] = React.useState(false);

  const handleDownload = async () => {
    setDownloadingZip(true);
    try {
      await downloadProjectZip();
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Title & Badge */}
        <div className="flex items-start md:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
                College ML Micro-Project
              </span>
              <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Pima Dataset ({totalRecords} samples)
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5 leading-snug">
              Build a Multilayer Perceptron Neural Network for Classification
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigate('report')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
              currentPage === 'report'
                ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                : 'bg-indigo-950/80 hover:bg-indigo-900 text-cyan-200 border-indigo-700/60 shadow-sm'
            }`}
            title="View & Download College Micro-Project Report in exact CMRIT / JNTUH format"
          >
            <span className="text-sm">📄</span>
            College Report (.docx & PDF)
          </button>

          <button
            onClick={() => onNavigate('viva')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Faculty Viva Preparation Guide"
          >
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Faculty</span> Viva Guide
          </button>

          <button
            onClick={() => onNavigate('python')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="View Python Source Files"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            Python Code
          </button>

          <button
            onClick={onRetrain}
            disabled={isTraining}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white transition ${
              isTraining
                ? 'bg-cyan-800 cursor-not-allowed opacity-75'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-md shadow-cyan-600/20'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTraining ? 'animate-spin' : ''}`} />
            {isTraining ? 'Training...' : 'Train Model'}
          </button>

          <button
            onClick={handleDownload}
            disabled={downloadingZip}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition"
            title="Download full project zip with app.py, requirements.txt, run.bat, etc."
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span> ZIP
          </button>
        </div>
      </div>
    </header>
  );
};

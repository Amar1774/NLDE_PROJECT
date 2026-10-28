import React, { useState } from 'react';
import {
  FileCode2,
  Download,
  Copy,
  Check,
  Terminal,
  FolderTree,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { PROJECT_SOURCE_FILES } from '../../data/projectFiles.ts';
import { downloadSingleFile, downloadProjectZip } from '../../utils/zipExport.ts';

export const PythonFilesPage: React.FC = () => {
  const fileNames = [
    'app.py',
    'model_utils.py',
    'requirements.txt',
    'run.bat',
    'run.sh',
    'README.md',
    'diabetes.csv'
  ];

  const [selectedFile, setSelectedFile] = useState<string>('app.py');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const curContent = PROJECT_SOURCE_FILES[selectedFile] || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(curContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await downloadProjectZip();
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <FileCode2 className="w-4 h-4" />
            Stage 8: Standalone Python Streamlit Project & Source Code
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Complete Standalone Project Files & Windows 11 Execution
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Download the complete, self-contained Python project package or inspect the code directly below.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/25 transition shrink-0"
        >
          <Download className="w-4 h-4" />
          {isZipping ? 'Packaging ZIP Archive...' : 'Download Full Project ZIP (.zip)'}
        </button>
      </div>

      {/* Windows 11 + VS Code Step-by-Step Setup Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
          <Laptop className="w-5 h-5" />
          <h3>Step-by-Step Guide: Running on Windows 11 in VS Code</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Method 1: 1-Click Batch Runner */}
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
            <div className="font-bold text-cyan-300 text-sm">
              Method A: 1-Click Automated Launcher (Fastest)
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
              <li>Download and extract the <strong>ZIP archive</strong>.</li>
              <li>Ensure Python 3.10+ is installed (with <em>'Add to PATH'</em> enabled).</li>
              <li>Double-click <code className="text-cyan-400 font-mono">run.bat</code>.</li>
              <li>The script automatically creates <code className="text-slate-400">venv</code>, installs dependencies, and opens the dashboard in your default browser at <code className="text-emerald-400">http://localhost:8501</code>!</li>
            </ol>
          </div>

          {/* Method 2: Manual Terminal in VS Code */}
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
            <div className="font-bold text-blue-300 text-sm">
              Method B: VS Code Integrated Terminal
            </div>
            <div className="space-y-1 text-slate-300">
              <p>In VS Code, press <code className="text-cyan-400">Ctrl + `</code> to open terminal, then run:</p>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-200 space-y-1 overflow-x-auto">
                <div>python -m venv venv</div>
                <div>venv\Scripts\activate</div>
                <div>pip install -r requirements.txt</div>
                <div>streamlit run app.py</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Source Code Viewer Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* File Tabs Header */}
        <div className="flex items-center justify-between bg-slate-950 border-b border-slate-800 px-4 py-2 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {fileNames.map(file => (
              <button
                key={file}
                onClick={() => setSelectedFile(file)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                  selectedFile === file
                    ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {file}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <button
              onClick={() => downloadSingleFile(selectedFile, curContent)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-xs font-semibold border border-cyan-800 transition"
              title={`Download ${selectedFile}`}
            >
              <Download className="w-3.5 h-3.5" />
              Download {selectedFile}
            </button>
          </div>
        </div>

        {/* File Content Preview */}
        <div className="p-4 bg-[#0a0f1d] max-h-[550px] overflow-y-auto">
          <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre select-text">
            {curContent}
          </pre>
        </div>
      </div>
    </div>
  );
};

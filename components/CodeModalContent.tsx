import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ComputerTerminal01Icon,
  CheckmarkCircle02Icon,
  Copy01Icon
} from '@hugeicons/core-free-icons';

interface CodeModalContentProps {
  codeTab: 'usage' | 'component' | 'vanilla';
  codeContent: string;
  copied: boolean;
  onCopyCode: () => void;
}

const CodeModalContent: React.FC<CodeModalContentProps> = ({ codeTab, codeContent, copied, onCopyCode }) => {
  const [dependencyCopied, setDependencyCopied] = useState(false);

  const handleCopyDependency = async () => {
    try {
      await navigator.clipboard.writeText('npm install ogl');
      setDependencyCopied(true);
      setTimeout(() => setDependencyCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex-1 overflow-auto p-0 custom-scrollbar bg-[#0a0a0a]">
      <div className="p-4 space-y-6">
        {/* Installation Instructions */}
        <div className="p-4 rounded-lg bg-white/10 border border-white/10">
          <h3 className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
            <HugeiconsIcon icon={ComputerTerminal01Icon} size={16} />
            Installation
          </h3>
          <div className="flex items-center justify-between bg-black/50 rounded border border-white/10 px-3 py-2">
            <code className="text-xs sm:text-sm font-mono text-white/80">npm install ogl</code>
            <button 
              onClick={handleCopyDependency}
              className="text-white/70 hover:text-white transition-colors p-1"
              title="Copy command"
            >
              {dependencyCopied ? <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} /> : <HugeiconsIcon icon={Copy01Icon} size={16} />}
            </button>
          </div>
        </div>

        {/* Main Code Block */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-400">
              {codeTab === 'usage' 
                ? '1. Copy this snippet into your project.' 
                : '2. Create a file named Grainient.tsx and paste the source code.'}
            </p>
          </div>
          
          <div className="relative group">
            <pre className="text-xs sm:text-sm font-mono text-white/80 bg-black p-4 rounded-lg border border-white/10 overflow-x-auto selection:bg-white/20">
              {codeContent}
            </pre>
            <button
              onClick={onCopyCode}
              className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 text-white rounded-md backdrop-blur-sm transition-all border border-white/10 opacity-0 group-hover:opacity-100 focus:opacity-100"
              title="Copy to clipboard"
            >
              {copied ? <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-white/80" /> : <HugeiconsIcon icon={Copy01Icon} size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeModalContent;

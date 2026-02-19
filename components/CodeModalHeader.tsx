import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  CodeIcon,
  SourceCodeIcon,
  DocumentCodeIcon,
  CodeSquareIcon,
} from '@hugeicons/core-free-icons';

interface CodeModalHeaderProps {
  onClose: () => void;
  codeTab: 'usage' | 'component' | 'vanilla';
  setCodeTab: (tab: 'usage' | 'component' | 'vanilla') => void;
  setCopied: (copied: boolean) => void;
}

const CodeModalHeader: React.FC<CodeModalHeaderProps> = ({ onClose, codeTab, setCodeTab, setCopied }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <HugeiconsIcon icon={CodeIcon} size={20} className="text-white" />
          Get Code
        </h2>
        
        {/* Tabs */}
        <div className="flex bg-black/50 rounded-lg p-1 border border-white/10">
          <button
            onClick={() => { setCodeTab('usage'); setCopied(false); }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${
              codeTab === 'usage' 
                ? 'bg-white/20 text-white' 
                : 'text-white/50 hover:text-white hover:bg-white/10'
            }`}
          >
            <HugeiconsIcon icon={SourceCodeIcon} size={16} />
            Usage
          </button>
          <button
            onClick={() => { setCodeTab('component'); setCopied(false); }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${
              codeTab === 'component' 
                ? 'bg-white/20 text-white' 
                : 'text-white/50 hover:text-white hover:bg-white/10'
            }`}
          >
            <HugeiconsIcon icon={DocumentCodeIcon} size={16} />
            Grainient.tsx
          </button>
          <button
            onClick={() => { setCodeTab('vanilla'); setCopied(false); }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${
              codeTab === 'vanilla' 
                ? 'bg-white/20 text-white' 
                : 'text-white/50 hover:text-white hover:bg-white/10'
            }`}
          >
            <HugeiconsIcon icon={CodeSquareIcon} size={16} />
            Vanilla
          </button>
        </div>
      </div>

      <button 
        onClick={onClose} 
        className="text-white/50 hover:text-white transition-colors p-1"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={20}/>
      </button>
    </div>
  );
};

export default CodeModalHeader;

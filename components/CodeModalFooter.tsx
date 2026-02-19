import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle02Icon, Copy01Icon } from '@hugeicons/core-free-icons';

interface CodeModalFooterProps {
  onClose: () => void;
  onCopyCode: () => void;
  copied: boolean;
}

const CodeModalFooter: React.FC<CodeModalFooterProps> = ({ onClose, onCopyCode, copied }) => {
  return (
    <div className="p-4 bg-white/5 flex justify-end gap-3">
      <button 
        onClick={onClose}
        className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
      >
        Close
      </button>
      <button 
        onClick={onCopyCode}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all border border-white/10"
      >
        {copied ? <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} /> : <HugeiconsIcon icon={Copy01Icon} size={16} />}
        {copied ? 'Copied!' : 'Copy Code'}
      </button>
    </div>
  );
};

export default CodeModalFooter;

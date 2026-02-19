import React, { useState } from 'react';
import { GrainientProps } from './Grainient';
import { GRAINIENT_SOURCE } from '../constants/code-snippets';
import { getUsageCode, getVanillaCode } from '../utils/codeGenerators';
import CodeModalHeader from './CodeModalHeader';
import CodeModalContent from './CodeModalContent';
import CodeModalFooter from './CodeModalFooter';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GrainientProps;
}

const CodeModal: React.FC<CodeModalProps> = ({ isOpen, onClose, config }) => {
  const [codeTab, setCodeTab] = useState<'usage' | 'component' | 'vanilla'>('usage');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getCodeContent = () => {
    if (codeTab === 'usage') return getUsageCode(config);
    if (codeTab === 'component') return GRAINIENT_SOURCE;
    return getVanillaCode(config);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(getCodeContent());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#111] rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        <CodeModalHeader 
          onClose={onClose} 
          codeTab={codeTab} 
          setCodeTab={setCodeTab} 
          setCopied={setCopied}
        />
        
        <CodeModalContent 
          codeTab={codeTab} 
          codeContent={getCodeContent()} 
          copied={copied} 
          onCopyCode={handleCopyCode} 
        />

        <CodeModalFooter 
          onClose={onClose} 
          onCopyCode={handleCopyCode} 
          copied={copied} 
        />
      </div>
    </div>
  );
};

export default CodeModal;

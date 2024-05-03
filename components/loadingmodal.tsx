// Modal.tsx
import React from 'react';
import CustomLoader from './CustomLoader';
import { Loader2 } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
}

const LaodingModal: React.FC<ModalProps> = ({ isOpen }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-800 opacity-50"></div>
            <div className="flex items-center justify-center mb-4">
                <center><Loader2 className="animate-spin" size={70}/></center>
            </div>
        </div>
      )}
    </>
  );
};

export default LaodingModal;

import React from 'react';
import { X } from 'lucide-react';
import QuizForm from './lp/QuizForm';

interface QuizModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#0f152a]/90 backdrop-blur-md transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-[#0b0f1e] rounded-[2rem] w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl transform transition-all animate-fade-in-up border border-white/10 scrollbar-hide">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-full transition-colors backdrop-blur-sm"
                    aria-label="Sair"
                >
                    <X size={24} />
                </button>

                <div className="pt-8 sm:pt-0">
                    <QuizForm onComplete={onClose} />
                </div>
            </div>
        </div>
    );
};

export default QuizModal;

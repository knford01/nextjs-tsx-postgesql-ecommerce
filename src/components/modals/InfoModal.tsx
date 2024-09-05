import React, { useEffect } from "react";

interface InfoModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    h2_color: string; // Assuming this is a valid CSS color
    title: string;
    content: string;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onRequestClose, h2_color, title, content }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 top-[80px] bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
            <div className="bg-gray-200 rounded-lg max-w-lg w-full max-h-[calc(80vh)] mx-4 overflow-hidden flex flex-col" style={{ border: '3px solid white', marginTop: '2rem' }}>
                <div className="rounded-t-lg w-full" style={{ backgroundColor: h2_color }}>
                    <h2 className="text-xl font-bold text-white mb-2 p-2">{title}</h2>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                    <p className="modal-content">{content}</p>
                </div>
                <button onClick={onRequestClose} className="bg-red-500 text-white px-4 py-2 rounded transition-transform duration-300 hover:scale-105 mb-4 mx-auto">
                    Close
                </button>
            </div>
        </div>
    );
};

export default InfoModal;

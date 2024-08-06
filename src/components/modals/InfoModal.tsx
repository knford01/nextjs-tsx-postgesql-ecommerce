import React from "react";

interface InfoModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    h2_color: string; // Assuming this is a valid CSS color
    title: string;
    content: string;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onRequestClose, h2_color, title, content }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-20">

            <div className="bg-gray-200 rounded-lg" style={{ border: '3px solid white' }}>
                <div className="rounded-lg max-w-lg w-full text-center" style={{ backgroundColor: h2_color }}>
                    <h2 className="text-xl font-bold text-white mb-2 p-2">{title}</h2>
                </div>
                <div className="p-4 rounded-lg max-w-lg w-full text-center">
                    <p className="modal-content">{content}</p>
                    <button onClick={onRequestClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded transition-transform duration-300 hover:scale-105">
                        Close
                    </button>
                </div>
            </div>

        </div>
    );
};

export default InfoModal;

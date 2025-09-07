
import React, { useState, useEffect } from 'react';

interface TranscriptionDisplayProps {
  transcription: string;
  isLoading: boolean;
}

const CopyIcon = ({ copied }: { copied: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 ${copied ? 'scale-125 text-green-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {copied ? 
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /> : 
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        }
    </svg>
);


export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ transcription, isLoading }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const handleCopy = () => {
        if (transcription) {
            navigator.clipboard.writeText(transcription);
            setCopied(true);
        }
    };
    
  return (
    <div className="flex flex-col flex-grow h-full">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-teal-400">Transcription</h2>
            {transcription && (
                 <button
                    onClick={handleCopy}
                    className="flex items-center px-3 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors duration-200"
                >
                    <CopyIcon copied={copied}/>
                    <span className="ml-2 text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
            )}
        </div>
        <div className="relative flex-grow bg-gray-900/70 rounded-lg p-4 w-full h-64 lg:h-full border border-gray-700">
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/80 rounded-lg z-10">
                    <div className="w-12 h-12 border-4 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
                    <p className="mt-4 text-lg">Transcribing audio...</p>
                </div>
            )}
            {transcription ? (
                <p className="text-lg leading-relaxed whitespace-pre-wrap">{transcription}</p>
            ) : (
                !isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-lg">Your transcribed text will appear here.</p>
                    </div>
                )
            )}
        </div>
    </div>
  );
};


import React, { useRef, useState } from 'react';

interface FileUploaderProps {
  onAudioReady: (blob: Blob) => void;
  disabled: boolean;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


export const FileUploader: React.FC<FileUploaderProps> = ({ onAudioReady, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onAudioReady(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600";

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="audio/*"
        disabled={disabled}
      />
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-300 transition-colors duration-300 ${disabledClass}`}
      >
        <UploadIcon/>
        Upload Audio File
      </button>
      {fileName && <p className="mt-2 text-sm text-center text-gray-400 truncate">Selected: {fileName}</p>}
    </div>
  );
};

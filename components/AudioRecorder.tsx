
import React, { useState, useRef, useCallback, useEffect } from 'react';
// FIX: Import ErrorMessage component to resolve 'Cannot find name' error.
import { ErrorMessage } from './ErrorMessage';

interface AudioRecorderProps {
  onAudioReady: (blob: Blob) => void;
  disabled: boolean;
}

const MicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const StopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
  </svg>
);

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioReady, disabled }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  useEffect(() => {
      return () => {
          stopRecording();
      }
  }, [stopRecording]);

  const startRecording = async () => {
    setPermissionError(null);
    if (isRecording) {
      stopRecording();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onAudioReady(audioBlob);
        setIsRecording(false);
        // Stop all tracks on the stream to turn off the mic indicator
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setPermissionError('Microphone access was denied. Please allow microphone access in your browser settings.');
      setIsRecording(false);
    }
  };

  const buttonClass = isRecording 
    ? "bg-red-500 hover:bg-red-600" 
    : "bg-cyan-500 hover:bg-cyan-600";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {permissionError && <ErrorMessage message={permissionError} />}
      <button
        onClick={startRecording}
        disabled={disabled}
        className={`relative flex items-center justify-center w-24 h-24 rounded-full text-white shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-800 ${buttonClass} ${disabledClass}`}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
        {isRecording ? <StopIcon /> : <MicIcon />}
      </button>
      <p className={`mt-4 text-lg font-medium ${isRecording ? 'text-red-400 animate-pulse' : 'text-gray-300'}`}>
        {isRecording ? 'Recording...' : 'Click to Record'}
      </p>
    </div>
  );
};

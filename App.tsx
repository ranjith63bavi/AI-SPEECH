
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { AudioRecorder } from './components/AudioRecorder';
import { FileUploader } from './components/FileUploader';
import { TranscriptionDisplay } from './components/TranscriptionDisplay';
import { ErrorMessage } from './components/ErrorMessage';
import { LanguageSelector } from './components/LanguageSelector';
import { transcribeAudio } from './services/geminiService';
import { blobToBase64 } from './utils/audioUtils';
import { LANGUAGES } from './utils/languages';

const App: React.FC = () => {
  const [transcription, setTranscription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-US');

  const handleAudio = useCallback(async (audioBlob: Blob) => {
    setIsLoading(true);
    setError(null);
    setTranscription('');

    try {
      const mimeType = audioBlob.type;
      if (!mimeType.startsWith('audio/')) {
          throw new Error(`Unsupported file type: ${mimeType}. Please upload a valid audio file.`);
      }

      const base64Audio = await blobToBase64(audioBlob);
      const languageName = LANGUAGES[selectedLanguage as keyof typeof LANGUAGES];
      const result = await transcribeAudio(base64Audio, mimeType, languageName);
      setTranscription(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Transcription failed: ${err.message}`);
      } else {
        setError('An unknown error occurred during transcription.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedLanguage]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          <div className="lg:col-span-1 bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col items-center justify-center space-y-6">
            <h2 className="text-2xl font-bold text-center text-cyan-400">Get Started</h2>
            <p className="text-center text-gray-400">Select a language, then record or upload audio to transcribe.</p>
            <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                disabled={isLoading}
            />
            <AudioRecorder onAudioReady={handleAudio} disabled={isLoading} />
            <div className="flex items-center w-full">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="flex-shrink mx-4 text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>
            <FileUploader onAudioReady={handleAudio} disabled={isLoading} />
          </div>
          <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col">
             {error && <ErrorMessage message={error} />}
             <TranscriptionDisplay transcription={transcription} isLoading={isLoading} />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Powered by Gemini API. Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;

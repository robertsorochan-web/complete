import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Mic, Languages } from 'lucide-react';

const twiPhrases = {
  welcome: "Akwaaba! Yɛfrɛ wo kwan pa so.",
  yourScore: "Wo score ne",
  strength: "Wo strength ne",
  needsWork: "Deɛ ɛhia adwuma ne",
  actionTip: "Deɛ wobɛtumi ayɛ nnɛ",
  goodJob: "Wo yɛ adeɛ pa!",
  keepGoing: "Kɔ so ara!",
  health: "Wo apɔmuden",
  money: "Wo sika",
  team: "Wo team",
  systems: "Wo nhyehyɛe",
  vision: "Wo vision"
};

const VoiceNavigation = ({ text, autoPlay = false, language = 'en' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    return localStorage.getItem('akofa_voice_enabled') === 'true';
  });
  const [speechSupported, setSpeechSupported] = useState(false);
  const [selectedLang, setSelectedLang] = useState(language);

  useEffect(() => {
    setSpeechSupported('speechSynthesis' in window);
  }, []);

  useEffect(() => {
    if (autoPlay && voiceEnabled && text) {
      speak(text);
    }
  }, [autoPlay, text, voiceEnabled]);

  const speak = (textToSpeak) => {
    if (!speechSupported) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = selectedLang === 'tw' ? 'en-GH' : 'en-GH';
    utterance.rate = selectedLang === 'tw' ? 0.8 : 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const speakTwi = (key) => {
    if (twiPhrases[key]) {
      speak(twiPhrases[key]);
    }
  };

  const stopSpeaking = () => {
    if (speechSupported) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const toggleVoice = () => {
    const newValue = !voiceEnabled;
    setVoiceEnabled(newValue);
    localStorage.setItem('akofa_voice_enabled', newValue.toString());
    
    if (!newValue) {
      stopSpeaking();
    }
  };

  const toggleLanguage = () => {
    const newLang = selectedLang === 'en' ? 'tw' : 'en';
    setSelectedLang(newLang);
  };

  if (!speechSupported) return null;

  return (
    <div className="voice-navigation flex items-center gap-2">
      <button
        onClick={toggleLanguage}
        className="p-2 rounded-lg bg-slate-700 text-gray-400 hover:text-white transition"
        title={`Switch to ${selectedLang === 'en' ? 'Twi' : 'English'}`}
      >
        <Languages className="w-5 h-5" />
        <span className="text-xs ml-1">{selectedLang.toUpperCase()}</span>
      </button>
      
      <button
        onClick={toggleVoice}
        className={`p-2 rounded-lg transition ${
          voiceEnabled 
            ? 'bg-purple-600 text-white' 
            : 'bg-slate-700 text-gray-400 hover:text-white'
        }`}
        title={voiceEnabled ? 'Voice navigation enabled' : 'Enable voice navigation'}
      >
        {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>

      {voiceEnabled && text && (
        <button
          onClick={() => isPlaying ? stopSpeaking() : speak(text)}
          className={`p-2 rounded-lg transition ${
            isPlaying 
              ? 'bg-red-600 text-white animate-pulse' 
              : 'bg-slate-700 text-gray-400 hover:text-white hover:bg-slate-600'
          }`}
          title={isPlaying ? 'Stop speaking' : 'Read aloud'}
        >
          <Mic className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export { twiPhrases };

export const SpeakButton = ({ text, className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const speechSupported = 'speechSynthesis' in window;

  const speak = () => {
    if (!speechSupported) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GH';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  if (!speechSupported) return null;

  return (
    <button
      onClick={() => isPlaying ? stop() : speak()}
      className={`p-1.5 rounded-lg transition ${
        isPlaying 
          ? 'bg-purple-600 text-white' 
          : 'bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-700'
      } ${className}`}
      title={isPlaying ? 'Stop' : 'Listen'}
    >
      <Volume2 className="w-4 h-4" />
    </button>
  );
};

export default VoiceNavigation;

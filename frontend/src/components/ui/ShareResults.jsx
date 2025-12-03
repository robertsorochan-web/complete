import React, { useState } from 'react';
import { Share2, Copy, Check, Twitter, Linkedin, Mail } from 'lucide-react';
import { trackShare } from '../../utils/analytics';

const ShareResults = ({ assessmentData, purpose = 'personal' }) => {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { bioHardware = 5, internalOS = 5, culturalSoftware = 5, socialInstance = 5, consciousUser = 5 } = assessmentData || {};
  
  const allLayers = [bioHardware, internalOS, culturalSoftware, socialInstance, consciousUser];
  const avgScore = (allLayers.reduce((a, b) => a + b, 0) / allLayers.length).toFixed(1);

  const shareText = `I just completed my Akorfa Stack Assessment! My overall score is ${avgScore}/10. Discover what's holding you back and get actionable steps to fix it.`;
  const shareUrl = 'https://akorfafixit.netlify.app';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      trackShare('copy_link');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOnTwitter = () => {
    trackShare('twitter');
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    trackShare('linkedin');
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareViaEmail = () => {
    trackShare('email');
    const subject = encodeURIComponent('Check out my Akorfa Stack Assessment');
    const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition"
      >
        <Share2 className="w-4 h-4" />
        Share Results
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Share Your Results</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-900 rounded-lg p-4 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">{avgScore}/10</div>
                <div className="text-gray-400 text-sm">Your Overall Score</div>
              </div>
              <div className="grid grid-cols-5 gap-2 mt-4">
                {allLayers.map((score, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-lg font-bold text-purple-300">{score}</div>
                    <div className="text-xs text-gray-500">L{idx + 1}</div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-6">{shareText}</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={shareOnTwitter}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] rounded-lg font-medium transition"
              >
                <Twitter className="w-5 h-5" />
                Twitter
              </button>
              <button
                onClick={shareOnLinkedIn}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0A66C2] hover:bg-[#0958a8] rounded-lg font-medium transition"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={shareViaEmail}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition"
              >
                <Mail className="w-5 h-5" />
                Email
              </button>
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareResults;

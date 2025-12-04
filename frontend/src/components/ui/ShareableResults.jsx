import React, { useState } from 'react';
import { Share2, MessageCircle, Copy, Check, Printer, Download, Phone, Users } from 'lucide-react';

const ShareableResults = ({ assessmentData, purpose, userName, bottleneck, strength, avgScore }) => {
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const generateShareText = () => {
    const { bioHardware = 0, internalOS = 0, culturalSoftware = 0, socialInstance = 0, consciousUser = 0 } = assessmentData || {};
    
    const text = `
🎯 My Akↄfa Assessment Results

📊 Overall Score: ${avgScore}/10

💪 My Strength: ${strength}
⚠️ Area wey need work: ${bottleneck}

My Scores:
💰 Money/Resources: ${bioHardware}/10
👥 Team: ${internalOS}/10
⚙️ Systems: ${culturalSoftware}/10
📱 Communication: ${socialInstance}/10
🎯 Vision: ${consciousUser}/10

Try Akↄfa free: https://akofa-fixit.replit.app

#AkofaFixit #Ghana #SelfImprovement
    `.trim();
    
    return text;
  };

  const generateShortShareText = () => {
    return `I just check myself with Akↄfa! My score: ${avgScore}/10. My strength be ${strength}. Try am free: https://akofa-fixit.replit.app`;
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareViaSMS = () => {
    const text = encodeURIComponent(generateShortShareText());
    window.open(`sms:?body=${text}`, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = generateShareText();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="share-results space-y-3">
      <button
        onClick={shareViaWhatsApp}
        className="w-full py-4 bg-[#25D366] hover:bg-[#20BD5A] rounded-xl font-bold text-lg transition flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
      >
        <MessageCircle className="w-6 h-6" fill="white" />
        Share on WhatsApp
      </button>

      <button
        onClick={() => setShowOptions(!showOptions)}
        className="w-full py-2 text-gray-400 hover:text-white transition text-sm flex items-center justify-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        More sharing options
      </button>

      {showOptions && (
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={shareViaSMS}
              className="p-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition flex flex-col items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              <span className="text-xs font-medium">SMS</span>
            </button>

            <button
              onClick={copyToClipboard}
              className="p-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition flex flex-col items-center gap-2"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span className="text-xs font-medium">{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-3 bg-orange-600 hover:bg-orange-700 rounded-xl transition flex flex-col items-center gap-2"
            >
              <Printer className="w-5 h-5" />
              <span className="text-xs font-medium">Print</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-section, .print-section * {
            visibility: visible;
          }
          .print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
            color: black;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ShareableResults;

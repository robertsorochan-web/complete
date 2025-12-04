import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const FloatingWhatsAppButton = ({ phoneNumber = '+233000000000', message = "Hello! I need help with Akↄfa Fixit" }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setShowTooltip(false);
    setIsAnimating(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {showTooltip && (
        <div className="bg-white text-gray-800 rounded-lg shadow-xl p-4 max-w-[280px] relative animate-fade-in">
          <button 
            onClick={handleClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="text-sm font-medium mb-2">Need help? 👋</p>
          <p className="text-xs text-gray-600 mb-3">
            Chat with our support team on WhatsApp. We dey here to help you!
          </p>
          <button
            onClick={handleClick}
            className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition"
          >
            Start Chat
          </button>
        </div>
      )}
      
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className={`w-14 h-14 md:w-16 md:h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isAnimating ? 'animate-bounce-slow' : ''
        }`}
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-white" fill="white" />
      </button>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FloatingWhatsAppButton;

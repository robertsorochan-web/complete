import React, { useState } from 'react';
import { Share2, Copy, Check, Instagram, Facebook, MessageCircle } from 'lucide-react';

const templates = {
  newProduct: {
    name: 'New Product',
    templates: [
      {
        id: 'np1',
        platform: 'whatsapp',
        text: "🆕 NEW ARRIVAL! 🎉\n\nWe just got [PRODUCT NAME] in stock!\n\n✨ Features:\n• [Feature 1]\n• [Feature 2]\n• [Feature 3]\n\n💰 Price: GHS [PRICE]\n\n📍 Find us at [LOCATION]\n📞 Call/WhatsApp: [PHONE]\n\nFirst come, first served! 🏃‍♂️"
      },
      {
        id: 'np2',
        platform: 'instagram',
        text: "🆕 JUST IN! 🎉\n\n[PRODUCT NAME] now available!\n\nDM to order or visit us at [LOCATION]\n\n#NewArrival #GhanaBusiness #ShopLocal #[YourBusinessName]"
      }
    ]
  },
  promotion: {
    name: 'Sale/Promo',
    templates: [
      {
        id: 'pr1',
        platform: 'whatsapp',
        text: "🔥 SPECIAL OFFER! 🔥\n\n[X]% OFF on all [PRODUCTS]!\n\n⏰ Valid: [START DATE] - [END DATE]\n\n🏃‍♂️ Don't miss out!\n📍 Location: [ADDRESS]\n📞 WhatsApp: [PHONE]\n\nShare with friends! 👥"
      },
      {
        id: 'pr2',
        platform: 'facebook',
        text: "🎊 FLASH SALE! 🎊\n\nFor the next [X] days only!\n\nGet [DISCOUNT]% off when you buy [PRODUCT].\n\nUse code: [CODE] or mention this post!\n\nShare to help a friend save money! 💰"
      }
    ]
  },
  thankYou: {
    name: 'Thank You',
    templates: [
      {
        id: 'ty1',
        platform: 'whatsapp',
        text: "🙏 THANK YOU! 🙏\n\nDear [CUSTOMER NAME],\n\nThank you for your patronage! We appreciate you choosing us.\n\nYour support keeps us going. 💪\n\nSee you again soon!\n- [YOUR BUSINESS NAME]"
      },
      {
        id: 'ty2',
        platform: 'instagram',
        text: "Thank you for supporting our small business! 🙏❤️\n\nEvery purchase matters to us.\n\n#SupportSmallBusiness #GhanaBusiness #ThankYou #Grateful"
      }
    ]
  },
  holiday: {
    name: 'Holiday',
    templates: [
      {
        id: 'hd1',
        platform: 'whatsapp',
        text: "🎄 HAPPY [HOLIDAY]! 🎉\n\nFrom all of us at [BUSINESS NAME], we wish you and your family a blessed [HOLIDAY]!\n\n⏰ Holiday Hours:\n[DATE]: [HOURS]\n\nThank you for your support this year! 🙏"
      },
      {
        id: 'hd2',
        platform: 'facebook',
        text: "Wishing everyone a wonderful [HOLIDAY]! 🎉\n\nWe're grateful for your continued support.\n\nStay blessed! ✨\n\n#Happy[Holiday] #GhanaBusiness #Blessed"
      }
    ]
  },
  reminder: {
    name: 'Reminder',
    templates: [
      {
        id: 'rm1',
        platform: 'whatsapp',
        text: "⏰ REMINDER ⏰\n\nDon't forget! [EVENT/PROMOTION] ends [DATE]!\n\n🏃‍♂️ Visit us before time runs out!\n\n📍 [LOCATION]\n📞 [PHONE]"
      }
    ]
  }
};

const SocialMediaTemplates = () => {
  const [selectedCategory, setSelectedCategory] = useState('newProduct');
  const [copiedId, setCopiedId] = useState(null);
  const [customText, setCustomText] = useState('');

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const shareViaWhatsApp = (text) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'facebook': return <Facebook className="w-4 h-4" />;
      case 'whatsapp': return <MessageCircle className="w-4 h-4" />;
      default: return <Share2 className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'instagram': return 'text-pink-400';
      case 'facebook': return 'text-blue-400';
      case 'whatsapp': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
          <Share2 className="w-5 h-5 text-pink-400" />
        </div>
        <div>
          <h3 className="font-bold text-white">Social Media Templates</h3>
          <p className="text-sm text-gray-400">Ready-to-use posts for your business</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {Object.entries(templates).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              selectedCategory === key 
                ? 'bg-pink-600 text-white' 
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {templates[selectedCategory].templates.map(template => (
          <div key={template.id} className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
            <div className="flex items-center justify-between mb-2">
              <div className={`flex items-center gap-2 ${getPlatformColor(template.platform)}`}>
                {getPlatformIcon(template.platform)}
                <span className="text-sm font-medium capitalize">{template.platform}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(template.text, template.id)}
                  className="p-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition"
                  title="Copy"
                >
                  {copiedId === template.id ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-300" />
                  )}
                </button>
                {template.platform === 'whatsapp' && (
                  <button
                    onClick={() => shareViaWhatsApp(template.text)}
                    className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
                    title="Share on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans bg-slate-800/50 rounded-lg p-3 max-h-32 overflow-y-auto">
              {template.text}
            </pre>
            <p className="text-xs text-gray-500 mt-2">
              💡 Replace [BRACKETS] with your information
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-purple-900/20 rounded-xl p-4 border border-purple-500/30">
        <h4 className="font-semibold text-purple-400 mb-2">Tips for Social Media Success</h4>
        <div className="text-sm text-gray-300 space-y-1">
          <p>• Post at least 3 times per week</p>
          <p>• Use good photos of your products</p>
          <p>• Reply to comments quickly</p>
          <p>• Share customer testimonials</p>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaTemplates;

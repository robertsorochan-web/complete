import React, { useState, useEffect } from 'react';
import { ClipboardList, Check, Circle, Printer, ChevronDown, ChevronUp, FileText } from 'lucide-react';

const checklistTemplates = {
  businessRegistration: {
    title: 'Business Registration Checklist',
    icon: '📋',
    description: 'Steps to register your business for Ghana',
    items: [
      { id: 1, text: 'Choose your business name', tip: 'Check if name available at RGD' },
      { id: 2, text: 'Decide business structure (Sole Proprietor, Partnership, Limited Company)', tip: 'Sole proprietor easiest for small business' },
      { id: 3, text: 'Get forms from Registrar General Department (RGD)', tip: 'Also available online at rgd.gov.gh' },
      { id: 4, text: 'Fill registration forms', tip: 'Bring ID and passport photos' },
      { id: 5, text: 'Pay registration fee', tip: 'Fee depend on business type' },
      { id: 6, text: 'Get your Business Registration Certificate', tip: 'Usually ready in 5-10 working days' },
      { id: 7, text: 'Apply for TIN (Tax Identification Number) at GRA', tip: 'Need this for tax and contracts' },
      { id: 8, text: 'Open business bank account', tip: 'Bring certificate and TIN' }
    ]
  },
  loanApplication: {
    title: 'Loan Application Checklist',
    icon: '🏦',
    description: 'What you need to apply for business loan',
    items: [
      { id: 1, text: 'Business Registration Certificate', tip: 'Certified copy or original' },
      { id: 2, text: 'TIN Certificate', tip: 'From Ghana Revenue Authority' },
      { id: 3, text: 'Valid ID (Ghana Card, Passport, or Voter ID)', tip: 'Must not be expired' },
      { id: 4, text: 'Proof of address (Utility bill)', tip: 'Not more than 3 months old' },
      { id: 5, text: 'Business plan or proposal', tip: 'Explain what you go use money for' },
      { id: 6, text: 'Bank statements (6-12 months)', tip: 'Shows your business transactions' },
      { id: 7, text: 'Financial records (Sales, Expenses)', tip: 'Basic records if you no get formal accounts' },
      { id: 8, text: 'Collateral documents (if required)', tip: 'Land documents, car papers, etc.' },
      { id: 9, text: 'Guarantor information', tip: 'Usually need 2 guarantors' },
      { id: 10, text: 'Passport photographs', tip: '2-4 recent photos' }
    ]
  },
  taxCompliance: {
    title: 'Tax Compliance Checklist',
    icon: '📊',
    description: 'Keep your business tax compliant',
    items: [
      { id: 1, text: 'Register for TIN at GRA', tip: 'Mandatory for all businesses' },
      { id: 2, text: 'Determine your tax category', tip: 'Based on turnover size' },
      { id: 3, text: 'Keep daily sales records', tip: 'Use simple exercise book or app' },
      { id: 4, text: 'Keep receipts for all expenses', tip: 'For deductions and proof' },
      { id: 5, text: 'File quarterly returns (if applicable)', tip: 'For VAT registered businesses' },
      { id: 6, text: 'Pay presumptive tax (if small business)', tip: 'Quarterly payment to GRA' },
      { id: 7, text: 'File annual tax returns', tip: 'By April 30 each year' },
      { id: 8, text: 'Keep records for at least 6 years', tip: 'In case of audit' }
    ]
  },
  dailyOperations: {
    title: 'Daily Operations Checklist',
    icon: '☀️',
    description: 'Start your business day right',
    items: [
      { id: 1, text: 'Count cash from yesterday', tip: 'Verify against records' },
      { id: 2, text: 'Check stock levels', tip: 'Note what need restocking' },
      { id: 3, text: 'Clean and organize workspace', tip: 'First impression matter' },
      { id: 4, text: 'Review today\'s orders/appointments', tip: 'Prepare what you need' },
      { id: 5, text: 'Follow up on pending payments', tip: 'Morning best time to call' },
      { id: 6, text: 'Check prices of materials/supplies', tip: 'Market prices dey change' },
      { id: 7, text: 'Respond to customer messages', tip: 'Quick response = happy customer' },
      { id: 8, text: 'Record all sales today', tip: 'Don\'t leave for tomorrow' }
    ]
  }
};

const BusinessChecklists = () => {
  const [checklists, setChecklists] = useState(() => {
    const saved = localStorage.getItem('akofa_checklists');
    return saved ? JSON.parse(saved) : {};
  });
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    localStorage.setItem('akofa_checklists', JSON.stringify(checklists));
  }, [checklists]);

  const toggleItem = (templateId, itemId) => {
    setChecklists(prev => {
      const currentItems = prev[templateId] || [];
      if (currentItems.includes(itemId)) {
        return { ...prev, [templateId]: currentItems.filter(id => id !== itemId) };
      }
      return { ...prev, [templateId]: [...currentItems, itemId] };
    });
  };

  const getProgress = (templateId, template) => {
    const completed = checklists[templateId]?.length || 0;
    return Math.round((completed / template.items.length) * 100);
  };

  const handlePrint = (templateId, template) => {
    const printContent = `
      <html>
        <head>
          <title>${template.title} - Akↄfa Fixit</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            .item { padding: 10px 0; border-bottom: 1px solid #eee; display: flex; gap: 10px; }
            .checkbox { width: 20px; height: 20px; border: 2px solid #333; }
            .tip { color: #666; font-size: 12px; margin-left: 30px; }
          </style>
        </head>
        <body>
          <h1>${template.icon} ${template.title}</h1>
          <p>${template.description}</p>
          ${template.items.map(item => `
            <div class="item">
              <div class="checkbox"></div>
              <div>
                <div>${item.text}</div>
                <div class="tip">Tip: ${item.tip}</div>
              </div>
            </div>
          `).join('')}
          <p style="margin-top: 20px; color: #666;">Generated by Akↄfa Fixit</p>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Business Checklists</h3>
            <p className="text-sm text-gray-400">Ready-to-use checklists for your business</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-700">
        {Object.entries(checklistTemplates).map(([templateId, template]) => {
          const isExpanded = expanded === templateId;
          const progress = getProgress(templateId, template);
          const completedItems = checklists[templateId] || [];
          
          return (
            <div key={templateId}>
              <button
                onClick={() => setExpanded(isExpanded ? null : templateId)}
                className="w-full p-4 text-left hover:bg-slate-700/50 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{template.icon}</span>
                    <div>
                      <div className="font-medium text-white">{template.title}</div>
                      <div className="text-sm text-gray-400">{template.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">{progress}%</div>
                      <div className="text-xs text-gray-500">{completedItems.length}/{template.items.length}</div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </div>
                <div className="mt-2 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </button>
              
              {isExpanded && (
                <div className="px-4 pb-4 space-y-2">
                  {template.items.map(item => {
                    const isChecked = completedItems.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleItem(templateId, item.id)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl transition text-left ${
                          isChecked 
                            ? 'bg-green-900/30 border border-green-500/30' 
                            : 'bg-slate-700/50 hover:bg-slate-700'
                        }`}
                      >
                        {isChecked ? (
                          <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <div className={isChecked ? 'text-green-400 line-through' : 'text-white'}>
                            {item.text}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">💡 {item.tip}</div>
                        </div>
                      </button>
                    );
                  })}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handlePrint(templateId, template)}
                      className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center justify-center gap-2 transition"
                    >
                      <Printer className="w-4 h-4" />
                      Print Checklist
                    </button>
                    <button
                      onClick={() => setChecklists(prev => ({ ...prev, [templateId]: [] }))}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessChecklists;

import React, { useState, useEffect } from 'react';
import { ClipboardCheck, CheckCircle, Circle, AlertTriangle, FileText, Building2 } from 'lucide-react';

const loanRequirements = {
  basic: [
    { id: 'id_card', text: 'Ghana Card or Valid ID', description: 'National ID, Passport, or Voter ID' },
    { id: 'proof_address', text: 'Proof of Address', description: 'Utility bill, rent receipt, or bank statement' },
    { id: 'passport_photo', text: 'Passport Photos', description: '2 recent passport-size photographs' },
    { id: 'phone', text: 'Active Phone Number', description: 'For verification and loan disbursement' }
  ],
  business: [
    { id: 'business_reg', text: 'Business Registration', description: 'Certificate of incorporation or business name registration' },
    { id: 'tin', text: 'TIN Certificate', description: 'Tax Identification Number from GRA' },
    { id: 'bank_statement', text: '6 Months Bank Statements', description: 'Shows your business cash flow' },
    { id: 'business_location', text: 'Business Location Proof', description: 'Rent agreement or proof of business premises' }
  ],
  financial: [
    { id: 'income_proof', text: 'Proof of Income', description: 'Pay slips, sales records, or audited accounts' },
    { id: 'collateral', text: 'Collateral Documents', description: 'Land title, car documents, or fixed deposit' },
    { id: 'guarantor', text: 'Guarantor Information', description: 'Someone who can vouch for you' },
    { id: 'business_plan', text: 'Simple Business Plan', description: 'What you go use the money for' }
  ]
};

const LoanChecklist = () => {
  const [checked, setChecked] = useState(() => {
    const saved = localStorage.getItem('akofa_loan_checklist');
    return saved ? JSON.parse(saved) : [];
  });
  const [loanType, setLoanType] = useState('business');

  useEffect(() => {
    localStorage.setItem('akofa_loan_checklist', JSON.stringify(checked));
  }, [checked]);

  const toggleItem = (id) => {
    setChecked(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const allItems = [...loanRequirements.basic, ...loanRequirements[loanType === 'personal' ? 'basic' : 'business'], ...loanRequirements.financial];
  const progress = (checked.length / allItems.length) * 100;
  const isReady = progress >= 75;

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
          <ClipboardCheck className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h3 className="font-bold text-white">Loan Application Checklist</h3>
          <p className="text-sm text-gray-400">Get ready to apply for loan</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Your Progress</span>
          <span className={`text-sm font-semibold ${isReady ? 'text-green-400' : 'text-yellow-400'}`}>
            {checked.length}/{allItems.length} ready
          </span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              isReady ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-yellow-500 to-orange-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        {isReady && (
          <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            You ready to apply for loan!
          </p>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            Basic Documents
          </h4>
          <div className="space-y-2">
            {loanRequirements.basic.map(item => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`w-full p-3 rounded-xl border flex items-start gap-3 transition text-left ${
                  checked.includes(item.id) 
                    ? 'bg-green-900/20 border-green-500/30' 
                    : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                }`}
              >
                {checked.includes(item.id) ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className={`font-medium ${checked.includes(item.id) ? 'text-green-400' : 'text-white'}`}>
                    {item.text}
                  </div>
                  <div className="text-xs text-gray-400">{item.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-400" />
            Business Documents
          </h4>
          <div className="space-y-2">
            {loanRequirements.business.map(item => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`w-full p-3 rounded-xl border flex items-start gap-3 transition text-left ${
                  checked.includes(item.id) 
                    ? 'bg-green-900/20 border-green-500/30' 
                    : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                }`}
              >
                {checked.includes(item.id) ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className={`font-medium ${checked.includes(item.id) ? 'text-green-400' : 'text-white'}`}>
                    {item.text}
                  </div>
                  <div className="text-xs text-gray-400">{item.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            Financial Documents
          </h4>
          <div className="space-y-2">
            {loanRequirements.financial.map(item => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`w-full p-3 rounded-xl border flex items-start gap-3 transition text-left ${
                  checked.includes(item.id) 
                    ? 'bg-green-900/20 border-green-500/30' 
                    : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                }`}
              >
                {checked.includes(item.id) ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className={`font-medium ${checked.includes(item.id) ? 'text-green-400' : 'text-white'}`}>
                    {item.text}
                  </div>
                  <div className="text-xs text-gray-400">{item.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-900/20 rounded-xl p-4 border border-blue-500/30">
        <h4 className="font-semibold text-blue-400 mb-2">Where to Apply</h4>
        <div className="text-sm text-gray-300 space-y-1">
          <p>• Banks: GCB, Ecobank, Fidelity, CalBank</p>
          <p>• Microfinance: Sinapi Aba, Opportunity Int'l</p>
          <p>• Mobile Loans: MTN Qwik Loan, Vodafone Cash Loan</p>
        </div>
      </div>
    </div>
  );
};

export default LoanChecklist;

import React, { useState } from 'react';
import { Calculator, HelpCircle, Info } from 'lucide-react';

const TaxCalculator = () => {
  const [income, setIncome] = useState('');
  const [businessType, setBusinessType] = useState('sole');
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);

  const calculateTax = () => {
    const monthlyIncome = parseFloat(income) || 0;
    const annualIncome = monthlyIncome * 12;
    
    let tax = 0;
    let bracket = '';
    
    if (annualIncome <= 4380) {
      tax = 0;
      bracket = 'No tax - Income too small';
    } else if (annualIncome <= 5280) {
      tax = (annualIncome - 4380) * 0.05;
      bracket = '5% bracket';
    } else if (annualIncome <= 6280) {
      tax = 45 + (annualIncome - 5280) * 0.10;
      bracket = '10% bracket';
    } else if (annualIncome <= 38280) {
      tax = 145 + (annualIncome - 6280) * 0.175;
      bracket = '17.5% bracket';
    } else if (annualIncome <= 158280) {
      tax = 5745 + (annualIncome - 38280) * 0.25;
      bracket = '25% bracket';
    } else {
      tax = 35745 + (annualIncome - 158280) * 0.30;
      bracket = '30% bracket';
    }

    const monthlyTax = tax / 12;
    const effectiveRate = annualIncome > 0 ? ((tax / annualIncome) * 100).toFixed(1) : 0;

    setResult({
      annualIncome,
      annualTax: tax.toFixed(2),
      monthlyTax: monthlyTax.toFixed(2),
      effectiveRate,
      bracket,
      takeHome: (monthlyIncome - monthlyTax).toFixed(2)
    });
    setShowResult(true);
  };

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <Calculator className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="font-bold text-white">Ghana Tax Calculator</h3>
          <p className="text-sm text-gray-400">Estimate your income tax</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Your Monthly Income (GHS)</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="e.g., 3000"
            className="w-full p-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Business Type</label>
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="w-full p-4 bg-slate-700 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="sole">Sole Proprietor (Self-employed)</option>
            <option value="employee">Employee (PAYE)</option>
            <option value="company">Registered Company</option>
          </select>
        </div>

        <button
          onClick={calculateTax}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-white transition"
        >
          Calculate My Tax
        </button>
      </div>

      {showResult && result && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">GHS {result.monthlyTax}</div>
              <div className="text-sm text-gray-400">Monthly Tax</div>
            </div>
            <div className="bg-green-900/30 rounded-xl p-4 text-center border border-green-500/30">
              <div className="text-2xl font-bold text-green-400">GHS {result.takeHome}</div>
              <div className="text-sm text-gray-400">Take Home</div>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Annual Income:</span>
              <span className="text-white">GHS {result.annualIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Annual Tax:</span>
              <span className="text-white">GHS {parseFloat(result.annualTax).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Effective Rate:</span>
              <span className="text-white">{result.effectiveRate}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Tax Bracket:</span>
              <span className="text-blue-400">{result.bracket}</span>
            </div>
          </div>

          <div className="bg-amber-900/20 rounded-xl p-4 border border-amber-500/30">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                This na estimate only. For accurate tax calculation, consult a tax professional or visit GRA office.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxCalculator;

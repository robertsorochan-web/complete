import React, { useRef } from 'react';
import { Printer, Download, FileText } from 'lucide-react';
import { getLayerConfig } from '../../config/purposeConfig';
import { getScoreEmoji, getScoreLabel } from '../../config/useCaseTemplates';

const PrintableReport = ({ assessmentData, purpose, userName, bottleneck, strength, actionTips }) => {
  const reportRef = useRef(null);
  const { bioHardware = 0, internalOS = 0, culturalSoftware = 0, socialInstance = 0, consciousUser = 0 } = assessmentData || {};
  
  const layers = getLayerConfig(purpose);
  const allScores = [bioHardware, internalOS, culturalSoftware, socialInstance, consciousUser];
  const avgScore = (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1);

  const handlePrint = () => {
    const printContent = reportRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Akↄfa Assessment Report - ${userName || 'User'}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px; 
              color: #333;
              line-height: 1.6;
            }
            .report-header { 
              text-align: center; 
              border-bottom: 2px solid #8B5CF6; 
              padding-bottom: 20px; 
              margin-bottom: 20px; 
            }
            .report-header h1 { color: #8B5CF6; margin-bottom: 5px; }
            .report-header p { color: #666; }
            .score-grid { 
              display: grid; 
              grid-template-columns: repeat(5, 1fr); 
              gap: 10px; 
              margin: 20px 0; 
            }
            .score-item { 
              text-align: center; 
              padding: 15px; 
              border: 1px solid #ddd; 
              border-radius: 8px; 
            }
            .score-item .emoji { font-size: 24px; }
            .score-item .label { font-size: 12px; color: #666; margin-top: 5px; }
            .score-item .value { font-size: 24px; font-weight: bold; color: #333; }
            .overall-score { 
              text-align: center; 
              background: #F3E8FF; 
              padding: 20px; 
              border-radius: 12px; 
              margin: 20px 0; 
            }
            .overall-score .value { font-size: 48px; font-weight: bold; color: #8B5CF6; }
            .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            .section h3 { color: #8B5CF6; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .strength { background: #DCFCE7; border-color: #22C55E; }
            .strength h3 { color: #22C55E; }
            .weakness { background: #FEE2E2; border-color: #EF4444; }
            .weakness h3 { color: #EF4444; }
            .action-list { list-style: none; padding-left: 0; }
            .action-list li { padding: 8px 0; border-bottom: 1px solid #eee; }
            .action-list li:before { content: "→ "; color: #8B5CF6; font-weight: bold; }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              padding-top: 20px; 
              border-top: 1px solid #ddd; 
              color: #666; 
              font-size: 12px; 
            }
            @media print { 
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const scoreLabels = {
    bioHardware: { name: 'Money/Resources', icon: '💰' },
    internalOS: { name: 'Team', icon: '👥' },
    culturalSoftware: { name: 'Systems', icon: '⚙️' },
    socialInstance: { name: 'Communication', icon: '📱' },
    consciousUser: { name: 'Vision', icon: '🎯' }
  };

  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div>
      <button
        onClick={handlePrint}
        className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition flex items-center justify-center gap-2"
      >
        <Printer className="w-5 h-5" />
        Print Report (PDF)
      </button>

      <div ref={reportRef} style={{ display: 'none' }}>
        <div className="report-header">
          <h1>Akↄfa Fixit Assessment Report</h1>
          <p>Prepared for: {userName || 'User'}</p>
          <p>Date: {date}</p>
        </div>

        <div className="overall-score">
          <div className="label">Overall Score</div>
          <div className="value">{avgScore}/10</div>
          <div className="emoji" style={{ fontSize: '32px' }}>{getScoreEmoji(parseFloat(avgScore))}</div>
          <div style={{ marginTop: '10px', color: '#666' }}>{getScoreLabel(parseFloat(avgScore))}</div>
        </div>

        <div className="score-grid">
          {Object.entries(scoreLabels).map(([key, label]) => {
            const score = assessmentData[key] || 0;
            return (
              <div key={key} className="score-item">
                <div className="emoji">{label.icon}</div>
                <div className="value">{score}</div>
                <div className="label">{label.name}</div>
                <div className="emoji">{getScoreEmoji(score)}</div>
              </div>
            );
          })}
        </div>

        <div className="section strength">
          <h3>💪 Your Strength</h3>
          <p>{strength}</p>
          <p style={{ marginTop: '10px', color: '#666' }}>
            This is your strongest area. Build on this foundation.
          </p>
        </div>

        <div className="section weakness">
          <h3>⚠️ Area That Needs Work</h3>
          <p>{bottleneck}</p>
          <p style={{ marginTop: '10px', color: '#666' }}>
            Focus on improving this area first - it will unlock growth in other areas.
          </p>
        </div>

        <div className="section">
          <h3>📋 Action Steps</h3>
          <ul className="action-list">
            {actionTips && actionTips.length > 0 ? (
              actionTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))
            ) : (
              <>
                <li>Focus on your weakest area first</li>
                <li>Set small, achievable goals for this week</li>
                <li>Track your progress daily</li>
                <li>Ask for help from people you trust</li>
                <li>Review and update your assessment weekly</li>
              </>
            )}
          </ul>
        </div>

        <div className="footer">
          <p>Generated by Akↄfa Fixit • akofa-fixit.replit.app</p>
          <p style={{ marginTop: '5px' }}>
            This report is for personal use only. Results are based on self-assessment and should not replace professional advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrintableReport;

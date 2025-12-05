const API_URL = import.meta.env.VITE_API_URL || '';

export const exportToJSON = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/export/json`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Export failed');
    
    const data = await response.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `akofa-export-${formatDate()}.json`);
    return true;
  } catch (err) {
    console.error('Export error:', err);
    return false;
  }
};

export const exportToCSV = async (token, dataType = 'checkins') => {
  try {
    const response = await fetch(`${API_URL}/api/export/csv?type=${dataType}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Export failed');
    
    const csvData = await response.text();
    const blob = new Blob([csvData], { type: 'text/csv' });
    downloadBlob(blob, `akofa-${dataType}-${formatDate()}.csv`);
    return true;
  } catch (err) {
    console.error('Export error:', err);
    return false;
  }
};

export const generateLocalExport = (userData) => {
  const exportData = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    user: {
      displayName: userData.displayName,
      purpose: userData.purpose,
      memberSince: userData.createdAt
    },
    assessments: userData.assessments || [],
    checkins: userData.checkins || [],
    moods: userData.moods || [],
    challenges: userData.challenges || [],
    streaks: userData.streaks || {},
    xp: userData.xp || 0,
    level: userData.level || 1
  };
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `akofa-backup-${formatDate()}.json`);
  return true;
};

export const convertToCSV = (data, headers) => {
  if (!data || data.length === 0) return '';
  
  const csvHeaders = headers || Object.keys(data[0]);
  const csvRows = data.map(row => 
    csvHeaders.map(header => {
      let cell = row[header];
      if (cell === null || cell === undefined) cell = '';
      if (typeof cell === 'object') cell = JSON.stringify(cell);
      cell = String(cell).replace(/"/g, '""');
      return `"${cell}"`;
    }).join(',')
  );
  
  return [csvHeaders.join(','), ...csvRows].join('\n');
};

export const generateCheckinCSV = (checkins) => {
  const headers = ['date', 'layer', 'score', 'notes', 'mood'];
  const csvData = convertToCSV(checkins.map(c => ({
    date: new Date(c.createdAt).toLocaleDateString(),
    layer: c.layer || 'general',
    score: c.score || 0,
    notes: c.notes || '',
    mood: c.mood || ''
  })), headers);
  
  const blob = new Blob([csvData], { type: 'text/csv' });
  downloadBlob(blob, `akofa-checkins-${formatDate()}.csv`);
  return true;
};

export const generateMoodCSV = (moods) => {
  const headers = ['date', 'time', 'mood', 'energy', 'notes'];
  const csvData = convertToCSV(moods.map(m => ({
    date: new Date(m.createdAt).toLocaleDateString(),
    time: new Date(m.createdAt).toLocaleTimeString(),
    mood: m.mood || '',
    energy: m.energy || '',
    notes: m.notes || ''
  })), headers);
  
  const blob = new Blob([csvData], { type: 'text/csv' });
  downloadBlob(blob, `akofa-moods-${formatDate()}.csv`);
  return true;
};

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const formatDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export const importFromJSON = async (file, token) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        const response = await fetch(`${API_URL}/api/import`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        if (response.ok) {
          resolve(await response.json());
        } else {
          reject(new Error('Import failed'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};

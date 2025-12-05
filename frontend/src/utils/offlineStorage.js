const DB_NAME = 'akofa-offline-db';
const DB_VERSION = 1;

const STORES = {
  CHECKINS: 'pendingCheckins',
  MOOD_ENTRIES: 'pendingMoodEntries',
  QUEST_PROGRESS: 'pendingQuestProgress',
  CHALLENGE_UPDATES: 'pendingChallengeUpdates',
  CACHED_DATA: 'cachedData'
};

let db = null;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      
      Object.values(STORES).forEach(storeName => {
        if (!database.objectStoreNames.contains(storeName)) {
          database.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        }
      });
    };
  });
};

export const savePendingAction = async (storeName, data) => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const item = {
      ...data,
      timestamp: new Date().toISOString(),
      synced: false
    };
    
    const request = store.add(item);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getPendingActions = async (storeName) => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result.filter(item => !item.synced));
    request.onerror = () => reject(request.error);
  });
};

export const markAsSynced = async (storeName, id) => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const getRequest = store.get(id);
    
    getRequest.onsuccess = () => {
      const item = getRequest.result;
      if (item) {
        item.synced = true;
        const updateRequest = store.put(item);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        resolve();
      }
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
};

export const deletePendingAction = async (storeName, id) => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const cacheData = async (key, data) => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORES.CACHED_DATA, 'readwrite');
    const store = transaction.objectStore(STORES.CACHED_DATA);
    
    const item = {
      id: key,
      data,
      cachedAt: new Date().toISOString()
    };
    
    const request = store.put(item);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getCachedData = async (key, maxAgeMs = 3600000) => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORES.CACHED_DATA, 'readonly');
    const store = transaction.objectStore(STORES.CACHED_DATA);
    const request = store.get(key);
    
    request.onsuccess = () => {
      const item = request.result;
      if (!item) {
        resolve(null);
        return;
      }
      
      const age = Date.now() - new Date(item.cachedAt).getTime();
      if (age > maxAgeMs) {
        resolve(null);
        return;
      }
      
      resolve(item.data);
    };
    request.onerror = () => reject(request.error);
  });
};

export const syncPendingActions = async (apiUrl, token) => {
  if (!navigator.onLine) return { synced: 0, failed: 0 };
  
  let synced = 0;
  let failed = 0;
  
  const storeConfigs = [
    { store: STORES.CHECKINS, endpoint: '/api/checkin' },
    { store: STORES.MOOD_ENTRIES, endpoint: '/api/mood/entry' },
    { store: STORES.QUEST_PROGRESS, endpoint: '/api/quests/update' },
    { store: STORES.CHALLENGE_UPDATES, endpoint: '/api/challenges/update' }
  ];
  
  for (const config of storeConfigs) {
    try {
      const pendingItems = await getPendingActions(config.store);
      
      for (const item of pendingItems) {
        try {
          const response = await fetch(`${apiUrl}${config.endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(item.data)
          });
          
          if (response.ok) {
            await deletePendingAction(config.store, item.id);
            synced++;
          } else {
            failed++;
          }
        } catch (err) {
          failed++;
        }
      }
    } catch (err) {
      console.error(`Error syncing ${config.store}:`, err);
    }
  }
  
  return { synced, failed };
};

export const saveCheckinOffline = (data) => savePendingAction(STORES.CHECKINS, { data });
export const saveMoodEntryOffline = (data) => savePendingAction(STORES.MOOD_ENTRIES, { data });
export const saveQuestProgressOffline = (data) => savePendingAction(STORES.QUEST_PROGRESS, { data });
export const saveChallengeUpdateOffline = (data) => savePendingAction(STORES.CHALLENGE_UPDATES, { data });

export const getPendingCount = async () => {
  let total = 0;
  for (const storeName of Object.values(STORES)) {
    if (storeName !== STORES.CACHED_DATA) {
      try {
        const items = await getPendingActions(storeName);
        total += items.length;
      } catch (err) {
        console.error(`Error getting pending count for ${storeName}:`, err);
      }
    }
  }
  return total;
};

export { STORES };

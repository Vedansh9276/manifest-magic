// Background service worker for Manifest V3 extension

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed');
    // Initialize storage with default values
    chrome.storage.local.set({ 
      enabled: true,
      clickCount: 0 
    });
  }
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_STATUS') {
    chrome.storage.local.get(['enabled', 'clickCount'], (result) => {
      sendResponse(result);
    });
    return true; // Keep message channel open for async response
  }
  
  if (message.type === 'TOGGLE_STATUS') {
    chrome.storage.local.get(['enabled'], (result) => {
      const newStatus = !result.enabled;
      chrome.storage.local.set({ enabled: newStatus }, () => {
        sendResponse({ enabled: newStatus });
      });
    });
    return true;
  }
  
  if (message.type === 'INCREMENT_CLICK') {
    chrome.storage.local.get(['clickCount'], (result) => {
      const newCount = (result.clickCount || 0) + 1;
      chrome.storage.local.set({ clickCount: newCount }, () => {
        sendResponse({ clickCount: newCount });
      });
    });
    return true;
  }
});

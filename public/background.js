// Profile Scout - Background Service Worker

// Store for extracted profile data
let profileData = null;
let lastExtractedUrl = null;

// Mock API endpoint
const MOCK_API_ENDPOINT = 'https://api.profilescout.example/profiles';

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Profile Scout installed');
    chrome.storage.local.set({ 
      extractionCount: 0,
      apiSendCount: 0,
      lastProfile: null
    });
  }
});

// Mock API call function
async function sendToApi(data) {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock successful response
  const mockResponse = {
    success: true,
    id: 'profile_' + Date.now(),
    message: 'Profile data received',
    timestamp: new Date().toISOString()
  };
  
  console.log('Mock API Response:', mockResponse);
  
  // Update send count
  chrome.storage.local.get(['apiSendCount'], (result) => {
    chrome.storage.local.set({ 
      apiSendCount: (result.apiSendCount || 0) + 1 
    });
  });
  
  return mockResponse;
}

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  
  if (message.type === 'PROFILE_EXTRACTED') {
    // Store the extracted profile data
    profileData = message.data;
    lastExtractedUrl = message.url;
    
    // Update extraction count
    chrome.storage.local.get(['extractionCount'], (result) => {
      chrome.storage.local.set({ 
        extractionCount: (result.extractionCount || 0) + 1,
        lastProfile: {
          data: profileData,
          url: lastExtractedUrl,
          timestamp: new Date().toISOString()
        }
      });
    });
    
    sendResponse({ success: true });
    return true;
  }
  
  if (message.type === 'GET_PROFILE_DATA') {
    chrome.storage.local.get(['lastProfile', 'extractionCount', 'apiSendCount'], (result) => {
      sendResponse({
        profile: result.lastProfile,
        stats: {
          extractionCount: result.extractionCount || 0,
          apiSendCount: result.apiSendCount || 0
        }
      });
    });
    return true;
  }
  
  if (message.type === 'EXTRACT_NOW') {
    // Trigger extraction from the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'EXTRACT_PROFILE' }, (response) => {
          if (chrome.runtime.lastError) {
            sendResponse({ success: false, error: 'Could not connect to page. Try refreshing.' });
          } else {
            sendResponse(response);
          }
        });
      } else {
        sendResponse({ success: false, error: 'No active tab found' });
      }
    });
    return true;
  }
  
  if (message.type === 'SEND_TO_API') {
    sendToApi(message.data)
      .then(response => sendResponse(response))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (message.type === 'CLEAR_DATA') {
    profileData = null;
    lastExtractedUrl = null;
    chrome.storage.local.set({ lastProfile: null }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

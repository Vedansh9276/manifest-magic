// Profile Scout - Background Service Worker

// GitHub API (free, no auth required for basic requests)
const GITHUB_API = 'https://api.github.com/users';

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Profile Scout installed');
    chrome.storage.local.set({ 
      extractionCount: 0,
      apiCallCount: 0,
      lastProfile: null,
      searchHistory: []
    });
  }
});

// Fetch real GitHub profile data
async function fetchGitHubProfile(username) {
  try {
    const response = await fetch(`${GITHUB_API}/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ProfileScout-Extension'
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found');
      }
      if (response.status === 403) {
        throw new Error('API rate limit exceeded. Try again later.');
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Also fetch repos count
    const reposResponse = await fetch(`${GITHUB_API}/${username}/repos?per_page=1`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ProfileScout-Extension'
      }
    });
    
    // Update API call count
    chrome.storage.local.get(['apiCallCount'], (result) => {
      chrome.storage.local.set({ 
        apiCallCount: (result.apiCallCount || 0) + 1 
      });
    });
    
    return {
      success: true,
      profile: {
        username: data.login,
        name: data.name,
        avatar: data.avatar_url,
        bio: data.bio,
        company: data.company,
        location: data.location,
        email: data.email,
        blog: data.blog,
        twitter: data.twitter_username,
        publicRepos: data.public_repos,
        publicGists: data.public_gists,
        followers: data.followers,
        following: data.following,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        profileUrl: data.html_url,
        hireable: data.hireable,
        type: data.type
      },
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  
  if (message.type === 'FETCH_GITHUB_PROFILE') {
    fetchGitHubProfile(message.username)
      .then(result => {
        if (result.success) {
          // Save to storage
          chrome.storage.local.get(['searchHistory'], (stored) => {
            const history = stored.searchHistory || [];
            history.unshift({
              ...result.profile,
              fetchedAt: result.fetchedAt
            });
            // Keep only last 20 searches
            chrome.storage.local.set({ 
              lastProfile: result,
              searchHistory: history.slice(0, 20)
            });
          });
        }
        sendResponse(result);
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep channel open for async
  }
  
  if (message.type === 'GET_STATS') {
    chrome.storage.local.get(['extractionCount', 'apiCallCount', 'searchHistory'], (result) => {
      sendResponse({
        extractionCount: result.extractionCount || 0,
        apiCallCount: result.apiCallCount || 0,
        historyCount: (result.searchHistory || []).length
      });
    });
    return true;
  }
  
  if (message.type === 'GET_HISTORY') {
    chrome.storage.local.get(['searchHistory'], (result) => {
      sendResponse({
        history: result.searchHistory || []
      });
    });
    return true;
  }
  
  if (message.type === 'GET_LAST_PROFILE') {
    chrome.storage.local.get(['lastProfile'], (result) => {
      sendResponse(result.lastProfile || null);
    });
    return true;
  }
  
  if (message.type === 'CLEAR_HISTORY') {
    chrome.storage.local.set({ 
      searchHistory: [],
      lastProfile: null
    }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (message.type === 'PROFILE_EXTRACTED') {
    // Update extraction count for page extractions
    chrome.storage.local.get(['extractionCount'], (result) => {
      chrome.storage.local.set({ 
        extractionCount: (result.extractionCount || 0) + 1 
      });
    });
    sendResponse({ success: true });
    return true;
  }
});

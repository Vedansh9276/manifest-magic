// Profile Scout - Content Script
// Extracts profile data from web pages

function extractProfileData() {
  const data = {
    // Page metadata
    pageTitle: document.title || '',
    pageUrl: window.location.href,
    domain: window.location.hostname,
    
    // Meta information
    metaDescription: document.querySelector('meta[name="description"]')?.content || '',
    metaAuthor: document.querySelector('meta[name="author"]')?.content || '',
    
    // Open Graph data (common on social profiles)
    ogTitle: document.querySelector('meta[property="og:title"]')?.content || '',
    ogDescription: document.querySelector('meta[property="og:description"]')?.content || '',
    ogImage: document.querySelector('meta[property="og:image"]')?.content || '',
    ogType: document.querySelector('meta[property="og:type"]')?.content || '',
    
    // Twitter Card data
    twitterTitle: document.querySelector('meta[name="twitter:title"]')?.content || '',
    twitterDescription: document.querySelector('meta[name="twitter:description"]')?.content || '',
    twitterImage: document.querySelector('meta[name="twitter:image"]')?.content || '',
    twitterCreator: document.querySelector('meta[name="twitter:creator"]')?.content || '',
    
    // Schema.org JSON-LD data
    schemaData: extractSchemaData(),
    
    // Common profile elements
    profileData: extractCommonProfileElements(),
    
    // Links
    socialLinks: extractSocialLinks(),
    
    // Extraction timestamp
    extractedAt: new Date().toISOString()
  };
  
  return data;
}

function extractSchemaData() {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  const schemas = [];
  
  scripts.forEach(script => {
    try {
      const data = JSON.parse(script.textContent);
      // Look for Person or Organization schemas
      if (data['@type'] === 'Person' || data['@type'] === 'Organization' || 
          data['@type'] === 'ProfilePage') {
        schemas.push(data);
      }
    } catch (e) {
      // Ignore parse errors
    }
  });
  
  return schemas;
}

function extractCommonProfileElements() {
  const profile = {};
  
  // Look for common profile patterns
  const nameSelectors = [
    'h1', '[class*="name"]', '[class*="title"]', 
    '[itemprop="name"]', '[data-testid*="name"]'
  ];
  
  for (const selector of nameSelectors) {
    const el = document.querySelector(selector);
    if (el && el.textContent.trim().length > 0 && el.textContent.trim().length < 100) {
      profile.name = el.textContent.trim();
      break;
    }
  }
  
  // Look for bio/description
  const bioSelectors = [
    '[class*="bio"]', '[class*="about"]', '[class*="description"]',
    '[itemprop="description"]'
  ];
  
  for (const selector of bioSelectors) {
    const el = document.querySelector(selector);
    if (el && el.textContent.trim().length > 0) {
      profile.bio = el.textContent.trim().substring(0, 500);
      break;
    }
  }
  
  // Look for avatar/profile image
  const imageSelectors = [
    '[class*="avatar"] img', '[class*="profile"] img', 
    '[itemprop="image"]', 'img[alt*="profile"]'
  ];
  
  for (const selector of imageSelectors) {
    const el = document.querySelector(selector);
    if (el && el.src) {
      profile.avatar = el.src;
      break;
    }
  }
  
  // Look for email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const pageText = document.body.innerText;
  const emails = pageText.match(emailRegex);
  if (emails && emails.length > 0) {
    profile.emails = [...new Set(emails)].slice(0, 5);
  }
  
  return profile;
}

function extractSocialLinks() {
  const socialPatterns = {
    twitter: /twitter\.com|x\.com/i,
    linkedin: /linkedin\.com/i,
    github: /github\.com/i,
    facebook: /facebook\.com/i,
    instagram: /instagram\.com/i,
    youtube: /youtube\.com/i
  };
  
  const links = {};
  const allLinks = document.querySelectorAll('a[href]');
  
  allLinks.forEach(link => {
    const href = link.href;
    for (const [platform, pattern] of Object.entries(socialPatterns)) {
      if (pattern.test(href) && !links[platform]) {
        links[platform] = href;
      }
    }
  });
  
  return links;
}

// Listen for extraction requests from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'EXTRACT_PROFILE') {
    try {
      const data = extractProfileData();
      
      // Send to background script
      chrome.runtime.sendMessage({
        type: 'PROFILE_EXTRACTED',
        data: data,
        url: window.location.href
      });
      
      sendResponse({ success: true, data: data });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }
  return true;
});

// Auto-extract on page load (optional - can be toggled)
// extractProfileData();

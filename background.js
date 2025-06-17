// Background script for X to Bird - Bring Back the Blue Bird

// Initialize extension on install
chrome.runtime.onInstalled.addListener(() => {
  // Set default values
  chrome.storage.sync.get(['enabled', 'useClassicBird', 'replaceFavicon', 'replaceText', 'customPageName', 'customLogoUrl'], (result) => {
    const defaults = {
      enabled: true,
      useClassicBird: true,
      replaceFavicon: true,
      replaceText: false,
      replaceUrl: false,
      customPageName: 'Twitter',
      customLogoUrl: ''
    };
    
    // Only set values that are undefined
    const toSet = {};
    Object.keys(defaults).forEach(key => {
      if (result[key] === undefined) {
        toSet[key] = defaults[key];
      }
    });
    
    if (Object.keys(toSet).length > 0) {
      chrome.storage.sync.set(toSet);
    }
  });
});

// Handle tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    if (tab.url.includes('x.com') || tab.url.includes('twitter.com')) {
      // Content script will be automatically injected based on manifest
      // This is just for logging or additional logic if needed
      console.log('X/Twitter page detected:', tab.url);
    }
  }
});


// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getConfig') {
    chrome.storage.sync.get(['enabled', 'customPageName', 'customLogoUrl'], (result) => {
      sendResponse(result);
    });
    return true; // Keep message channel open for async response
  }
});
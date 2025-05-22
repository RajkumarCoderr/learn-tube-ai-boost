
// Listen for installation
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onInstalled) {
  chrome.runtime.onInstalled.addListener(() => {
    console.log('YouTube Learner Extension installed');
  });
}

// Listen for tab updates
if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.onUpdated) {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url?.includes('youtube.com/watch')) {
      // Send a message to the content script
      chrome.tabs.sendMessage(tabId, {
        type: 'NEW_VIDEO',
        videoId: new URL(tab.url).searchParams.get('v')
      });
    }
  });
}

export {}; // Adding this to make TypeScript treat this as a module

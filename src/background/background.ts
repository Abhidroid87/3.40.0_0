import { handleAuthMessage } from './messageHandlers/auth';

console.log('Background script loaded');

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  
  // Initialize storage with default values
  const defaultSettings = {
    tasksEnabled: true,
    weatherEnabled: true,
    newsEnabled: true,
    theme: 'light',
    notifications: true
  };
  
  chrome.storage.sync.get(defaultSettings, (settings) => {
    console.log('Settings initialized:', settings);
  });
});

// Listen for side panel toggle action
if (chrome.action && chrome.action.onClicked) {
  chrome.action.onClicked.addListener((tab) => {
    console.log('Extension icon clicked');
    try {
      chrome.sidePanel.open({ windowId: tab.windowId });
    } catch (error) {
      console.error('Error opening side panel:', error);
    }
  });
} else {
  console.warn('chrome.action is not available');
}

// Handle OAuth2 callback
chrome.webNavigation.onCommitted.addListener(async (details) => {
  if (!details.url.startsWith(import.meta.env.VITE_WEBSITE_URL || 'http://localhost:4000')) {
    return;
  }

  try {
    const url = new URL(details.url);
    if (url.pathname === '/auth/callback') {
      const token = await handleAuthMessage({
        action: 'handleAuthCallback',
        payload: url.search.substring(1)
      });
      
      // Close the auth tab after successful login
      chrome.tabs.remove(details.tabId);
      
      // Notify all extension views about successful auth
      chrome.runtime.sendMessage({ type: 'AUTH_SUCCESS', token });
    }
  } catch (error) {
    console.error('Auth callback error:', error);
  }
});

// Message handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  
  if (message.type.startsWith('AUTH_')) {
    const [, action] = message.type.split('_');
    if (action) {
      handleAuthMessage({ action: action.toLowerCase(), payload: message.payload })
        .then(sendResponse)
        .catch(error => sendResponse({ error: error.message }));
      return true; // Will respond asynchronously
    }
  }
  
  if (message.type === 'GET_SETTINGS') {
    const defaultSettings = {
      tasksEnabled: true,
      weatherEnabled: true,
      newsEnabled: true,
      theme: 'light',
      notifications: true
    };
    
    chrome.storage.sync.get(defaultSettings, (settings) => {
      sendResponse(settings);
    });
    return true;
  }
  
  if (message.type === 'SAVE_SETTINGS') {
    chrome.storage.sync.set(message.settings, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});
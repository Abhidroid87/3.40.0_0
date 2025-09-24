import { storageService } from '../services/storageService';
import { apiService } from '../services/apiService';

/**
 * Background service worker for Manage Chrome Extension
 * Handles extension lifecycle, message passing, and sync operations
 */

console.log('Manage background script loaded');

// Extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Manage extension installed');
  
  // Set up side panel
  if ('sidePanel' in chrome) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  }
  
  // Initialize default data
  initializeExtension();
});

// Message handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);

  switch (request.action) {
    case 'getPageContext':
      handleGetPageContext(sender.tab)
        .then(response => sendResponse({ success: true, ...response }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    case 'syncData':
      handleSyncData()
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    case 'aiPlaceholder':
      handleAIPlaceholder(request.type, request.content)
        .then(response => sendResponse({ success: true, ...response }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    default:
      sendResponse({ success: false, error: 'Unknown action' });
      return false;
  }
});

// Context menu setup
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'openManageTools',
    title: 'Open Manage Tools',
    contexts: ['page', 'selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'openManageTools' && tab?.id) {
    // Inject content script to show popup
    chrome.tabs.sendMessage(tab.id, { action: 'showPopup' });
  }
});

// Periodic sync (every 30 minutes)
chrome.alarms.create('syncData', { periodInMinutes: 30 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'syncData') {
    handleSyncData();
  }
});

/**
 * Initialize extension with default data
 */
async function initializeExtension(): Promise<void> {
  try {
    // Check if this is first install
    const preferences = await storageService.getPreferences();
    
    if (!preferences.name) {
      // Set up default preferences
      await storageService.savePreferences({
        theme: 'system',
        dashboardLayout: {
          showTasks: true,
          showNotes: true,
          showAISuggestions: true
        }
      });
    }

    console.log('Extension initialized successfully');
  } catch (error) {
    console.error('Failed to initialize extension:', error);
  }
}

/**
 * Get context information about the current page
 */
async function handleGetPageContext(tab?: chrome.tabs.Tab): Promise<any> {
  if (!tab) {
    throw new Error('No tab information available');
  }

  return {
    url: tab.url || '',
    title: tab.title || '',
    domain: tab.url ? new URL(tab.url).hostname : '',
    timestamp: new Date().toISOString()
  };
}

/**
 * Handle data synchronization with backend
 */
async function handleSyncData(): Promise<void> {
  try {
    console.log('Starting data sync...');
    
    // Get local data
    const [tasks, notes, preferences] = await Promise.all([
      storageService.getTasks(),
      storageService.getNotes(),
      storageService.getPreferences()
    ]);

    // Sync with backend (placeholder)
    await Promise.all([
      apiService.syncTasks(tasks),
      apiService.syncNotes(notes)
    ]);

    console.log('Data sync completed successfully');
  } catch (error) {
    console.error('Data sync failed:', error);
    // Don't throw - sync failures shouldn't break the extension
  }
}

/**
 * Handle AI placeholder actions
 */
async function handleAIPlaceholder(type: string, content: string): Promise<any> {
  console.log(`AI placeholder called: ${type} with content length: ${content.length}`);
  
  try {
    switch (type) {
      case 'summarize':
        const summary = await apiService.summarizeContent(content);
        return { result: summary };
        
      case 'generateTasks':
        const suggestions = await apiService.generateTaskSuggestions(content);
        return { suggestions };
        
      case 'analyze':
        const analysis = await apiService.analyzeContent(content);
        return { analysis };
        
      default:
        throw new Error(`Unknown AI action: ${type}`);
    }
  } catch (error) {
    console.error('AI placeholder action failed:', error);
    return { 
      result: `AI ${type} placeholder - implement when API is connected`,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Export for testing
export {
  initializeExtension,
  handleGetPageContext,
  handleSyncData,
  handleAIPlaceholder
};
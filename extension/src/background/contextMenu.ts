chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'toggleNotes',
    title: 'Toggle Notes Panel',
    contexts: ['page', 'selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'toggleNotes') {
    chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_NOTES_PANEL' });
  }
});
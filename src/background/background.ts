import { generateResponse, summarizeContent } from '../services/geminiService'

// Background script loaded
console.log('Background script loaded')

// Ensure side panel and context menu are set up
async function ensureSidePanel() {
  if ('sidePanel' in chrome) {
    try {
      await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
      chrome.contextMenus.create({
        id: 'openSidePanel',
        title: 'Open Manage Side Panel',
        contexts: ['all']
      })
      return true
    } catch (error) {
      console.error('Error setting up side panel:', error)
      return false
    }
  }
  return false
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'openSidePanel') {
    if ('sidePanel' in chrome) {
      try {
        if (tab?.windowId) {
          await chrome.sidePanel.open({ windowId: tab.windowId })
        }
      } catch (error) {
        console.error('Error opening side panel:', error)
      }
    } else {
      chrome.windows.create({
        url: chrome.runtime.getURL('sidepanel.html'),
        type: 'popup',
        width: 400,
        height: 600
      })
    }
  }
})

chrome.runtime.onInstalled.addListener(async () => {
  console.log('Extension installed')
  await ensureSidePanel()
})

// Message handling
interface MessageRequest {
  action: 'summarizePage' | 'chatWithAI'
  content?: string
  message?: string
  context?: string
}

interface MessageResponse {
  success: boolean
  summary?: string
  response?: string
  error?: string
}

chrome.runtime.onMessage.addListener((
  request: MessageRequest,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: MessageResponse) => void
): boolean => {
  if (request.action === 'summarizePage') {
    if (!request.content) {
      sendResponse({ success: false, error: 'No content provided' })
      return true
    }

    summarizeContent(request.content)
      .then(summary => {
        sendResponse({ success: true, summary: summary.text })
      })
      .catch(err => {
        console.error('Summarization failed:', err)
        sendResponse({ success: false, error: 'Failed to summarize content' })
      })

    return true
  }

  if (request.action === 'chatWithAI') {
    if (!request.message) {
      sendResponse({ success: false, error: 'No message provided' })
      return true
    }

    generateResponse(request.message, request.context)
      .then(response => {
        sendResponse({ success: true, response: response.text })
      })
      .catch(err => {
        console.error('Chat failed:', err)
        sendResponse({ success: false, error: 'Failed to generate response' })
      })

    return true
  }

  sendResponse({ success: false, error: 'Unknown action' })
  return true
})
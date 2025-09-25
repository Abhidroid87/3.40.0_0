import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, FileText, Loader2, Send, Sparkles, PenTool, Smartphone, Download, FolderSync as Sync } from 'lucide-react';
import { useSidePanelStore } from '../store/sidePanelStore';
import { useAppStore } from '../store/appStore';
import { bridgeService } from '../services/bridgeService';
import DiagnosticPanel from '../components/DiagnosticPanel';
import NotesEditor from '../components/NotesEditor';

function SidePanelApp() {
  const {
    currentSummary,
    chatMessages,
    isLoading,
    summarizePage,
    sendChatMessage,
    clearChat
  } = useSidePanelStore();

  const { tasks, notes } = useAppStore();

  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState<'summary' | 'chat' | 'notes' | 'sync' | 'diagnostics'>('summary');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Auto-summarize current page when side panel opens
    if (activeTab === 'summary') {
      summarizePage();
    }
  }, [summarizePage, activeTab]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    await sendChatMessage(chatInput);
    setChatInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSyncToMobile = async () => {
    setSyncStatus('syncing');
    
    try {
      await bridgeService.sendToMobile({ tasks, notes });
      setSyncStatus('success');
      
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('error');
      
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h1 className="font-semibold text-gray-800">Manage Assistant</h1>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'summary'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Summary</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'chat'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'notes'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Notes</span>
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'sync'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Sync</span>
          </button>
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'diagnostics'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Status</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full p-4 overflow-y-auto"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Page Summary</h2>
                  <button
                    onClick={summarizePage}
                    disabled={isLoading}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-1"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>Refresh</span>
                  </button>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                      <p className="text-gray-600">Analyzing page content...</p>
                    </div>
                  </div>
                ) : currentSummary ? (
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50">
                    <p className="text-gray-700 leading-relaxed">{currentSummary}</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No content to summarize</p>
                    <p className="text-sm">Navigate to a page with text content</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'notes' && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full overflow-y-auto"
            >
              <NotesEditor />
            </motion.div>
          )}

          {activeTab === 'sync' && (
            <motion.div
              key="sync"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full p-4 overflow-y-auto"
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Mobile Sync</h2>
                  <p className="text-gray-600 text-sm">
                    Sync your tasks and notes with the mobile app
                  </p>
                </div>

                {/* Sync Stats */}
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
                      <div className="text-sm text-gray-600">Tasks</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">{notes.length}</div>
                      <div className="text-sm text-gray-600">Notes</div>
                    </div>
                  </div>
                </div>

                {/* Sync Actions */}
                <div className="space-y-3">
                  <motion.button
                    onClick={handleSyncToMobile}
                    disabled={syncStatus === 'syncing'}
                    className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {syncStatus === 'syncing' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Syncing...</span>
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-5 h-5" />
                        <span>Sync to Mobile App</span>
                      </>
                    )}
                  </motion.button>

                  {/* Sync Status */}
                  {syncStatus !== 'idle' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg text-center ${
                        syncStatus === 'success' ? 'bg-green-100 text-green-800' :
                        syncStatus === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {syncStatus === 'success' && '✅ Data sent to mobile app!'}
                      {syncStatus === 'error' && '❌ Sync failed. Please try again.'}
                      {syncStatus === 'syncing' && '🔄 Opening mobile app...'}
                    </motion.div>
                  )}
                </div>

                {/* Instructions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">How it works:</h3>
                  <ol className="text-sm text-gray-600 space-y-1">
                    <li>1. Click "Sync to Mobile App"</li>
                    <li>2. A bridge page will open</li>
                    <li>3. Your mobile app will launch automatically</li>
                    <li>4. Data will be synced to your phone</li>
                  </ol>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'diagnostics' && (
            <motion.div
              key="diagnostics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full p-4 overflow-y-auto"
            >
              <DiagnosticPanel />
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col"
            >
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Start a conversation</p>
                    <p className="text-sm">Ask questions about the current page</p>
                  </div>
                ) : (
                  chatMessages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </motion.div>
                  ))
                )}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span className="text-sm text-gray-600">Thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200/50">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about this page..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !chatInput.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                
                {chatMessages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear conversation
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SidePanelApp;
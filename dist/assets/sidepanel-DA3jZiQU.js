import { a as createLucideIcon, c as create, j as jsxRuntimeExports, r as reactExports, T as Tag, X, C as Check, F as FileText, A as AnimatePresence, m as motion, b as client, R as React } from './globals-CTBrUfLW.js';
import { g as generateResponse, s as summarizeContent } from './geminiService-UhRGqT1M.js';

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Link = createLucideIcon("Link", [
  ["path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", key: "1cjeqo" }],
  ["path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71", key: "19qd67" }]
]);

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Loader2 = createLucideIcon("Loader2", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const MessageSquare = createLucideIcon("MessageSquare", [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }]
]);

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const PenTool = createLucideIcon("PenTool", [
  ["path", { d: "m12 19 7-7 3 3-7 7-3-3z", key: "rklqx2" }],
  ["path", { d: "m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z", key: "1et58u" }],
  ["path", { d: "m2 2 7.586 7.586", key: "etlp93" }],
  ["circle", { cx: "11", cy: "11", r: "2", key: "xmgehs" }]
]);

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Save = createLucideIcon("Save", [
  ["path", { d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z", key: "1owoqh" }],
  ["polyline", { points: "17 21 17 13 7 13 7 21", key: "1md35c" }],
  ["polyline", { points: "7 3 7 8 15 8", key: "8nz8an" }]
]);

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Send = createLucideIcon("Send", [
  ["path", { d: "m22 2-7 20-4-9-9-4Z", key: "1q3vgg" }],
  ["path", { d: "M22 2 11 13", key: "nzbqef" }]
]);

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Sparkles = createLucideIcon("Sparkles", [
  [
    "path",
    {
      d: "m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z",
      key: "17u4zn"
    }
  ],
  ["path", { d: "M5 3v4", key: "bklmnn" }],
  ["path", { d: "M19 17v4", key: "iiml17" }],
  ["path", { d: "M3 5h4", key: "nem4j1" }],
  ["path", { d: "M17 19h4", key: "lbex7p" }]
]);

const useSidePanelStore = create((set, get) => ({
  currentSummary: null,
  chatMessages: [],
  isLoading: false,
  error: null,
  setError: (error) => set({ error }),
  setSummary: (summary) => set({ currentSummary: summary }),
  clearChat: () => set({ chatMessages: [] }),
  summarizePage: async () => {
    set({ isLoading: true, error: null });
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) {
        throw new Error("No active tab found");
      }
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "getPageContent"
      });
      if (response?.content) {
        const result = await summarizeContent(response.content);
        set({ currentSummary: result.text });
      } else {
        set({ currentSummary: "No content available to summarize on this page." });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Failed to summarize page:", errorMessage);
      set({
        currentSummary: "Failed to analyze page content.",
        error: errorMessage
      });
    } finally {
      set({ isLoading: false });
    }
  },
  sendChatMessage: async (message) => {
    const userMessage = {
      role: "user",
      content: message,
      timestamp: Date.now()
    };
    set((state) => ({
      chatMessages: [...state.chatMessages, userMessage],
      isLoading: true,
      error: null
    }));
    try {
      const result = await generateResponse(message, get().currentSummary || void 0);
      const assistantMessage = {
        role: "assistant",
        content: result.text,
        timestamp: Date.now()
      };
      set((state) => ({
        chatMessages: [...state.chatMessages, assistantMessage],
        isLoading: false,
        error: null
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Chat error:", errorMessage);
      set({
        error: errorMessage,
        isLoading: false
      });
    }
  }
}));

function DiagnosticPanel() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-semibold mb-2", children: "Diagnostics" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white/80", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Extension Status:" }),
        " Active"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white/80", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "AI Service:" }),
        " Placeholder Mode"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white/80", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Storage:" }),
        " Local Chrome Storage"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white/80", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Sync:" }),
        " Offline Mode"
      ] })
    ] })
  ] });
}

const NotesEditor = () => {
  const [currentUrl, setCurrentUrl] = reactExports.useState("");
  const [note, setNote] = reactExports.useState(null);
  const [availableTasks, setAvailableTasks] = reactExports.useState([]);
  const [newTag, setNewTag] = reactExports.useState("");
  const [isSaving, setIsSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url);
        loadNoteForUrl(tabs[0].url);
      }
    });
    loadTasks();
  }, []);
  const loadNoteForUrl = async (url) => {
    const stored = await chrome.storage.local.get("notes");
    const notes = stored.notes || {};
    setNote(notes[url] || {
      id: crypto.randomUUID(),
      title: "",
      content: "",
      url,
      tags: [],
      lastModified: /* @__PURE__ */ new Date()
    });
  };
  const loadTasks = async () => {
    const stored = await chrome.storage.local.get("tasks");
    setAvailableTasks(stored.tasks || []);
  };
  const handleSave = async () => {
    if (!note) return;
    setIsSaving(true);
    try {
      const stored = await chrome.storage.local.get("notes");
      const notes = stored.notes || {};
      notes[currentUrl] = {
        ...note,
        lastModified: /* @__PURE__ */ new Date()
      };
      await chrome.storage.local.set({ notes });
      if (note.taskId) {
        const stored2 = await chrome.storage.local.get("tasks");
        const tasks = stored2.tasks || [];
        const taskIndex = tasks.findIndex((t) => t.id === note.taskId);
        if (taskIndex !== -1) {
          tasks[taskIndex].notes = tasks[taskIndex].notes || [];
          if (!tasks[taskIndex].notes.includes(note.id)) {
            tasks[taskIndex].notes.push(note.id);
            await chrome.storage.local.set({ tasks });
          }
        }
      }
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSaving(false);
    }
  };
  const handleAddTag = () => {
    if (!note || !newTag.trim()) return;
    if (!note.tags.includes(newTag.trim())) {
      setNote({
        ...note,
        tags: [...note.tags, newTag.trim()]
      });
    }
    setNewTag("");
  };
  const handleRemoveTag = (tagToRemove) => {
    if (!note) return;
    setNote({
      ...note,
      tags: note.tags.filter((tag) => tag !== tagToRemove)
    });
  };
  const handleAttachTask = (taskId) => {
    if (!note) return;
    setNote({
      ...note,
      taskId: taskId === note.taskId ? void 0 : taskId
    });
  };
  if (!note) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "text",
        value: note.title,
        onChange: (e) => setNote({ ...note, title: e.target.value }),
        placeholder: "Note title...",
        className: "w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        value: note.content,
        onChange: (e) => setNote({ ...note, content: e.target.value }),
        placeholder: "Start taking notes...",
        className: "w-full h-40 px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 text-sm text-gray-600", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "w-4 h-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: currentUrl })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: note.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-3 h-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tag }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handleRemoveTag(tag),
                className: "hover:text-red-600",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
              }
            )
          ]
        },
        tag
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: newTag,
            onChange: (e) => setNewTag(e.target.value),
            onKeyPress: (e) => e.key === "Enter" && handleAddTag(),
            placeholder: "Add a tag...",
            className: "flex-1 px-3 py-1 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleAddTag,
            disabled: !newTag.trim(),
            className: "px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50",
            children: "Add"
          }
        )
      ] })
    ] }),
    availableTasks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Attach to Task" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: availableTasks.map((task) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => handleAttachTask(task.id),
          className: `flex items-center justify-between p-2 rounded-lg text-sm ${note.taskId === task.id ? "bg-blue-600 text-white" : "bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-800 hover:border-blue-500"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: task.title }),
            note.taskId === task.id && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 ml-2" })
          ]
        },
        task.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: handleSave,
        disabled: isSaving,
        className: "flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isSaving ? "Saving..." : "Save Note" })
        ]
      }
    ) })
  ] });
};

function SidePanelApp() {
  const {
    currentSummary,
    chatMessages,
    isLoading,
    summarizePage,
    sendChatMessage,
    clearChat
  } = useSidePanelStore();
  const [chatInput, setChatInput] = reactExports.useState("");
  const [activeTab, setActiveTab] = reactExports.useState("summary");
  reactExports.useEffect(() => {
    if (activeTab === "summary") {
      summarizePage();
    }
  }, [summarizePage, activeTab]);
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    await sendChatMessage(chatInput);
    setChatInput("");
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-5 h-5 text-blue-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-semibold text-gray-800", children: "Manage Assistant" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-1 bg-gray-100 rounded-lg p-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveTab("summary"),
            className: `flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === "summary" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Summary" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveTab("chat"),
            className: `flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === "chat" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Chat" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveTab("notes"),
            className: `flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === "notes" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PenTool, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Notes" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveTab("diagnostics"),
            className: `flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === "diagnostics" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Status" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
      activeTab === "summary" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 20 },
          className: "h-full p-4 overflow-y-auto",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-gray-800", children: "Page Summary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: summarizePage,
                  disabled: isLoading,
                  className: "px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-1",
                  children: [
                    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Refresh" })
                  ]
                }
              )
            ] }),
            isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", children: "Analyzing page content..." })
            ] }) }) : currentSummary ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-700 leading-relaxed", children: currentSummary }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-gray-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-12 h-12 mx-auto mb-2 opacity-50" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No content to summarize" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Navigate to a page with text content" })
            ] })
          ] })
        },
        "summary"
      ),
      activeTab === "notes" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -20 },
          className: "h-full overflow-y-auto",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(NotesEditor, {})
        },
        "notes"
      ),
      activeTab === "diagnostics" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -20 },
          className: "h-full p-4 overflow-y-auto",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(DiagnosticPanel, {})
        },
        "diagnostics"
      ),
      activeTab === "chat" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -20 },
          className: "h-full flex flex-col",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [
              chatMessages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-gray-500", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-12 h-12 mx-auto mb-2 opacity-50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Start a conversation" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Ask questions about the current page" })
              ] }) : chatMessages.map((message, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  className: `flex ${message.role === "user" ? "justify-end" : "justify-start"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `max-w-[80%] p-3 rounded-lg ${message.role === "user" ? "bg-blue-600 text-white" : "bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-800"}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: message.content })
                    }
                  )
                },
                index
              )),
              isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  className: "flex justify-start",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/80 backdrop-blur-sm border border-gray-200/50 p-3 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "w-4 h-4 animate-spin text-blue-600" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-600", children: "Thinking..." })
                  ] }) })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: chatInput,
                    onChange: (e) => setChatInput(e.target.value),
                    onKeyPress: handleKeyPress,
                    placeholder: "Ask about this page...",
                    className: "flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    disabled: isLoading
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: handleSendMessage,
                    disabled: isLoading || !chatInput.trim(),
                    className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" })
                  }
                )
              ] }),
              chatMessages.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: clearChat,
                  className: "mt-2 text-xs text-gray-500 hover:text-gray-700",
                  children: "Clear conversation"
                }
              )
            ] })
          ]
        },
        "chat"
      )
    ] }) })
  ] });
}

client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidePanelApp, {}) })
);

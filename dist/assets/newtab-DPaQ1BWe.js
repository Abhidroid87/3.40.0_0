import { c as create, j as jsxRuntimeExports, a as createLucideIcon, r as reactExports, C as Check, X, m as motion, A as AnimatePresence, F as FileText, T as Tag, b as client, R as React } from './globals-CTBrUfLW.js';

const __vite_import_meta_env__ = {};
function createJSONStorage(getStorage, options) {
  let storage;
  try {
    storage = getStorage();
  } catch (_e) {
    return;
  }
  const persistStorage = {
    getItem: (name) => {
      var _a;
      const parse = (str2) => {
        if (str2 === null) {
          return null;
        }
        return JSON.parse(str2, void 0 );
      };
      const str = (_a = storage.getItem(name)) != null ? _a : null;
      if (str instanceof Promise) {
        return str.then(parse);
      }
      return parse(str);
    },
    setItem: (name, newValue) => storage.setItem(
      name,
      JSON.stringify(newValue, void 0 )
    ),
    removeItem: (name) => storage.removeItem(name)
  };
  return persistStorage;
}
const toThenable = (fn) => (input) => {
  try {
    const result = fn(input);
    if (result instanceof Promise) {
      return result;
    }
    return {
      then(onFulfilled) {
        return toThenable(onFulfilled)(result);
      },
      catch(_onRejected) {
        return this;
      }
    };
  } catch (e) {
    return {
      then(_onFulfilled) {
        return this;
      },
      catch(onRejected) {
        return toThenable(onRejected)(e);
      }
    };
  }
};
const oldImpl = (config, baseOptions) => (set, get, api) => {
  let options = {
    getStorage: () => localStorage,
    serialize: JSON.stringify,
    deserialize: JSON.parse,
    partialize: (state) => state,
    version: 0,
    merge: (persistedState, currentState) => ({
      ...currentState,
      ...persistedState
    }),
    ...baseOptions
  };
  let hasHydrated = false;
  const hydrationListeners = /* @__PURE__ */ new Set();
  const finishHydrationListeners = /* @__PURE__ */ new Set();
  let storage;
  try {
    storage = options.getStorage();
  } catch (_e) {
  }
  if (!storage) {
    return config(
      (...args) => {
        console.warn(
          `[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`
        );
        set(...args);
      },
      get,
      api
    );
  }
  const thenableSerialize = toThenable(options.serialize);
  const setItem = () => {
    const state = options.partialize({ ...get() });
    let errorInSync;
    const thenable = thenableSerialize({ state, version: options.version }).then(
      (serializedValue) => storage.setItem(options.name, serializedValue)
    ).catch((e) => {
      errorInSync = e;
    });
    if (errorInSync) {
      throw errorInSync;
    }
    return thenable;
  };
  const savedSetState = api.setState;
  api.setState = (state, replace) => {
    savedSetState(state, replace);
    void setItem();
  };
  const configResult = config(
    (...args) => {
      set(...args);
      void setItem();
    },
    get,
    api
  );
  let stateFromStorage;
  const hydrate = () => {
    var _a;
    if (!storage) return;
    hasHydrated = false;
    hydrationListeners.forEach((cb) => cb(get()));
    const postRehydrationCallback = ((_a = options.onRehydrateStorage) == null ? void 0 : _a.call(options, get())) || void 0;
    return toThenable(storage.getItem.bind(storage))(options.name).then((storageValue) => {
      if (storageValue) {
        return options.deserialize(storageValue);
      }
    }).then((deserializedStorageValue) => {
      if (deserializedStorageValue) {
        if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
          if (options.migrate) {
            return options.migrate(
              deserializedStorageValue.state,
              deserializedStorageValue.version
            );
          }
          console.error(
            `State loaded from storage couldn't be migrated since no migrate function was provided`
          );
        } else {
          return deserializedStorageValue.state;
        }
      }
    }).then((migratedState) => {
      var _a2;
      stateFromStorage = options.merge(
        migratedState,
        (_a2 = get()) != null ? _a2 : configResult
      );
      set(stateFromStorage, true);
      return setItem();
    }).then(() => {
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(stateFromStorage, void 0);
      hasHydrated = true;
      finishHydrationListeners.forEach((cb) => cb(stateFromStorage));
    }).catch((e) => {
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(void 0, e);
    });
  };
  api.persist = {
    setOptions: (newOptions) => {
      options = {
        ...options,
        ...newOptions
      };
      if (newOptions.getStorage) {
        storage = newOptions.getStorage();
      }
    },
    clearStorage: () => {
      storage == null ? void 0 : storage.removeItem(options.name);
    },
    getOptions: () => options,
    rehydrate: () => hydrate(),
    hasHydrated: () => hasHydrated,
    onHydrate: (cb) => {
      hydrationListeners.add(cb);
      return () => {
        hydrationListeners.delete(cb);
      };
    },
    onFinishHydration: (cb) => {
      finishHydrationListeners.add(cb);
      return () => {
        finishHydrationListeners.delete(cb);
      };
    }
  };
  hydrate();
  return stateFromStorage || configResult;
};
const newImpl = (config, baseOptions) => (set, get, api) => {
  let options = {
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => state,
    version: 0,
    merge: (persistedState, currentState) => ({
      ...currentState,
      ...persistedState
    }),
    ...baseOptions
  };
  let hasHydrated = false;
  const hydrationListeners = /* @__PURE__ */ new Set();
  const finishHydrationListeners = /* @__PURE__ */ new Set();
  let storage = options.storage;
  if (!storage) {
    return config(
      (...args) => {
        console.warn(
          `[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`
        );
        set(...args);
      },
      get,
      api
    );
  }
  const setItem = () => {
    const state = options.partialize({ ...get() });
    return storage.setItem(options.name, {
      state,
      version: options.version
    });
  };
  const savedSetState = api.setState;
  api.setState = (state, replace) => {
    savedSetState(state, replace);
    void setItem();
  };
  const configResult = config(
    (...args) => {
      set(...args);
      void setItem();
    },
    get,
    api
  );
  api.getInitialState = () => configResult;
  let stateFromStorage;
  const hydrate = () => {
    var _a, _b;
    if (!storage) return;
    hasHydrated = false;
    hydrationListeners.forEach((cb) => {
      var _a2;
      return cb((_a2 = get()) != null ? _a2 : configResult);
    });
    const postRehydrationCallback = ((_b = options.onRehydrateStorage) == null ? void 0 : _b.call(options, (_a = get()) != null ? _a : configResult)) || void 0;
    return toThenable(storage.getItem.bind(storage))(options.name).then((deserializedStorageValue) => {
      if (deserializedStorageValue) {
        if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
          if (options.migrate) {
            return [
              true,
              options.migrate(
                deserializedStorageValue.state,
                deserializedStorageValue.version
              )
            ];
          }
          console.error(
            `State loaded from storage couldn't be migrated since no migrate function was provided`
          );
        } else {
          return [false, deserializedStorageValue.state];
        }
      }
      return [false, void 0];
    }).then((migrationResult) => {
      var _a2;
      const [migrated, migratedState] = migrationResult;
      stateFromStorage = options.merge(
        migratedState,
        (_a2 = get()) != null ? _a2 : configResult
      );
      set(stateFromStorage, true);
      if (migrated) {
        return setItem();
      }
    }).then(() => {
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(stateFromStorage, void 0);
      stateFromStorage = get();
      hasHydrated = true;
      finishHydrationListeners.forEach((cb) => cb(stateFromStorage));
    }).catch((e) => {
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(void 0, e);
    });
  };
  api.persist = {
    setOptions: (newOptions) => {
      options = {
        ...options,
        ...newOptions
      };
      if (newOptions.storage) {
        storage = newOptions.storage;
      }
    },
    clearStorage: () => {
      storage == null ? void 0 : storage.removeItem(options.name);
    },
    getOptions: () => options,
    rehydrate: () => hydrate(),
    hasHydrated: () => hasHydrated,
    onHydrate: (cb) => {
      hydrationListeners.add(cb);
      return () => {
        hydrationListeners.delete(cb);
      };
    },
    onFinishHydration: (cb) => {
      finishHydrationListeners.add(cb);
      return () => {
        finishHydrationListeners.delete(cb);
      };
    }
  };
  if (!options.skipHydration) {
    hydrate();
  }
  return stateFromStorage || configResult;
};
const persistImpl = (config, baseOptions) => {
  if ("getStorage" in baseOptions || "serialize" in baseOptions || "deserialize" in baseOptions) {
    if ((__vite_import_meta_env__ ? "production" : void 0) !== "production") {
      console.warn(
        "[DEPRECATED] `getStorage`, `serialize` and `deserialize` options are deprecated. Use `storage` option instead."
      );
    }
    return oldImpl(config, baseOptions);
  }
  return newImpl(config, baseOptions);
};
const persist = persistImpl;

class StorageService {
  STORAGE_KEYS = {
    TASKS: "tasks",
    NOTES: "notes",
    PREFERENCES: "userPreferences",
    SYNC_STATUS: "syncStatus"
  };
  // Task Management
  async getTasks() {
    try {
      const result = await chrome.storage.local.get(this.STORAGE_KEYS.TASKS);
      return result[this.STORAGE_KEYS.TASKS] || [];
    } catch (error) {
      console.error("Error getting tasks:", error);
      return [];
    }
  }
  async saveTasks(tasks) {
    try {
      await chrome.storage.local.set({ [this.STORAGE_KEYS.TASKS]: tasks });
      this.markForSync("tasks");
    } catch (error) {
      console.error("Error saving tasks:", error);
      throw error;
    }
  }
  async addTask(task) {
    const newTask = {
      ...task,
      id: this.generateId(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      subtasks: task.subtasks || []
    };
    const tasks = await this.getTasks();
    tasks.push(newTask);
    await this.saveTasks(tasks);
    return newTask;
  }
  async updateTask(taskId, updates) {
    const tasks = await this.getTasks();
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await this.saveTasks(tasks);
  }
  async deleteTask(taskId) {
    const tasks = await this.getTasks();
    const filteredTasks = tasks.filter((t) => t.id !== taskId);
    await this.saveTasks(filteredTasks);
  }
  // Notes Management
  async getNotes() {
    try {
      const result = await chrome.storage.local.get(this.STORAGE_KEYS.NOTES);
      return result[this.STORAGE_KEYS.NOTES] || [];
    } catch (error) {
      console.error("Error getting notes:", error);
      return [];
    }
  }
  async saveNotes(notes) {
    try {
      await chrome.storage.local.set({ [this.STORAGE_KEYS.NOTES]: notes });
      this.markForSync("notes");
    } catch (error) {
      console.error("Error saving notes:", error);
      throw error;
    }
  }
  async addNote(note) {
    const newNote = {
      ...note,
      id: this.generateId(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const notes = await this.getNotes();
    notes.push(newNote);
    await this.saveNotes(notes);
    return newNote;
  }
  async updateNote(noteId, updates) {
    const notes = await this.getNotes();
    const noteIndex = notes.findIndex((n) => n.id === noteId);
    if (noteIndex === -1) {
      throw new Error("Note not found");
    }
    notes[noteIndex] = {
      ...notes[noteIndex],
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await this.saveNotes(notes);
  }
  async deleteNote(noteId) {
    const notes = await this.getNotes();
    const filteredNotes = notes.filter((n) => n.id !== noteId);
    await this.saveNotes(filteredNotes);
  }
  async getNotesByUrl(url) {
    const notes = await this.getNotes();
    return notes.filter((note) => note.url === url);
  }
  // User Preferences
  async getPreferences() {
    try {
      const result = await chrome.storage.local.get(this.STORAGE_KEYS.PREFERENCES);
      return result[this.STORAGE_KEYS.PREFERENCES] || {
        theme: "system",
        dashboardLayout: {
          showTasks: true,
          showNotes: true,
          showAISuggestions: true
        }
      };
    } catch (error) {
      console.error("Error getting preferences:", error);
      return {
        theme: "system",
        dashboardLayout: {
          showTasks: true,
          showNotes: true,
          showAISuggestions: true
        }
      };
    }
  }
  async savePreferences(preferences) {
    try {
      await chrome.storage.local.set({ [this.STORAGE_KEYS.PREFERENCES]: preferences });
      this.markForSync("preferences");
    } catch (error) {
      console.error("Error saving preferences:", error);
      throw error;
    }
  }
  // Utility methods
  generateId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  async markForSync(dataType) {
    try {
      const syncStatus = await chrome.storage.local.get(this.STORAGE_KEYS.SYNC_STATUS);
      const currentStatus = syncStatus[this.STORAGE_KEYS.SYNC_STATUS] || {};
      currentStatus[dataType] = {
        lastModified: (/* @__PURE__ */ new Date()).toISOString(),
        needsSync: true
      };
      await chrome.storage.local.set({ [this.STORAGE_KEYS.SYNC_STATUS]: currentStatus });
    } catch (error) {
      console.error("Error marking for sync:", error);
    }
  }
  // Backend sync preparation (placeholder)
  async syncWithBackend() {
    console.log("Backend sync placeholder - implement when backend is ready");
  }
}
const storageService = new StorageService();

const useAppStore = create()(
  persist(
    (set, get) => ({
      // Initial state
      preferences: {
        theme: "system",
        dashboardLayout: {
          showTasks: true,
          showNotes: true,
          showAISuggestions: true
        }
      },
      tasks: [],
      tasksLoading: false,
      notes: [],
      notesLoading: false,
      showPopup: false,
      currentPageContext: null,
      // Preferences
      setPreferences: (newPreferences) => {
        const updatedPreferences = { ...get().preferences, ...newPreferences };
        set({ preferences: updatedPreferences });
        storageService.savePreferences(updatedPreferences);
      },
      // Task management
      loadTasks: async () => {
        set({ tasksLoading: true });
        try {
          const tasks = await storageService.getTasks();
          set({ tasks, tasksLoading: false });
        } catch (error) {
          console.error("Failed to load tasks:", error);
          set({ tasksLoading: false });
        }
      },
      addTask: async (taskData) => {
        try {
          const newTask = await storageService.addTask(taskData);
          set((state) => ({ tasks: [...state.tasks, newTask] }));
        } catch (error) {
          console.error("Failed to add task:", error);
          throw error;
        }
      },
      updateTask: async (taskId, updates) => {
        try {
          await storageService.updateTask(taskId, updates);
          set((state) => ({
            tasks: state.tasks.map(
              (task) => task.id === taskId ? { ...task, ...updates, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } : task
            )
          }));
        } catch (error) {
          console.error("Failed to update task:", error);
          throw error;
        }
      },
      deleteTask: async (taskId) => {
        try {
          await storageService.deleteTask(taskId);
          set((state) => ({ tasks: state.tasks.filter((task) => task.id !== taskId) }));
        } catch (error) {
          console.error("Failed to delete task:", error);
          throw error;
        }
      },
      toggleTask: async (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (task) {
          await get().updateTask(taskId, { completed: !task.completed });
        }
      },
      addSubTask: async (taskId, subtaskData) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task) return;
        const newSubTask = {
          ...subtaskData,
          id: Date.now().toString(),
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        const updatedSubtasks = [...task.subtasks || [], newSubTask];
        await get().updateTask(taskId, { subtasks: updatedSubtasks });
      },
      toggleSubTask: async (taskId, subtaskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task || !task.subtasks) return;
        const updatedSubtasks = task.subtasks.map(
          (subtask) => subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
        );
        await get().updateTask(taskId, { subtasks: updatedSubtasks });
      },
      // Note management
      loadNotes: async () => {
        set({ notesLoading: true });
        try {
          const notes = await storageService.getNotes();
          set({ notes, notesLoading: false });
        } catch (error) {
          console.error("Failed to load notes:", error);
          set({ notesLoading: false });
        }
      },
      addNote: async (noteData) => {
        try {
          const newNote = await storageService.addNote(noteData);
          set((state) => ({ notes: [...state.notes, newNote] }));
        } catch (error) {
          console.error("Failed to add note:", error);
          throw error;
        }
      },
      updateNote: async (noteId, updates) => {
        try {
          await storageService.updateNote(noteId, updates);
          set((state) => ({
            notes: state.notes.map(
              (note) => note.id === noteId ? { ...note, ...updates, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } : note
            )
          }));
        } catch (error) {
          console.error("Failed to update note:", error);
          throw error;
        }
      },
      deleteNote: async (noteId) => {
        try {
          await storageService.deleteNote(noteId);
          set((state) => ({ notes: state.notes.filter((note) => note.id !== noteId) }));
        } catch (error) {
          console.error("Failed to delete note:", error);
          throw error;
        }
      },
      getNotesByUrl: (url) => {
        return get().notes.filter((note) => note.url === url);
      },
      // UI actions
      setShowPopup: (show) => set({ showPopup: show }),
      setPageContext: (context) => set({ currentPageContext: context })
    }),
    {
      name: "manage-app-store",
      partialize: (state) => ({
        preferences: state.preferences,
        tasks: state.tasks,
        notes: state.notes
      })
    }
  )
);

function Greeting() {
  const getTimeBasedGreeting = () => {
    const hour = (/* @__PURE__ */ new Date()).getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200", children: getTimeBasedGreeting() });
}

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Bell = createLucideIcon("Bell", [
  ["path", { d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9", key: "1qo2s2" }],
  ["path", { d: "M10.3 21a1.94 1.94 0 0 0 3.4 0", key: "qgo35s" }]
]);

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Calendar = createLucideIcon("Calendar", [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
]);

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const ChevronDown = createLucideIcon("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const ChevronRight = createLucideIcon("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Lightbulb = createLucideIcon("Lightbulb", [
  [
    "path",
    {
      d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
      key: "1gvzjb"
    }
  ],
  ["path", { d: "M9 18h6", key: "x1upvd" }],
  ["path", { d: "M10 22h4", key: "ceow96" }]
]);

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Plus = createLucideIcon("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Settings = createLucideIcon("Settings", [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Trash2 = createLucideIcon("Trash2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
]);

/**
 * @name toDate
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number, it is treated as a timestamp.
 *
 * If the argument is none of the above, the function returns Invalid Date.
 *
 * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param argument - The value to convert
 *
 * @returns The parsed date in the local time zone
 *
 * @example
 * // Clone the date:
 * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert the timestamp to date:
 * const result = toDate(1392098430000)
 * //=> Tue Feb 11 2014 11:30:30
 */
function toDate(argument) {
  const argStr = Object.prototype.toString.call(argument);

  // Clone the date
  if (
    argument instanceof Date ||
    (typeof argument === "object" && argStr === "[object Date]")
  ) {
    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
    return new argument.constructor(+argument);
  } else if (
    typeof argument === "number" ||
    argStr === "[object Number]" ||
    typeof argument === "string" ||
    argStr === "[object String]"
  ) {
    // TODO: Can we get rid of as?
    return new Date(argument);
  } else {
    // TODO: Can we get rid of as?
    return new Date(NaN);
  }
}

/**
 * @name constructFrom
 * @category Generic Helpers
 * @summary Constructs a date using the reference date and the value
 *
 * @description
 * The function constructs a new date using the constructor from the reference
 * date and the given value. It helps to build generic functions that accept
 * date extensions.
 *
 * It defaults to `Date` if the passed reference date is a number or a string.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The reference date to take constructor from
 * @param value - The value to create the date
 *
 * @returns Date initialized using the given date and value
 *
 * @example
 * import { constructFrom } from 'date-fns'
 *
 * // A function that clones a date preserving the original type
 * function cloneDate<DateType extends Date(date: DateType): DateType {
 *   return constructFrom(
 *     date, // Use contrustor from the given date
 *     date.getTime() // Use the date value to create a new date
 *   )
 * }
 */
function constructFrom(date, value) {
  if (date instanceof Date) {
    return new date.constructor(value);
  } else {
    return new Date(value);
  }
}

/**
 * @name startOfDay
 * @category Day Helpers
 * @summary Return the start of a day for the given date.
 *
 * @description
 * Return the start of a day for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The start of a day
 *
 * @example
 * // The start of a day for 2 September 2014 11:55:00:
 * const result = startOfDay(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 02 2014 00:00:00
 */
function startOfDay(date) {
  const _date = toDate(date);
  _date.setHours(0, 0, 0, 0);
  return _date;
}

/**
 * @name constructNow
 * @category Generic Helpers
 * @summary Constructs a new current date using the passed value constructor.
 * @pure false
 *
 * @description
 * The function constructs a new current date using the constructor from
 * the reference date. It helps to build generic functions that accept date
 * extensions and use the current date.
 *
 * It defaults to `Date` if the passed reference date is a number or a string.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The reference date to take constructor from
 *
 * @returns Current date initialized using the given date constructor
 *
 * @example
 * import { constructNow, isSameDay } from 'date-fns'
 *
 * function isToday<DateType extends Date>(
 *   date: DateType | number | string,
 * ): boolean {
 *   // If we were to use `new Date()` directly, the function would  behave
 *   // differently in different timezones and return false for the same date.
 *   return isSameDay(date, constructNow(date));
 * }
 */
function constructNow(date) {
  return constructFrom(date, Date.now());
}

/**
 * @name isSameDay
 * @category Day Helpers
 * @summary Are the given dates in the same day (and year and month)?
 *
 * @description
 * Are the given dates in the same day (and year and month)?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The first date to check
 * @param dateRight - The second date to check

 * @returns The dates are in the same day (and year and month)
 *
 * @example
 * // Are 4 September 06:00:00 and 4 September 18:00:00 in the same day?
 * const result = isSameDay(new Date(2014, 8, 4, 6, 0), new Date(2014, 8, 4, 18, 0))
 * //=> true
 *
 * @example
 * // Are 4 September and 4 October in the same day?
 * const result = isSameDay(new Date(2014, 8, 4), new Date(2014, 9, 4))
 * //=> false
 *
 * @example
 * // Are 4 September, 2014 and 4 September, 2015 in the same day?
 * const result = isSameDay(new Date(2014, 8, 4), new Date(2015, 8, 4))
 * //=> false
 */
function isSameDay(dateLeft, dateRight) {
  const dateLeftStartOfDay = startOfDay(dateLeft);
  const dateRightStartOfDay = startOfDay(dateRight);

  return +dateLeftStartOfDay === +dateRightStartOfDay;
}

/**
 * @name isPast
 * @category Common Helpers
 * @summary Is the given date in the past?
 * @pure false
 *
 * @description
 * Is the given date in the past?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is in the past
 *
 * @example
 * // If today is 6 October 2014, is 2 July 2014 in the past?
 * const result = isPast(new Date(2014, 6, 2))
 * //=> true
 */
function isPast(date) {
  return +toDate(date) < Date.now();
}

/**
 * @name isToday
 * @category Day Helpers
 * @summary Is the given date today?
 * @pure false
 *
 * @description
 * Is the given date today?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is today
 *
 * @example
 * // If today is 6 October 2014, is 6 October 14:00:00 today?
 * const result = isToday(new Date(2014, 9, 6, 14, 0))
 * //=> true
 */
function isToday(date) {
  return isSameDay(date, constructNow(date));
}

const SubTaskEditor = ({
  subtasks,
  onAdd,
  onDelete,
  onToggle
}) => {
  const [newSubTask, setNewSubTask] = reactExports.useState("");
  const [newDueDate, setNewDueDate] = reactExports.useState("");
  const handleAddSubTask = () => {
    if (!newSubTask.trim()) return;
    onAdd({
      title: newSubTask.trim(),
      completed: false,
      dueDate: newDueDate || void 0
    });
    setNewSubTask("");
    setNewDueDate("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-white/80 mb-2", children: "Subtasks" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: newSubTask,
          onChange: (e) => setNewSubTask(e.target.value),
          onKeyPress: (e) => e.key === "Enter" && handleAddSubTask(),
          placeholder: "Add a subtask...",
          className: "flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white placeholder-white/50 focus:outline-none focus:border-white/40"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "date",
          value: newDueDate,
          onChange: (e) => setNewDueDate(e.target.value),
          className: "w-32 bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-white/40"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleAddSubTask,
          disabled: !newSubTask.trim(),
          className: "p-2 bg-white/10 hover:bg-white/20 rounded-lg disabled:opacity-50",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 text-white" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: subtasks.map((subtask) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 p-2 bg-white/5 rounded-lg group",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => onToggle(subtask.id),
              className: "flex-shrink-0",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-4 h-4 rounded border ${subtask.completed ? "bg-green-500 border-green-600" : "border-white/30 hover:border-white/50"} flex items-center justify-center`, children: subtask.completed && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3 text-white" }) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `flex-1 text-sm ${subtask.completed ? "line-through text-white/50" : "text-white"}`, children: subtask.title }),
          subtask.dueDate && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white/50", children: new Date(subtask.dueDate).toLocaleDateString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => onDelete(subtask.id),
              className: "opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3 text-white/70" })
            }
          )
        ]
      },
      subtask.id
    )) })
  ] });
};

const ReminderEditor = ({
  reminders,
  onAdd,
  onDelete
}) => {
  const [newReminder, setNewReminder] = reactExports.useState("");
  const handleAddReminder = () => {
    if (!newReminder.trim()) return;
    onAdd(newReminder);
    setNewReminder("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-white/80 mb-2", children: "Reminders" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "datetime-local",
          value: newReminder,
          onChange: (e) => setNewReminder(e.target.value),
          className: "flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-white/40"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleAddReminder,
          disabled: !newReminder,
          className: "p-2 bg-white/10 hover:bg-white/20 rounded-lg disabled:opacity-50",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 text-white" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: reminders.map((reminder, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 p-2 bg-white/5 rounded-lg group",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-4 h-4 text-white/70" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm text-white", children: new Date(reminder).toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => onDelete(reminder),
              className: "opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3 text-white/70" })
            }
          )
        ]
      },
      index
    )) })
  ] });
};

const TaskCard = ({
  task,
  expanded,
  onToggle,
  onExpand,
  onDelete,
  priorityColorMap
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      whileHover: { scale: 1.02 },
      className: "task-card",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start space-x-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.button,
          {
            onClick: onToggle,
            className: `mt-1 w-6 h-6 border-2 rounded-lg transition-all duration-200 flex items-center justify-center ${task.completed ? "border-green-500 bg-green-500" : "border-white/30 hover:border-white/50"}`,
            whileHover: { scale: 1.1 },
            whileTap: { scale: 0.9 },
            children: task.completed && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-white" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: `font-medium truncate text-lg ${task.completed ? "line-through text-white/50" : "text-white"}`, children: task.title }),
              task.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm ${task.completed ? "text-white/30" : "text-white/70"}`, children: task.description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-1 rounded-lg ${priorityColorMap[task.priority]}`, children: task.priority.toUpperCase() }),
              task.dueDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-white/50 flex items-center space-x-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(task.dueDate).toLocaleDateString() })
              ] })
            ] })
          ] }),
          (task.subtasks?.length > 0 || task.reminders?.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: onExpand,
              className: "mt-2 flex items-center space-x-1 text-white/50 hover:text-white text-sm",
              children: [
                expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Details" })
              ]
            }
          ),
          expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-4", children: [
            task.subtasks && task.subtasks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "text-sm font-medium text-white/70", children: "Subtasks" }),
              task.subtasks.map((subtask) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center space-x-2 text-sm",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-3 h-3 rounded-sm ${subtask.completed ? "bg-green-500" : "border border-white/30"}` }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: subtask.completed ? "line-through text-white/30" : "text-white", children: subtask.title }),
                    subtask.dueDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/50", children: [
                      "· ",
                      new Date(subtask.dueDate).toLocaleDateString()
                    ] })
                  ]
                },
                subtask.id
              ))
            ] }),
            task.reminders && task.reminders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "text-sm font-medium text-white/70", children: "Reminders" }),
              task.reminders.map((reminder, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center space-x-2 text-sm text-white/70",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-3 h-3" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(reminder).toLocaleString() })
                  ]
                },
                index
              ))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.button,
          {
            onClick: onDelete,
            className: "mt-1 p-2 text-white/30 hover:text-red-500 rounded-lg transition-colors",
            whileHover: { scale: 1.1 },
            whileTap: { scale: 0.9 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
          }
        )
      ] })
    }
  );
};

const TaskPanel = () => {
  const priorityWeight = { high: 3, medium: 2, low: 1 };
  const { tasks, userPreferences, addTask, deleteTask, toggleTask } = useAppStore();
  const [activeTaskView, setActiveTaskView] = reactExports.useState("list");
  const [showAddTask, setShowAddTask] = reactExports.useState(false);
  const [expandedTasks, setExpandedTasks] = reactExports.useState(/* @__PURE__ */ new Set());
  const [newTaskTitle, setNewTaskTitle] = reactExports.useState("");
  const [newTaskDescription, setNewTaskDescription] = reactExports.useState("");
  const [newTaskPriority, setNewTaskPriority] = reactExports.useState("medium");
  const [newTaskDueDate, setNewTaskDueDate] = reactExports.useState("");
  const [newSubtasks, setNewSubtasks] = reactExports.useState([]);
  const [newReminders, setNewReminders] = reactExports.useState([]);
  const handleAddSubtask = reactExports.useCallback((subtask) => {
    setNewSubtasks((prev) => [...prev, { ...subtask, id: crypto.randomUUID() }]);
  }, []);
  const handleDeleteSubtask = reactExports.useCallback((subtaskId) => {
    setNewSubtasks((prev) => prev.filter((st) => st.id !== subtaskId));
  }, []);
  const handleAddReminder = reactExports.useCallback((reminder) => {
    setNewReminders((prev) => !prev.includes(reminder) ? [...prev, reminder] : prev);
  }, []);
  const handleDeleteReminder = reactExports.useCallback((reminder) => {
    setNewReminders((prev) => prev.filter((r) => r !== reminder));
  }, []);
  const handleAddTask = reactExports.useCallback(async () => {
    if (!newTaskTitle.trim()) return;
    const taskData = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      description: newTaskDescription || void 0,
      completed: false,
      priority: newTaskPriority,
      dueDate: newTaskDueDate || void 0,
      subtasks: newSubtasks,
      reminders: newReminders
    };
    try {
      const response = await chrome.runtime.sendMessage({
        action: "getTaskSuggestions",
        task: newTaskTitle
      });
      addTask(
        response?.suggestions ? { ...taskData, aiSuggestions: response.suggestions } : taskData
      );
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskPriority("medium");
      setNewTaskDueDate("");
      setNewSubtasks([]);
      setNewReminders([]);
      setShowAddTask(false);
    } catch (error) {
      console.error("Failed to get AI suggestions:", error);
      addTask(taskData);
    }
  }, [
    newTaskTitle,
    newTaskDescription,
    newTaskPriority,
    newTaskDueDate,
    newSubtasks,
    newReminders,
    addTask
  ]);
  const toggleTaskExpansion = reactExports.useCallback((taskId) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  }, []);
  const { pendingTasks, completedTasks } = reactExports.useMemo(() => {
    const sorted = [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (!a.completed && !b.completed) {
        const aDate = a.dueDate ? new Date(a.dueDate) : null;
        const bDate = b.dueDate ? new Date(b.dueDate) : null;
        const aUrgent = aDate && (isPast(aDate) || isToday(aDate));
        const bUrgent = bDate && (isPast(bDate) || isToday(bDate));
        if (aUrgent !== bUrgent) return aUrgent ? -1 : 1;
        if (aDate && bDate) {
          const dateCompare = aDate.getTime() - bDate.getTime();
          if (dateCompare !== 0) return dateCompare;
        }
        if (aDate) return -1;
        if (bDate) return 1;
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return -1;
    });
    return {
      pendingTasks: sorted.filter((t) => !t.completed),
      completedTasks: sorted.filter((t) => t.completed)
    };
  }, [tasks]);
  if (!userPreferences.tasksEnabled) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-white mb-2", children: "Tasks Disabled" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70", children: "Enable tasks in settings to manage your to-do list." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card card-padding h-full flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col space-y-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "heading-secondary flex items-center space-x-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              animate: { rotate: [0, 360] },
              transition: { duration: 2, repeat: Infinity, ease: "linear" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-6 h-6" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Tasks" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.button,
          {
            onClick: () => setShowAddTask(!showAddTask),
            className: "btn-secondary interactive-element",
            whileHover: { scale: 1.1, rotate: 90 },
            whileTap: { scale: 0.9 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-5 h-5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/10 rounded-lg p-1 flex", children: ["list", "timeline"].map((view) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setActiveTaskView(view),
          className: `px-3 py-1 rounded-md text-sm font-medium transition-colors ${activeTaskView === view ? "bg-white/20 text-white" : "text-white/70 hover:text-white"}`,
          children: [
            view.charAt(0).toUpperCase() + view.slice(1),
            " View"
          ]
        },
        view
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showAddTask && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: "auto" },
        exit: { opacity: 0, height: 0 },
        className: "mb-8 overflow-hidden",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "task-card space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "Task title...",
              value: newTaskTitle,
              onChange: (e) => setNewTaskTitle(e.target.value),
              className: "w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/40",
              onKeyPress: (e) => e.key === "Enter" && handleAddTask(),
              autoFocus: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              placeholder: "Description (optional)...",
              value: newTaskDescription,
              onChange: (e) => setNewTaskDescription(e.target.value),
              className: "w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/40",
              rows: 3
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-white/70 mb-1", children: "Priority" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: newTaskPriority,
                  onChange: (e) => setNewTaskPriority(e.target.value),
                  className: "w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/40",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "low", children: "🟢 Low Priority" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "medium", children: "🟡 Medium Priority" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "high", children: "🔴 High Priority" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-white/70 mb-1", children: "Due Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "date",
                  value: newTaskDueDate,
                  onChange: (e) => setNewTaskDueDate(e.target.value),
                  className: "w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/40"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SubTaskEditor,
            {
              subtasks: newSubtasks,
              onAdd: handleAddSubtask,
              onDelete: handleDeleteSubtask,
              onToggle: (id) => {
                setNewSubtasks(
                  (prev) => prev.map((st) => st.id === id ? { ...st, completed: !st.completed } : st)
                );
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ReminderEditor,
            {
              reminders: newReminders,
              onAdd: handleAddReminder,
              onDelete: handleDeleteReminder
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-3 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.button,
              {
                onClick: handleAddTask,
                className: "flex-1 btn-primary",
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
                  "Add Task"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.button,
              {
                onClick: () => setShowAddTask(false),
                className: "btn-secondary",
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
                children: "Cancel"
              }
            )
          ] })
        ] })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: activeTaskView === "list" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      pendingTasks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-white/90 text-base font-bold mb-4 flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📋" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Pending (",
            pendingTasks.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: pendingTasks.map((task) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          TaskCard,
          {
            task,
            expanded: expandedTasks.has(task.id),
            onToggle: () => toggleTask(task.id),
            onExpand: () => toggleTaskExpansion(task.id),
            onDelete: () => deleteTask(task.id),
            priorityColorMap: priorityWeight
          },
          task.id
        )) })
      ] }),
      completedTasks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-white/90 text-base font-bold mb-4 flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "✅" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Completed (",
            completedTasks.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: completedTasks.map((task) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          TaskCard,
          {
            task,
            expanded: expandedTasks.has(task.id),
            onToggle: () => toggleTask(task.id),
            onExpand: () => toggleTaskExpansion(task.id),
            onDelete: () => deleteTask(task.id),
            priorityColorMap: priorityWeight
          },
          task.id
        )) })
      ] }),
      tasks.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "space-y-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/70", children: "No tasks yet." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.button,
              {
                onClick: () => setShowAddTask(true),
                className: "btn-primary",
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-5 h-5 mr-2" }),
                  "Create your first task"
                ]
              }
            )
          ]
        }
      ) })
    ] }) : (
      // Timeline View
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-4 top-0 bottom-0 w-px bg-white/20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6 pl-12", children: [...pendingTasks, ...completedTasks].map((task) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 },
            className: "relative",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `absolute -left-8 w-4 h-4 rounded-full border-2 ${task.completed ? "bg-green-500 border-green-600" : "bg-white border-white/50"}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TaskCard,
                {
                  task,
                  expanded: expandedTasks.has(task.id),
                  onToggle: () => toggleTask(task.id),
                  onExpand: () => toggleTaskExpansion(task.id),
                  onDelete: () => deleteTask(task.id),
                  priorityColorMap: priorityWeight
                }
              )
            ]
          },
          task.id
        )) })
      ] })
    ) })
  ] });
};

function SettingsPanel() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-semibold mb-2", children: "Settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-sm", children: "Placeholder settings panel. Theme and preferences coming soon." })
  ] });
}

const NotesOverview = () => {
  const [recentNotes, setRecentNotes] = reactExports.useState([]);
  reactExports.useEffect(() => {
    const loadNotes = async () => {
      const stored = await chrome.storage.local.get("notes");
      if (stored.notes) {
        setRecentNotes(stored.notes);
      }
    };
    loadNotes();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "glass-card p-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-semibold text-white mb-4 flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "mr-2" }),
          " Recent Notes"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: recentNotes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/70 text-center py-4", children: "No notes yet. Click to create your first note." }) : recentNotes.map((note) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-white/10 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-medium", children: note.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 text-sm line-clamp-2 mt-1", children: note.content }),
          note.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mt-2", children: note.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center text-xs bg-white/20 px-2 py-1 rounded", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 12, className: "mr-1" }),
            tag
          ] }, tag)) })
        ] }, note.id)) })
      ]
    }
  );
};

const AISuggestions = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "glass-card p-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-semibold text-white mb-4 flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "mr-2" }),
          " AI Suggestions"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/70 text-center py-4", children: "AI suggestions will be available soon. This feature is currently in development." })
      ]
    }
  );
};

const Clock = () => {
  const [time, setTime] = reactExports.useState(/* @__PURE__ */ new Date());
  reactExports.useEffect(() => {
    const timer = setInterval(() => {
      setTime(/* @__PURE__ */ new Date());
    }, 1e3);
    return () => clearInterval(timer);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-4xl font-light text-white mb-4", children: [
    time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg opacity-75", children: time.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }) })
  ] });
};

function App() {
  const {
    showSettings,
    setShowSettings,
    initializeApp
  } = useAppStore();
  const [isLoading, setIsLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const init = async () => {
      try {
        await initializeApp();
      } catch (error) {
        console.error("Failed to initialize app:", error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [initializeApp]);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 via-purple-800 to-indigo-900", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        className: "glass-card p-6",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-2xl font-light", children: "Loading Manage..." })
        ] })
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-800 via-purple-800 to-indigo-900", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Greeting, {})
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.button,
        {
          onClick: () => setShowSettings(!showSettings),
          className: "p-2 rounded-full hover:bg-white/10 transition-colors",
          whileHover: { scale: 1.1 },
          whileTap: { scale: 0.9 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-6 h-6 text-white" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showSettings && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        className: "mb-8",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsPanel, {})
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.2 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(TaskPanel, {})
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.3 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(NotesOverview, {})
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.4 },
          className: "space-y-8",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(AISuggestions, {})
        }
      )
    ] })
  ] }) }) });
}

client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);

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

export { storageService as s };

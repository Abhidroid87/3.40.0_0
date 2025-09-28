import { create } from 'zustand';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AppState {
  tasks: Task[];
  isAuthenticated: boolean;
  user: User | null;
  hasCompletedOnboarding: boolean;
  addTask: (task: Task) => void;
  toggleTask: (taskId: string) => void;
  removeTask: (taskId: string) => void;
  signOut: () => void;
  completeOnboarding: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  tasks: [],
  isAuthenticated: false,
  user: null,
  hasCompletedOnboarding: false,
  addTask: (task: Task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),
  toggleTask: (taskId: string) =>
    set((state) => ({
      tasks: state.tasks.map((task: Task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    })),
  removeTask: (taskId: string) =>
    set((state) => ({
      tasks: state.tasks.filter((task: Task) => task.id !== taskId),
    })),
  signOut: () => 
    set(() => ({
      isAuthenticated: false,
      user: null
    })),
  completeOnboarding: () =>
    set(() => ({
      hasCompletedOnboarding: true
    }))
}));
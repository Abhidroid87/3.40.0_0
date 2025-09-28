import React from 'react';
import { useCallback } from 'react';
import { useAppStore } from '../store/appStore';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const TaskPanel: React.FC = () => {
  const tasks = useAppStore((state) => state.tasks);
  const toggleTask = useAppStore((state) => state.toggleTask);

  const handleToggleTask = useCallback((taskId: string) => {
    toggleTask(taskId);
  }, [toggleTask]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Today's Tasks</h2>
      <div className="space-y-3">
        {tasks.map((task: Task) => (
          <div key={task.id} className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTask(task.id)}
              className="h-4 w-4 text-blue-600"
            />
            <span className={`${task.completed ? 'line-through text-gray-400' : ''}`}>
              {task.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskPanel;
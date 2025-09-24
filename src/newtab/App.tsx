import React, { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import Dashboard from '../components/Dashboard/Dashboard';
import PopupPanel from '../components/Popup/PopupPanel';

/**
 * Main app component for the new tab page
 * Loads user data and displays the dashboard
 */
function App() {
  const { loadTasks, loadNotes } = useAppStore();

  useEffect(() => {
    // Initialize app data when component mounts
    const initializeApp = async () => {
      try {
        await Promise.all([
          loadTasks(),
          loadNotes()
        ]);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, [loadTasks, loadNotes]);

  return (
    <>
      <Dashboard />
      <PopupPanel />
    </>
  );
}

export default App;
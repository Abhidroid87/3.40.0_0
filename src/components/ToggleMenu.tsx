import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls, Reorder } from 'framer-motion';
import { FiBookmark, FiX, FiMinimize2, FiMaximize2, FiBookOpen, FiShoppingBag, FiMap } from 'react-icons/fi';
import { BiBot } from 'react-icons/bi';
import { useToggleMenu } from '../contexts/ToggleMenuContext';
import { Note, addNote as addFirebaseNote, getUserNotes, deleteNote as deleteFirebaseNote } from '../services/notes';
import { useAuth } from '../contexts/AuthContext';
import { useGeminiContext } from '../contexts/GeminiContext';
import { extractProductDetails } from '../utils/productExtractor';
import { getPlatform } from '../utils/platform';

interface ToggleMenuProps {
  platform?: 'youtube' | 'shopping' | 'default';
}

interface Position {
  x: number;
  y: number;
}

export const ToggleMenu: React.FC<ToggleMenuProps> = ({ platform = 'default' }) => {
  const { isOpen, toggleMenu } = useToggleMenu();
  const { summarizeText, generateRecommendations, isProcessing } = useGeminiContext();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'ai' | 'shopping' | 'travel'>('notes');
  const [opacity, setOpacity] = useState(0.95);
  const dragControls = useDragControls();
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  const loadNotes = async () => {
    if (user) {
      const userNotes = await getUserNotes(user.uid, platform);
      setNotes(userNotes);
    }
  };

  const addNote = async () => {
    if (newNote.trim() && user) {
      const note = {
        content: newNote,
        timestamp: new Date(),
        userId: user.uid,
        platform,
        url: window.location.href
      };
      
      await addFirebaseNote(note);
      await loadNotes();
      setNewNote('');
    }
  };

  const deleteNote = async (id: string) => {
    await deleteFirebaseNote(id);
    await loadNotes();
  };

  return (
    <div className="fixed right-0 top-1/4 z-50">
      <button
        onClick={toggleMenu}
        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-l-lg shadow-lg"
      >
        <FiBookmark size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className={`fixed right-0 top-0 h-full w-80 shadow-xl backdrop-blur-md ${
              platform === 'youtube' 
                ? 'bg-black/75 text-white' 
                : platform === 'shopping'
                ? 'bg-white/90 dark:bg-gray-800/90'
                : 'bg-white/95 dark:bg-gray-800/95'
            }`}
            style={{ 
              '--tw-backdrop-blur': 'blur(8px)',
              backdropFilter: 'var(--tw-backdrop-blur)',
              WebkitBackdropFilter: 'var(--tw-backdrop-blur)'
            } as React.CSSProperties}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Notes</h2>
                <button
                  onClick={toggleMenu}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="mb-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a new note..."
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={3}
                />
                <button
                  onClick={addNote}
                  className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
                >
                  Add Note
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg relative group"
                  >
                    <p className="text-sm dark:text-white">{note.content}</p>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 block">
                      {new Date(note.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
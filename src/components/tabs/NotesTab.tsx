import React from 'react';
import { VideoTimestamp, formatTimestamp, getCurrentVideoTime } from '../utils/youtubeUtils';

interface NotesTabProps {
  notes: Note[];
  newNote: string;
  setNewNote: (note: string) => void;
  addNote: () => void;
  deleteNote: (id: string) => void;
  platform: string;
  summarizeText?: (text: string) => Promise<string>;
}

export const NotesTab: React.FC<NotesTabProps> = ({
  notes,
  newNote,
  setNewNote,
  addNote,
  deleteNote,
  platform,
  summarizeText
}) => {
  const handleAddTimestampedNote = () => {
    if (platform === 'youtube') {
      const timestamp = getCurrentVideoTime();
      setNewNote(`[${formatTimestamp(timestamp)}] ${newNote}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a new note..."
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={3}
        />
        <div className="flex gap-2">
          <button
            onClick={addNote}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
          >
            Add Note
          </button>
          {platform === 'youtube' && (
            <button
              onClick={handleAddTimestampedNote}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
            >
              Add Timestamp
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-300px)]">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg relative group"
          >
            <p className="text-sm dark:text-white">{note.content}</p>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              {summarizeText && (
                <button
                  onClick={() => summarizeText(note.content)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Summarize
                </button>
              )}
              <button
                onClick={() => deleteNote(note.id)}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 block">
              {new Date(note.timestamp).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
import React from 'react';

const AISummary: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">AI Summary</h2>
      <p className="text-gray-600 dark:text-gray-300">
        Your activity summary will appear here...
      </p>
    </div>
  );
};

export default AISummary;
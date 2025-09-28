import React from 'react';

const Greeting: React.FC = () => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
      <p className="text-gray-600 dark:text-gray-300">Ready to continue where you left off?</p>
    </div>
  );
};

export default Greeting;
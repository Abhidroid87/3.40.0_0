import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ToggleMenuContextType {
  isOpen: boolean;
  toggleMenu: () => void;
}

const ToggleMenuContext = createContext<ToggleMenuContextType | undefined>(undefined);

export const ToggleMenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ToggleMenuContext.Provider value={{ isOpen, toggleMenu }}>
      {children}
    </ToggleMenuContext.Provider>
  );
};

export const useToggleMenu = () => {
  const context = useContext(ToggleMenuContext);
  if (context === undefined) {
    throw new Error('useToggleMenu must be used within a ToggleMenuProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface GeminiContextType {
  summarizeText: (text: string) => Promise<string>;
  generateRecommendations: (context: any) => Promise<string>;
  isProcessing: boolean;
}

const GeminiContext = createContext<GeminiContextType | undefined>(undefined);

export const GeminiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const summarizeText = async (text: string): Promise<string> => {
    setIsProcessing(true);
    try {
      const prompt = `Please summarize the following text concisely: ${text}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error summarizing text:', error);
      return 'Failed to generate summary';
    } finally {
      setIsProcessing(false);
    }
  };

  const generateRecommendations = async (context: any): Promise<string> => {
    setIsProcessing(true);
    try {
      const prompt = `Based on this context: ${JSON.stringify(context)}, please provide relevant recommendations.`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return 'Failed to generate recommendations';
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <GeminiContext.Provider value={{ summarizeText, generateRecommendations, isProcessing }}>
      {children}
    </GeminiContext.Provider>
  );
};

export const useGeminiContext = () => {
  const context = useContext(GeminiContext);
  if (context === undefined) {
    throw new Error('useGeminiContext must be used within a GeminiProvider');
  }
  return context;
};
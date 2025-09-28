import { db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';

export interface Note {
  id: string;
  content: string;
  timestamp: Date;
  userId: string;
  platform?: string;
  url?: string;
}

export const addNote = async (note: Omit<Note, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'notes'), note);
  return docRef.id;
};

export const getUserNotes = async (userId: string, platform?: string): Promise<Note[]> => {
  const constraints = [
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  ];
  
  if (platform) {
    constraints.push(where('platform', '==', platform));
  }

  const q = query(collection(db, 'notes'), ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp.toDate()
  })) as Note[];
};

export const deleteNote = async (noteId: string): Promise<void> => {
  await deleteDoc(doc(db, 'notes', noteId));
};

export const getPageNotes = async (userId: string, url: string): Promise<Note[]> => {
  const q = query(
    collection(db, 'notes'),
    where('userId', '==', userId),
    where('url', '==', url),
    orderBy('timestamp', 'desc')
  );
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp.toDate()
  })) as Note[];
};
import { firebase } from '../config/environment';

export const app = firebase.app;
export const auth = firebase.auth;
export const db = firebase.db;

/**
 * Helper to ensure Firebase has been initialized before use.
 */
export const ensureFirebase = () => firebase;

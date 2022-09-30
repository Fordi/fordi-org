import { useEffect } from 'preact/hooks';
import { onCall, offCall } from './spy.js';

let listenerOn = false;
let storeCount = 0;

const storageEvents = new WeakMap();

// Global event listener for storage.
// This gets attached on first use of `useSessionStorage` or `useLocalStorage`,
// and cleaned up if there are no instances on the page.
const storageEventListener = (event) => {
  const { key, storageArea } = event;
  // Fast-fails
  const keyListeners = storageEvents.get(storageArea);
  // Not listening on this store
  if (!keyListeners) return;
  // Not listening to this key
  if (key && !(key in keyListeners)) return;
  // No key means a global change (like .clear())
  if (!key) {
    Object.keys(keyListeners).forEach((k) => {
      keyListeners[k].forEach((handler) => handler(event));
    });
  } else {
    // Run any listeners
    keyListeners[key].forEach((handler) => handler(event));
  }
};
// Context for this function, via `onCall` will be the passed
// in context object, a.k.a., the store.
const storageChangeListener = (key, newValue) => {
  const oldValue = key && this.getItem(key);
  // Notify the storage listener with a pseudo-event
  storageEventListener({
    storageArea: this,
    key,
    newValue,
    oldValue,
    url: window.location.href,
  });
};

const startListening = () => {
  // If already listening, skip this.
  if (listenerOn) return;
  listenerOn = true;
  // Captures storage events coming from another window.
  window.addEventListener('storage', storageEventListener);
};

const startListeningTo = (store) => {
  // Not already listening to this store
  if (!storageEvents.has(store)) {
    // Storage events don't happen on the same window.
    // Pay attention to storage-changing methods so we
    //  have awareness of in-app changes.
    onCall(sessionStorage, 'setItem', storageChangeListener);
    onCall(sessionStorage, 'removeItem', storageChangeListener);
    onCall(sessionStorage, 'clear', storageChangeListener);
    // make a hash for keys
    storageEvents.set(store, {});
    // Weakmaps don't keep a length, so we need to.
    storeCount += 1;
  }
  return storageEvents.get(store);
};

const stopListening = () => {
  // If not listening, skip this.
  if (!listenerOn) return;
  listenerOn = false;
  // Remove the event listener
  window.removeEventListener('storage', storageEventListener);
};

const stopListeningTo = (store) => {
  // Already not listening.  Skip.
  if (storageEvents.has(store)) {
    // Remove the change listeners
    offCall(sessionStorage, 'setItem', storageChangeListener);
    offCall(sessionStorage, 'removeItem', storageChangeListener);
    offCall(sessionStorage, 'clear', storageChangeListener);
    // Clean up
    storageEvents.delete(store, {});
    storeCount -= 1;
  }
  return storeCount !== 0;
};

/**
 * Hook that triggers each time a the value for storage key is changed
 * @param {Storage} store the storage area to listen on
 * @param {string} key the key to listen to
 * @param {function} listener function to call when the key changes
 * @returns void
 */
const useStorageEffect = (store, key, listener) => {
  // Listen for changes to `store.getItem(key)`
  // Un-listens and re-listens if `key` or `listener` changes
  useEffect(() => {
    // Listen globally if we weren't already.
    startListening(store);
    // Listen to this store if we weren't already.
    const keyListeners = startListeningTo(store);
    // If we weren't already listening on this key,
    // create the set.
    if (!keyListeners[key]) {
      keyListeners[key] = new Set();
    }
    const keySet = keyListeners[key];
    // Add the listener
    keySet.add(listener);
    // Return a cleanup function
    return () => {
      // Remove the listener
      keySet.delete(listener);

      // If no more listeners for this key, cleanup
      // the key altogether to reduce overhead.
      if (keySet.size === 0) {
        delete keyListeners[key];
      }
      // If no listeners are left for this store, stop listening to it.
      if (Object.keys(keyListeners).length === 0) {
        // If there are no more stores still being listened to
        if (!stopListeningTo(store)) {
          // Stop listening altogether.
          stopListening();
        }
      }
    };
  }, [key, listener]);
};

export default useStorageEffect;

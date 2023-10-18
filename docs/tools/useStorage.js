import { useState, useEffect, useCallback } from "preact/hooks";
import useStorageEffect from "./useStorageEffect.js";

function updateStorage(store, stateKey, state) {
  const current = store.getItem(stateKey);
  if (state === null || state === undefined) {
    if (current) {
      store.removeItem(stateKey);
    }
    return;
  }
  // Don't trigger storage events without a change.
  const json = JSON.stringify(state);
  if (json === current) {
    return;
  }
  store.setItem(stateKey, json);
}

/**
 * Like `useState`, but the state is kept in storage as JSON
 * @param {Storage} store the place to keep data
 * @param {String} storageKey Key under which to store the state
 * @param {Stringable} defaultValue state to start with if there is no
 *  pre-existing data
 * @returns state and setter
 */
export const useStorage = (store, stateKey, defaultValue) => {
  // Lock the initial value.
  const [initialValue] = useState(defaultValue);

  // Gets the initial state, or default if no valid state
  // is stored.
  const initialize = useCallback(() => {
    const stored = store.getItem(stateKey);
    if (stored) {
      try {
        return JSON.parse(stored ?? "");
      } catch (e) {
        // fall through
      }
    }
    // No stored state, or state is invalid; return the default
    return initialValue;
  }, [store, stateKey, initialValue]);

  // Initialize state
  const [state, setState] = useState(initialize);

  // When stateKey changes (a dependency of `initialize`), reinitialize
  // This will also happen if `defaultValue` changes without `stateKey`.
  useEffect(() => setState(initialize()), [initialize]);

  // when `state` changes, update storage to match
  useEffect(() => updateStorage(store, stateKey, state), [state]);

  // Callback to be called whenever the value for
  // `store.getItem(key)` changes.
  const onStorageChange = useCallback(
    (event) => {
      const { newValue } = event;
      // Don't trigger storage events without a change.
      const json = JSON.stringify(state);
      if (newValue === json) {
        return;
      }
      let newState = initialValue;
      try {
        // Attempt to parse.
        newState = JSON.parse(newValue ?? "");
      } catch (e) {
        /* fall through */
      }
      // Update the state with the new data.
      setState(newState);
    },
    [state, initialValue]
  );

  // Listen for changes to the stored value for `stateKey`.
  useStorageEffect(store, stateKey, onStorageChange);

  // Return value matches the signature used on `useState`
  return [state, setState];
};

/**
 * Like `useState`, but the state is kept in sessionStorage as JSON
 * @param {String} storageKey Key under which to store the state
 * @param {Stringable} defaultValue state to start with if there is no
 *  pre-existing data
 * @returns state and setter
 */
export const useSessionStorage = (storageKey, defaultValue) =>
  useStorage(sessionStorage, storageKey, defaultValue);

/**
 * Like `useState`, but the state is kept in localStorage as JSON
 * @param {String} storageKey Key under which to store the state
 * @param {Stringable} defaultValue state to start with if there is no
 *  pre-existing data
 * @returns state and setter
 */
export const useLocalStorage = (storageKey, defaultValue) =>
  useStorage(localStorage, storageKey, defaultValue);

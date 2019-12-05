import { useState, useEffect, useMemo } from "react";
import { createStore } from "../core";

/**
 * @template S , A
 * @param {import("../core").Store<S, A>} store
 * @returns {(sensitiveStateKeys: (keyof S)[], listener: Function) => [S, A]}
 */
export function createHooks(store) {
  return function(sensitiveStateKeys, listener) {
    if (typeof listener !== "function") listener = useState()[1];

    useEffect(() => {
      return store.addListener(listener, sensitiveStateKeys).remove;
    }, []);

    return [store.state, store.actions];
  };
}

/**
 * @template S , A
 * @param {S} initialState
 * @param {A} actions
 * @param {(keyof S)[]} sensitiveStateKeys
 * @param {()=>void} listener
 * @returns {[S,A]}
 */
export function useLocalStore(
  initialState,
  actions,
  sensitiveStateKeys,
  listener,
) {
  const useStore = useMemo(() => {
    const localStore = createStore(initialState, actions);
    return createHooks(localStore);
  }, []);
  return useStore(sensitiveStateKeys, listener);
}

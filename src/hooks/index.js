// @ts-check

import { useState, useEffect, useRef } from "react";
import { createStore } from "../core";

/**
 * @template S , A
 * @typedef {(sensitiveStateKeys?: (keyof S)[], listener?: (S) => void) => [S, A]} UseHook
 */

/**
 * @template S , A
 * @param {import("../core").Store<S, A>} store
 * @returns {UseHook<S,A>}
 */
export function createHooks(store) {
  /**@type {UseHook<S,A>} */
  function useHook(sensitiveStateKeys, listener) {
    const [, forceUpdate] = useState();
    /**@type {{current: () => void | undefined}} */
    const listenerRemove = useRef();
    if (typeof listener !== "function") listener = forceUpdate;

    useEffect(() => {
      listenerRemove.current?.();

      listenerRemove.current = store.addListener(
        listener,
        sensitiveStateKeys,
      ).remove;

      return listenerRemove.current;
    }, [listener, sensitiveStateKeys]);

    return [store.state, store.actions];
  }
  return useHook;
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
  const useStore = useState(() => {
    const localStore = createStore(initialState, actions);
    return createHooks(localStore);
  })[0];
  return useStore(sensitiveStateKeys, listener);
}

import { useMemo } from "react";
import { createStore } from "@stately/core";
import { createHooks } from "@stately/hooks";

/** @typedef {import("@stately/core").store} store */

/**
 * create global states and actions
 * @template S
 * @template A
 * @type {function}
 * @param {S} initialState
 * @param {A} actions
 * @param {(store: store<S, A>) => void} initializer
 * @returns {[ (sensitiveStateKeys: [keyof S], listener: Function) => [S, A],
 *  () => [S, A] ]
 * }
 */
export function createState(initialState, actions, initializer) {
  const store = createStore(initialState, actions, initializer);
  return [createHooks(store), () => [store.state, store.actions], store];
}

/**
 * Create states and actions privately inside of a function component.
 * This is useful for more own state needed in component.
 * @template stateT , actionsT
 * @param {()=>stateT} initialState
 * @param {()=>actionsT} actions
 * @param {Array<keyof stateT>} sensitiveStateKeys
 * @param {()=>void} listener
 * @returns {[stateT,actionsT]}
 */
export function useLocalStore(
  initialState,
  actions,
  sensitiveStateKeys,
  listener,
) {
  const useStore = useMemo(() => {
    const localStore = createStore(initialState(), actions());
    return createHooks(localStore);
  }, []);
  return useStore(sensitiveStateKeys, listener);
}

export { createStore, createHooks };

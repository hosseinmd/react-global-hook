"use strict";

import { createStore } from "./core";
import { createHooks, useLocalStore } from "./hooks";

/**
 * @deprecated Please use createStore
 * @template S , A
 * @type {function}
 * @param {S} initialState
 * @param {A} actions
 * @param {(store: import("./core").Store<S, A>) => void} initializer
 * @returns {[ (sensitiveStateKeys: (keyof S)[], listener: (S) => void) => [S, A],() => [S, A] ]}
 */
export function createState(initialState, actions, initializer) {
  const store = createStore(initialState, actions, initializer);
  return [createHooks(store), () => [store.state, store.actions], store];
}

export { createStore, createHooks, useLocalStore };

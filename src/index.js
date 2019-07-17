"use strict";

import { createStore } from "@stately/core";
import { createHooks } from "@stately/hooks";

/** @typedef {import("@stately/core").store} store */

/**
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

export { createStore, createHooks };

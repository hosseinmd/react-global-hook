"use strict";

import { setState } from "./lib/setState";
import { associateActions } from "./lib/Actions";
import { addListener } from "./lib/Listener";

/**
 * @template S , A
 * @typedef {object} Store
 * @property {S} state
 * @property {A} actions
 * @property {(listener: (S) => void, sensitiveStatesKey: (keyof S)[]) => { remove: () => {} }} addListener
 * @property {(partialState: S) => void} setState
 */

/**
 * @template S , A
 * @param {S} initialState
 * @param {A} actions
 * @param {(store: Store<S, A>) => void} initializer
 * @returns {Store<S, A>}
 */
export const createStore = (initialState, actions, initializer) => {
  const store = { state: initialState, __listeners: {} };
  store.setState = setState.bind(store);
  store.addListener = addListener.bind(store);
  store.actions = associateActions(store, actions);
  typeof initializer == "function" && initializer(store);
  return store;
};

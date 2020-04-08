//@ts-check

import React, { useRef, memo } from "react";
import {
  Provider as RPProvider,
  createStore as RPCreateStore,
  createReducer,
} from "react-principal";

/**
 * @template S , A
 * @typedef {object} Store
 * @property {A} actions
 * @property {() => S} getState,
 * @property {(sensitiveStatesKey: (keyof S)[]) => S} useState,
 * @property {(
  listener: (S) => void,
  sensitiveStatesKey: (keyof S)[],
) => { remove: () => {} }} addListener
 * @property {(partialState: S) => void} setState
 */

/**
 * @template S , A
 * @param {S} initialState
 * @param {({ setState, getState }) => A} actions
 * @param {(store: S) => S} [initializer]
 * @returns {Store<S, A>}
 */
export const createStore = (initialState, actions, initializer) => {
  const resolvedInitialState = { ...initialState, [LISTENERS_KEY]: {} };
  const SET_STATE = "SET_STATE";

  const getState = () => store.ref.current?.state;
  const getDispatch = () => store.ref.current?.dispatch;

  const reducer = createReducer({
    [SET_STATE]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  });

  const setState = (partialState) => {
    const dispatch = getDispatch();
    dispatch({ type: SET_STATE, payload: partialState });
  };

  const store = {
    _RPStore: RPCreateStore({
      reducer,
      // @ts-ignore
      initialState: resolvedInitialState,
    }),
    _onStateDidChange: (state, { type, payload }) => {
      callListeners(state, payload);
    },
    _initializer: initializer,
    useState: (sensitiveStatesKey) => {
      const nextObserveValue = () => {
        return sensitiveStatesKey?.reduce(
          (previousValue, currentValue) => ({
            ...previousValue,
            [currentValue]: true,
          }),
          {},
        );
      };
      return store._RPStore.useState(nextObserveValue);
    },
    actions: actions({ setState, getState }),
    addListener: addListener.bind(null, resolvedInitialState),
    setState,
    getState,
  };

  return store;
};

/**
 * @type {React.FC<{ store: any }>}
 */
export const Provider = memo(({ children, store }) => {
  store.ref = useRef();
  return (
    <RPProvider
      ref={store.ref}
      onStateDidChange={store._onStateDidChange}
      store={store._RPStore}
      initializer={store._initializer}
    >
      {children}
    </RPProvider>
  );
});

const LISTENERS_KEY = Symbol("Listeners key");

function callListeners(state, newState) {
  const __listeners = state[LISTENERS_KEY];
  let queueUpdate = [];
  Object.keys(newState).forEach((key) => {
    if (!__listeners[key]) {
      return;
    }

    __listeners[key].forEach((listener) => {
      if (!queueUpdate.includes(listener)) queueUpdate.push(listener);
    });
  });

  queueUpdate.forEach((listener) => {
    typeof listener === "function" && listener(state);
  });
}

function addListener(state, listener, sensitiveStatesKey) {
  const __listeners = state[LISTENERS_KEY];

  if (!Array.isArray(sensitiveStatesKey)) {
    sensitiveStatesKey = Object.keys(state);
  }

  for (const stateKey of sensitiveStatesKey) {
    __listeners[stateKey]
      ? __listeners[stateKey].push(listener)
      : (__listeners[stateKey] = [listener]);
  }

  return {
    remove: () => {
      for (const stateKey of sensitiveStatesKey) {
        __listeners[stateKey] = __listeners[stateKey].filter(
          (prevListener) => prevListener !== listener,
        );
      }
    },
  };
}

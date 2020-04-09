//@ts-check

import React, { useRef, memo } from "react";
import {
  Provider as RPProvider,
  createStore as RPCreateStore,
  createReducer,
} from "react-principal";
import { LISTENERS_KEY } from "./constants";
import { createAddListener, callListeners } from "./lib/Listener";

/**
 * @template S , A
 * @typedef {object} Store
 * @property {A} actions
 * @property {() => S} getState,
 * @property {(sensitiveStatesKey?: (keyof S)[]) => S} useState,
 * @property {(
  listener: (S) => void,
  sensitiveStatesKey: (keyof S)[],
) => { remove: () => void }} addListener
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

  const getState = () => store.ref.current?.state;
  const getDispatch = () => store.ref.current?.dispatch;

  const useState = (sensitiveStatesKey) => {
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
  };

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
    actions: actions({ setState, getState }),
    addListener: createAddListener(resolvedInitialState),
    useState,
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

const SET_STATE = "SET_STATE";

const reducer = createReducer({
  [SET_STATE]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
});

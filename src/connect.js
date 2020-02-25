// @ts-check

"use strict";

import React from "react";
import { createHooks } from "./hooks";

/**
 * @param {any} props
 * @param {any} state
 * @param {any} actions
 */
const DefaultMergeStatesAndActionsToProp = (props, state, actions) => ({
  ...props,
  ...state,
  ...actions,
});

/**
 * @template S , A
 * @param {import("./core").Store<S, A>} store
 * @param {(props: any,state: S, actions: A) => any} mergeStatesAndActionsToProp
 */
export const connect = (
  store,
  mergeStatesAndActionsToProp = DefaultMergeStatesAndActionsToProp,
) =>
  /**
   * @template C
   * @param {React.ComponentType<C>} Comp
   * @returns {React.ComponentType<C>}
   */
  Comp => {
    const useStore = createHooks(store);
    return props => {
      useStore();

      const merged = mergeStatesAndActionsToProp(
        props,
        store.state,
        store.actions,
      );

      return <Comp {...merged} />;
    };
  };

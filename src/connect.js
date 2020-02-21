"use strict";

import React from "react";
import { createHooks } from "./hooks";

const DefaultMergeStatesAndActionsToProp = (props, state, actions) => ({
  ...props,
  ...state,
  ...actions,
});

/**
 * @template S , A , C
 * @param {import("./core").Store<S, A>} store
 * @param {(props: any,state: S, actions: A) => any} mergeStatesAndActionsToProp
 */
export const connect = (
  store,
  mergeStatesAndActionsToProp = DefaultMergeStatesAndActionsToProp,
) =>
  /**
   * @template C
   * @param {C} Comp
   * @returns {C}
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

// @ts-check

import React, { memo, forwardRef } from "react";

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
 * @param {(keyof S)[]} [sensitiveStatesKey]
 * @param {(props: any, state: S, actions: A) => any} [mergeStatesAndActionsToProp]
 */
export const connect = (
  store,
  sensitiveStatesKey,
  mergeStatesAndActionsToProp = DefaultMergeStatesAndActionsToProp,
) =>
  /**
   * @template C
   * @param {React.ComponentType<C>} Comp
   * @returns {React.ForwardRefRenderFunction<C>}
   */
  (Comp) => {
    return memo(
      forwardRef((props, ref) => {
        const state = store.useState(sensitiveStatesKey);
        const actions = store.actions;

        const merged = mergeStatesAndActionsToProp(props, state, actions);

        return <Comp {...merged} {...{ ref }} />;
      }),
    );
  };

function createHOC(getWrapperComponent, wrapperName = "withHOC") {
  return (WrappedComponent) => {
    const WrapperComponent = getWrapperComponent(WrappedComponent);
    WrapperComponent.router = WrappedComponent.router;

    WrapperComponent.displayName = `${wrapperName}(${getDisplayName(
      WrappedComponent,
    )})`;

    return WrapperComponent;
  };
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

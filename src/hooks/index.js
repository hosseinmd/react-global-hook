// @ts-check
import { useRef, useMemo } from "react";
import { useReducer } from "react";

/**
 * @template S , A
 * @typedef {(sensitiveStateKeys?: (keyof S)[]) => [S, A]} UseHook
 */

/**
 * @template S , A
 * @param {import("../core").Store<S, A>} store
 * @returns {UseHook<S, A>}
 */
export function createHooks(store) {
  /**
   * @type {UseHook<S, A>}
   */
  const useStore = (sensitiveStatesKey) => {
    const state = store.useState(sensitiveStatesKey);
    return [state, store.actions];
  };
  return useStore;
}

/**
 * @template S , A
 * @param {S} initialState
 * @param {(self: {
  setState: (partialState: S) => void;
  getState: () => S;
}) => A} actions
 * @param {(partialState: S) => S} initializer
 * @returns {[S, A]}
 */
export function useLocalStore(initialState, actions, initializer) {
  /**
   * @type {[S, (any) => void]}
   */
  const [state, dispatch] = useReducer(reducer, initialState, initializer);

  const stateRef = useRef(state);
  stateRef.current = state;

  const createdActions = useMemo(() => {
    const setState = (partialState) => {
      dispatch({ payload: partialState });
    };

    const getState = () => stateRef.current;

    return actions({ setState, getState });
  }, []);

  return [state, createdActions];
}

const reducer = (state, { payload }) => ({
  ...state,
  ...payload,
});

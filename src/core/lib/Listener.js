// @ts-check
import { LISTENERS_KEY } from "../constants";

/**
 * @this {any}
 */
export function createAddListener(state) {
  function addListener(listener, sensitiveStatesKey) {
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

  return addListener;
}

export function callListeners(state, newState) {
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

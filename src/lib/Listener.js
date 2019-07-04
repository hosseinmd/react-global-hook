"use strict";

const Listener = {
  add(store, listener, sensitiveStatesKey) {
    if (!Array.isArray(sensitiveStatesKey))
      sensitiveStatesKey = Object.keys(store.state);

    for (const stateKey of sensitiveStatesKey) {
      store.__listeners[stateKey] = [
        ...(store.__listeners[stateKey] || []),
        listener,
      ];
    }

    return {
      remove: () => {
        for (const stateKey of sensitiveStatesKey) {
          store.__listeners[stateKey] = store.__listeners[stateKey].filter(
            prevListener => prevListener !== listener,
          );
        }
      },
    };
  },
};
export default Listener;

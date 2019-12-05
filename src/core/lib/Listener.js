"use strict";

export function addListener(listener, sensitiveStatesKey) {
  if (!Array.isArray(sensitiveStatesKey))
    sensitiveStatesKey = Object.keys(this.state);

  for (const stateKey of sensitiveStatesKey) {
    this.__listeners[stateKey]
      ? this.__listeners[stateKey].push(listener)
      : (this.__listeners[stateKey] = [listener]);
  }

  return {
    remove: () => {
      for (const stateKey of sensitiveStatesKey) {
        this.__listeners[stateKey] = this.__listeners[stateKey].filter(
          prevListener => prevListener !== listener,
        );
      }
    },
  };
}

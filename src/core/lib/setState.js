"use strict";

export function setState(newState = {}) {
  Object.assign(this.state, { ...newState });
  let queueUpdate = [];
  for (const key in newState) {
    if (newState.hasOwnProperty(key) && this.__listeners[key])
      for (const listener of this.__listeners[key]) {
        if (!queueUpdate.includes(listener)) queueUpdate.push(listener);
      }
  }
  for (const listener of queueUpdate) {
    typeof listener == "function" && listener({ ...this.state });
  }
}

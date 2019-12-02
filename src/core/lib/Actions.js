"use strict";

export function associateActions(store, actions = {}) {
  const associatedActions = {};
  for (const key in actions) {
    if (actions.hasOwnProperty(key)) {
      if (typeof actions[key] === "function") {
        associatedActions[key] = actions[key].bind(null, store);
      } else if (typeof actions[key] === "object") {
        associatedActions[key] = associateActions(store, actions[key]);
      }
    }
  }
  return associatedActions;
}

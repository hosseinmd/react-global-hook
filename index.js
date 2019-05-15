import React from "react";

function setState(newState = {}) {
  this.state = { ...this.state, ...newState };
  let queueUpdate = [];
  Object.keys(newState).forEach(key => {
    if (this.listeners[key])
      this.listeners[key].forEach(listener => {
        if (!queueUpdate.includes(listener)) queueUpdate.push(listener);
      });
  });
  queueUpdate.forEach(listener => {
    listener(this.state);
  });
}

function useGlobal(sensitiveStateKeys, listener) {
  if (typeof listener !== "function") listener = React.useState()[1];
  if (!Array.isArray(sensitiveStateKeys))
    sensitiveStateKeys = Object.keys(this.state);
  React.useEffect(() => {
    sensitiveStateKeys.forEach(stateKey => {
      this.listeners[stateKey] = [
        ...(this.listeners[stateKey] || []),
        listener
      ];
    });
    return () => {
      sensitiveStateKeys.forEach(stateKey => {
        this.listeners[stateKey] = this.listeners[stateKey].filter(
          prevListener => prevListener !== listener
        );
      });
    };
  }, []);
  return [this.state, this.actions];
}

function associateActions(store, actions = {}) {
  const associatedActions = {};
  Object.keys(actions).forEach(key => {
    if (typeof actions[key] === "function") {
      associatedActions[key] = actions[key].bind(null, store);
    }
    if (typeof actions[key] === "object") {
      associatedActions[key] = associateActions(store, actions[key]);
    }
  });
  return associatedActions;
}

export const createState = (initialState, actions, initializer) => {
  const store = { state: initialState, listeners: {} };
  store.setState = setState.bind(store);
  store.actions = associateActions(store, actions);
  if (initializer) initializer(store);
  return [useGlobal.bind(store), () => [store.state, store.actions]];
};

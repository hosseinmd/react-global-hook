"use strict";

import { setState } from "./lib/setState";
import { useState } from "./lib/hooks";
import { associateActions } from "./lib/Actions";

export const createState = (initialState, actions, initializer) => {
  const store = { state: initialState, __listeners: {} };
  store.setState = setState.bind(store);
  store.actions = associateActions(store, actions);
  if (initializer) initializer(store);
  return [useState.bind(store), () => [store.state, store.actions]];
};

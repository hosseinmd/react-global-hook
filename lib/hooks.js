"use strict";

import React from "react";
import Listener from "./Listener";

export function useState(sensitiveStateKeys, listener) {
  if (typeof listener !== "function") listener = React.useState()[1];

  React.useEffect(() => {
    return Listener.add(this, listener, sensitiveStateKeys).remove;
  }, []);
  return [this.state, this.actions];
}

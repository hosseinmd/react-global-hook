[![NPM](https://nodei.co/npm/react-global-hook.png)](https://nodei.co/npm/react-global-hook/)

[![install size](https://packagephobia.now.sh/badge?p=react-global-hook)](https://packagephobia.now.sh/result?p=react-global-hook) [![dependencies](https://david-dm.org/hosseinmd/react-global-hook.svg)](https://david-dm.org/hosseinmd/react-global-hook.svg)

# react-global-hook

Easy state management for react & react-native using hooks.

## install

```npm
npm i react-global-hook --save
```

---

### use

```javascript
import React from "react";
import { createState } from "react-global-hook";

const initialState = {
  counter: 0
};

const actions = {
  addToCounter: (store, amount) => {
    const newCounterValue = store.state.counter + amount;
    store.setState({ counter: newCounterValue });
  }
};

const { useGlobal, getGlobal } = createState(React, initialState, actions);

const App = () => {
  const [globalState, globalActions] = useGlobal(["counter"]);
  // this component update just when `counter` did update
  // if useGlobal parameter isn't defined this function will be update at any change state
  // if parameter is empty array like [] this function will never be update
  // if 2nd parameter define function this function will be run instead update componentF
  return (
    <div>
      <p>
        counter:
        {globalState.counter}
      </p>
      <button type="button" onClick={() => globalActions.addToCounter(1)}>
        +1 to global
      </button>
    </div>
  );
};

export default App;
```

### getGlobal

this function is for use state and actions out of component

```javascript
function myApi(){
  ...
  const [globalState, globalActions] = getGlobal();
  ...
}

```

---

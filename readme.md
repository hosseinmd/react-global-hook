[![NPM](https://nodei.co/npm/react-global-hook.png)](https://nodei.co/npm/react-global-hook/)

[![install size](https://packagephobia.now.sh/badge?p=react-global-hook)](https://packagephobia.now.sh/result?p=react-global-hook) [![dependencies](https://david-dm.org/hosseinmd/react-global-hook.svg)](https://david-dm.org/hosseinmd/react-global-hook.svg)

# react-global-hook

Easy state management for react & react-native using hooks.
it's useful for global state management and complex components state

## install

```npm
npm i react-global-hook --save
```

---

### use

```javascript
import { createStore, createHooks } from "react-global-hook";

const initialState = {
  counter: 0,
};

const actions = {
  addToCounter: (store, amount) => {
    const newCounterValue = store.state.counter + amount;
    store.setState({ counter: newCounterValue });
  },
};

const store = createStore(initialState, actions);
const useGlobal = createHooks(store);

const App = () => {
  const [state, actions] = useGlobal(["counter"]);
  // this component update just when `counter` did update
  // if useGlobal parameter isn't defined this function will be update at any change state
  // if parameter is empty array like [] this function will never be update
  // if 2nd parameter define function this function will be run instead update componentF
  return (
    <div>
      <p>
        counter:
        {state.counter}
      </p>
      <button type="button" onClick={() => actions.addToCounter(1)}>
        +1 to global
      </button>
      <OtherComp />
    </div>
  );
};

const OtherComp = () => {
  const [state] = useGlobal(["counter"]);
  return (
    <p>
      counter:
      {state.counter}
    </p>
  );
};

```

### useLocalStore
Use this instead of useReducer

```javascript

import { useLocalStore } from "react-global-hook";

const App = () => {
  const [state, actions] = useLocalStore(
    {
      counter: 0,
    },
    {
      increase: (store) => {
        const newCounterValue = store.state.counter + 1;
        store.setState({ counter: newCounterValue });
      },
    },
  );

  return (
    <div>
      <p>
        counter:
        {state.counter}
      </p>
      <button type="button" onClick={actions.increase}>
        +1 to global
      </button>
    </div>
  );
};

```

### store

This function is for use state and actions out of component

```javascript
const {state, actions, setState, addListener} = store;
```

---

## stories
- [React use Hooks: How to use React Global Hook](https://medium.com/@hosseinm.developer/manage-state-with-react-hooks-how-to-use-react-global-hook-785331e5f1f) @depreceted
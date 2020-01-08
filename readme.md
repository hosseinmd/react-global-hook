[![NPM](https://nodei.co/npm/react-global-hook.png)](https://nodei.co/npm/react-global-hook/)

[![install size](https://packagephobia.now.sh/badge?p=react-global-hook)](https://packagephobia.now.sh/result?p=react-global-hook) [![dependencies](https://david-dm.org/hosseinmd/react-global-hook.svg)](https://david-dm.org/hosseinmd/react-global-hook.svg)

# react-global-hook

Easy state management for react & react-native using hooks.
it's useful for global state management and complex components state

## TOC

- [install](#install)
- [Create Store](#createStore)
- [Class Components](#classComponents)
- [create Local Store ](#useLocalStore)
- [Store](#Store)

## install

```npm
npm i react-global-hook --save
```

```npm
yarn add react-global-hook
```

## createStore

```javascript
import { createStore, createHooks } from "react-global-hook";

const initialState = {
  counter: 0,
};

const actions = {
  increase(store) {
    store.setState({ count: store.state.count + 1 });
  },
  decrease(store) {
    if (store.state.count <= 0) return;

    store.setState({ count: store.state.count - 1 });
  },
};

const store = createStore(initialState, actions);
const useGlobal = createHooks(store);

const App = () => {
  const [state, actions] = store;
  // this component update just when `counter` did update
  // if useGlobal parameter isn't defined this function will be update at any change state
  // if parameter is empty array like [] this function will never be update
  // if 2nd parameter define function this function will be run instead update componentF
  return (
    <div>
      <button type="button" onClick={actions.decrease}>
        Decrease
      </button>
      <button type="button" onClick={actions.increase}>
        Increase
      </button>
      <OtherComp />
    </div>
  );
};

const OtherComp = () => {
  const [state] = useGlobal(["counter"]);
  return <p>Count:{state.counter}</p>;
};
```

## classComponents

if you want to use store in class component follow this approach

```javascript
class TestComponent extends Component {
  componentDidMount() {
    this.unsubscribe = store.addListener(() => this.forceUpdate());
  }
  componentWillUnmount() {
    this.unsubscribe.remove();
  }
  render() {
    const { state, actions } = store;
    return (
      <p onMouseEnter={actions.increase} onMouseLeave={actions.decrease}>
        {state.count}
      </p>
    );
  }
}
```

## useLocalStore

Use this instead of useReducer

```javascript
import { useLocalStore } from "react-global-hook";

const App = () => {
  const [state, actions] = useLocalStore(
    {
      counter: 0,
    },
    {
      increase: store => {
        const newCounterValue = store.state.counter + 1;
        store.setState({ counter: newCounterValue });
      },
    },
  );

  return (
    <div>
      <p>
        Count:
        {state.counter}
      </p>
      <button type="button" onClick={actions.increase}>
        Increase
      </button>
    </div>
  );
};
```

## Store

```javascript
const { state, actions, setState, addListener } = store;
```

---

## stories

- [React use Hooks: How to use React Global Hook](https://medium.com/@hosseinm.developer/manage-state-with-react-hooks-how-to-use-react-global-hook-785331e5f1f) @depreceted

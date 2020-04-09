[![NPM](https://nodei.co/npm/react-global-hook.png)](https://nodei.co/npm/react-global-hook/)

[![install size](https://packagephobia.now.sh/badge?p=react-global-hook)](https://packagephobia.now.sh/result?p=react-global-hook) [![dependencies](https://david-dm.org/hosseinmd/react-global-hook.svg)](https://david-dm.org/hosseinmd/react-global-hook.svg)

# react-global-hook

Easy state management for react & react-native using hooks.
it's useful for global state management and complex components state

React-global-hook V2 uses the React.context

## TOC

- [Install](#Install)
- [Create Store](#createStore)
- [Class Components](#classComponents)
- [create Local Store ](#useLocalStore)
- [Store](#Store)
- [Performance](#Performance)
- [Stories](#Stories)
- [Examples](#Example)

## Install

```npm
npm i react-global-hook@next --save
```

```npm
yarn add react-global-hook@next
```

## createStore

```javascript
import { createStore, createHooks, Provider } from "react-global-hook";

const initialState = {
  counter: 0,
};

const actions = ({ setState, getState }) => ({
  increase() {
    const { count } = getState()
    setState({ count: count + 1 });
  },
  decrease() {
    const { count } = getState()

    if (count <= 0) return;

    setState({ count: count - 1 });
  },
});

/**
 * The initializer run when Provider render
 */
const initializer = (state) => ({
  ...state
  counter: new Date().getDay()
})

const store = createStore(initialState, actions, initializer);
const useGlobal = createHooks(store);

const OtherComp = () => {
  const [state, actions] = useGlobal(["counter"]); // Will update based on changes to counter

  return <p>Count:{state.counter}</p>;
};

const Container = () => {
  const actions = store.actions; // will not update

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

const App = () => (
  <Provider store={store}>
    <Container>
  <Provider>
)
```

## classComponents

if you want to use store in class component follow this approach

```javascript
class TestComponent extends Component {
  render() {
    const { increase, decrease, count } = this.props;
    return (
      <p onMouseEnter={increase} onMouseLeave={decrease}>
        {count}
      </p>
    );
  }
}

export default connect(store)(TestComponent);
```

## useLocalStore

Use this instead of useReducer

```javascript
import { useLocalStore } from "react-global-hook";

const App = () => {
  const [{counter}, actions] = useLocalStore(
    {
      counter: 0,
    },
    ({ setState, getState }) => ({
      increase() {
        const { counter } = getState()
        const newCounterValue = counter + 1;
        setState({ counter: newCounterValue });
      },
    }),
  );

  return (
    <div>
      <p>
        Count:
        {counter}
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
import { createStore } from "react-global-hook";

const store = createStore(initialState, actions);

const { getState, actions, setState, useState, addListener } = store;
```

### setState

Set partial state

```js
setState({ counter: counter + 1 });
```

### addListener

Add an event listener.
Listener run when a state update

```js example
//Run when counter update
function logCounter() {
  console.log(store.getState().counter);
}
store.addListener(logCounter, ["counter"]);
```

### actions

gives bound actions

```js
store.actions.addToCounter(3);
```

## Persist

For persist state add your function to listener 

```js
function persister(state) {
  asyncStorage.setItem("persist:key",JSON.stringify(state))
}
store.addListener(persister, ["token","username"]); // Whenever the token and username change, this function will call.
```

## Performance

Avoid unreasonable repetition of setState for better performance. Because after each setState, every component that is connected with hook will be rendered again and every function added to listener will be run again.
For Example

```javascript
// Bad
actions = ({ setState, getState }) => ({
  clearSelected: () => {
    setState({ selected: "" });
    setState({ row: [] });
  },
});
```

```javascript
// Good
actions = ({ setState, getState }) => ({
  clearSelected: () => {
    setState({
      selected: "",
      row: [],
    });
  },
});
```

---

## Stories

- [React use Hooks: How to use React Global Hook](https://medium.com/@hosseinm.developer/manage-state-with-react-hooks-how-to-use-react-global-hook-785331e5f1f)

## Example

- [Todo list - react-global-hook](https://codesandbox.io/s/react-global-hook-tpc3y)

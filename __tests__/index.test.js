import renderer, { act } from "react-test-renderer";
import React from "react";
import { createStore, Provider } from "../src";

const store = createStore({ count: 0 }, ({ setState, getState }) => ({
  increase() {
    const { count } = getState();
    setState({ count: count + 1 });
  },
}));

const TextInputTester = function () {
  const { count } = store.useState();
  const { increase } = store.actions;

  return (
    <p count={count} increase={increase}>
      {count}
    </p>
  );
};

let component;
let tree;
test("store: useState in component", () => {
  component = renderer.create(
    <Provider store={store}>
      <TextInputTester />
    </Provider>,
  );
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  act(() => {
    tree.props.increase();
  });

  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

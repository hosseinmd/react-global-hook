import React, { Component } from "react";
import renderer, { act } from "react-test-renderer";
import { createStore, connect, Provider } from "../src";

const store = createStore({ count: 0 }, ({ setState, getState }) => ({
  increase() {
    const { count } = getState();
    setState({ count: count + 1 });
  },
  decrease() {
    const { count } = getState();
    setState({ count: count - 1 });
  },
}));

class TestComponent extends Component {
  render() {
    const { count, increase, decrease } = this.props;
    return <p {...{ count, increase, decrease }}>{count}</p>;
  }
}

const ConnectedTest = connect(store)(TestComponent);

test("should increment counter", () => {
  let component = renderer.create(
    <Provider store={store}>
      <ConnectedTest />
    </Provider>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  act(() => {
    tree.props.increase();
  });

  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  act(() => {
    tree.props.decrease();
  });

  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

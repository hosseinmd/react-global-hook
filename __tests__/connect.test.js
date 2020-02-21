import { renderHook, act } from "@testing-library/react-hooks";
import { Component } from "react";
import { createStore, connect } from "../src";

const store = createStore(
  { count: 0 },
  {
    increase(store) {
      store.setState({ count: store.state.count + 1 });
    },
    decrease(store) {
      store.setState({ count: store.state.count - 1 });
    },
  },
  () => {},
);

class TestComponent extends Component {
  render() {
    return this.props;
  }
}

const ConnectedTest = connect(store)(TestComponent);

test("should increment counter", () => {
  const { result } = renderHook(() => ConnectedTest());

  act(() => {
    result.current.props.increase();
  });

  expect(result.current.props.count).toBe(1);

  act(() => {
    result.current.props.decrease();
  });

  expect(result.current.props.count).toBe(0);
});

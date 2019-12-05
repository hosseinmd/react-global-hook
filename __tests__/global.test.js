import { renderHook, act } from "@testing-library/react-hooks";
import { useCallback } from "react";
import { createStore, createHooks } from "../src";

const store = createStore(
  { count: 0 },
  {
    increase(store) {
      store.setState({ count: store.state.count + 1 });
    },
  },
  () => {},
);
const useGlobal = createHooks(store);

function TestComponent() {
  const [state, actions] = useGlobal(["count"]);

  const increase = useCallback(() => actions.increase(), []);

  return { count: state.count, increase };
}

test("should increment counter", () => {
  const { result } = renderHook(() => TestComponent());

  act(() => {
    result.current.increase();
  });

  expect(result.current.count).toBe(1);
});

import { renderHook, act } from "@testing-library/react-hooks";
import { useCallback } from "react";
import { createState } from "../src";

const [useGlobal, getGlobal] = createState(
  { count: 0 },
  {
    increment(store) {
      store.setState({ count: store.state.count + 1 });
    },
  },
  () => {},
);

function TestComponent() {
  const [state, actions] = useGlobal(["count"]);

  const increment = useCallback(() => actions.increment(), []);

  return { count: state.count, increment };
}

test("should increment counter", () => {
  const { result } = renderHook(() => TestComponent());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});

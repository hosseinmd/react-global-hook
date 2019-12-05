import { renderHook, act } from "@testing-library/react-hooks";
import { useCallback } from "react";
import { useLocalStore } from "../src";

function TestComponent() {
  const [state, actions] = useLocalStore(
    { count: 0 },
    {
      increase(store) {
        store.setState({ count: store.state.count + 1 });
      },
    },
  );

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

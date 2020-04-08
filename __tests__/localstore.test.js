import { renderHook, act } from "@testing-library/react-hooks";
import { useLocalStore } from "../src";

function TestComponent() {
  const [{ count }, { increment }] = useLocalStore(
    { count: 0 },
    ({ setState, getState }) => ({
      increment() {
        const { count } = getState();
        setState({ count: count + 1 });
      },
    }),
  );

  return { count, increment };
}

test("should increment counter", () => {
  const { result } = renderHook(() => TestComponent());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});

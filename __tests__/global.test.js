import React, { useCallback } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { createStore, createHooks, Provider } from "../src";

const store = createStore({ count: 0 }, ({ setState, getState }) => ({
  increase() {
    const { count } = getState();
    setState({ count: count + 1 });
  },
}));
const useGlobal = createHooks(store);

function TestComponent() {
  const [state, actions] = useGlobal(["count"]);

  const increase = useCallback(() => actions.increase(), []);

  return { count: state.count, increase };
}

test("should increment counter", () => {
  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );
  const { result } = renderHook(() => TestComponent(), { wrapper });

  act(() => {
    result.current.increase();
  });

  expect(result.current.count).toBe(1);
});

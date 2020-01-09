import renderer from "react-test-renderer";
import React, { Component } from "react";
import { createStore } from "../src";

class TestComponent extends Component {
  constructor(props) {
    super(props);
    this.store = createStore(
      { count: 0 },
      {
        increase(store) {
          store.setState({ count: store.state.count + 1 });
        },
        decrease(store) {
          if (store.state.count <= 0) return;

          store.setState({ count: store.state.count - 1 });
        },
      },
    );
  }
  componentDidMount() {
    this.unsubscribe = this.store.addListener(() => this.forceUpdate());
  }
  componentWillUnmount() {
    this.unsubscribe.remove();
  }
  render() {
    const { state, actions } = this.store;
    return (
      <p onMouseEnter={actions.increase} onMouseLeave={actions.decrease}>
        {state.count}
      </p>
    );
  }
}

test("TestComponent changes the count when hovered", () => {
  const component = renderer.create(<TestComponent></TestComponent>);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseEnter();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseLeave();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

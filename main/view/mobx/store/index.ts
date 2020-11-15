import * as React from 'react';
import { action, computed, observable } from 'mobx';

// mobx
class TestStore {
  @observable
  counter = 0;

  @computed
  get info() {
    return `鼠标点击：${this.counter} 次...`;
  }

  @action
  increase() {
    this.counter++;
  }

  @action
  resetCounter() {
    this.counter = 0;
  }

  @action
  async setCounter(counter: number) {
    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
      this.counter = counter;
    } catch (e) {
      //
    }
  }
}

const store = new TestStore();

const context = React.createContext(store);

export const useStore = () => React.useContext(context);

export default store;

// interface
export interface TestState {
  info: string;
  counter: number;
}
export interface TestProps {
  testState: TestState & {
    increase: () => void;
    resetCounter: () => void;
    setCounter: (counter: number) => Promise<void>;
  };
}

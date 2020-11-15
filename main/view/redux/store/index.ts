import { Dispatch } from 'redux';

// redux
const reduxState = {
  counter: 0,
  info: '鼠标点击：0 次...',
};

export const testReducer = (state: TestState = reduxState, action: IAction) => {
  switch (action.type) {
    case 'increase':
      return { ...state, counter: state.counter + 1, info: `鼠标点击：${state.counter} 次...` };
    case 'reset':
      return { ...state, counter: 0, info: '鼠标点击：0 次...' };
    case 'set':
      return { ...state, counter: action.data, info: `鼠标点击：${action.data} 次...` };
    default:
      return state;
  }
};

export const increase = () => (dispatch: Dispatch) => {
  dispatch({
    type: 'increase',
  });
};

export const resetCounter = () => (dispatch: Dispatch) => {
  dispatch({
    type: 'reset',
  });
};

export const setCounter = (counter: number) => async (dispatch: Dispatch) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
  dispatch({
    type: 'set',
    data: counter,
  });
};

// interface
export interface TestState {
  info: string;
  counter: number;
}
export interface TestProps {
  testState: TestState;
  increase: () => void;
  resetCounter: () => void;
  setCounter: (counter: number) => Promise<void>;
}

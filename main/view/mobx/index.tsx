import * as React from 'react';
import { useObserver } from 'mobx-react';

// store
import { useStore } from './store';

// css
import './style/index.scss';

/**
 * demo
 */
const AppView = () => {
  const store = useStore();

  // 点击事件
  const onclick = () => {
    store.increase();
  };

  // 右键点击事件
  const oncontextmenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    store.resetCounter();
  };

  return useObserver(() => (
    <div className={'mobx-hooks'} onClick={onclick} onContextMenu={oncontextmenu}>
      <p>鼠标左键点击增加，右键点击归零</p>
      <p> {store.info} </p>
    </div>
  ));
};

export default AppView;

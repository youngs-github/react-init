import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Provider as MobxProvider } from 'mobx-react';
import { Provider as ReduxProvider } from 'react-redux';

import Router from '../router';
import { MobxStore, ReduxStore } from '../store';

// 可自由切换mobx、redux
const App = (
  <MobxProvider {...MobxStore}>
    <ReduxProvider store={ReduxStore}>
      <Router />
    </ReduxProvider>
  </MobxProvider>
);

// 浏览器环境
if (document) {
  ReactDom.render(App, document.getElementById('app'));

  /**
   * 屏幕大小变化时更新fontsize
   */
  const resize = () => {
    document.documentElement.style.fontSize = document.documentElement.offsetWidth / (1920 / 80) + 'px';
    return resize;
  };
  window.addEventListener('resize', resize());
}

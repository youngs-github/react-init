import * as React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader';

import AppMobxView from '../view/mobx/index';
import AppMobxClazzView from '../view/mobx/clazz';
import AppReduxView from '../view/redux/index';
import AppReduxClazzView from '../view/redux/clazz';

/**
 * 路由
 */
const Router = () => (
  <HashRouter>
    <Switch>
      <Route exact path={'/mobx'} component={AppMobxView} />
      <Route exact path={'/mobx/clazz'} component={AppMobxClazzView} />
      <Route exact path={'/redux'} component={AppReduxView} />
      <Route exact path={'/redux/clazz'} component={AppReduxClazzView} />
    </Switch>
  </HashRouter>
);

// dev环境
const isDev = process.env.NODE_ENV !== 'production';

export default isDev ? hot(module)(Router) : Router;

import * as React from 'react';
import { inject, observer } from 'mobx-react';

// store
import { TestProps } from './store';

// css
import './style/index.scss';

/**
 * demo
 */
@inject('testState')
@observer
class AppView extends React.PureComponent<TestProps> {
  constructor(props: TestProps) {
    super(props);
  }
  // 点击事件
  onclick = () => {
    this.props.testState.increase();
  };

  // 右键点击事件
  oncontextmenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.testState.resetCounter();
  };

  render() {
    return (
      <div className={'mobx-hooks-clazz'} onClick={this.onclick} onContextMenu={this.oncontextmenu}>
        <p>鼠标左键点击增加，右键点击归零</p>
        <p> {this.props.testState.info} </p>
      </div>
    );
  }
}

export default AppView;

import * as React from 'react';
import { connect } from 'react-redux';

// store
import { increase, resetCounter, TestProps, TestState } from './store';

// css
import './style/index.scss';

/**
 * demo
 */
class AppView extends React.PureComponent<TestProps> {
  constructor(props: TestProps) {
    super(props);
  }

  // 点击事件
  onclick = () => {
    this.props.increase();
  };

  // 右键点击事件
  oncontextmenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.resetCounter();
  };

  render() {
    return (
      <div className={'mobx-hooks'} onClick={this.onclick} onContextMenu={this.oncontextmenu}>
        <p>鼠标左键点击增加，右键点击归零</p>
        <p> {this.props.testState.info} </p>
      </div>
    );
  }
}

const mapStateToProps = (state: TestState) => state;
const mapDispatchToProps = { increase, resetCounter };

export default connect(mapStateToProps, mapDispatchToProps)(AppView);

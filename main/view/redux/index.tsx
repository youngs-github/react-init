import * as React from 'react';
import { connect } from 'react-redux';

// store
import { increase, resetCounter, TestProps, TestState } from './store';

// css
import './style/index.scss';

/**
 * demo
 */
const AppView = (props: TestProps) => {
  // 点击事件
  const onclick = () => {
    props.increase();
  };

  // 右键点击事件
  const oncontextmenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    props.resetCounter();
  };

  return (
    <div className={'mobx-hooks'} onClick={onclick} onContextMenu={oncontextmenu}>
      <p>鼠标左键点击增加，右键点击归零</p>
      <p> {props.testState.info} </p>
    </div>
  );
};

const mapStateToProps = (state: TestState) => state;
const mapDispatchToProps = { increase, resetCounter };

export default connect(mapStateToProps, mapDispatchToProps)(AppView);

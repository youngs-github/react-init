import { RouteComponentProps } from 'react-router';
import { AxiosResponse } from 'axios';

/**
 * 全局声明
 */
declare global {
  /**
   * 文件声明
   */
  declare module '*.css';
  declare module '*.less';
  declare module '*.scss';
  declare module '*.sass';
  declare module '*.svg';
  declare module '*.png';
  declare module '*.jpg';
  declare module '*.jpeg';
  declare module '*.gif';
  declare module '*.json';

  /**
   * 请求接口基础数据类型
   */
  interface IResponse {
    data: any;
    status: number;
    message: string;
  }

  /**
   * 页码类型
   */
  interface IPage {
    current: number;
    size: number;
    total: number;
  }

  /**
   * 页码类型
   */
  interface ISort {
    sort: string;
    order: 'asc' | 'desc';
  }

  /**
   * 错误类型
   */
  interface IError extends Error {
    response?: AxiosResponse;
  }

  /**
   * props基础类型
   */
  interface IProps {
    children?: JSX.Element[] | JSX.Element | React.ReactNode;
    className?: string;
  }

  /**
   * action类型
   */
  interface IAction extends React.ReducerAction {
    data?: {
      current?: number;
      data?: any;
      start?: number;
      size?: number;
      total?: number;
    };
    type: string;
    message?: string;
  }

  /**
   * reducer类型
   */
  type IReducer<S> = (state: S, action: IAction) => S;

  /**
   * ref通用类型
   */
  type IRef<TRef> = ((instance: TRef | null) => void) | React.MutableRefObject<TRef | null> | null;

  /**
   * 路由基本类型
   */
  type IRouter = RouteComponentProps<Record<string, string>>;

  /**
   * 静态路由配置类型
   */
  interface IRouterConfig {
    name: string;
    path: string;
    hidden?: boolean;
    children?: Array<IRouterConfig>;
    component?: React.ComponentType<object>;
  }
}

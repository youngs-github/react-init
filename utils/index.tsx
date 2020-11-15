/**
 * 通用工具类
 *
 */
export default class Utils {
  /**
   * 无构造器
   */
  constructor() {
    throw new Error('Utils不是构造器！');
  }

  /**
   * 非空判断
   */
  static isNotEmpty = (object: any): boolean => {
    if (undefined === object) {
      return false;
    }
    if (null === object) {
      return false;
    }
    return object !== '';
  };

  /**
   * 写text至剪贴板上
   * @param text
   */
  static writeClipboard = (text: string): void => {
    try {
      navigator.clipboard.writeText(text);
    } catch (e) {
      console.error('剪贴板写入出错！', e);
    }
  };
}

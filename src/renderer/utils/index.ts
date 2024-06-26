/**
 * 寻找目标对象
 * @param target
 * @param callback
 * @returns
 */
export const findNode = (target: HTMLElement, callback: (el: HTMLElement) => Boolean) => {
  // 判断类样式中是否包含 arco-tree-node
  if (callback(target)) {
    return target;
  } else {
    const parent = target.parentElement || target.parentNode;
    if (parent instanceof HTMLElement) {
      return findNode(parent, callback);
    }
  }
  return null;
};

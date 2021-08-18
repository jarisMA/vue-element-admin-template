import store from "@/store/index";

// 判断是否存在该权限
export const isAuthPermission = (permission) => {
  return permission
    .split(",")
    .some((r) => (store.state.authPermissions || []).includes(r));
};

export const makeElementTree = (params) => {
  const { pid, list, pidFiled, nameFiled, valueFiled } = params;
  // 构建一个内部函数，用于实现递归
  const makeTree = (pid, arr) => {
    const res = [];
    arr.forEach((i) => {
      if (i[pidFiled] === pid) {
        // 自己调用自己，递归查归属于自己的 children
        const children = makeTree(i[valueFiled], list);
        const obj = {
          name: i[nameFiled],
          value: i[valueFiled],
        };
        // 如果有 children 则插入 obj 中
        if (children.length) {
          obj.children = children;
        }
        res.push(obj);
      }
    });
    return res;
  };
  return makeTree(pid, list);
};

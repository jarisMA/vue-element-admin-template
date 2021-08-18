//  props
//  type  Array[Object]

//  Object (参数对象，*为必填项)
//  * type  类型  (empty,phone,array,email,password)
//  * value 验证值
//   error 报错信息
//   key  验证失效关键字(懒验证类型，验证不通过中断之后验证，返回不通过关键字)

import { Message } from "element-ui";

const _reg = {
  notEmpty: /^[\s\S]*.*[^\s][\s\S]*$/,
  phoneReg: /^1[34578]\d{9}$/,
  emailReg: /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/,
  passwordReg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,30}$/,
};

const validators = (prop = []) => {
  let keyword = null;
  let result = null;
  prop.every((data) => {
    const { type } = data;
    result = _type[type](data.value, data.error);
    result ? (keyword = null) : (keyword = data.key);
    return result;
  });
  return {
    keyword,
    result,
  };
};

const empty = (value, error = "缺少必填参数") => {
  const result = _reg.notEmpty.test(value) && typeof value !== "undefined";
  if (!result) {
    Message.error(error);
    return false;
  }
  return true;
};

const phone = (value, error = "手机号格式不正确") => {
  const result = _reg.phoneReg.test(value);
  if (!result) {
    Message.error(error);
    return false;
  }
  return true;
};

const array = (value, error = "缺少必填参数") => {
  const result = value.length;
  if (!result) {
    Message.error(error);
    return false;
  }
  return true;
};

const email = (value, error = "邮箱格式不正确") => {
  const result = _reg.emailReg.test(value);
  if (!result) {
    Message.error(error);
    return false;
  }
  return true;
};

const password = (value, error = "密码必须包含大小写，且不能少于8位") => {
  const result = _reg.passwordReg.test(value);
  if (!result) {
    Message.error(error);
    return false;
  }
  return true;
};

const _type = {
  empty,
  phone,
  array,
  email,
  password,
};

export default validators;

import axios from "axios";
import Cookies from "js-cookie";
import { Message } from "element-ui";
import { goRoute } from "utils/routes";

const axiosInstance = axios.create();

axiosInstance.defaults.timeout = 20000;

axiosInstance.interceptors.request.use(
  (config) => {
    const newConfig = { ...config };
    const TOKEN = Cookies.get(process.env.VUE_APP_TOKEN);
    if (TOKEN) {
      newConfig.headers.Authorization = `Bearer ${TOKEN}`;
    }
    return newConfig;
  },
  (error) => Promise.reject(error)
);

const handleErrorRequest = (error) => {
  const { response } = error;
  const status = response ? response.status : 408;
  if (response) {
    const { data } = response;
    const { errors } = data;
    const msg = data.message || "网络错误";
    if (status === 401 || status === 402) {
      Cookies.remove(process.env.VUE_APP_TOKEN, {
        path: "",
        domain: process.env.VUE_APP_DOMAIN,
      });
      Message.error("登录失效，即将跳转前台");
      setTimeout(() => {
        window.location.href = process.env.VUE_APP_WEB;
      }, 3000);
    } else if (status === 403) {
      Message.error("没有权限，回到首页");
      goRoute(
        {
          name: "Home",
        },
        "replace"
      );
    } else if (status === 419) {
      // 页面过期;
      localStorage.clear();
      sessionStorage.clear();
    } else if (status === 422 || status === 423 || status === 429) {
      const errorObj = errors || data;
      Object.keys(errorObj).forEach((errorKey) => {
        const errorValue = errorObj[errorKey].join("\n");
        Message.error(errorValue);
      });
    } else {
      Message.error(msg);
    }
  } else {
    Message.error("网络超时");
  }
};

axiosInstance.interceptors.response.use(
  (res) => {
    switch (true) {
      case res.data.error_code === 0:
        return res.data.data;
      default:
        if (res.data.error_code !== 0) {
          Message.error(res.data.msg);
          return Promise.reject(res.data);
        }
        return res.data;
    }
  },
  (error) => {
    handleErrorRequest(error);
    return Promise.reject(error);
  }
);

export default {
  post(url = "", data = {}, config = {}) {
    return axiosInstance.post(url, data, config);
  },
  put(url = "", data = {}, config = {}) {
    return axiosInstance.put(url, data, config);
  },
  patch(url = "", data = {}, config = {}) {
    return axiosInstance.patch(url, data, config);
  },
  get(url = "", params = {}, config = {}) {
    const OPTIONS = { params, ...config };
    return axiosInstance.get(url, OPTIONS);
  },
  delete(url = "", params = {}, config = {}) {
    const OPTIONS = { params, ...config };
    return axiosInstance.delete(url, OPTIONS);
  },
};

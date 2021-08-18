import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Message } from "element-ui";
import Cookies from "js-cookie";
import Store from "@/store/index";
import userService from "service/user.js";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes,
});

router.firstInit = false;

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  if (to.meta.title) document.title = to.meta.title;
  try {
    let TOKEN = Cookies.get(process.env.VUE_APP_TOKEN);
    if (!TOKEN) {
      Message.error("登录失效，即将跳转前台");
      setTimeout(() => {
        window.location.href = process.env.VUE_APP_WEB;
      }, 3000);
      return;
    }
    if (!router.firstInit && TOKEN) {
      router.firstInit = true;
      await userService.myPermissions().then(({ permissions }) => {
        if (permissions.length < 1) {
          Message.error("无权限，即将跳转前台");
          return (window.location.href = process.env.VUE_APP_WEB);
        }
        Store.commit("setAuthPermissions", permissions);
      });
      await userService.getUserInfo().then((data) => {
        Store.commit("setUserInfo", data);
      });
    }
    if (
      to.meta &&
      to.meta.permission &&
      !to.meta.permission
        .split(",")
        .some((r) => (Store.state.authPermissions || []).indexOf(r) > -1)
    ) {
      next({
        name: "Home",
        replace: true,
      });
    }
    next();
  } catch {
    next();
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;

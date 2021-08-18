import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import "../theme/index.css";
import IconSvg from "./plugins/icons";
import ElementUI from "element-ui";
import { isAuthPermission } from "utils/function";
import { goRoute } from "utils/routes";

Vue.config.productionTip = false;
Vue.use(IconSvg);
Vue.use(ElementUI);

Vue.prototype.isAuthPermission = isAuthPermission;
Vue.prototype.goRoute = goRoute;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

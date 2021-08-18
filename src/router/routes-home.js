import Home from "views/Home";

export default [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "主页",
      nav: {
        icon: "el-icon-s-home",
        title: "主页",
      },
    },
  },
];

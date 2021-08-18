import TheLayout from "components/TheLayout";
import routesHome from "./routes-home";

let routesAll = [...routesHome];

export default [
  {
    path: "/",
    component: TheLayout,
    redirect: { name: "Home" },
    children: routesAll,
  },
  {
    path: "/*",
    redirect: { name: "Home" },
  },
];

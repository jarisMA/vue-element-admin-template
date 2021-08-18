import axios from "@/global/request/axios";
import API from "@/global/request/api";
const userService = {
  list(params) {
    return axios.get(API.users, params);
  },
  id(id) {
    return axios.get(API.user(id));
  },
  edit(id, params) {
    return axios.put(API.user(id), params);
  },
  myPermissions() {
    return axios.get(API.userPermissions);
  },
  getUserInfo() {
    return axios.get(API.userInfo);
  },
};

export default userService;

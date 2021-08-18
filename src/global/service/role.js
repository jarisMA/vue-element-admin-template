import axios from "@/global/request/axios";
import API from "@/global/request/api";

const roleService = {
  list(params) {
    return axios.get(API.roles, params);
  },
  insert(params) {
    return axios.post(API.roles, params);
  },
  id(id) {
    return axios.get(API.role(id));
  },
  edit(id, params) {
    return axios.put(API.role(id), params);
  },
  delete(id) {
    return axios.delete(API.role(id));
  },
  permissions() {
    return axios.get(API.permissions);
  },
};

export default roleService;

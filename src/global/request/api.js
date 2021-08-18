const PREFIX = `${process.env.VUE_APP_API}/api`;
const ADMIN_PREFIX = `${PREFIX}/admin`;
// const DAYLAB_ADMIN_PREFIX = `${process.env.VUE_APP_DAYLAB_API}/api/admin`;

export default {
  userInfo: `${PREFIX}/web/users/user-info`,
  users: `${ADMIN_PREFIX}/users`,
  user: (id) => `${ADMIN_PREFIX}/users/${id}`,
  userPermissions: `${ADMIN_PREFIX}/permissions/my`,

  roles: `${ADMIN_PREFIX}/roles`,
  role: (id) => `${ADMIN_PREFIX}/roles/${id}`,
  permissions: `${ADMIN_PREFIX}/permissions`,

  ossToken: `${PREFIX}/file/alioss-token`,
  ossStore: `${PREFIX}/file/alioss-store`,
};

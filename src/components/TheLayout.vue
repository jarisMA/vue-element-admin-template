<template>
  <div class="page">
    <div class="page-left-container" :style="[{ width: siderWidth }]">
      <div class="page-sidebar">
        <div class="sidebar-header">
          <img class="sidebar-header-logo" src="~images/common/logo.svg" />
        </div>
        <div
          class="sidebar-body"
          :style="{ backgroundColor: navBackgroundColor }"
        >
          <el-scrollbar class="scrollbar-section">
            <el-menu
              :background-color="navBackgroundColor"
              :text-color="navTextColor"
              :active-text-color="navActiveTextColor"
              :default-active="$route.meta.belong || $route.name"
              :router="true"
              :collapse="collapse"
            >
              <template v-for="route in navRoutes">
                <el-menu-item
                  v-if="!haveChildren(route)"
                  :key="route.name"
                  :index="route.name"
                  :route="{ name: route.name }"
                >
                  <i
                    v-if="route.meta.nav.icon"
                    :class="route.meta.nav.icon"
                  ></i>
                  <icon-svg
                    v-if="route.meta.nav.svg"
                    :svg-class="route.meta.nav.svg.class"
                    :svg-name="route.meta.nav.svg.name"
                  ></icon-svg>
                  <span slot="title">{{ route.meta.nav.title }}</span>
                </el-menu-item>
                <el-submenu
                  class="el-submenu-level_1"
                  v-else
                  :key="route.name"
                  :index="route.name"
                >
                  <template slot="title">
                    <i
                      v-if="route.meta.nav.icon"
                      :class="route.meta.nav.icon"
                    ></i>
                    <icon-svg
                      v-if="route.meta.nav.svg"
                      :svg-class="route.meta.nav.svg.class"
                      :svg-name="route.meta.nav.svg.name"
                    ></icon-svg>
                    <span>{{ route.meta.nav.title }}</span>
                  </template>
                  <template v-for="item in route.children">
                    <el-menu-item
                      v-if="!haveChildren(item)"
                      :key="item.name"
                      :index="item.name"
                      :route="{ name: item.name }"
                    >
                      <span class="fa-dot"></span>
                      <span>{{ item.meta.nav.title }}</span>
                    </el-menu-item>
                    <el-submenu
                      class="el-submenu-level_2"
                      v-else
                      :key="item.name"
                      :index="item.name"
                    >
                      <template slot="title">
                        <i
                          v-if="item.meta.nav.icon"
                          :class="item.meta.nav.icon"
                        ></i>
                        <icon-svg
                          v-else-if="item.meta.nav.svg"
                          :svg-class="item.meta.nav.svg.class"
                          :svg-name="item.meta.nav.svg.name"
                        ></icon-svg>
                        <span v-else class="fa-diamond"></span>
                        <span>{{ item.meta.nav.title }}</span>
                      </template>
                      <el-menu-item
                        v-for="data in item.children"
                        :key="data.name"
                        :index="data.name"
                        :route="{ name: data.name }"
                      >
                        <span class="fa-dot"></span>
                        <span>{{ data.meta.nav.title }}</span>
                      </el-menu-item>
                    </el-submenu>
                  </template>
                </el-submenu>
              </template>
            </el-menu>
          </el-scrollbar>
        </div>
        <div class="sidebar-footer">
          <div class="collapse-icon-container" @click="handleCollapse">
            <icon-svg
              :svg-class="{ 'collapse-icon': true, unfold: collapse }"
              svg-name="fold"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="page-right-container">
      <div class="page-header">
        <div class="page-header-left"></div>
        <div class="page-header-middle"></div>
        <div class="fullscreen-container" @click="toggleScreenfull">
          <icon-svg
            svg-class="fullscreen-icon"
            :svg-name="isFullscreen ? 'off_screen' : 'full_screen'"
          ></icon-svg>
        </div>
        <div class="page-header-right">
          <el-dropdown style="height: 100%" @command="handleCommand">
            <div class="page-header-right">
              <el-avatar
                class="user-avatar"
                :size="30"
                :src="userInfo.avatar_url"
              ></el-avatar>
              <span class="user-name">{{ userInfo.nickname }}</span>
              <i class="el-icon-arrow-down"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-video-pause"
                command="handleLogout"
                >登出</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="page-content">
        <el-scrollbar class="scrollbar-section">
          <div class="breadcrumb-container">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item v-for="step in breadcrumb" :key="step.name">
                <el-breadcrumb-item
                  v-if="
                    step.meta.breadcrumb.path &&
                    step.meta.breadcrumb.path !== $route.name
                  "
                  :to="{ name: step.meta.breadcrumb.path }"
                  :key="step.name"
                  :replace="true"
                >
                  {{ step.meta.breadcrumb.name }}
                </el-breadcrumb-item>
                <el-breadcrumb-item v-else :key="step.name">
                  {{ step.meta.breadcrumb.name }}
                </el-breadcrumb-item>
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <router-view />
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import screenfull from "screenfull";
import { mapState } from "vuex";
import routesAll from "@/router/routes";
import Cookies from "js-cookie";

export default {
  name: "TheLayout",
  data() {
    return {
      navBackgroundColor: "#141f29",
      navTextColor: "#909399",
      navActiveTextColor: "#fff",
      navRoutes: [],
      collapse: false,
      isFullscreen: false,
    };
  },
  computed: {
    ...mapState(["userInfo", "authPermissions"]),
    siderWidth() {
      return this.collapse ? "64px" : "227px";
    },
    title() {
      return this.$route.meta.title || "";
    },
    breadcrumb() {
      return this.$route.matched.filter((data) => data.meta.breadcrumb) || [];
    },
  },
  created() {
    this.getRoutes();
    if (screenfull.isEnabled) {
      screenfull.on("change", this.getIsFullscreen);
    }
  },
  beforeDestroy() {
    if (screenfull.isEnabled) {
      screenfull.off("change", this.getIsFullscreen);
    }
  },
  methods: {
    getRoutes() {
      let resultRoutes = this.filterPermissionRoutes(
        routesAll,
        this.authPermissions
      );
      this.navRoutes = this.filterRoutes(resultRoutes);
    },
    filterPermissionRoutes(routes, permissions) {
      const filterRoutes = [];
      routes.forEach((data) => {
        const route = { ...data };
        const notPermission = !route.meta || !route.meta.permission;
        const hasPermission =
          !notPermission && permissions.includes(route.meta.permission);
        const passPermission = notPermission || hasPermission;
        let hasPath = true;
        if (route.children) {
          route.children = this.filterPermissionRoutes(
            data.children,
            permissions
          );
          if (route.children.length === 0) {
            hasPath = false;
          }
        }
        if (passPermission && hasPath) {
          filterRoutes.push(route);
        }
      });
      return filterRoutes;
    },
    filterRoutes(routes) {
      let result = [];
      routes.forEach((data) => {
        if (data.meta && data.meta.nav) {
          let item = {
            name: data.name,
            meta: data.meta,
          };
          if (data.children) {
            item.children = this.filterRoutes(data.children);
          }
          result.push(item);
        } else if (data.children) {
          this.filterRoutes(data.children).forEach((item) => {
            result.push(item);
          });
        }
      });
      return result;
    },
    haveChildren(route) {
      let children = route.children || [];
      return children.length;
    },
    handleCollapse() {
      this.collapse = !this.collapse;
    },
    getIsFullscreen() {
      this.isFullscreen = screenfull.isFullscreen;
    },
    toggleScreenfull() {
      if (!screenfull.isEnabled) {
        this.$message.warning("当前浏览器不支持全屏操作");
        return;
      }
      screenfull.toggle();
    },
    handleCommand(command) {
      this[command]();
    },
    handleLogout() {
      Cookies.remove(process.env.VUE_APP_TOKEN, {
        path: "",
        domain: process.env.VUE_APP_DOMAIN,
      });
      window.location.href = process.env.VUE_APP_WEB;
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  height: 100vh;
  display: flex;
  .page-left-container {
    z-index: 101;
    flex: none;
    display: flex;
    flex-direction: column;
    width: 246px;
    transition: all 0.1s ease-out;
    .page-sidebar {
      flex: 1;
      display: flex;
      flex-direction: column;
      .sidebar-header {
        z-index: 102;
        flex: none;
        height: 48px;
        background: #fff;
        .sidebar-header-logo {
          margin: 8px 12px 8px 20px;
          height: 32px;
        }
      }
      .sidebar-body {
        flex: 1;
        height: 0;
        overflow: auto;
        box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
        .nav-svg {
          margin-right: 5px;
          width: 24px;
          height: 18px;
          vertical-align: middle;
          color: #909399;
        }
      }
      .sidebar-footer {
        flex: none;
        padding: 8px;
        height: 48px;
        background: #141f29;
        overflow: hidden;
        box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
        .collapse-icon-container {
          height: 32px;
          text-align: center;
          background-color: #1d2b3a;
          border-radius: 3px;
          cursor: pointer;
          &:hover {
            background-color: #273849;
          }
          .collapse-icon {
            margin-top: 6px;
            width: 20px;
            height: 20px;
            transition: all 0.2s ease-out;
            &.unfold {
              transform: rotate(-180deg);
            }
          }
        }
      }
    }
  }
  .page-right-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 1000px;
    overflow: hidden;
    .page-header {
      z-index: 100;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      height: 48px;
      font-size: 13px;
      line-height: 48px;
      font-weight: 400;
      color: #606266;
      background: #fff;
      box-shadow: 0 1px 2px 0 rgba(9, 18, 26, 0.06),
        0 4px 8px 0 rgba(39, 56, 73, 0.08);
      .page-header-left {
        .page-header-collapse {
          margin-right: 10px;
          padding: 5px 10px 0 10px;
          cursor: pointer;
          &:hover {
            background: rgba(0, 0, 0, 0.025);
          }
          .collapse-icon {
            width: 18px;
            height: 18px;
            font-weight: 500;
          }
        }
      }
      .page-header-middle {
        height: 100%;
        flex: 1;
      }
      .fullscreen-container {
        padding: 0 10px;
        width: 40px;
        height: 100%;
        cursor: pointer;
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
        .fullscreen-icon {
          width: 20px;
          height: 100%;
        }
      }
      .page-header-right {
        display: flex;
        align-items: center;
        flex: none;
        padding: 0 10px;
        height: 100%;
        transition: all 0.2s ease;
        cursor: pointer;
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
        .user-avatar {
          margin: 0 8px;
        }
        .user-name {
          margin-right: 8px;
          font-size: 12px;
          vertical-align: middle;
        }
      }
    }
    .page-content {
      position: relative;
      flex: 1;
      overflow-y: auto;
      .breadcrumb-container {
        padding: 15px 20px 0;
        /deep/ .el-breadcrumb__inner.is-link {
          cursor: pointer;
        }
      }
    }
  }
}
</style>

<template>
  <div class="page-container">
    <div class="introduction-container">
      <div class="introduction-avatar">
        <el-avatar
          class="user-avatar"
          :size="64"
          :src="userInfo.avatar_url"
        ></el-avatar>
      </div>
      <div>
        <div class="introduction-title">
          {{ userInfo.nickname }}，欢迎来到「 灵感库 」管理中心！
        </div>
        <div class="introduction-desc">
          关于权限及任何技术问题，请联系管理员 {{ email }} ~
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Home",
  data() {
    return {
      email: process.env.VUE_APP_EMAIL,
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
};
</script>

<style lang="less">
.page-container {
  background: transparent;
}
.introduction-container {
  padding: 8px 16px;
  border-left: 5px solid @primaryColor;
  background: lighten(@primaryColor, 50%);
  border-radius: 4px;
  display: flex;
  align-items: center;
  .introduction-avatar {
    margin-right: 20px;
  }
  .introduction-title {
    margin: 12px 0;
    font-size: 20px;
    font-weight: 500;
    line-height: 1.5em;
    color: #333;
  }
  .introduction-desc {
    margin: 12px 0;
    font-size: 14px;
    line-height: 1.5em;
    color: #777;
  }
}
</style>

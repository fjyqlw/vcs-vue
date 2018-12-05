<style lang="less">
@import "../styles/main.less";
@import "../styles/common.less";
@import "../iconfont/iconfont.css";
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
            <scroll-bar ref="scrollBar">
                <shrinkable-menu :shrink="shrink" @on-change="handleSubmenuChange" :before-push="beforePush" :open-names="openedSubmenuArr" :menu-list="menuList">
                    <div slot="top" class="logo-con">
                        <img v-show="!shrink"  src="../images/xhy2.gif" key="max-logo" />
                        <img v-show="shrink" src="../images/xiaohuangya1.gif" key="min-logo" />
                    </div>
                </shrinkable-menu>
            </scroll-bar>
        </div>
        <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                        <Icon type="md-menu" size="32" />
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                    </div>
                </div>
                <div class="header-avator-con">
                    <div>

                        <!-- <il8n></il8n> -->
                        <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
                        <lock-screen></lock-screen>
                    </div>
                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ userName }}</span>
                                    <Icon type="ios-arrow-down" />
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="account">个人中心</DropdownItem>
                                    <DropdownItem name="logout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Avatar icon="ios-person" style="background: #619fe7;margin-left: 10px;"></Avatar>
                        </Row>
                    </div>
                </div>
            </div>
            <!-- <div class="tags-con">
                <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
            </div> -->
        </div>
        <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
            <div class="single-page">
                <keep-alive :include="cachePage">
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>

        <Modal v-model="logoutModel" width="300" :loading="loading" class-name="vertical-center-modal">
            <p slot="header">
                <Icon type="ios-information-circle"></Icon>
                <span>提示</span>
            </p>
            <div style="text-align:center">
                <p>确定退出系统?</p>
            </div>
            <div slot="footer" align="center">
                <Button type="primary" @click="onLogout" :loading="loading">退出</Button>
                <Button type="default" @click="logoutModel = false;">取消</Button>
            </div>
        </Modal>

    </div>
</template>
<script>
import shrinkableMenu from "@/common/components/shrinkable-menu/shrinkable-menu.vue";
import tagsPageOpened from "@/common/components/tags-page-opened.vue";
import breadcrumbNav from "@/common/components/breadcrumb-nav.vue";
import fullScreen from "@/common/components/fullscreen.vue";
// import il8n from "@/common/components/i18n.vue";
import lockScreen from "@/common/components/lockscreen/lockscreen.vue";
import util from "@/libs/util.js";
import scrollBar from "@/common/components/scroll-bar/vue-scroller-bars";
import { post } from "@/libs/axios-cfg";
export default {
  components: {
    shrinkableMenu,
    tagsPageOpened,
    breadcrumbNav,
    fullScreen,
    lockScreen,
    scrollBar
    // il8n
  },
  data() {
    return {
      logoutModel: false,
      loading: false,
      shrink: false,
      userName: "",
      isFullScreen: false,
      openedSubmenuArr: this.$store.state.app.openedSubmenuArr
    };
  },
  updated() {
    this.getPermission();
  },
  computed: {
    menuList() {
      return this.$store.state.app.menuList;
    },
    pageTagsList() {
      return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
    },
    currentPath() {
      return this.$store.state.app.currentPath; // 当前面包屑数组
    },
    avatorPath() {
      return localStorage.avatorImgPath;
    },
    cachePage() {
      return this.$store.state.app.cachePage;
    },
    lang() {
      return this.$store.state.app.lang;
    },
    mesCount() {
      return this.$store.state.app.messageCount;
    }
  },
  methods: {
    async getPermission() {
      // let res = await post('/account/current');
      // console.log(res)
    },
    init() {
      let pathArr = util.setCurrentPath(this, this.$route.name);
      this.$store.commit("updateMenulist");
      if (pathArr.length >= 2) {
        this.$store.commit("addOpenSubmenu", pathArr[1].name);
      }
      this.userName = localStorage.getItem("user");
      let messageCount = 3;
      this.messageCount = messageCount.toString();
      this.checkTag(this.$route.name);
      this.$store.commit("setMessageCount", 3);
    },
    toggleClick() {
      this.shrink = !this.shrink;
    },
    async handleClickUserDropdown(name) {
      if (name === "account") {
        util.openNewPage(this, "account");
        this.$router.push({
          name: "account"
        });
      } else if (name === "logout") {
        this.logoutModel = true;
      }
    },
    async onLogout() {
        this.loading = true;
      let res = await post("/auth/logout", {});
      if (res.code === 0) {
        localStorage.removeItem('remember');
        //退出登录
        this.$store.commit("logout", this);
        this.$store.commit("clearOpenedSubmenu");
        this.$router.push({
          name: "login"
        });
      }
    },
    checkTag(name) {
      let openpageHasTag = this.pageTagsList.some(item => {
        if (item.name === name) {
          return true;
        }
      });
      if (!openpageHasTag) {
        //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        util.openNewPage(
          this,
          name,
          this.$route.params || {},
          this.$route.query || {}
        );
      }
    },
    handleSubmenuChange(val) {
      // console.log(val)
    },
    beforePush(name) {
      // if (name === 'accesstest_index') {
      //     return false;
      // } else {
      //     return true;
      // }
      return true;
    },
    fullscreenChange(isFullScreen) {
      // console.log(isFullScreen);
    },
    scrollBarResize() {
      this.$refs.scrollBar.resize();
    }
  },
  watch: {
    $route(to) {
      this.$store.commit("setCurrentPageName", to.name);
      let pathArr = util.setCurrentPath(this, to.name);
      if (pathArr.length > 2) {
        this.$store.commit("addOpenSubmenu", pathArr[1].name);
      }
      this.checkTag(to.name);
      localStorage.currentPageName = to.name;
    },
    lang() {
      util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
    },
    openedSubmenuArr() {
      setTimeout(() => {
        this.scrollBarResize();
      }, 300);
    }
  },
  mounted() {
    this.init();
    window.addEventListener("resize", this.scrollBarResize);
  },
  created() {
    // 显示打开的页面的列表
    this.$store.commit("setOpenedList");
  },
  dispatch() {
    window.removeEventListener("resize", this.scrollBarResize);
  }
};
</script>
<style lang="less">
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 0;
        }
    }
</style>
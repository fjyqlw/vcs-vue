import Vue from 'vue';
import {router} from './router/index';
import {appRouter} from './router/router';
import store from './store';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import './libs/iview-cfg';
// import i18n from './common/components/i18n/index';
import websocketUtil_ from './libs/websocket-util';

Vue.prototype.websocketUtil = websocketUtil_;

new Vue({
    el: '#app',
    router: router,
    store: store,
    // i18n: i18n,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        // i18n.locale = 'en';
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
        // 权限菜单过滤相关
        this.$store.commit('updateMenulist');
    },
    created () {
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});

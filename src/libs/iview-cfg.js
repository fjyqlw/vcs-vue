import Vue from 'vue';
import iView from 'iview';
import { ResError } from '@/libs//error/ResError';
import ZkTable from 'vue-table-with-tree-grid';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import contentmenu from 'v-contextmenu';
import 'v-contextmenu/dist/index.css';
import VueI18n from 'vue-i18n';
import en from 'iview/dist/locale/en-US';
import zh from 'iview/dist/locale/zh-CN';
import Icn from '../common/components/i18n/lang/cn.json';
import Ien from '../common/components/i18n/lang/en.json';

iView.Message.config({
    duration: 4
});
// 全局引入
Vue.use(iView);
Vue.use(ZkTable);
Vue.use(Treeselect);
Vue.use(contentmenu);
Vue.use(VueI18n);

// Vue.locale = () => { };

const messages = {
    en: Object.assign(Ien, en),
    zh: Object.assign(Icn, zh)
};

// Vue.config.lang = localStorage.lang || navigator.language || 'zh-CN';

const i18n = new VueI18n({
    locale: 'en',
    messages
});

Vue.locale('en-US', i18n);
new Vue({ i18n }).$mount('#app');

const errorHandler = (error, vm) => {
    iView.Message.destroy();
    if (!(error instanceof ResError)) {
        console.error(error);
        iView.Message.error('系统出了点小差，请联系管理员修复一下~');
    } else {
        iView.Message.error(error.message);
    }
};

Vue.config.errorHandler = errorHandler;
Vue.prototype.$throw = (error) => errorHandler(error, this);
import VueI18n from 'vue-i18n';
import Vue from 'vue';

Vue.use(VueI18n);

var langMessages = {
    cn: require('./lang/cn.json'),
    en: require('./lang/en.json')
};
var i18n = new VueI18n({
    locale: 'cn',
    messages: langMessages
});
export default i18n;

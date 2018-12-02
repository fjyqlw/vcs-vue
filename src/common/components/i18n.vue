<template>
    <div class="full-screen-btn-con">
        <Dropdown transfer trigger="hover" @on-click="langDropdown">
            <Icon type="ios-globe-outline" size="23" />
            <DropdownMenu slot="list">
                <DropdownItem name="zh-CN" :selected="sellang.zh">中文</DropdownItem>
                <DropdownItem name="en-US" :selected="sellang.en">英文</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
import Vue from "vue";
import { locale } from "iview";
import en from "iview/dist/locale/en-US";
import zh from "iview/dist/locale/zh-CN";
export default {
  name: "il8nDropdown",
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
      return {
          sellang:{
              en: false,
              zh: true
          }
      }
  },
  created() {
      debugger;
      let name = localStorage.getItem('lang') || 'zh-CN';
      console.log(name);
      this.langDropdown(name);
  },
  methods: {
     langDropdown(name) {
      this.sellang={};
        Vue.config.lang = name;
      if (name === "zh-CN") {
        Vue.locale(name, zh);
        this.sellang.zh = true;
      } else {
        Vue.locale(name, en);
        this.sellang.en = true;
      }
      localStorage.setItem("lang",name);
    }
  },
  created() {}
};
</script>

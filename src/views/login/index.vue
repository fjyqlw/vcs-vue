<template>
  <div class="login">
    <div style="height:100%;width:100%;background: rgb(0,0,0,0.2);">
      <Row
        type="flex"
        justify="center"
        align="middle"
        style="height:100%"
      >
        <Col span="6">
        <div>&nbsp;</div>
        </Col>
        <Col span="12" style="height: 500px;background: rgba(0, 0, 0, 0.4);">
        <Row
          type="flex"
          justify="center"
          align="middle"
          style="height:100%"
        >
          <Col span="12" style="height:100%;">
          <div>
            <Card :bordered="false" style="box-shadow: none !important;border-color: #00000000 !important;background: #00000000 !important;color:#fff !important;">
                <p slot="title" class="head">文档管理系统</p>
                <p>用户身份验证</p>
                <p>用户注册</p>
                <p>文档更改申请</p>
                <p>审核</p>
            </Card>


          </div>
          </Col>
          <Col span="12">
          <Card style="width:400px;margin: auto;background: rgba(0, 0, 0, 0.4);border: none;">
            <div style="text-align:center;padding:10px;">
              <h2 style="color:#fff;">用户登录</h2>
              <br>
              <Form
                @submit.native.prevent="handleSubmit"
                ref="formItem"
                :model="formItem"
                :rules="FromRule"
              >
                <FormItem prop="account">
                  <Input
                    :disabled="isValidate"
                    autocomplete="new-password"
                    v-model.trim="formItem.userId"
                    size="large"
                    type="text"
                    placeholder="用户名"
                  >
                  <Icon
                    type="ios-contact"
                    slot="prepend"
                    size="30"
                  />
                  </Input>
                </FormItem>
                <FormItem prop="password">
                  <Input
                    :disabled="isValidate"
                    v-model.trim="formItem.password"
                    autocomplete="new-password"
                    size="large"
                    type="password"
                    placeholder="密码"
                  >
                  <Icon
                    type="ios-lock"
                    slot="prepend"
                    size="30"
                  ></Icon>
                  </Input>
                </FormItem>
                <FormItem style="float:left;padding-left:20px;color:#fff;margin-bottom:10px !important;">
                  <Checkbox
                    v-model="formItem.rember"
                    size="large"
                  ><span
                      style="margin-left:5px;"
                    >记住密码</span></Checkbox>
                </FormItem>
                <div style="clear:both;"></div>
                <FormItem style="text-align: right;">
                  <Button
                    :loading="isSubmit"
                    :disabled="isValidate"
                    html-type="submit"
                    type="default"
                    size="large"
                    style="width:calc(100% - 15px);"
                    ghost
                  >
                    {{isValidate ? '登录验证中':'登 录'}}
                  </Button>
                </FormItem>
                <Divider style="color:#fff;">更多</Divider>
                <FormItem style="margin-bottom: 0px !important;">
                  <Row>
                    <Col
                      span="8"
                      class="tool"
                    >

                    <div style="float: left;">
                      <span
                        @click="onRegister()"
                        style="color:#fff;"
                      >注册账号</span></div>
                    </Col>

                    <Col
                      span="8"
                      class="tool"
                    >
                    <div><span
                        @click="onHelp()"
                        style="color:#fff;"
                      >使用方法</span></div>
                    </Col>
                    <Col
                      span="8"
                      class="tool"
                    >
                    <div style="float: right;">
                      <span
                        @click="onForget()"
                        style="color:#fff;"
                      >忘记密码</span></div>
                    </Col>
                  </Row>
                </FormItem>
              </Form>
            </div>
          </Card>
          </Col>
        </Row>
        </Col>
        <Col span="6">
        <div>&nbsp;</div>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
import util from "@/libs/util.js";
import { post } from "@/libs/axios-cfg";
export default {
  data() {
    return {
      isSubmit: false,
      setting: {
        autoLogin: false
      },
      formItem: {
        userId: "",
        password: ""
      },
      isValidate: false,
      FromRule: {
        userId: [{ required: true, message: "账号不能为空" }],
        password: [{ required: true, message: "请填写密码" }]
      }
    };
  },
  methods: {
    handleSubmit() {
      if (this.isValidate) {
        return false;
      }
      this.$refs.formItem.validate(valid => {
        if (valid) {
          this.login();
        }
      });
    },
    async login() {
      this.isValidate = true;
      const loadings = this.$Message.loading({
        content: "用户信息验证中...",
        duration: 0
      });
      try {
        let password = util.getMd5Pwd(this.formItem.password);

        let res = await post("/auth/login", {
          userId: this.formItem.userId,
          password: password
        });

        if (res.code === 0) {
          this.$Message.success("登录成功");
          localStorage.setItem("csrf-token", res.data.token);
          localStorage.setItem("user", res.data.userName);
          sessionStorage.setItem("password", password);

          //   if (this.setting.remberMe) {
          //     localStorage.setItem("userId", this.formItem.userId);
          //     localStorage.setItem("password", password);
          //     localStorage.setItem("autoLogin", this.setting.autoLogin);
          //     localStorage.setItem("remberMe", this.setting.remberMe);
          //   } else {
          //     localStorage.removeItem("userId");
          //     localStorage.removeItem("password");
          //     localStorage.removeItem("autoLogin");
          //     localStorage.removeItem("remberMe");
          //   }
          this.$store.commit("setAvator", "");

          this.websocketUtil.init(this.formItem.userId);
          this.$router.push({
            name: "home_index"
          });
        } else {
          this.$Message.error(res.msg);
        }
      } catch (error) {
        this.$throw(error);
      }
      setTimeout(loadings, 0);
      this.isValidate = false;
    },
    onRegister() {
      this.$router.push({
        name: "register"
      });
    },
    onForget() { },
    onHelp() { }
  }
};
</script>
<style lang="less">
.login {
  background-image: url("../../images/login-bg.png");
  height: 100%;
  background-size: cover;
  .tool {
    color: #2b85e4;
    span {
      cursor: pointer;
    }
  }

.head {
  color:#fff;
  font-size:28px;
  height: 35px;
  line-height: 35px;
  background-image: url("../../images/login-head.png");
  background-size: cover;
}
.ivu-card-head {
    border-bottom: 2px solid #e8eaec !important;
}

  .ivu-form-item {
    margin-bottom: 30px !important;
  }
  .ivu-input-group-append,
  .ivu-input-group-prepend {
    color: #ffffff !important;
    background-color: transparent !important;
    border: none !important;
  }

  .ivu-input {
    font-size: 18px;
    border-bottom: 1px solid #dcdee2 !important;
    color: #ffffff !important;
    border-top: 0px !important;
    border-left: 0 !important;
    border-right: 0 !important;
    outline: none !important;
    background-color: transparent !important;
  }
  .ivu-input:focus {
    box-shadow: none !important;
  }
  input:focus {
    background: transparent !important;
  }
  .ivu-btn-ghost.ivu-btn-primary:hover {
    background: transparent !important;
  }
  .ivu-btn-ghost.ivu-btn-dashed:hover,
  .ivu-btn-ghost.ivu-btn-default:hover {
    color: #ffffff !important;
    border-color: #ffffff !important;
  }
  .ivu-divider-inner-text {
    padding: 0 10px !important;
}
}
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px white inset !important;
  background-color: transparent !important;
}
</style>
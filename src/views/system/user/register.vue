<template>
  <div class="register">
    <Row type="flex" justify="center" align="middle" style="height:100%">
      <Col span="24">
      <div>
        <Card style="width:550px;margin:auto;">
          <p slot="title">
            <Icon type="ios-contact" size="23" />
            账号注册
          </p>
          <Form ref="registerForm" :model="data" :rules="ruls" :label-width="80">
            <FormItem label="姓名" prop="userName">
              <Input v-model.trim="data.userName" />
            </FormItem>
            <FormItem label="手机号" prop="userId">
              <Input v-model.trim="data.userId" />
            </FormItem>
            <FormItem label="邮箱" prop="email">
              <AutoComplete v-model="data.email" @on-search="emailComplete" placeholder="请输入邮箱地址">
                <Option v-for="item in emails" :value="item" :key="item">{{ item }}</Option>
              </AutoComplete>
            </FormItem>
            <FormItem label="备注" prop="desc">
              <Input v-model.trim="data.comment" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注..." />
            </FormItem>
          </Form>
          <div style="text-align: center;">
            <Button type="success" @click="submit">注册</Button>
            <Button @click="resetForm">重置</Button>
          </div>
          <div style="text-align: right;">
            <span class="tool" @click="backToLogin">返回登录</span>
          </div>
        </Card>

      </div>
      </Col>
    </Row>

  </div>
</template>
<script>
import { post } from "@/libs/axios-cfg";
import util from "@/libs/util.js";
export default {
  data() {
    const validateConfirmPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.data.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      show: true,
      loading: false,
      data: {
        userName: "",
        userId: "",
        email: "",
        password: "",
        rePassword: "",
        comment: ""
      },
      email: "",
      emails: [],
      ruls: {
        userName: [
          { required: true, message: "请输入姓名" },
          {
            pattern: /(^[\u4e00-\u9fa5]{1}[\u4e00-\u9fa5\.·。]{0,8}[\u4e00-\u9fa5]{1}$)|(^[a-zA-Z]{1}[a-zA-Z\s]{0,8}[a-zA-Z]{1}$)/,
            message: "姓名不合法，请输入正确的2-10位字符"
          }
        ],
        userId: [
          { required: true, message: "请输入手机号" },
          {
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
            message: "请输入正确的手机号"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱地址" },
          {
            pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
            message: "请输入正确的邮箱地址"
          }
        ],
        password: [
          { required: true, message: "请填写密码" },
          {
            pattern: /^(\w){6,18}$/,
            message: "密码应为[A-Za-z0-9_]组成的6-18位字符"
          }
        ],
        rePassword: [{ validator: validateConfirmPwd }]
      }
    };
  },
  methods: {
    async submit() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.add();
        }
      });
    },
    isPoneAvailable(val) {
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!myreg.test(val)) {
        return false;
      } else {
        return true;
      }
    },
    emailComplete(value) {
      this.emails =
        !value || value.indexOf("@") >= 0
          ? []
          : [value + "@qq.com", value + "@sina.com", value + "@163.com"];
    },
    onSelect(value) {
      debugger;
      if (null != value) {
        this.email = value;
      }
      return;
    },
    /**
     * @description 添加用户数据请求
     */
    async add(data) {
      this.loading = true;
      try {
        let password = util.getMd5Pwd(this.data.password);
        let res = await post("/user/register", {
          userName: this.data.userName,
          userId: this.data.userId,
          email: this.data.email,
          comment: this.data.comment
        });
        this.$Message.success("注册成功");
        this.$router.push({
          name: "login"
        });
      } catch (error) {
        this.$throw(error);
      }
      this.loading = false;
    },
    backToLogin() {
      this.$router.push({
        name: "login"
      });
    },
    resetForm() {
      this.$refs["registerForm"].resetFields();
    }
  }
};
</script>
<style lang="less">
.register {
  background-image: url("../../../images/login-bg.jpg");
  height: 100%;
  background-size: cover;
  .tool {
    color: #2b85e4;
    cursor: pointer;
  }
}
</style>

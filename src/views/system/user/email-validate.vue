<template>
  <div class="register">
    <Row type="flex" justify="center" align="middle" style="height:100%">
      <Col span="24">
      <div>
        <Card style="width:550px;margin:auto;">
          <p slot="title">
            <Icon type="ios-contact" size="23" />
            账号激活
          </p>
          <Form ref="registerForm" :model="data" :rules="ruls" :label-width="80">

            <FormItem label="密码" prop="password">
              <Input type="password" v-model.trim="data.password" :disabled="btnDisabled"/>
        </FormItem>
              <FormItem label="重复密码" prop="rePassword">
                <Input type="password" v-model.trim="data.rePassword" :disabled="btnDisabled"/>
        </FormItem>

          </Form>
          <div style="text-align: center;">
            <Button type="success" @click="submit" :disabled="btnDisabled">激活</Button>
            <Button @click="resetForm" :disabled="btnDisabled">重置</Button>
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
      btnDisabled: true,
      loading: false,
      code: "",
      audit: "",
      data: {
        code: "",
        auditId: "",
        password: "",
        rePassword: "",
        comment: ""
      },
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
  created() {
    let params = this.$route.params;
    this.auditId = params.auditId;
    this.code = params.code;
    this.emailValidate();
  },
  methods: {
    async emailValidate() {
      let url = "/user/emailValidate/" + this.auditId + "/" + this.code;
      let res = await post(url, {});
      if (res.data === true) {
        this.btnDisabled = false;
      } else {
        this.$Message.error(res.data);
         setTimeout(() => {
          this.$router.push({
            name: "login"
          });
        }, 1000);
      }
    },
    async submit() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.setPassword();
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
    /**
     * @description 设置密码
     */
    async setPassword(data) {
      this.loading = true;
      try {
        let url = "/user/password/" + this.auditId + "/" + this.code;
        let password = util.getMd5Pwd(this.data.password);
        let res = await post(url, {
          p: password
        });
        this.$Message.success("激活成功");
        setTimeout(() => {
          this.$router.push({
            name: "login"
          });
        }, 1000);
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

<template>

  <div>
    <Modal
      v-model="applyModel"
      class-name="vertical-center-modal"
      :width="800"
      :height="600"
      :mask-closable="false"
      :title="'申请-'+data.title"
      ok-text="提交"
      @on-ok="onOk"
      :loading="setting.vuterloading"
    >
      <div>
        <Card>
          <div>
            <template>
              <Row>
                <Col
                  span="23"
                  class="margin-bottom-10"
                >
                <Alert
                  type="warning"
                  v-show="data.type=='delete'&&data.item.kind=='dir'"
                  show-icon
                >请注意，删除文件夹会把文件夹及其子文件都删除，请谨慎操作！</Alert>
                <Alert
                  type="warning"
                  v-show="data.type=='delete'&&data.item.kind=='file'"
                  show-icon
                >您正在申请删除文件，请谨慎操作！</Alert>
                <Form
                  :model="formData"
                  :label-width="120"
                  class="base-info-form"
                >
                  <div v-show="data.type!='add-folder' && data.type!='add-file'">
                    <Divider orientation="left">基本信息</Divider>
                    <FormItem label="名称"><Input
                        v-model="data.item.fileName"
                        readonly
                      /></FormItem>
                    <FormItem label="地址"><Input
                        v-model="formData.svnUrl"
                        readonly
                      /></FormItem>
                    <FormItem label="最后提交人"><Input
                        v-model="data.item.author"
                        readonly
                      /></FormItem>
                    <FormItem label="最后提交时间"><Input
                        v-model="data.item.date"
                        readonly
                      /></FormItem>
                    <FormItem label="版本（修改次数）"><Input
                        v-model="data.item.revision"
                        readonly
                      /></FormItem>
                  </div>
                  <Divider orientation="left">申请信息</Divider>
                  <FormItem label="目录地址"><Input
                      v-model="formData.svnUrl"
                      v-show="data.type=='add-folder' || data.type=='add-file'"
                      readonly
                    /></FormItem>
                  <FormItem
                    label="新文件夹名称"
                    v-show="data.type == 'add-folder'"
                  ><Input
                      v-model="formData.newFolder"
                      placeholder="请输入要新建的文件夹名称"
                    /></FormItem>
                  <FormItem
                    label="新文件名称"
                    v-show="data.type == 'add-file'"
                  ><Input
                      :value="file==null?'':file.name"
                      readonly
                    /></FormItem>
                  <FormItem label="审核人">
                    <Select
                      v-model="formData.auditUserId"
                      filterable
                      remote
                      clearable
                      placeholder="请输入审核人id或者姓名"
                      :remote-method="searchAuditId"
                      :loading="setting.loading"
                    >
                      <Option
                        v-for="(option, index) in auditUserList"
                        :value="option.userId"
                        :key="index"
                      >{{option.userName+'('+option.userId+')'}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="备注">
                    <Input
                      v-model="formData.comment"
                      type="textarea"
                      :autosize="{minRows: 2,maxRows: 5}"
                      placeholder="请输入提交备注..."
                    />
                  </FormItem>
                  <FormItem
                    label="审核文件"
                    v-show="data.type != 'delete' && data.type != 'add-folder'"
                  >
                    <Upload
                      ref="upload"
                      v-show="file==null"
                      type="drag"
                      :data="formData"
                      name="file"
                      :with-credentials="true"
                      :paste="true"
                      :before-upload="beforeUpload"
                      action="/api/upload/applyUpload"
                      :show-upload-list="true"
                      :on-progress="onProgress"
                      :on-success="onSuccess"
                    >
                      <div style="padding: 20px 0">
                        <Icon
                          type="ios-cloud-upload"
                          size="52"
                          style="color: #3399ff"
                        ></Icon>
                        <p>单击或拖动待审核文件</p>
                      </div>
                    </Upload>
                    <Row v-show="file!=null">
                      <Col span="20">
                      <Icon
                        type="md-document"
                        size="18"
                      /><span style="font-size:14px;">{{file?file.name:''}}</span>
                      </Col>
                      <Col span="4">
                      <Button
                        type="primary"
                        size="small"
                        @click="removeFile"
                        icon="md-close"
                      >重新选择</Button>
                      </Col>
                    </Row>
                  </FormItem>
                </Form>
                </Col>
              </Row>
            </template>
          </div>
        </Card>
      </div>
    </Modal>

  </div>
</template>
<script>
import { post } from "@/libs/axios-cfg";
var qs = require("qs");

export default {
  data() {
    return {
      data: {
        title: "",
        type: "",
        svnUrl: "",
        svnId: "",
        item: {}
      },
      applyModel: false,
      param: {},
      file: null,
      formData: {
        type: "",
        svnUrl: "",
        comment: "",
        auditUserId: "",
        newFolder: "新建文件夹"
      },
      setting: {
        loading: true,
        showBorder: true
      },
      auditUserList: []
    };
  },
  created() {},
  watch: {},
  methods: {
    open(data) {
      this.initModel();
      console.log(data);
      this.data = data;
      this.formData.svnUrl = decodeURI(this.data.item.url);
      this.formData.type = data.type;

      if (this.data.type == "add-folder" || this.data.type == "add-file") {
        if (this.data.svnUrl == null || this.data.svnUrl == "") {
          this.getSvnUrlById(this.data.svnId);
        }
      }

      this.applyModel = true;
    },
    initModel() {
      this.data = {
        title: "",
        type: "",
        svnUrl: "",
        svnId: "",
        item: {}
      };
      this.formData = {
        type: "",
        svnUrl: "",
        comment: "",
        auditUserId: "",
        newFolder: "新建文件夹"
      };
      this.file = null;
      this.auditUserList = [];
    },
    searchAuditId(query) {
      if (query !== "") {
        var reg = /\((\d+)\)/;

        if (reg.test(query)) {
          //如果匹配上直接获取括号里的内容
          query = RegExp.$1;
        }
        this.auditUserList = [];
        this.getAuditUserList(query);
      } else {
        this.auditUserList = [];
      }
    },
    async getSvnUrlById(svnId) {
      this.setting.loading = true;
      try {
        let res = await post(
          "/repo/get/{svnId}",
          {},
          {
            svnId: svnId
          }
        );
        this.formData.svnUrl = res.data.svnUrl;
      } catch (error) {
        this.$throw(error);
      }
      this.setting.loading = false;
    },
    selectAuditId(value) {
      this.formData.auditUserId;
    },
    async getAuditUserList(value) {
      this.setting.loading = true;
      try {
        let res = await post(
          "/audit/user/keyword/{keyword}",
          {},
          {
            keyword: value
          }
        );
        this.auditUserList = res.data.rows;
      } catch (error) {
        this.$throw(error);
      }
      this.setting.loading = false;
    },
    beforeUpload(file) {
      if (
        this.data.type == "add-file" ||
        file.name == this.data.item.fileName
      ) {
        this.file = file;
      } else {
        this.$Message.error("选取的文件名称必须和原文件名称一致！");
      }

      return false;
    },
    onProgress(event, file, fileList) {},
    onSuccess(response, file, fileList) {
      console.log(response);
    },
    removeFile() {
      this.$refs.upload.clearFiles();
      this.file = null;
    },
    onOk() {
      this.setting.loading = true;
      console.log(this.formData);

      if (this.data.type == "add-folder" || this.data.type == "delete") {
        this.apply();
      } else {
        this.$refs.upload.post(this.file);
      }
    },
    async apply() {
      this.setting.loading = true;
      try {
        let res = await post("/upload/apply", this.formData);
        console.log(res.data);
      } catch (error) {
        this.$throw(error);
      }
      this.setting.loading = false;
    }
  }
};
</script>

<style lang="less">
.resp-folder {
  width: 80px;
  margin: 10px;
  cursor: pointer;
  float: left;
  .ivu-dropdown {
    display: block;
  }
  .icon {
    text-align: center;
  }
  .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }
}
.base-info-form {
  .ivu-form-item {
    margin-bottom: 5px !important;
    .ivu-form-item-label {
      text-align: left;
    }
  }
}
</style>

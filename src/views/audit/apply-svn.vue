<template>
  <div class="audit-user">
    <Card>
      <div>
        <template>
          <Row class="margin-bottom-10">
            <Col span="24">
            <Button :disabled="setting.loading" type="success" @click="getData">
              <Icon type="refresh"></Icon>&nbsp;刷新数据
            </Button>
            <Button type="primary" @click="exportData(1)">
              <Icon type="ios-download-outline"></Icon>&nbsp;导出表格
            </Button>
            <RadioGroup v-model="state" type="button">
              <Radio label="0" style="color:#2d8cf0;">待审核</Radio>
              <Radio label="1" style="color:#19be6b;">已同意</Radio>
              <Radio label="2"><span style="color:#ed4014;">已拒绝</span></Radio>
            </RadioGroup>
            </Col>
          </Row>
          <Row>
            <Table ref="table" class="margin-bottom-10" :columns="columns" :loading="setting.loading" :border="setting.showBorder" :data="data.rows"></Table>
            <Page :total="data.total" class="tr" @on-change="pageChange" :current.sync="data.page" :page-size="data.pageSize" @on-page-size-change="pageSizeChange" show-elevator show-sizer></Page>
          </Row>
        </template>
      </div>
    </Card>

    <Modal v-model="auditModel" :title="'审批-'+auditModelTitle" :loading="setting.loading" @on-ok="audit" @on-cancel="onCancel">
      <Form :model="auditItem" :label-width="80" class="audit-user">
        <Divider orientation="left">基本信息</Divider>
        <FormItem label="账号">
          <Input v-model="auditItem.applyUserId" :readonly="true"/>
        </FormItem>
          <FormItem label="姓名">
            <Input v-model="auditItem.applyUserName" :readonly="true"/>
        </FormItem>
            <FormItem label="邮箱">
              <Input v-model="auditItem.applyEmail" :readonly="true"/>
        </FormItem>
              <FormItem label="申请时间">
                <Input v-model="auditItem.createTime" :readonly="true"/>
        </FormItem>
                <FormItem label="备  注">
                  <Input v-model="auditItem.comment" type="textarea" :readonly="true"/>
        </FormItem>

                  <Divider orientation="left">审批信息</Divider>

                  <FormItem label="审核人" v-show="auditItem.auditUserName != null && auditItem.auditUserName != ''">
                    <Input v-model="auditItem.auditUserName" :readonly="state != 0"/>
        </FormItem>
                    <FormItem label="审核时间" v-show="auditItem.auditTime != null && auditItem.auditTime != ''">
                      <Input v-model="auditItem.auditTime" :readonly="state != 0"/>
        </FormItem>
                      <FormItem label="审批意见">
                        <Input v-model="auditItem.message" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :readonly="state != 0" placeholder="请输入审批意见..."/>
        </FormItem>
      </Form>
      <div slot="footer" align="center">
        <Button type="primary" size="large" :loading="setting.loading" @click="audit" v-show="auditItem.state != -1 ">确定</Button>
        <Button size="large" class="margin-left-10" :loading="setting.loading" @click="onCancel" v-show="auditItem.state != -1 ">取消</Button>
        <Button size="large" class="margin-left-10" :loading="setting.loading" @click="onCancel" v-show="auditItem.state === -1 ">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import dayjs from "dayjs";
import { post } from "@/libs/axios-cfg";
export default {
  data() {
    return {
      selections: [],
      setting: {
        loading: true,
        showBorder: true
      },
      search: {
        type: "userName",
        value: ""
      },
      auditItem: {},
      auditModel: false,
      auditModelTitle: "",
      state: "0",
      message: "",
      columns: [
        { title: "申请账号", key: "applyUserId", sortable: true },
        { title: "姓名", key: "applyUserName", sortable: true },
        {
          title: "申请理由",
          key: "comment",
          render: (h, params) => {
            return h(
              "Poptip",
              {
                props: {
                  content: params.row.comment,
                  trigger: "hover"
                }
              },
              params.row.comment
            );
          },
          sortable: true
        },
        {
          title: "申请日期",
          key: "createTime",
          render: (h, params) => {
            return h("span", params.row.createTime);
          },
          sortable: true
        },
        { title: "邮箱", key: "applyEmail", sortable: true },
        {
          title: "审批日期",
          key: "createTime",
          render: (h, params) => {
            return h("span", params.row.createTime);
          },
          sortable: true
        },
        {
          title: "审批意见",
          key: "message",
          render: (h, params) => {
            return h(
              "Poptip",
              {
                props: {
                  content: params.row.message,
                  trigger: "hover"
                }
              },
              params.row.message
            );
          },
          sortable: true
        },
        {
          title: "审批时间",
          key: "auditTime",
          render: (h, params) => {
            return h("span", params.row.lastLauditTimeoginDate);
          },
          sortable: true
        },
        {
          title: "操作",
          key: "action",
          width: 160,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "default"
                  },
                  style: {
                    marginRight: "5px",
                    display: this.state != 0 ? "none" : "inline-block"
                  },
                  on: {
                    click: () => {
                      this.auditModelTitle = "同意";
                      this.auditItem = params.row;
                      this.auditItem.state = 1;
                      this.auditModel = true;
                    }
                  }
                },
                "同意"
              ),
              h(
                "Button",
                {
                  props: { type: "error", size: "default" },
                  style: {
                    marginRight: "5px",
                    display: this.state != 0 ? "none" : "inline-block"
                  },
                  on: {
                    click: () => {
                      this.auditModelTitle = "拒绝";
                      this.auditItem = params.row;
                      this.auditItem.state = 2;
                      this.auditModel = true;
                    }
                  }
                },
                "拒绝"
              ),
              h(
                "Button",
                {
                  props: { type: "primary", size: "default" },
                  style: {
                    display: this.state == 0 ? "none" : "inline-block"
                  },
                  on: {
                    click: () => {
                      this.auditModelTitle = "详情";
                      this.auditItem = params.row;
                      this.auditItem.state = -1;
                      this.auditModel = true;
                    }
                  }
                },
                "详情"
              )
            ]);
          }
        }
      ],
      data: {},
      dataFilter: {
        page: 1,
        pageSize: 10,
        state: "0"
      },
      removeObject: null,
      roles: null
    };
  },
  created() {
    this.getData();
  },
  watch: {
    state() {
      console.log(this.state);

      this.getData();
    }
  },
  methods: {
    /**
     * @description 分页更换事件回调
     */
    pageChange(p) {
      this.dataFilter.page = p;
      this.getData();
    },
    /**
     * @description 分页每页显示数量改变事件回调
     */
    pageSizeChange(p) {
      this.dataFilter.pageSize = p;
      this.getData();
    },
    /**
     * @description 获取用户列表
     */
    async getData() {
      this.setting.loading = true;
      try {
        let res = await post(
          "/audit/user/list/{state}",
          {
            page: this.dataFilter.page,
            pageSize: this.dataFilter.pageSize
          },
          {
            state: this.state
          }
        );
        this.data = res.data;
      } catch (error) {
        this.$throw(error);
      }
      this.setting.loading = false;
    },
    onCancel() {
      this.auditModel = false;
      this.auditItem = {};
    },
    async audit() {
      this.setting.loading = true;
      try {
        let res = await post(
          "/user/audit/{auditId}/{state}",
          {
            message: this.auditItem.message
          },
          {
            auditId: this.auditItem.auditId,
            state: this.auditItem.state
          }
        );
        this.auditModel = false;
        this.auditItem = {};
        this.getData();
      } catch (error) {
        this.$throw(error);
      }
      this.setting.loading = false;
    },
    /**
     * @description 导出表格CSV
     */
    exportData() {
      let typeName;
      if (this.state === "0") {
        typeName = "待审核";
      } else if (this.state === "1") {
        typeName = "已同意";
      } else {
        typeName = "已拒绝";
      }
      this.$refs.table.exportCsv({
        filename: "用户注册审核数据-" + typeName + "-" + new Date().getTime(),
        columns: this.columns.filter(
          (col, index) => index < this.columns.length - 1
        ),
        data: this.data.rows
      });
    }
  }
};
</script>
<style lang="less">
.audit-user {
  .ivu-form-item {
    margin-bottom: 5px !important;
  }
}
</style>

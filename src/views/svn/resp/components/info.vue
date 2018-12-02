<template>
  <Modal v-model="infoModel" class-name="vertical-center-modal" :width="800" :height="600" :title="'属性'">
    <p slot="header">
      <span>属性</span>
    </p>
    <div class="info-attr">
      <Card>
        <div>
          <template>
            <Row>
              <Col span="23" class="margin-bottom-10">
              <Form :label-width="120" class="base-info-form">
                <FormItem label="名称"><label>{{data.item.fileName}}</label></FormItem>
                <FormItem label="地址"><label>{{decodeURI(data.item.url)}}</label></FormItem>
                <FormItem label="最后提交人"><label>{{data.item.author}}</label></FormItem>
                <FormItem label="最后修改时间"><label>{{data.item.date}}</label></FormItem>
                <FormItem label="版本（修改次数）"><label>{{data.item.revision}}</label></FormItem>
              </Form>
              </Col>
            </Row>
          </template>
        </div>
      </Card>
    </div>
    <div slot="footer">
      <Button type="primary" center size="large">关闭</Button>
    </div>
  </Modal>
</template>
<script>
import { post } from "@/libs/axios-cfg";
var qs = require("qs");

export default {
  data() {
    return {
      data: {
        item: {}
      },
      infoModel: false,
      setting: {
        loading: true,
        showBorder: true
      }
    };
  },
  created() {},
  watch: {},
  methods: {
    open(data) {
      this.data = data;
      this.data.item.url = decodeURI(this.data.item.url);
      this.infoModel = true;
    },
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
  }
}
.info-attr {
  .ivu-form .ivu-form-item-label {
    text-align: left;
  }
}
</style>

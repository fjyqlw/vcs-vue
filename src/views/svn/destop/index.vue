<template>
    <div>
        <Card>
            <p slot="title" class="card-title">
                <Icon type="home"></Icon>
                <span>资源管理</span>
            </p>
            <div>
                <template>
                    <Row>
                        <Col span="15"  class="margin-bottom-10">
                            <Button type="info" @click="downloadRoot()"><Icon type="ios-download-outline" />&nbsp;导出所有</Button>
                            <Button :disabled="setting.loading" type="success" @click="initDestop"><Icon type="refresh"></Icon>&nbsp;刷新数据</Button>
                            <Tooltip placement="top">
                                <i-switch size="large" v-model="props.isFold">
                                    <span slot="open">展开</span>
                                    <span slot="close">折叠</span>
                                </i-switch>
                                <div slot="content">
                                    <p>是否折叠所有的节点</p>
                                </div>
                            </Tooltip>
                        </Col>
                    </Row>
                   <Content style="border-top: 1px solid #e9eaec;">
               
              <div class="resp-folder" title="返回上一级" @click="openParent()" v-show="destopStack!=null && destopStack.length>0">
                <div class="icon"><Icon type="ios-folder" size="60" /></div>
                <div class="name">上一级</div>
              </div>
              
              <div class="resp-folder" :title="item.fileName" v-for="item in listData" :key="item.url">
                
              <Dropdown trigger="contextMenu" placement="right-start">
                <div v-if="item.kind == 'dir'" class="icon" @click="open(item,$event)"><Icon type="ios-folder-outline" size="60"></Icon></div>
                <div v-else class="icon" @click="open(item,$event)"><Icon type="ios-document-outline" size="60"></Icon></div>
                <div class="name" @click="open(item,$event)">{{item.fileName}}</div>
        
                <DropdownMenu slot="list">
                  <DropdownItem on-click="openParent()">返回上级</DropdownItem>
                  <DropdownItem>下载</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              </div>

                <div style="clear:both"></div>
        
                    </Content>
                </template>
            </div>
        </Card>
           
    
    </div>
</template>
<script>
import { post } from "@/libs/axios-cfg";
var qs = require("qs");

export default {
  data() {
    return {
      destopStack: null,
      removeModal: false,
      setting: {
        loading: true,
        showBorder: true
      },
      props: {
        stripe: true,
        border: true,
        showHeader: true,
        showSummary: false,
        showRowHover: true,
        showIndex: false,
        treeType: true,
        isFold: false,
        expandType: false,
        selectionType: false
      },
      datas: [],
      treeData: [],
      listData: [],
      parentUrl: "",
      columns: [
        {
          label: "资源名称",
          prop: "fileName",
          type: "template",
          template: "fileName"
        },
        {
          label: "最后提交时间",
          prop: "date",
          width: "200px"
        },
        {
          label: "版本",
          prop: "revision",
          width: "100px"
        },
        {
          label: "操作",
          type: "template",
          prop: "action",
          template: "action",
          width: "120px"
        }
      ],
      removeObject: null,
      svnId: "523605981e514dd187782e84c5b8c736",
      svnUrl: null,
      listParam: {
        svnId: "523605981e514dd187782e84c5b8c736",
        svnUrl: null
      },
      listParentParam: {
        svnId: "523605981e514dd187782e84c5b8c736",
        svnUrl: null
      }
    };
  },
  created() {
    this.initDestop();
  },
  methods: {
    async getData() {
      this.setting.loading = true;
      try {
        let res = await post("/svn/showTree", {
          svnId: "523605981e514dd187782e84c5b8c736"
        });
        this.datas = res.data;
        this.treeData = res.data.children;
      } catch (error) {
        this.$throw(error);
      }
      this.setting.loading = false;
    },
    async getDestopData(type, stackParam) {
      this.setting.loading = true;
      try {
        let res = await post("/svn/showList", this.listParam);

        if ("init" === type) {
          this.destopStack = new Array();
        } else if ("open" === type) {
          this.destopStack.push(stackParam);
          console.log(this.destopStack);
        } else if ("" === type) {
        }
        this.listData = res.data;
      } catch (error) {
        this.$throw(error);
      }
      this.setting.loading = false;
    },
    async initDestop() {
      this.getDestopData("init");
    },
    async open(item, event) {
      var btnNum = event.button;
      console.log(btnNum);
      if (item.kind == "dir") {
        var stackParam = {
          svnId: this.listParam.svnId,
          svnUrl: this.listParam.svnUrl
        };
        this.listParam.svnUrl = item.url;
        this.getDestopData("open", stackParam);
      }
    },
    contextmenu() {},
    async openParent() {
      this.listParam = this.destopStack.pop();
      this.getDestopData("parent");
    },
    onDownload(row) {
      let url = "/api/svn/download?";
      let param = {
        url: row.url,
        kind: row.kind
      };

      url += qs.stringify(param);
      window.location.href = url;
    },
    downloadRoot() {
      let url = "/api/svn/download?";
      let param = {
        url: this.datas.url,
        kind: "dir"
      };

      url += qs.stringify(param);
      window.location.href = url;
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
</style>

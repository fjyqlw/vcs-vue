<template>
  <div class="respo">
    <Card>
      <div>
        <template>
          <Row>
            <Col span="15" class="margin-bottom-10">

            <RadioGroup v-model="viewType">
              <Radio label="explorer" :disabled="setting.loading">
                <span>文档视图</span>
              </Radio>
              <Radio label="tree" :disabled="setting.loading">
                <span>树视图</span>
              </Radio>
            </RadioGroup>

            <Select v-model="svnId" style="width:200px" :disabled="setting.loading">
              <Option v-for="item in repoList" :value="item.svnId" :key="item.svnId" :disabled="item.state != 1">{{ item.svnName }}</Option>
            </Select>
            <Tooltip placement="top" v-show="viewType=='tree'" :disabled="setting.loading">
              <i-switch size="large" v-model="props.isFold">
                <span slot="open">展开</span>
                <span slot="close">折叠</span>
              </i-switch>
              <div slot="content">
                <p>是否折叠所有的节点</p>
              </div>
            </Tooltip>
            <Button :disabled="setting.loading" type="success" @click="initData()" icon="ios-refresh">刷新数据</Button>
            <Button :disabled="setting.loading" type="info" @click="downloadRoot()" icon="ios-download-outline">导出所有</Button>

            </Col>
          </Row>
          <zk-table v-show="viewType=='tree'" ref="table" sum-text="sum" index-text="#" :data="treeData" :columns="columns" :stripe="props.stripe" :border="props.border" :show-header="props.showHeader" :show-summary="props.showSummary" :show-row-hover="props.showRowHover" :show-index="props.showIndex" :tree-type="props.treeType" :is-fold="props.isFold" :expand-type="props.expandType" :selection-type="props.selectionType">
            <template slot="fileName" slot-scope="scope">
              <div v-if="scope.row.kind == 'dir'">
                <Icon type="ios-folder" size="30"></Icon>&nbsp;{{fileName}}
              </div>
              <div v-else>
                <Icon type="md-document"></Icon>&nbsp;{{fileName}}
              </div>
            </template>
            <template slot="action" slot-scope="scope">
              <Button type="success" @click="onDownload(scope.row)" size="small">
                <Icon type="md-arrow-down" />&nbsp;导出</Button>
            </template>
          </zk-table>

          <Content style="border-top: 1px solid #e9eaec;" v-show="viewType=='explorer' && eType=='icon'">

            <div class="resp-folder" title="返回上一级" @click="openParent()" v-show="destopStack!=null && destopStack.length>0">
              <div class="icon">
                <Icon type="ios-folder" size="60" />
              </div>
              <div class="name">上一级</div>
            </div>

            <div class="resp-folder" :title="item.fileName" v-for="item in listData" :key="item.url">
              <div v-contextmenu:contextmenu @contextmenu="contextmenuData = item">
                <div v-if="item.kind == 'dir'" class="icon" @click="open(item)">
                  <Icon type="ios-folder-outline" size="60"></Icon>
                </div>
                <div v-else class="icon" @click="open(item)">
                  <Icon type="ios-document-outline" size="60"></Icon>
                </div>
                <div class="name" @click="open(item,$event)">{{item.fileName}}</div>
              </div>
            </div>

            <div class="resp-folder" v-contextmenu:contextmenu-click v-show="listData==null || listData.length < 1">
              <div class="icon">
                <Icon type="ios-add" size="81"></Icon>
              </div>
            </div>

            <div style="clear:both"></div>

            <v-contextmenu ref="contextmenu">
              <v-contextmenu-submenu @submenu-show="true" title="查看">
                <v-contextmenu-item @click="eType='detail'">详细信息</v-contextmenu-item>
                <v-contextmenu-item @click="eType='icon'">大图标</v-contextmenu-item>
              </v-contextmenu-submenu>
              <v-contextmenu-item @click="initData">刷新</v-contextmenu-item>
              <v-contextmenu-item @click="eType='icon'" :disabled="eType=='detail'">下载</v-contextmenu-item>
              <v-contextmenu-item divider></v-contextmenu-item>
              <v-contextmenu-submenu @submenu-show="true" title="新建" :disabled="eType=='detail'">
                <v-contextmenu-item @click="openApplyModel('新建文件夹','add-folder')">文件夹</v-contextmenu-item>
                <v-contextmenu-item @click="openApplyModel('新建文件','add-file')">文件</v-contextmenu-item>
              </v-contextmenu-submenu>
              <v-contextmenu-item @click="openApplyModel('修改文件','update')" :disabled="contextmenuData.kind=='dir' || eType=='detail'">修改</v-contextmenu-item>
              <v-contextmenu-item @click="openApplyModel('删除文件','delete')" :disabled="eType=='detail'">删除</v-contextmenu-item>
              <v-contextmenu-item divider></v-contextmenu-item>
              <v-contextmenu-item @click="openInfoModel('删除文件','delete')" :disabled="eType=='detail'">属性</v-contextmenu-item>
            </v-contextmenu>
            <v-contextmenu ref="contextmenu-click" event-type="click">
                <v-contextmenu-item @click="openApplyModel('新建文件夹','add-folder')">新建文件夹</v-contextmenu-item>
                <v-contextmenu-item @click="openApplyModel('新建文件','add-file')">新建文件</v-contextmenu-item>
              </v-contextmenu>
          </Content>

          <Content v-show="viewType=='explorer' && eType=='detail'">

            <div style="float:left;width:100%;margin-bottom:5px;">
              <div style="float:left;width:90px;">
                <Button icon="md-arrow-round-back" @click="openParent()" :disabled="destopStack==null || destopStack.length<1">上一级</Button>
              </div>
              <div style="float:left;width:calc(100% - 90px);">
                <Input style="float:left;" prefix="ios-folder-outline" v-model="headPath" readonly />
              </div>
            </div>
            <div style="clear:both;"></div>
            <Table :columns="columns1" :data="listData" @on-row-click="onRowClick" v-contextmenu:contextmenu></Table>

          </Content>
        </template>
      </div>
    </Card>

    <apply-model ref="applyModel"></apply-model>
    <info-model ref="infoModel"></info-model>
  </div>
</template>
<script>
import { post } from "@/libs/axios-cfg";
import util from "@/libs/util.js";
import applyModel from "./components/apply";
import infoModel from "./components/info";
var qs = require("qs");

export default {
  components: {
    applyModel,
    infoModel
  },
  data() {
    return {
      contextmenuData: {},
      viewType: "explorer",
      eType: "icon",
      destopStack: null,
      repoList: [],
      listData: [],
      svnId: "",
      listParam: {
        svnId: "",
        svnUrl: null
      },
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
        selectionType: true
      },
      headPath: "/",
      datas: [],
      treeData: [],
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
      columns1: [
        {
          title: "名称",
          key: "fileName",
          sortable: true,
          render: (h, params) => {
            var type = params.row.kind == "dir" ? "ios-folder" : "md-document";
            return h("div", [
              h("Icon", {
                props: {
                  type: type,
                  size: "18",
                  style: "margin-right:5px;"
                }
              }),
              h(
                "span",
                {
                  props: {
                    style: "margin-left:15px;"
                  }
                },
                params.row.fileName
              )
            ]);
          }
        },
        {
          title: "修改日期",
          sortable: true,
          key: "date"
        },
        {
          title: "类型",
          sortable: true,
          key: "kind",
          render: (h, params) => {
            var val = params.row.kind == "dir" ? "文件夹" : "文档";
            var fileName = params.row.fileName.toUpperCase();
            if (params.row.kind == "dir") {
              val = "文件夹";
            } else {
              val = util.getFileNameType(fileName);
            }
            return h("div", [h("span", val)]);
          }
        },
        {
          title: "版本",
          sortable: true,
          key: "revision"
        }
      ]
    };
  },
  watch: {
    svnId(n, o) {
      this.listParam.svnId = n;
      this.initData();
    },
    viewType(n, o) {
      this.initData();
    },
    listParam: {
      handler() {
        if (this.listParam.svnUrl != null && this.listParam.svnUrl != "") {
          this.headPath = decodeURI(this.listParam.svnUrl);
        } else {
          this.headPath = "/";
        }
      },
      deep: true
    }
  },
  mounted() {
    this.getRespData();
  },
  methods: {
    initData() {
      if (this.viewType == "tree") {
        this.getTreeData();
      } else {
        this.initDestop();
      }
    },
    async getRespData() {
      this.setting.loading = true;
      try {
        let res = await post("/repo/list", {});
        this.repoList = res.data;
        if (this.repoList.length > 0) {
          this.listParam.svnId = this.repoList[0].svnId;
          this.svnId = this.repoList[0].svnId;
          // this.initData();
        }
      } catch (error) {
        this.$throw(error);
      }
      this.setting.loading = false;
    },
    async getTreeData() {
      this.setting.loading = true;
      try {
        let res = await post("/svn/showTree", {
          svnId: this.svnId
        });
        this.datas = res.data;
        this.treeData = res.data.children;
      } catch (error) {
        this.$throw(error);
      }
      this.setting.loading = false;
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
    },

    async getDestopData(type, stackParam) {
      this.setting.loading = true;
      try {
        let res = await post("/svn/showList", this.listParam);

        if ("init" === type) {
          this.destopStack = new Array();
        } else if ("open" === type) {
          this.destopStack.push(stackParam);
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
      console.log(item, event);
      if (item.kind == "dir") {
        var stackParam = {
          svnId: this.listParam.svnId,
          svnUrl: this.listParam.svnUrl
        };
        this.listParam.svnUrl = item.url;
        this.getDestopData("open", stackParam);
      }
    },
    async openParent() {
      this.listParam = this.destopStack.pop();
      this.getDestopData("parent");
    },
    onRowClick(rows, index) {
        this.open(rows);
    },
    openApplyModel(title, type) {
      this.$refs.applyModel.open({
        title: title,
        type: type,
        svnId:this.listParam.svnId,
        svnUrl:this.listParam.svnUrl,
        item: this.contextmenuData
      });
    },
    openInfoModel(title, type) {
      this.$refs.infoModel.open({
        title: title,
        type: type,
        item: this.contextmenuData
      });
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
.respo {
  .ivu-table td,
  .ivu-table th {
    border-bottom: none;
  }
}
.v-contextmenu {
  width: 150px !important;
}
</style>
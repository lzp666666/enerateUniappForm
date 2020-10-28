<template>
  <div class="container">
    <div class="left-board">
      <div class="logo-wrapper"></div>
      <div class="components-list">
        <div v-for="(item, index) in componentsData" :key="index">
          <div class="components-title">
            <a-icon type="bar-chart" />{{ item.title }}
          </div>
          <draggable
            class="components-draggable"
            :list="item.data"
            :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
            :clone="cloneComponent"
            draggable=".components-item"
            :sort="false"
            @end="onEnd"
          >
            <div
              class="components-item"
              v-for="(jtem, jndex) in item.data"
              :key="jndex"
            >
              <div class="components-body">
                <a-icon :type="jtem.tagIcon" />
                {{ jtem.label }}
              </div>
            </div>
          </draggable>
        </div>
      </div>
    </div>
    <div class="center-board">
      <div class="action-bar">
        <a-button @click="download">导出VUE文件</a-button>
        <!-- <a-button>复制代码</a-button> -->

        <a-popconfirm
          title="是否清空全部?"
          ok-text="Yes"
          cancel-text="No"
          @confirm="delAll"
          @cancel="cancel"
        >
          <a-button>清空</a-button>
        </a-popconfirm>
      </div>
      <div class="center-scrollbar">
        <a-row class="center-board-row">
          <a-form-model
            style="height: 100%"
            :label-align="formConf.labelPosition"
            :layout="formConf.layout"
            :label-col="{ span: formConf.labelSpan }"
            :wrapper-col="{ span: 24 - formConf.labelSpan }"
          >
            <draggable
              class="drawing-board"
              :list="drawingList"
              :animation="340"
              group="componentsGroup"
            >
              <draggable-item
                v-for="(element, index) in drawingList"
                :key="element.renderKey"
                :drawingList="drawingList"
                :element="element"
                :index="index"
                :active-id="activeId"
                @cloneComponent="cloneComponent"
                :form-conf="formConf"
              ></draggable-item>
            </draggable>
            <div v-show="!drawingList.length" class="empty-info">
              从左侧拖入或点选组件进行表单设计
            </div>
          </a-form-model>
        </a-row>
      </div>
    </div>
    <div class="right-board">
      <right-panel :active-data.sync="activeData" :form-conf="formConf" />
    </div>
    <code-type-dialog
      :visible.sync="codeData.dialogVisible"
      :show-file-name="codeData.showFileName"
      @confirm="generate"
    />
  </div>
</template>

<script>
import draggable from "vuedraggable";
import {
  inputComponents,
  selectComponents,
  layoutComponents,
  formConf,
} from "@/assets/js/generator/config";
import drawingDefalut from "@/assets/js/generator/drawingDefalut";
import beautifier from "js-beautify";
import { saveAs } from "file-saver";
import RightPanel from "./RightPanel";
import CodeTypeDialog from "./CodeTypeDialog";
import DraggableItem from "./DraggableItem";
import { makeUpJs } from "@/assets/js/generator/js";
import { makeUpCss } from "@/assets/js/generator/css";
import {
  makeUpHtml,
  vueTemplate,
  vueScript,
  cssStyle,
} from "@/assets/js/generator/html";
import {
  // exportDefault,
  beautifierConf,
  // isNumberStr,
  titleCase,
} from "@/assets/js/index";
let tempActiveData;
export default {
  components: {
    draggable,
    DraggableItem,
    CodeTypeDialog,
    RightPanel,
  },
  provide() {
    return {
      activeItemFun: this.activeFormItem,
    };
  },
  data() {
    return {
      formConf,
      componentsData: {
        inputComponents: { title: "输入型组件", data: inputComponents },
        selectComponents: { title: "控制型组件", data: selectComponents },
        layoutComponents: { title: "布局型组件", data: layoutComponents },
      },
      idGlobal: 100,
      drawingList: JSON.parse(JSON.stringify(drawingDefalut)),
      activeId: JSON.parse(JSON.stringify(drawingDefalut[0].formId)),
      form: this.$form.createForm(this, { name: "coordinated" }),
      codeData: {
        // 复制导出代码-数据
        dialogVisible: false,
        operationType: "",
        generateConf: {},
        showFileName: false,
        formData: {},
      },
      activeData: JSON.parse(JSON.stringify(drawingDefalut[0])),
      currentTab: "mail",
    };
  },
  created() {
    console.log("drawingDefalut", drawingDefalut);
  },
  methods: {
    delAll() {
      this.drawingList = [];
    },
    activeFormItem(element) {
      console.log("element", element);
      this.activeData = element;
      this.activeId = element.formId;
    },
    cloneComponent(origin, type) {
      const clone = JSON.parse(JSON.stringify(origin));
      clone.formId = ++this.idGlobal;
      clone.span = formConf.span;
      clone.renderKey = +new Date(); // 改变renderKey后可以实现强制更新组件
      if (!clone.layout) clone.layout = "colFormItem";
      if (clone.layout === "colFormItem") {
        clone.vModel = `field${this.idGlobal}`;
        clone.placeholder !== undefined && (clone.placeholder += clone.label);
        tempActiveData = clone;
      } else if (clone.layout === "rowFormItem") {
        delete clone.label;
        clone.componentName = `row${this.idGlobal}`;
        clone.gutter = this.formConf.gutter;
        tempActiveData = clone;
      }
      if (type) {
        this.drawingList.push(JSON.parse(JSON.stringify(clone)));
      } else {
        return tempActiveData;
      }
    },
    onEnd(obj, a) {
      console.log("onEnd", obj, a);
    },
    AssembleFormData() {
      this.codeData.formData = {
        fields: JSON.parse(JSON.stringify(this.drawingList)),
        ...this.formConf,
      };
    },
    generate(data) {
      const func = this[`exec${titleCase(this.codeData.operationType)}`];
      this.codeData.generateConf = data;
      func && func(data);
    },
    execDownload(data) {
      const codeStr = this.generateCode();
      const blob = new Blob([codeStr], { type: "text/plain;charset=utf-8" });
      saveAs(blob, data.fileName);
    },
    download() {
      this.codeData.dialogVisible = true;
      this.codeData.operationType = "download";
    },
    generateCode() {
      const { type } = this.codeData.generateConf;
      this.AssembleFormData();
      const html = vueTemplate(makeUpHtml(this.codeData.formData, type));
      const script = vueScript(makeUpJs(this.codeData.formData, type));
      const css = cssStyle(makeUpCss(this.codeData.formData));
      console.log(html + script + css);
      return beautifier.html(html + script + css, beautifierConf.html);
    },
  },
};
</script>

<style lang="scss">
.empty-info {
  position: absolute;
  top: 46%;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 18px;
  color: #ccb1ea;
  letter-spacing: 4px;
}
.container {
  height: 84vh;
  background-color: #fff;
  display: flex;
  justify-content: space-between;

  .left-board {
    width: 260px;

    .logo-wrapper {
      position: relative;
      height: 46px;
      border-bottom: 1px solid #f1e8e8;
      border-right: 1px solid #f1e8e8;
      box-sizing: border-box;
      font-size: 20px;
      padding: 5px;
    }

    .components-list {
      padding: 8px;
      box-sizing: border-box;

      .components-title {
        font-size: 14px;
        color: #222;
        margin: 6px 2px;
      }

      .components-draggable {
        padding-bottom: 20px;

        .components-item {
          display: inline-block;
          width: 48%;
          margin: 1%;
          transition: transform 0ms !important;

          .components-body {
            padding: 8px 10px;
            background: #f6f7ff;
            font-size: 12px;
            cursor: move;
            border: 1px dashed #f6f7ff;
            border-radius: 3px;

            .anticon {
              margin-right: 10px;
            }

            &:hover {
              border: 1px dashed #787be8;
              color: #787be8;

              .svg-icon {
                color: #787be8;
              }
            }
          }
        }
      }
    }
  }

  .center-board {
    width: 66%;
    box-sizing: border-box;

    .action-bar {
      border-bottom: 1px solid #f1e8e8;
      text-align: right;
      height: 46px;
      border-right: 1px solid #f1e8e8;
      padding: 6px 30px;
    }

    .center-scrollbar {
      height: 100%;
    }

    .center-board-row {
      overflow: auto;
      padding: 12px 12px 15px 12px;
      height: 94%;
      box-sizing: border-box;

      .drawing-board {
        height: 100%;
        position: relative;

        .components-body {
          padding: 0;
          margin: 0;
          font-size: 0;
        }
        .el-form-item {
          margin-bottom: 15px;
        }
      }
    }
  }

  .right-board {
    overflow: hidden;
    width: 350px;
    padding-top: 3px;
  }
}
</style>

<template>
  <div class="icon-dialog">
    <a-modal
      v-model="nowVisible"
      title="选择生成类型"
      @ok="handleOk"
      @cancel="close"
    >
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <!-- <a-form-item label="生成类型">
          <a-radio-group default-value="file" button-style="solid" v-model="formData.type">
            <a-radio-button :value="item.value" v-for="(item,index) in typeOptions" :key="index">
              {{ item.label }}
            </a-radio-button>
          </a-radio-group>
        </a-form-item> -->
        <!-- <a-form-item label="使用端">
          <a-radio-group default-value="app" button-style="solid" v-model="formData.typeEnd">
            <a-radio-button :value="item.value" v-for="(item,index) in typeEnd" :key="index">
              {{ item.label }}
            </a-radio-button>
          </a-radio-group>
        </a-form-item> -->
        <a-form-item label="文件名">
          <a-input
            v-model="formData.fileName"
            placeholder="Basic usage"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    showFileName: {
      type: Boolean,
      default: null,
    },
  },
  data() {
    return {
      nowVisible: false,
      formData: {
        fileName: undefined,
        type: "file",
        typeEnd: "app端",
      },
      rules: {
        fileName: [
          {
            required: true,
            message: "请输入文件名",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "生成类型不能为空",
            trigger: "change",
          },
        ],
      },
      typeOptions: [
        {
          label: "页面",
          value: "file",
        },
        {
          label: "弹窗",
          value: "dialog",
        },
      ],
      typeEnd: [
        {
          label: "app端",
          value: "app",
        },
        {
          label: "web端",
          value: "web",
        },
      ],
      form: this.$form.createForm(this, { name: "dynamic_rule" }),
    };
  },
  created() {},
  computed: {},
  watch: {
    visible() {
      this.nowVisible = this.visible;
      this.formData.fileName = `${+new Date()}.vue`;
    },
  },
  mounted() {},
  methods: {
    onOpen() {
      if (this.showFileName) {
        this.formData.fileName = `${+new Date()}.vue`;
      }
    },
    close() {
      this.$emit("update:visible", false);
    },
    handleOk(e) {
      this.$emit("confirm", { ...this.formData });
      this.close();
    },
  },
};
</script>

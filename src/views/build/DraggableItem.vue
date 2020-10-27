<template>
  <a-col
    @click.stop="activeItem"
    :span="element.span"
    class="draggable-col"
    @mouseenter="drawing = true"
    @mouseleave="drawing = false"
    :class="[activeId === element.formId ? 'thisStyle' : '']"
  >
    <a-form-item
      v-if="element.type === 'input'"
      :label="element.label"
      class="el-form-item"
    >
      <a-input
        :addon-before="element.prepend"
        :addon-after="element.prepend"
        :disabled="element.disabled"
        v-model="element.defaultValue"
        :allow-clear="element.clearable"
        :maxLength="element.maxlength"
      >
        <a-icon slot="prefix" :type="element['prefix-icon']" />
        <a-icon slot="suffix" :type="element['suffix-icon']" />
      </a-input>
    </a-form-item>
    <a-form-item
      v-if="element.type === 'textarea'"
      :label="element.label"
      class="el-form-item"
    >
      <a-textarea
        :allow-clear="element.clearable"
        :disabled="element.disabled"
        v-model="element.defaultValue"
      ></a-textarea>
    </a-form-item>
    <a-form-item
      v-if="element.type === 'password'"
      :label="element.label"
      class="el-form-item"
    >
      <a-input-password
        :allow-clear="element.clearable"
        :disabled="element.disabled"
        v-model="element.defaultValue"
        placeholder="input password"
      />
    </a-form-item>
    <a-form-item
      v-if="element.tag === 'select' && element.type === 'single-column'"
      :label="element.label"
      class="el-form-item"
    >
      <a-select
        :disabled="element.disabled"
        :options="element.options"
        v-model="element.defaultValue"
        style="width: 100%"
      />
    </a-form-item>
    <a-form-item
      v-if="element.tag === 'select' && element.type === 'mutil-column-auto'"
      :label="element.label"
      class="el-form-item"
    >
      <a-cascader
        :disabled="element.disabled"
        :options="element.options"
        placeholder="Please select"
      />
    </a-form-item>
    <a-form-item
      v-if="element.type === 'radio'"
      :label="element.label"
      class="el-form-item"
    >
      <a-radio-group
        :disabled="element.disabled"
        :options="element.options"
        v-model="element.defaultValue"
      ></a-radio-group>
    </a-form-item>
    <a-form-item
      v-if="element.type === 'checkbox'"
      :label="element.label"
      class="el-form-item"
    >
      <a-checkbox-group
        :disabled="element.disabled"
        v-model="element.defaultValue"
        :options="element.options"
      >
      </a-checkbox-group>
    </a-form-item>
    <a-form-item
      v-if="element.type === 'switch'"
      :label="element.label"
      class="el-form-item"
    >
      <a-switch v-model="element.defaultValue" :disabled="element.disabled" />
    </a-form-item>
    <a-form-item
      v-if="element.type === 'slider'"
      :label="element.label"
      class="el-form-item"
    >
      <a-slider :disabled="element.disabled" v-model="element.defaultValue" />
    </a-form-item>
    <a-form-item
      v-if="element.type === 'time'"
      :label="element.label"
      class="el-form-item"
    >
      <a-time-picker
        :disabled="element.disabled"
        @change="onChangeDate"
        :defaultValue="element.defaultValue"
        :format="element.format"
      />
    </a-form-item>
    <a-form-item
      v-if="element.type === 'date'"
      :label="element.label"
      class="el-form-item"
    >
      <a-date-picker
        :disabled="element.disabled"
        @change="onChangeDate"
        :defaultValue="element.defaultValue"
        :format="element.format"
      ></a-date-picker>
    </a-form-item>
    <a-form-item
      v-if="element.type === 'a-rate'"
      :label="element.label"
      class="el-form-item"
    >
      <a-rate :disabled="element.disabled" v-model="element.defaultValue" />
    </a-form-item>
    <a-form-item
      v-if="element.type === 'upload'"
      :label="element.label"
      class="el-form-item"
    >
      <a-upload
        :disabled="element.disabled"
        name="file"
        :accept="element.accept"
        :listType="element['list-type']"
        :multiple="true"
        :action="element.action"
        :headers="{ authorization: 'authorization-text' }"
      >
        <a-button>
          <a-icon type="upload" />
          Click to Upload
        </a-button>
      </a-upload>
    </a-form-item>
    <div
      v-if="element.type === 'row'"
      :label="element.label"
      class="el-form-item row-style"
    >
      <a-row>
        <draggable
          style="min-height: 80px"
          class="drawing-board"
          :list="element.children"
          :animation="340"
          group="componentsGroup"
        >
          <draggable-item
            v-for="(item, jndex) in element.children"
            :key="item.renderKey"
            :element="item"
            :activeId="activeId"
            :drawingList="element.children"
            :index="jndex"
          ></draggable-item>
        </draggable>
      </a-row>
    </div>
    <div v-if="drawing">
      <span class="drawing-item drawing-item-copy" @click="copyItem">
        <a-icon
          type="file-add"
          :style="{ fontSize: '14px', color: '#409eff' }"
        />
      </span>
      <span class="drawing-item drawing-item-delete" @click="deleteItem">
        <a-icon type="delete" :style="{ fontSize: '14px', color: '#f56c6c' }" />
      </span>
    </div>
  </a-col>
</template>

<script>
import moment from "moment";
import draggable from "vuedraggable";

export default {
  name: "DraggableItem",
  components: {
    draggable,
  },
  inject: ["activeItemFun"],
  props: {
    element: {
      type: Object,
      default: null,
    },
    drawingList: {
      type: Array,
      default: null,
    },
    index: {
      type: Number,
      default: null,
    },
    cloneComponent: {
      type: Function,
      default: null,
    },
    activeId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: "coordinated" }),
      drawing: false,
      isActive: null,
    };
  },
  methods: {
    moment,
    copyItem() {
      this.$emit("cloneComponent", this.element, true);
    },
    deleteItem() {
      this.drawingList.splice(this.index, 1);
    },
    activeItem() {
      this.activeItemFun(this.element);
    },
    onChangeDate(date, dateString) {
      this.element.defaultValue = dateString;
    },
  },
};
</script>

<style lang="scss">
.el-form-item {
  border-radius: 6px;
  padding: 12px 10px;
  margin-bottom: 15px;
  &:hover {
    background: #f6f7ff;
  }
}
.thisStyle {
  .el-form-item {
    background: #f6f7ff;
  }
}
.draggable-col {
  position: relative;

  .drawing-item {
    cursor: pointer;
    top: -10px;
    height: 24px;
    width: 24px;
    text-align: center;
    border: 1px solid #409eff;
    border-radius: 30px;
    position: absolute;
  }

  .drawing-item-copy {
    right: 40px;
    border: 1px solid #409eff;
  }

  .drawing-item-delete {
    right: 10px;
    border: 1px solid #f56c6c;
  }
}

.row-style {
  border: 1px solid #0a7ced;
  &:hover {
    background-color: #fafafa;
  }
}
</style>

<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="组件属性">
        <div class="form-y">
          <a-form-model
            :model="activeData"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-form-item v-if="activeData.vModel !== undefined" label="字段名">
              <a-input
                v-model="activeData.vModel"
                placeholder="请输入字段名（v-model）"
              />
            </a-form-item>
            <a-form-item
              v-if="activeData.componentName !== undefined"
              label="组件名"
              >{{ activeData.componentName }}</a-form-item
            >
            <a-form-item v-if="activeData.label !== undefined" label="标题">
              <a-input v-model="activeData.label" placeholder="请输入标题" />
            </a-form-item>
            <a-form-item
              v-if="activeData.placeholder !== undefined"
              label="占位提示"
            >
              <a-input
                v-model="activeData.placeholder"
                placeholder="请输入占位提示"
              />
            </a-form-item>
            <a-form-item
              v-if="activeData['start-placeholder'] !== undefined"
              label="开始占位"
            >
              <a-input
                v-model="activeData['start-placeholder']"
                placeholder="请输入占位提示"
              />
            </a-form-item>
            <a-form-item
              v-if="activeData['end-placeholder'] !== undefined"
              label="结束占位"
            >
              <a-input
                v-model="activeData['end-placeholder']"
                placeholder="请输入占位提示"
              />
            </a-form-item>
            <a-form-item
              v-if="activeData.layout === 'rowFormItem'"
              label="栅格间隔"
            >
              <a-input-number
                v-model="activeData.gutter"
                :min="0"
                placeholder="栅格间隔"
              />
            </a-form-item>
            <a-form-item
              v-if="activeData.layout === 'rowFormItem'"
              label="布局模式"
            >
              <a-radio-group v-model="activeData.type">
                <a-radio-button label="default" />
                <a-radio-button label="flex" />
              </a-radio-group>
            </a-form-item>
            <a-form-item
              v-if="
                activeData.justify !== undefined && activeData.type === 'flex'
              "
              label="水平排列"
            >
              <a-select
                v-model="activeData.justify"
                placeholder="请选择水平排列"
                :style="{ width: '100%' }"
              >
                <a-option
                  v-for="(item, index) in justifyOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </a-select>
            </a-form-item>
            <a-form-item
              v-if="
                activeData.align !== undefined && activeData.type === 'flex'
              "
              label="垂直排列"
            >
              <a-radio-group v-model="activeData.align">
                <a-radio-button label="top" />
                <a-radio-button label="middle" />
                <a-radio-button label="bottom" />
              </a-radio-group>
            </a-form-item>
            <a-form-item
              v-if="activeData.labelSpan !== undefined"
              label="标签宽度"
            >
              <a-input
                v-model.number="activeData.labelSpan"
                type="number"
                placeholder="请输入标签宽度"
              />
            </a-form-item>
            <a-form-item
              v-if="activeData.style && activeData.style.width !== undefined"
              label="组件宽度"
            >
              <a-input
                v-model="activeData.style.width"
                placeholder="请输入组件宽度"
                clearable
              />
            </a-form-item>
            <a-form-item v-if="activeData.vModel !== undefined" label="默认值">
              <a-input
                :disabled="activeData.tag === 'timePicker'"
                v-model="defaultValue"
                placeholder="请输入默认值"
              />
            </a-form-item>
            <a-form-item v-if="activeData.type === 'checkbox'" label="至少应选">
              <a-input-number
                :value="activeData.min"
                :min="0"
                placeholder="至少应选"
                @input="$set(activeData, 'min', $event ? $event : undefined)"
              />
            </a-form-item>
            <a-form-item v-if="activeData.type === 'checkbox'" label="最多可选">
              <a-input-number
                :value="activeData.max"
                :min="0"
                placeholder="最多可选"
                @input="$set(activeData, 'max', $event ? $event : undefined)"
              />
            </a-form-item>
            <a-form-item v-if="activeData.prepend !== undefined" label="前缀">
              <a-input v-model="activeData.prepend" placeholder="请输入前缀" />
            </a-form-item>
            <a-form-item v-if="activeData.append !== undefined" label="后缀">
              <a-input v-model="activeData.append" placeholder="请输入后缀" />
            </a-form-item>
            <a-form-item
              v-if="activeData['prefix-icon'] !== undefined"
              label="前图标"
            >
              <a-input
                v-model="activeData['prefix-icon']"
                placeholder="请输入前图标名称"
              >
                <a-button
                  slot="append"
                  icon="el-icon-thumb"
                  @click="openIconsDialog('prefix-icon')"
                  >选择</a-button
                >
              </a-input>
            </a-form-item>
            <a-form-item
              v-if="activeData['suffix-icon'] !== undefined"
              label="后图标"
            >
              <a-input
                v-model="activeData['suffix-icon']"
                placeholder="请输入后图标名称"
              >
                <a-button
                  slot="append"
                  icon="el-icon-thumb"
                  @click="openIconsDialog('suffix-icon')"
                  >选择</a-button
                >
              </a-input>
            </a-form-item>
            <a-form-item
              v-if="activeData.tag === 'el-cascader'"
              label="选项分隔符"
            >
              <a-input
                v-model="activeData.separator"
                placeholder="请输入选项分隔符"
              />
            </a-form-item>
            <a-form-item
              v-if="activeData.autosize !== undefined"
              label="最小行数"
            >
              <a-input-number
                v-model="activeData.autosize.minRows"
                :min="1"
                placeholder="最小行数"
              />
            </a-form-item>
            <a-form-item
              v-if="activeData.autosize !== undefined"
              label="最大行数"
            >
              <a-input-number
                v-model="activeData.autosize.maxRows"
                :min="1"
                placeholder="最大行数"
              />
            </a-form-item>
            <a-form-item v-if="activeData.min !== undefined" label="最小值">
              <a-input-number v-model="activeData.min" placeholder="最小值" />
            </a-form-item>
            <a-form-item v-if="activeData.max !== undefined" label="最大值">
              <a-input-number v-model="activeData.max" placeholder="最大值" />
            </a-form-item>
            <a-form-item v-if="activeData.step !== undefined" label="步长">
              <a-input-number v-model="activeData.step" placeholder="步数" />
            </a-form-item>
            <!--        <a-form-item v-if="activeData.tag === 'input'" label="精度">-->
            <!--          <a-input-number v-model="activeData.precision" :min="0" placeholder="精度" />-->
            <!--        </a-form-item>-->
            <!--        <a-form-item v-if="activeData.tag === 'input'" label="按钮位置">-->
            <!--          <a-radio-group v-model="activeData['controls-position']">-->
            <!--            <a-radio-button label>默认</a-radio-button>-->
            <!--            <a-radio-button label="right">右侧</a-radio-button>-->
            <!--          </a-radio-group>-->
            <!--        </a-form-item>-->
            <a-form-item
              v-if="activeData.maxlength !== undefined"
              label="最多输入"
            >
              <a-input
                v-model="activeData.maxlength"
                placeholder="请输入字符长度"
              >
                <template slot="append">个字符</template>
              </a-input>
            </a-form-item>
            <a-form-item
              v-if="activeData['active-text'] !== undefined"
              label="开启提示"
            >
              <a-input
                v-model="activeData['active-text']"
                placeholder="请输入开启提示"
              />
            </a-form-item>
            <a-form-item
              v-if="activeData['inactive-text'] !== undefined"
              label="关闭提示"
            >
              <a-input
                v-model="activeData['inactive-text']"
                placeholder="请输入关闭提示"
              />
            </a-form-item>
            <a-form-item
              v-if="activeData['active-value'] !== undefined"
              label="开启值"
            >
              <a-input
                :value="setDefaultValue(activeData['active-value'])"
                placeholder="请输入开启值"
                @input="onSwitchValueInput($event, 'active-value')"
              />
            </a-form-item>
            <a-form-item
              v-if="activeData['inactive-value'] !== undefined"
              label="关闭值"
            >
              <a-input
                :value="setDefaultValue(activeData['inactive-value'])"
                placeholder="请输入关闭值"
                @input="onSwitchValueInput($event, 'inactive-value')"
              />
            </a-form-item>
            <!--            <a-form-item-->
            <!--              v-if="activeData.type !== undefined && 'date' === activeData.type"-->
            <!--              label="时间类型"-->
            <!--            >-->
            <!--              <a-select-->
            <!--                v-model="activeData.mode"-->
            <!--                placeholder="请选择时间类型"-->
            <!--                :style="{ width: '100%' }"-->
            <!--                @change="dateTypeChange"-->
            <!--              >-->
            <!--                <a-select-option-->
            <!--                  v-for="(item, index) in dateOptions"-->
            <!--                  :key="index"-->
            <!--                  :value="item.value"-->
            <!--                >{{ item.label }}</a-select-option>-->
            <!--              </a-select>-->
            <!--            </a-form-item>-->
            <a-form-item
              v-if="activeData.name !== undefined"
              label="文件字段名"
            >
              <a-input
                v-model="activeData.name"
                placeholder="请输入上传文件字段名"
              />
            </a-form-item>
            <a-form-item
              v-if="activeData.accept !== undefined"
              label="文件类型"
            >
              <a-select
                v-model="activeData.accept"
                placeholder="请选择文件类型"
                :style="{ width: '100%' }"
                clearable
              >
                <a-select-option value="image/*">image/*</a-select-option>
                <a-select-option value="video/*">video/*</a-select-option>
                <a-select-option value="audio/*">audio/*</a-select-option>
                <a-select-option value=".xls,.xlsx">.xls,.xlsx</a-select-option>
                <a-select-option value=".doc,.docx">.doc,.docx</a-select-option>
                <a-select-option value=".pdf">.pdf</a-select-option>
                <a-select-option value=".txt">.txt</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              v-if="activeData.fileSize !== undefined"
              label="文件大小"
            >
              <a-input
                v-model.number="activeData.fileSize"
                placeholder="请输入文件大小"
                :style="{ width: '70%' }"
              >
              </a-input>
              <a-select v-model="activeData.sizeUnit" :style="{ width: '30%' }">
                <a-select-option value="KB">KB</a-select-option>
                <a-select-option value="MB">MB</a-select-option>
                <a-select-option value="GB">GB</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              v-if="activeData.action !== undefined"
              label="上传地址"
            >
              <a-input
                v-model="activeData.action"
                placeholder="请输入上传地址"
                clearable
              />
            </a-form-item>
            <a-form-item
              v-if="activeData['list-type'] !== undefined"
              label="列表类型"
            >
              <a-radio-group v-model="activeData['list-type']" size="small">
                <a-radio-button value="text">text</a-radio-button>
                <a-radio-button value="picture">picture</a-radio-button>
                <a-radio-button value="picture-card"
                  >picture-card</a-radio-button
                >
              </a-radio-group>
            </a-form-item>
            <a-form-item
              v-if="activeData.buttonText !== undefined"
              v-show="'picture-card' !== activeData['list-type']"
              label="按钮文字"
            >
              <a-input
                v-model="activeData.buttonText"
                placeholder="请输入按钮文字"
              />
            </a-form-item>
            <a-form-item
              v-if="activeData['range-separator'] !== undefined"
              label="分隔符"
            >
              <a-input
                v-model="activeData['range-separator']"
                placeholder="请输入分隔符"
              />
            </a-form-item>
            <a-form-item
              v-if="activeData['picker-options'] !== undefined"
              label="时间段"
            >
              <a-input
                v-model="activeData['picker-options'].selectableRange"
                placeholder="请输入时间段"
              />
            </a-form-item>
            <a-form-item
              v-if="activeData.format !== undefined"
              label="时间格式"
            >
              <a-input placeholder="请输入时间格式" v-model="setTimeValue" />
            </a-form-item>
            <a-form-item
              v-if="activeData['show-word-limit'] !== undefined"
              label="输入统计"
            >
              <a-switch v-model="activeData['show-word-limit']" />
            </a-form-item>
            <a-form-item
              v-if="activeData.tag === 'input' && activeData.type === 'number'"
              label="严格步数"
            >
              <a-switch v-model="activeData['step-strictly']" />
            </a-form-item>
            <a-form-item
              v-if="activeData.type === 'mutil-column-auto'"
              label="是否多选"
            >
              <a-switch v-model="activeData.props.props.multiple" />
            </a-form-item>
            <a-form-item
              v-if="activeData.type === 'mutil-column-auto'"
              label="展示全路径"
            >
              <a-switch v-model="activeData['show-all-levels']" />
            </a-form-item>
            <a-form-item
              v-if="activeData.type === 'mutil-column-auto'"
              label="可否筛选"
            >
              <a-switch v-model="activeData.filterable" />
            </a-form-item>
            <a-form-item
              v-if="activeData.clearable !== undefined"
              label="能否清空"
            >
              <a-switch v-model="activeData.clearable" />
            </a-form-item>
            <a-form-item
              v-if="activeData.showTip !== undefined"
              label="显示提示"
            >
              <a-switch v-model="activeData.showTip" />
            </a-form-item>
            <a-form-item
              v-if="activeData.multiple !== undefined"
              label="多选文件"
            >
              <a-switch v-model="activeData.multiple" />
            </a-form-item>
            <a-form-item
              v-if="activeData['auto-upload'] !== undefined"
              label="自动上传"
            >
              <a-switch v-model="activeData['auto-upload']" />
            </a-form-item>
            <!--            <a-form-item v-if="activeData.readonly !== undefined" label="是否只读">-->
            <!--              <a-switch v-model="activeData.readonly" />-->
            <!--            </a-form-item>-->
            <a-form-item
              v-if="activeData.disabled !== undefined"
              label="是否禁用"
            >
              <a-switch v-model="activeData.disabled" />
            </a-form-item>
            <a-form-item
              v-if="activeData.type === 'single-column'"
              label="是否可搜索"
            >
              <a-switch v-model="activeData.filterable" />
            </a-form-item>
            <a-form-item
              v-if="activeData.type === 'single-column'"
              label="是否多选"
            >
              <a-switch
                v-model="activeData.multiple"
                @change="multipleChange"
              />
            </a-form-item>
            <a-form-item
              v-if="activeData.required !== undefined"
              label="是否必填"
            >
              <a-switch v-model="activeData.required" />
            </a-form-item>

            <a-form-item
              v-if="activeData['allow-half'] !== undefined"
              label="允许半选"
            >
              <a-switch v-model="activeData['allow-half']" />
            </a-form-item>
            <a-form-item
              v-if="activeData['show-text'] !== undefined"
              label="辅助文字"
            >
              <a-switch
                v-model="activeData['show-text']"
                @change="rateTextChange"
              />
            </a-form-item>
            <a-form-item
              v-if="activeData['show-score'] !== undefined"
              label="显示分数"
            >
              <a-switch
                v-model="activeData['show-score']"
                @change="rateScoreChange"
              />
            </a-form-item>

            <template
              v-if="
                ['checkbox', 'radio', 'single-column'].indexOf(
                  activeData.type
                ) > -1
              "
            >
              <a-divider>选项</a-divider>
              <draggable
                :list="activeData.options"
                :animation="340"
                group="selectItem"
                handle=".option-drag"
              >
                <div
                  v-for="(item, index) in activeData.options"
                  :key="index"
                  class="select-item"
                >
                  <div class="select-line-icon option-drag">
                    <a-icon type="menu-fold" />
                  </div>
                  <a-input
                    v-model="item.label"
                    placeholder="选项名"
                    size="small"
                  />
                  <a-input
                    placeholder="选项值"
                    size="small"
                    v-model="item.value"
                  />
                  <div
                    class="close-btn select-line-icon"
                    @click="activeData.options.splice(index, 1)"
                  >
                    <a-icon type="close" />
                  </div>
                </div>
              </draggable>
              <div>
                <a-button
                  style="padding-bottom: 0"
                  icon="plus"
                  type="link"
                  @click="addSelectItem"
                  >添加选项</a-button
                >
              </div>
            </template>
            <template v-if="activeData.type === 'mutil-column-auto'">
              <a-divider>选项</a-divider>
              <a-form-item label="数据类型">
                <a-radio-group v-model="activeData.dataType" size="small">
                  <a-radio-button value="dynamic">动态数据</a-radio-button>
                  <a-radio-button value="static">静态数据</a-radio-button>
                </a-radio-group>
              </a-form-item>

              <template v-if="activeData.dataType === 'dynamic'">
                <a-form-item label="标签键名">
                  <a-input
                    v-model="activeData.labelKey"
                    placeholder="请输入标签键名"
                  />
                </a-form-item>
                <a-form-item label="值键名">
                  <a-input
                    v-model="activeData.valueKey"
                    placeholder="请输入值键名"
                  />
                </a-form-item>
                <a-form-item label="子级键名">
                  <a-input
                    v-model="activeData.childrenKey"
                    placeholder="请输入子级键名"
                  />
                </a-form-item>
              </template>
              <div
                style="position: relative"
                v-if="activeData.dataType === 'static'"
              >
                鼠标右键可设置数据
                <a-tree
                  v-if="activeData.dataType === 'static'"
                  draggable
                  :replaceFields="{
                    children: 'children',
                    title: 'label',
                    key: 'id',
                  }"
                  :tree-data="activeData.options"
                  @expand="onExpand"
                  @rightClick="onRightClick"
                />
                <div :style="tmpStyle" v-if="NodeTreeItem">
                  <div class="menu-item" @click="orgHandle('add')">
                    <a-tooltip placement="bottom" title="新增子组织">
                      <a-icon type="plus-circle-o" />
                    </a-tooltip>
                  </div>
                  <div class="menu-item" @click="orgHandle('edit')">
                    <a-tooltip placement="bottom" title="修改">
                      <a-icon type="edit" />
                    </a-tooltip>
                  </div>
                  <div
                    class="menu-item"
                    @click="orgHandle('del')"
                    v-if="NodeTreeItem.parentOrgId"
                  >
                    <a-tooltip placement="bottom" title="删除">
                      <a-icon type="minus-circle-o" />
                    </a-tooltip>
                  </div>
                </div>
              </div>
              <div v-if="activeData.dataType === 'static'">
                <a-button
                  style="padding-bottom: 0"
                  icon="plus"
                  type="link"
                  @click="addTreeItem"
                  >添加父级</a-button
                >
              </div>
            </template>

            <template v-if="activeData.layout === 'colFormItem'">
              <a-divider>正则校验</a-divider>
              <div
                v-for="(item, index) in activeData.regList"
                :key="index"
                class="reg-item"
              >
                <span
                  class="close-btn"
                  @click="activeData.regList.splice(index, 1)"
                >
                  <a-icon type="close" />
                </span>
                <a-form-item label="表达式">
                  <a-input v-model="item.pattern" placeholder="请输入正则" />
                </a-form-item>
                <a-form-item label="错误提示" style="margin-bottom: 0">
                  <a-input
                    v-model="item.message"
                    placeholder="请输入错误提示"
                  />
                </a-form-item>
              </div>
              <div style="margin-left: 20px">
                <a-button type="link" icon="plus" @click="addReg"
                  >添加规则</a-button
                >
              </div>
            </template>
          </a-form-model>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="表单属性" force-render>
        <a-form-model
          :model="formConf"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="表单名">
            <a-input
              v-model="formConf.formRef"
              placeholder="请输入表单名（ref）"
            />
          </a-form-model-item>
          <a-form-model-item label="表单模型">
            <a-input
              v-model="formConf.formModel"
              placeholder="请输入数据模型"
            />
          </a-form-model-item>
          <a-form-model-item label="校验模型">
            <a-input
              v-model="formConf.formRules"
              disabled
              placeholder="请输入校验模型"
            />
          </a-form-model-item>
          <a-form-model-item label="表单布局">
            <a-radio-group v-model="formConf.layout">
              <a-radio-button value="horizontal">Horizontal</a-radio-button>
              <a-radio-button value="vertical">Vertical</a-radio-button>
              <a-radio-button value="inline">Inline</a-radio-button>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="标签对齐">
            <a-radio-group v-model="formConf.labelPosition">
              <a-radio-button value="left">左对齐</a-radio-button>
              <a-radio-button value="right">右对齐</a-radio-button>
              <a-radio-button value="top">顶部对齐</a-radio-button>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="标签宽度">
            <a-input-number
              v-model="formConf.labelSpan"
              placeholder="标签宽度"
            />
          </a-form-model-item>
          <a-form-model-item label="栅格间隔">
            <a-input-number
              v-model="formConf.gutter"
              :min="0"
              placeholder="栅格间隔"
            />
          </a-form-model-item>
          <a-form-model-item label="禁用表单">
            <a-switch v-model="formConf.disabled" />
          </a-form-model-item>
          <a-form-model-item label="表单按钮">
            <a-switch v-model="formConf.formBtns" />
          </a-form-model-item>
        </a-form-model>
      </a-tab-pane>
    </a-tabs>
    <a-modal
      title="添加选项"
      :visible="selectDataVisible"
      @ok="selectDataHandleOk"
      @cancel="selectDataVisible = false"
    >
      <a-form
        v-if="selectDataVisible"
        :form="selectDataForm"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="选项名">
          <a-input
            v-decorator="[
              'label',
              { rules: [{ required: true, message: '请输入' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="选项值">
          <a-input-group compact>
            <a-input
              style="width: 70%"
              v-decorator="[
                'value',
                { rules: [{ required: true, message: '请输入' }] },
              ]"
            />
            <a-select
              style="width: 30%"
              v-decorator="[
                'dataType',
                {
                  rules: [
                    { required: true, message: 'Please select your gender!' },
                  ],
                },
              ]"
            >
              <a-select-option value="string"> 字符串 </a-select-option>
              <a-select-option value="number"> 数字 </a-select-option>
            </a-select>
          </a-input-group>
        </a-form-item>
        <a-form-item label="操作类型" v-show="false">
          <a-input v-decorator="['type']" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import { formatterDate } from "@/assets/js/index";
const dateTimeFormat = {
  date: "yyyy-MM-dd",
  week: "yyyy 第 WW 周",
  month: "yyyy-MM",
  year: "yyyy",
  datetime: "yyyy-MM-dd HH:mm:ss",
  daterange: "yyyy-MM-dd",
  monthrange: "yyyy-MM",
  datetimerange: "yyyy-MM-dd HH:mm:ss",
};
export default {
  props: ["activeData", "formConf"],
  components: {
    draggable,
  },
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      selectDataVisible: false,
      selectDataForm: this.$form.createForm(this, { name: "coordinated" }),
      dateTypeOptions: [
        {
          label: "时间(date)",
          value: "date",
        },
        {
          label: "月(month)",
          value: "month",
        },
        {
          label: "年(year)",
          value: "year",
        },
        {
          label: "十年区间(decade)",
          value: "decade",
        },
      ],
      dateRangeTypeOptions: [
        {
          label: "日期范围(daterange)",
          value: "daterange",
        },
        {
          label: "月范围(monthrange)",
          value: "monthrange",
        },
        {
          label: "日期时间范围(datetimerange)",
          value: "datetimerange",
        },
      ],
      colorFormatOptions: [
        {
          label: "hex",
          value: "hex",
        },
        {
          label: "rgb",
          value: "rgb",
        },
        {
          label: "rgba",
          value: "rgba",
        },
        {
          label: "hsv",
          value: "hsv",
        },
        {
          label: "hsl",
          value: "hsl",
        },
      ],
      justifyOptions: [
        {
          label: "start",
          value: "start",
        },
        {
          label: "end",
          value: "end",
        },
        {
          label: "center",
          value: "center",
        },
        {
          label: "space-around",
          value: "space-around",
        },
        {
          label: "space-between",
          value: "space-between",
        },
      ],
      NodeTreeItem: null, // 右键菜单
      tmpStyle: "",
    };
  },
  computed: {
    dateOptions() {
      if (this.activeData.type === "date") {
        if (this.activeData["start-placeholder"] === undefined) {
          return this.dateTypeOptions;
        }
        return this.dateRangeTypeOptions;
      }
      return [];
    },
    defaultValue: {
      get() {
        return this.setDefaultValue(this.activeData.defaultValue);
      },
      set(str) {
        if (Array.isArray(this.activeData.defaultValue)) {
          // 数组
          this.$set(
            this.activeData,
            "defaultValue",
            str.split(",").map((val) => (this.isNumberStr(val) ? +val : val))
          );
        } else if (["true", "false"].indexOf(str) > -1) {
          // 布尔
          this.$set(this.activeData, "defaultValue", JSON.parse(str));
        } else {
          // 字符串和数字
          this.$set(
            this.activeData,
            "defaultValue",
            this.isNumberStr(str) ? +str : str
          );
        }
      },
    },
    setTimeValue: {
      get() {
        return this.activeData.format;
      },
      set(val, type) {
        console.log(val, type);
        const valueFormat = type === "week" ? dateTimeFormat.date : val;
        this.$set(this.activeData, "defaultValue", null);
        this.$set(this.activeData, "value-format", valueFormat);
        this.$set(this.activeData, "format", val);
      },
    },
  },
  mounted() {
    // document.addEventListener('click', e => {
    //   if (!this.$el.contains(e.target)) {
    //     this.NodeTreeItem = null// 点击其他区域关闭
    //   }
    // })
  },
  watch: {
    activeData() {
      console.log("右侧数据已更新", this.activeData, this.formConf);
    },
  },
  methods: {
    selectDataHandleOk() {
      this.selectDataForm.validateFields((err, values) => {
        if (!err) {
          if (this.NodeTreeItem) {
            this.nodeHandleAdd(
              this.activeData.options,
              this.NodeTreeItem.id,
              values
            );
          } else {
            this.activeData.options.push({
              label: values.label,
              value: values.value,
              id: values.value,
            });
          }
          this.selectDataVisible = false;
        }
      });
    },
    nodeHandleAdd(allData, ID, data) {
      allData.forEach((item, i) => {
        if (item.id === ID) {
          switch (data.type) {
            case "add":
              if (!item.children) {
                item.children = [];
              }
              item.children.push({ ...data, id: data.value });
              break;
            case "edit":
              item.label = data.label;
              item.value = data.value;
              item.id = data.label;
              break;
            case "del":
              allData.splice(i, 1);
              break;
          }
          return false;
        } else {
          if (item.children) {
            this.nodeHandleAdd(item.children, ID, data);
          }
        }
      });
    },
    onExpand() {
      this.NodeTreeItem = null;
    },
    onRightClick({ event, node }) {
      const x =
        event.currentTarget.offsetLeft + event.currentTarget.clientWidth;
      const y = event.currentTarget.offsetTop;
      this.NodeTreeItem = {
        pageX: x,
        pageY: y,
        id: node._props.eventKey,
        title: node._props.title,
        parentOrgId: node._props.dataRef.id || null,
      };
      this.tmpStyle = {
        position: "absolute",
        maxHeight: 40,
        textAlign: "center",
        left: `${x + 10 - 0}px`,
        top: `${y + 1.5 - 0}px`,
        display: "flex",
        flexDirection: "row",
      };
    },
    orgHandle(type) {
      if (type !== "del") {
        this.selectDataVisible = true;
        this.$nextTick(() => {
          this.selectDataForm.setFieldsValue({
            dataType: `string`,
            type: type,
            label: type === "edit" ? this.NodeTreeItem.title : "",
            value: type === "edit" ? this.NodeTreeItem.id : "",
          });
        });
      } else {
        this.nodeHandleAdd(this.activeData.options, this.NodeTreeItem.id, {
          type: "del",
        });
        this.NodeTreeItem = null;
      }
    },
    addTreeItem() {
      this.NodeTreeItem = null; // 点击其他区域关闭
      this.orgHandle("new");
    },
    addReg() {
      this.activeData.regList.push({
        pattern: "",
        message: "",
      });
    },
    addSelectItem() {
      this.activeData.options.push({
        label: "",
        value: "",
      });
    },
    rateTextChange(val) {
      if (val) this.activeData["show-score"] = false;
    },
    rateScoreChange(val) {
      if (val) this.activeData["show-text"] = false;
    },
    setDefaultValue(val) {
      if (Array.isArray(val)) {
        return val.join(",");
      }
      if (["string", "number"].indexOf(val) > -1) {
        return val;
      }
      if (typeof val === "boolean") {
        return `${val}`;
      }
      return val;
    },
    onSwitchValueInput(val, name) {
      if (["true", "false"].indexOf(val) > -1) {
        this.$set(this.activeData, name, JSON.parse(val));
      } else {
        this.$set(this.activeData, name, this.isNumberStr(val) ? +val : val);
      }
    },
    multipleChange(val) {
      this.$set(this.activeData, "defaultValue", val ? [] : "");
    },
    isNumberStr(str) {
      return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str);
    },
  },
};
</script>
<style lang="scss">
.form-y {
  height: 720px;
  overflow-y: auto;
}
.reg-item {
  padding: 12px 6px;
  background: #f8f8f8;
  position: relative;
  border-radius: 4px;
  .close-btn {
    position: absolute;
    right: 0px;
    top: 0px;
    display: block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    color: #fff;
    text-align: center;
    z-index: 1;
    cursor: pointer;
    font-size: 12px;
    &:hover {
      background: rgba(210, 23, 23, 0.5);
    }
  }
  & + .reg-item {
    margin-top: 18px;
  }
}
.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  & .el-input + .el-input {
    margin-left: 4px;
  }
}
.option-drag {
  cursor: move;
}
.select-item + .select-item {
  margin-top: 4px;
}
.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}
</style>

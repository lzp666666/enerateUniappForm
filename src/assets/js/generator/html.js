/* eslint-disable max-len */

let confGlobal
let someSpanIsNot24

export function dialogWrapper(str) {
  return `<el-dialog v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" title="Dialog Titile">
    ${str}
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handelConfirm">确定</el-button>
    </div>
  </el-dialog>`
}

export function vueTemplate(str) {
  return `<template>
    <div class="u-p-20">
      ${str}
    </div>
  </template>`
}

export function vueScript(str) {
  return `<script>
    ${str}
  </script>`
}

export function cssStyle(cssStr) {
  return `<style>
    ${cssStr}
  </style>`
}

function buildFormTemplate(conf, child, type) {
  let labelPosition = ''
  if (conf.labelPosition !== 'right') {
    labelPosition = `label-position="${conf.labelPosition}"`
  }
  const disabled = conf.disabled ? `:disabled="${conf.disabled}"` : ''
  let str = `<u-form ref="${conf.formRef}" :model="${conf.formModel}" :rules="${conf.formRules}" size="${conf.size}" ${disabled} label-width="${conf.labelWidth}px" ${labelPosition}>
      ${child}
      ${buildFromBtns(conf, type)}
    </u-form>`
  if (someSpanIsNot24) {
    str = `<u-row :gutter="${conf.gutter}">
        ${str}
      </u-row>`
  }
  return str
}

function buildFromBtns(conf, type) {
  let str = ''
  if (conf.formBtns && type === 'file') {
    str = `<u-form-item size="large">
          <u-button :style="{width: '48%'}" type="primary" @click="submitForm">提交</u-button>
          <u-button :style="{width: '48%'}" @click="resetForm">重置</u-button>
        </u-form-item>`
    if (someSpanIsNot24) {
      str = `<u-col :span="24">
          ${str}
        </u-col>`
    }
  }
  return str
}

// span不为24的用el-col包裹
function colWrapper(element, str) {
  if (someSpanIsNot24 || element.span !== 24) {
    return `<u-col :span="${element.span}">
      ${str}
    </u-col>`
  }
  return str
}

/**
 *@prefixIcon :'输入框前图标'
 *@suffixIcon :'输入框后图标'
 *@required :'必填,Uview 无'
 *
 *
 */
const layouts = {
  colFormItem(element) {
    let labelWidth = ''
    if (element.labelWidth && element.labelWidth !== confGlobal.labelWidth) {
      labelWidth = `label-width="${element.labelWidth}px"`
    }
    // const required = !trigger[element.tag] && element.required ? 'required' : ''
    const tagDom = tags[element.tag] ? tags[element.tag](element) : null
    const prefixIcon = element['prefix-icon'] ? `left-icon='${element['prefix-icon']}'` : ''
    const suffixIcon = element['suffix-icon'] ? `right-icon='${element['suffix-icon']}'` : ''
    let str = `<u-form-item ${labelWidth} label="${element.label}" prop="${element.vModel}"  ${prefixIcon} ${suffixIcon}>
        ${tagDom}
      </u-form-item>`
    str = colWrapper(element, str)
    return str
  },
  rowFormItem(element) {
    const children = element.children.map(el => layouts[el.layout](el))
    let str = `<view  class="u-p-10" >
      ${children.join('\n')}
    </view>`
    str = colWrapper(element, str)
    return str
  }
}

/**
 *@maxlength {Number}:'输入框的最大可输入长度'
 *@showWordLimit {Number}:'显示输入字数统计,Uview 无'
 *@readonly {Number}:'原生属性，是否只读,Uview 无'
 *@showPassword {Number}:'type为password时，是否显示右侧的密码查看图标'
 *
 */
const tags = {
  'input': el => {
    const {
      disabled, vModel, clearable, placeholder, width
    } = attrBuilder(el)
    const maxlength = el.maxlength ? `:maxlength="${el.maxlength}"` : ''
    const showPassword = el['show-password'] ? 'password-icon' : ''
    const type = el.type ? `type="${el.type}"` : ''
    return `<u-input ${vModel} ${type} ${placeholder} ${maxlength}   ${disabled} ${clearable}  ${showPassword}  ${width}></u-input>`
  },
  'select': el => {
    const {
      disabled, vModel, clearable, placeholder, width
    } = attrBuilder(el)
    const type = el.type ? `type="${el.type}"` : ''
    return `<u-input ${vModel} ${type} ${disabled} ${clearable} ${placeholder} ${width}  @click="selectShow.${el.vModel} = true" />
            <u-select mode="${el.type}" :default-value="selectDefaultValue.${el.vModel}" :list="selectOptions.${el.vModel}" v-model="selectShow.${el.vModel}" @confirm="selectConfirm($event,'${el.vModel}')"></u-select>`
  },
  'radio': el => {
    return `<u-radio-group v-model="formData.${el.vModel}" >
              <u-radio  v-for="(item, index) in selectOptions.${el.vModel}" :name="item.label" :key="index" >
               {{item.label}}
              </u-radio>
            </u-radio-group>`
  },
  'checkbox': el => {
    return `<u-checkbox-group @change="checkboxGroupChange($event,'${el.vModel}')" >
              <u-checkbox  v-for="(item, index) in selectOptions.${el.vModel}" v-model="item.checked" :name="item.label" :key="index" >
               {{item.label}}
              </u-checkbox>
            </u-checkbox-group>`
  },
  'switch': el => {
    return `<u-switch v-model="${confGlobal.formModel}.${el.vModel}"></u-switch>`
  },
  'slider': el => {
    return `<u-slider v-model="${confGlobal.formModel}.${el.vModel}"></u-slider>`
  },
  'timePicker': el => {
    const params = el.type === 'time' ? 'timeParams' : 'dateParams'
    return `<u-input v-model="formData.${el.vModel}" @click='selectShow.${el.vModel}=true' disabled />
            <u-picker mode="time" v-model="selectShow.${el.vModel}" :params="${params}" :default-time="formData.${el.vModel}"
            @confirm='timeConfirm($event,"${el.vModel}")'></u-picker>`
  }
}

function attrBuilder(el) {
  return {
    vModel: `v-model="${confGlobal.formModel}.${el.vModel}"`,
    clearable: el.clearable ? 'clearable' : '',
    placeholder: el.placeholder ? `placeholder="${el.placeholder}"` : '',
    width: el.style && el.style.width ? ':style="{width: \'100%\'}"' : '',
    disabled: el.disabled ? ':disabled=\'true\'' : ''
  }
}

export function makeUpHtml(conf, type) {
  const htmlList = []
  confGlobal = conf
  someSpanIsNot24 = conf.fields.some(item => item.span !== 24)
  conf.fields.forEach(el => {
    htmlList.push(layouts[el.layout](el))
  })
  const htmlStr = htmlList.join('\n')

  let temp = buildFormTemplate(conf, htmlStr, type)
  if (type === 'dialog') {
    temp = dialogWrapper(temp)
  }
  confGlobal = null
  return temp
}

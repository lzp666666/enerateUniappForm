import { exportDefault } from '../index'
import { trigger } from './config'

const units = {
  KB: '1024',
  MB: '1024 / 1024',
  GB: '1024 / 1024 / 1024'
}
let confGlobal
const inheritAttrs = {
  file: '',
  dialog: 'inheritAttrs: false,'
}

export function makeUpJs(conf, type) {
  confGlobal = conf = JSON.parse(JSON.stringify(conf))
  const dataList = []
  const ruleList = []
  const selectDefaultValue = []
  const selectShow = []
  const optionsList = []
  const propsList = []
  const methodList = mixinMethod(type)
  const uploadVarList = []

  conf.fields.forEach(el => {
    buildAttributes(el, dataList, ruleList, selectDefaultValue, selectShow, optionsList, methodList, propsList, uploadVarList)
  })
  const selectList = `
      selectDefaultValue:{
        ${selectDefaultValue}
      },
      selectShow:{
        ${selectShow}
      },
      selectOptions: {
       ${optionsList}
      }
    `
  const script = buildexport(
    conf,
    type,
    dataList.join('\n'),
    ruleList.join('\n'),
    selectList,
    uploadVarList.join('\n'),
    propsList.join('\n'),
    methodList.join('\n')
  )
  confGlobal = null
  return script
}

function buildAttributes(el, dataList, ruleList, selectDefaultValue, selectShow, optionsList, methodList, propsList, uploadVarList) {
  buildData(el, dataList)
  buildRules(el, ruleList)

  if (el.options && el.options.length) {
    optionsList.push(`${el.vModel}: ${JSON.stringify(el.options)}`)
    selectShow.push(`${el.vModel}:false`)
    selectDefaultValue.push(`${el.vModel}:[]`)
  }
  if (el.tag === 'timePicker') {
    selectShow.push(`${el.vModel}:false`)
  }

  if (el.action && el.tag === 'el-upload') {
    uploadVarList.push(
      `${el.vModel}Action: '${el.action}',
      ${el.vModel}fileList: [],`
    )
    methodList.push(buildBeforeUpload(el))
    if (!el['auto-upload']) {
      methodList.push(buildSubmitUpload(el))
    }
  }

  if (el.children) {
    el.children.forEach(el2 => {
      buildAttributes(el2, dataList, ruleList, selectDefaultValue, selectShow, optionsList, methodList, propsList, uploadVarList)
    })
  }
}

  function mixinMethod(type) {
  const list = []; const
    minxins = {
      file: confGlobal.formBtns ? {
        submitForm: `submitForm() {
        this.$refs['${confGlobal.formRef}'].validate(valid => {
          if(!valid) return
          console.log(this.${confGlobal.formModel})
          // TODO 提交表单
        })
      },`,
        resetForm: `resetForm() {
        this.$refs['${confGlobal.formRef}'].resetFields()
      },`
      } : null,
      dialog: {
        onOpen: 'onOpen() {},',
        onClose: `onClose() {
        this.$refs['${confGlobal.formRef}'].resetFields()
      },`,
        close: `close() {
        this.$emit('update:visible', false)
      },`,
        handelConfirm: `handelConfirm() {
        this.$refs['${confGlobal.formRef}'].validate(valid => {
          if(!valid) return
          this.close()
        })
      },`
      }
    }

  const methods = minxins[type]
  if (methods) {
    Object.keys(methods).forEach(key => {
      list.push(methods[key])
    })
  }

  return list
}

function buildData(conf, dataList) {
  if (conf.vModel === undefined) return
  let defaultValue
  if (typeof (conf.defaultValue) === 'string' && !conf.multiple) {
    defaultValue = `'${conf.defaultValue}'`
  } else {
    defaultValue = `${JSON.stringify(conf.defaultValue)}`
  }
  dataList.push(`${conf.vModel}: ${defaultValue},`)
}

function buildRules(conf, ruleList) {
  if (conf.vModel === undefined) return
  const rules = []
  if (trigger[conf.tag]) {
    if (conf.required) {
      const type = Array.isArray(conf.defaultValue) ? 'type: \'array\',' : ''
      let message = Array.isArray(conf.defaultValue) ? `请至少选择一个${conf.vModel}` : conf.placeholder
      if (message === undefined) message = `${conf.label}不能为空`
      rules.push(`{ required: true, ${type} message: '${message}', trigger: '${trigger[conf.tag]}' }`)
    }
    if (conf.regList && Array.isArray(conf.regList)) {
      conf.regList.forEach(item => {
        if (item.pattern) {
          rules.push(`{ pattern: ${item.pattern}, message: '${item.message}', trigger: '${trigger[conf.tag]}' }`)
        }
      })
    }
    ruleList.push(`${conf.vModel}: [${rules.join(',')}],`)
  }
}

function buildBeforeUpload(conf) {
  const unitNum = units[conf.sizeUnit]; let rightSizeCode = ''; let acceptCode = ''; const
    returnList = []
  if (conf.fileSize) {
    rightSizeCode = `let isRightSize = file.size / ${unitNum} < ${conf.fileSize}
    if(!isRightSize){
      this.$message.error('文件大小超过 ${conf.fileSize}${conf.sizeUnit}')
    }`
    returnList.push('isRightSize')
  }
  if (conf.accept) {
    acceptCode = `let isAccept = new RegExp('${conf.accept}').test(file.type)
    if(!isAccept){
      this.$message.error('应该选择${conf.accept}类型的文件')
    }`
    returnList.push('isAccept')
  }
  const str = `${conf.vModel}BeforeUpload(file) {
    ${rightSizeCode}
    ${acceptCode}
    return ${returnList.join('&&')}
  },`
  return returnList.length ? str : ''
}

function buildSubmitUpload(conf) {
  const str = `submitUpload() {
    this.$refs['${conf.vModel}'].submit()
  },`
  return str
}

function buildexport(conf, type, data, rules, selectList, uploadVar, props, methods) {
  const str = `${exportDefault}{
  ${inheritAttrs[type]}
  mixins: [form],
  components: {},
  onReady() {
    this.$refs.uForm.setRules(this.${conf.formRules});
   },
  props: [],
  data () {
    return {
      ${conf.formModel}: {
        ${data}
      },
      ${conf.formRules}: {
        ${rules}
      },
      ${selectList},
      ${uploadVar}
      ${props}
      skr:{}
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    ${methods}
  }
}`
  return str
}

export default [
  {
    layout: 'colFormItem',
    tagIcon: 'input',
    tag: 'input',
    label: '手机号',
    vModel: 'mobile',
    formId: 6,
    labelWidth: '',
    placeholder: '请输入手机号',
    defaultValue: '2222',
    span: 24,
    type: 'input',
    style: { width: '100%' },
    clearable: true,
    prepend: '',
    append: '',
    'prefix-icon': 'user',
    'suffix-icon': 'user',
    maxlength: 11,
    'show-word-limit': true,
    readonly: false,
    disabled: false,
    required: true,
    changeTag: true,
    regList: [{
      pattern: '/^1(3|4|5|7|8|9)\\d{9}$/',
      message: '手机号格式错误'
    }]
  }
]

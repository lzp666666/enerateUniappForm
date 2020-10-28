export default {
	data() {
		return {
			timeParams: {
				year: false,
				month: false,
				day: false,
				hour: true,
				minute: true,
				second: true
			},
			dateParams: {
				year: true,
				month: true,
				day: true,
				hour: false,
				minute: false,
				second: false
			}
		}
	},
	methods: {
		Params(fad) {
			console.log(fad)
		},
		selectConfirm($event, key) {
			let that = this,
				oldIndex = 0;
			that.formData[key] = $event.map(item => item.label).toString()
			that.selectDefaultValue[key] = []
			childrenIndex(that.selectOptions[key])

			function childrenIndex(data) {
				data.forEach((item, index) => {
					if (item.label && $event[oldIndex] && item.label === $event[oldIndex].label) {
						that.selectDefaultValue[key].push(index)
						oldIndex += 1
						if (item.children) {
							childrenIndex(item.children)
						}
						return
					}
				})
			}
		},
		checkboxGroupChange(e, key) {
			this.formData[key] = e
		},
		timeConfirm(val, key) {
			this.formData[key] = Object.keys(val).map(key => val[key]).join(':')
		}
	}
}

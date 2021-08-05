/* global Vue, _, moment, VueBootstrapTypeahead, VueMarkdown,
  VeeValidateRules, VeeValidate, VueToast */
import DynamicForm from './components/entity/form.js'
import DynComponents from './modules/bootstrap-vue-dynamic-form/index.js'
import MDEditor from './components/MDEditor.js'
import { 
  WITHOUT_DIACRITICS_VALIDATOR_NAME, WITHOUT_DIACRITICS_VALIDATOR 
} from './modules/bootstrap-vue-dynamic-form/components/file.js'

for (let i in DynComponents) {
  Vue.component(i, DynComponents[i])
}

Vue.use(VueToast, { position: 'top-right' })

Vue.filter('formatDate', function (value) {
  if (value) {
    value = _.isString(value) ? moment(value) : value
    return value.format('DD.MM.YYYY')
  }
})

Vue.filter('longDate', function (value) {
  if (value) {
    value = _.isString(value) ? moment(value) : value
    return value.format('DD.MM.YYYY HH:mm')
  }
})

import FileUploadingSelect from './components/storage/file_uploading_select.js'
Vue.component('FileUploadingSelect', FileUploadingSelect)

Vue.component('vue-bootstrap-typeahead', VueBootstrapTypeahead)
Vue.use(VueMarkdown)

Vue.component('ValidationProvider', VeeValidate.ValidationProvider)
Vue.component('ValidationObserver', VeeValidate.ValidationObserver)

VeeValidate.extend('required', VeeValidateRules.required)
VeeValidate.extend(WITHOUT_DIACRITICS_VALIDATOR_NAME, WITHOUT_DIACRITICS_VALIDATOR)

Vue.component('DynamicForm', DynamicForm)

Vue.component('MDEditor', MDEditor)
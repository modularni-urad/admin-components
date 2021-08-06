/* global Vue, VueRouter */
import store from './store.js'
import DynComponents from './bootstrap-vue-dynamic-form/index.js'
import { 
  WITHOUT_DIACRITICS_VALIDATOR_NAME, WITHOUT_DIACRITICS_VALIDATOR 
} from './bootstrap-vue-dynamic-form/components/file.js'
import List from './entity/list.js'
import Form from './entity/form.js'

for (let i in DynComponents) {
  Vue.component(i, DynComponents[i])
}
Vue.use(VueMarkdown)
Vue.component('ValidationProvider', VeeValidate.ValidationProvider)
Vue.component('ValidationObserver', VeeValidate.ValidationObserver)
Vue.component('EntityList', List)
Vue.component('ItemForm', Form)
VeeValidate.extend('required', VeeValidateRules.required)
VeeValidate.extend(WITHOUT_DIACRITICS_VALIDATOR_NAME, WITHOUT_DIACRITICS_VALIDATOR)

const cfg = { 
  url: '/uniapi/posts',
  conf: '/uniapi/posts/config.json',
  listViewName: 'ukoly'
}

const router = new VueRouter({
  routes: [{
    path: '/', 
    component: List, 
    props: route => {
      return { query: route.query, cfg }
    }
  }]
})

new Vue({
  router,
  store,
  template: '<router-view :key="$route.fullPath"></router-view>'
}).$mount('#app')
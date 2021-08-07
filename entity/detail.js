import ItemForm from './form.js'
import { defaultSaveData, loadData } from './utils.js'

export default {
  data: function () {
    return {
      curr: null,
      loaded: false,
      show: this.query._detail !== undefined
    }
  },
  props: ['query', 'cfg'],
  async created () {
    if (this.query._detail) {
      try {
        const req = await loadData(this.$props, this.query._detail, this.$store)
        this.curr = req.data[0]
        this.loaded = true
      } catch (e) {
        alert(e)
      }
    } else {
      this.loaded = true
    }
  },
  methods: {
    onSubmit: async function (item) {
      if (!item) return this.hide()
      try {
        const res = await defaultSaveData(item, this.curr, this.$props, this.$store)
        this.$store.dispatch('toast', { message: 'uloženo' })
        this.hide()
      } catch (err) {
        const message = err.response.data
        this.$store.dispatch('toast', { message, type: 'error' })
      }
    },
    hide: function () {
      this.$router.replace({ query: _.omit(this.query, '_detail') })
    }
  },
  components: { ItemForm },
  template: `
  <b-modal v-if="loaded" v-model="show" @hidden="hide" size="xl" title="Upravit" hide-footer>
    <ItemForm :config="cfg.conf" :onSubmit="onSubmit" :item="curr">
      <b-button class="mt-3" @click="hide">Storno</b-button>
    </ItemForm>
  </b-modal>
  `
}

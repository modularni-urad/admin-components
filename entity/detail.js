import ItemForm from './form.js'
import { defaultSaveData, defaultLoadData } from './utils.js'

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
        const req = this.cfg.loadData
          ? await this.cfg.loadData(this)
          : await defaultLoadData(this.query._detail, this)
        this.curr = req.data[0]
        this.loaded = true
      } catch (err) {
        this.$store.dispatch('onerror', err)
      }
    } else {
      this.loaded = true
    }
  },
  methods: {
    onSubmit: async function (item) {
      if (!item) return this.hide()
      try {
        const res = await defaultSaveData(item, this.curr, this)
        this.$store.dispatch('toast', { message: 'uloženo' })
        this.hide()
      } catch (err) {
        this.$store.dispatch('onerror', err)
      }
    },
    hide: function () {
      this.$router.replace({ query: _.omit(this.query, '_detail') })
    }
  },
  components: { ItemForm },
  template: `
  <b-modal v-if="loaded" v-model="show" @hidden="hide" size="xl" 
      :title="cfg.title || 'upravit'" hide-footer>

    <slot name="form" :config="cfg.conf" :onSubmit="onSubmit" :item="curr">
      <ItemForm :config="cfg.conf" :onSubmit="onSubmit" :item="curr">
        <template v-slot:buttons="{ invalid, submitting }">
          <b-button :disabled="submitting" class="mt-3" @click="hide">Storno</b-button>
        </template>
      </ItemForm>
    </slot>
    
  </b-modal>
  `
}

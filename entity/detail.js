import ItemForm from './form.js'
import { defaultSaveData, defaultLoadData } from './utils.js'
import { createNewItem } from './detail_utils.js'

export default {
  data: function () {
    return {
      curr: null,
      loaded: false
    }
  },
  props: ['query', 'cfg', 'hide', 'detail'],
  async created () {
    this.$watch(() => this.detail, () => {
      switch(this.detail) {
        case 'new': return this.createInitial()
        case null: return
        default: return this.fetchData()
      }
    })
  },
  methods: {
    createInitial: function () {
      this.curr = createNewItem(this.cfg.conf)
      this.loaded = true
    },
    fetchData: async function () {
      try {
        const req = this.cfg.loadData
          ? await this.cfg.loadData(this)
          : await defaultLoadData(this.detail, this)
        this.curr = req.data[0]
        this.loaded = true
      } catch (err) {
        this.$store.dispatch('onerror', err)
      }
    },
    onSubmit: async function (item) {
      if (!item) return this.hidden()
      try {
        const data = this.cfg.prepareData 
          ? await this.cfg.prepareData(item)
          : Object.assign({}, item)
        const res = await defaultSaveData(data, this.curr, this)
        this.cfg.finishSubmit && await this.cfg.finishSubmit(item, res.data, this)
        this.$store.dispatch('toast', { message: 'uloženo' })
        this.hidden()
      } catch (err) {
        this.$store.dispatch('onerror', err)
      }
    },
    hidden: function () {
      this.loaded = false
      this.hide()
    }
  },
  components: { ItemForm },
  template: `
  <div v-if="loaded">
    <b-modal @hidden="hidden" v-model="loaded" size="xl" :title="cfg.title || 'upravit'" hide-footer>

      <slot name="form" :config="cfg.conf" :onSubmit="onSubmit" :item="curr">
        <ItemForm :config="cfg.conf" :onSubmit="onSubmit" :item="curr">
          <template v-slot:buttons="{ invalid, submitting }">
            <b-button :disabled="submitting" class="mt-3" @click="hidden">storno</b-button>
          </template>
        </ItemForm>
      </slot>
      
    </b-modal>
  </div>
  `
}

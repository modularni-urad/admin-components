import { QEURY_ITEM_NAMES } from './consts.js'
const { FILTER, PAGE } = QEURY_ITEM_NAMES

export default {
  props: ['query', 'cfg'],
  methods: {
    setFilter: function (f) {
      const query = Object.assign({}, this.query, { [FILTER]: f.key, [PAGE]: 1 })
      this.$router.replace({ query })
    },
    isApplied: function (f) {
      return this.query[FILTER] === f.key
    },
    hide: function () {
      const query = _.omit(this.query, FILTER)
      this.$router.replace({ query })
    }
  },
  template: `
  <b-dropdown text="Možné filtry" variant="secondary" class="m-2">
    <b-dropdown-item v-for="i,idx in cfg.filters" :key="idx" @click="setFilter(i)">
      {{ i.label }} <b-button v-if="isApplied(i)" class="mt-3" @click="hide">x</b-button>
    </b-dropdown-item>
  </b-dropdown>
  `
}
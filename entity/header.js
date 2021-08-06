import { QEURY_ITEM_NAMES } from './consts.js'
const { SORT } = QEURY_ITEM_NAMES

export default {
  props: ['field', 'query'],
  computed: {
    sortDir: function () {
      const sort = (this.query[SORT] || '').split(',')
      return sort.length && sort[0] == this.$props.field.key ? sort[1] : null
    }
  },
  methods: {
    sort: function () {
      const dir = this.sortDir === null ?
        'asc' : this.sortDir === 'asc' ? 'desc' : null
      
      const query = Object.assign({}, this.query)
      this.sortDir === 'desc' 
        ? delete query[SORT]
        : Object.assign(query, { [SORT]: `${this.$props.field.key},${dir}` })
      this.$router.replace({ query })
    }
  },
  template: `
  <th scope="col">
    <span v-if="sortDir">
      <i class="fas" :class="sortDir === 'asc' ? 'fa-sort-up' : 'fa-sort-down'"></i>
    </span>
    <a v-if="field.sortable" href="javascript:void(0);" @click="sort">
      <slot></slot>
    </a>
    <slot v-else></slot>
  </th>
  `
}
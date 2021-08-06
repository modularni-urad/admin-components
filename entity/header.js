export default {
  props: ['field'],
  computed: {
    sortDir: function () {
      const sort = (this.$router.currentRoute.query.sortBy || '').split(',')
      return sort.length && sort[0] == this.$props.field.key ? sort[1] : null
    }
  },
  methods: {
    sort: function () {
      const dir = this.sortDir === null ?
        'asc' : this.sortDir === 'asc' ? 'desc' : null
      
      const query = Object.assign({}, this.$router.currentRoute.query)
      this.sortDir === 'desc' 
        ? delete query['sortBy']
        : Object.assign(query, { sortBy: `${this.$props.field.key},${dir}` })
      this.$router.push({ query })
    }
  },
  template: `
  <th scope="col">
    <span v-if="sortDir">{{ sortDir }}</span>
    <a v-if="field.sortable" href="javascript:void(0);" @click="sort">
      <slot></slot>
    </a>
    <slot v-else></slot>
  </th>
  `
}
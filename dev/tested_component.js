import ListView from './entity/list.js'
import { cellData } from '../entity/utils.js'

export default {
  props: ['query', 'cfg'],
  methods: {
    doEdit: function (row) {
      const query = Object.assign({}, this.query, { _detail: row.id })
      this.$router.replace({ query })
    },
    rowClass: function (row) {
      return row.id === 2 ? 'table-success' : ''
    },
    cellData
  },
  components: { ListView },
  template: `
  <ListView :query="query" :cfg="cfg">
    <template v-slot:default="{ items, fields }">
      <tr v-for="row,rowidx in items" :key="rowidx" :class="rowClass(row)">
        <td v-for="field,idx in fields" :key="idx">
          {{ cellData(row, field) }}
        </td>
        <td key="actions">
          <b-button size="sm" variant="primary" @click="doEdit(row)">
            <i class="fas fa-edit"></i> upravit
          </b-button>
        </td>
      </tr>
    </template>
  </ListView>
  `
}

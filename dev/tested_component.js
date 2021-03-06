import ListView from './entity/list.js'
import { cellData } from '../entity/utils.js'

export default {
  props: ['query', 'cfg'],
  methods: {
    rowClass: function (row) {
      return row.id === 2 ? 'table-success' : ''
    },
    cellData
  },
  components: { ListView },
  template: `
  <ListView :query="query" :cfg="cfg">
    <template v-slot:breadcrumb="{ cfg }">
      <b-breadcrumb-item active>tested component table</b-breadcrumb-item>
    </template>

    <template v-slot:middle="{ cfg }">
      <div>pokus</div>
    </template>

    <template v-slot:tbody="{ items, fields, doEdit }">
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

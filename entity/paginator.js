import { QEURY_ITEM_NAMES } from './consts.js'
const { PAGE, PAGESIZE } = QEURY_ITEM_NAMES

export default {
  computed: {
    cp: function () {
      return this.$props.query[PAGE] ? Number(this.$props.query[PAGE]) : 1
    },
    pageCount: function () {
      const pageSize = this.query[PAGESIZE] ? Number(this.query[PAGESIZE]) : 10
      return Math.round(this.$props.totalRows / pageSize)
    },
    leftDisabled: function () {
      return this.cp === 1
    },
    rightDisabled: function () {
      return this.cp === this.pageCount
    }
  },
  props: ['totalRows', 'query'],
  methods: {
    left: function () {
      const query = Object.assign({}, this.query, { [PAGE]: this.cp - 1 })
      this.$router.push({ query })
    },
    right: function () {
      const query = Object.assign({}, this.query, { [PAGE]: this.cp + 1 })
      this.$router.push({ query })
    }
  },
  template: `
  <div class="float-right">
    <b-button @click="left" :disabled="leftDisabled"><< zpět</b-button>

    {{ cp }} / {{ pageCount }}
    
    <b-button @click="right" :disabled="rightDisabled">vpřed >></b-button>
  </div>
  `
}
//<b-pagination align="right" :value="cp"
//:total-rows="totalRows" :per-page="perPage" @change="onChange">
//</b-pagination>
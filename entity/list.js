import Detail from './detail.js'
import Paginator from './paginator.js'
import template from './list.html.js'
import { cellData } from './utils.js'
import { QEURY_ITEM_NAMES } from './consts.js'
import THeader from './header.js'
import Filters from './filters.js'
const { PAGE, PAGESIZE, SORT, FILTER } = QEURY_ITEM_NAMES

export default {
  data: () => {
    return {
      isBusy: false,
      totalRows: null,
      items: []
    }
  },
  props: ['cfg', 'query'],
  created () {
    this.$watch(
      () => this.$route.query,
      () => {
        this.fetchData()
      },
      // fetch the data when the view is created and the data is already being observed
      { immediate: true }
    )
  },
  methods: {
    fetchData: async function () {
      const params = {
        currentPage: this.query[PAGE] || 1,
        perPage: this.query[PAGESIZE] || 10,
        sort: this.query[SORT] ? this.query[SORT].replace(',', ':') : 'id:asc'
      }
      if (this.query[FILTER]) {
        const f = _.find(this.cfg.filters, { key: this.query[FILTER] })
        f && Object.assign(params, { filter: JSON.stringify(f.value()) })
      }
      try {
        this.isBusy = true
        const res = await axios.get(this.$props.cfg.url, { params })
        this.totalRows = res.data.pagination.total
          ? res.data.pagination.total
          : this.totalRows
        this.items = res.data.data
      } catch (err) {
        this.$store.dispatch('onerror', err)
      } finally {
        this.isBusy = false
      }
    },
    setPageSize: function (newSize) {
      const newPage = 1 // TODO: spocitat, na zaklade currPage, aby se nemuselo na zacatek
      const query = Object.assign({}, this.query, { [PAGESIZE]: newSize, [PAGE]: newPage })
      this.$router.replace({ query })
    },
    add: function () {
      this.$router.replace({ query: Object.assign({}, this.query, { _detail: null }) })
    },
    doEdit: function (row) {
      const query = Object.assign({}, this.query, { _detail: row.id })
      this.$router.replace({ query })
    },
    cellData
  },
  components: { THeader, Paginator, Detail, Filters },
  template
}

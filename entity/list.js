import Detail from './detail.js'
import Paginator from './paginator.js'
import template from './list.html.js'
import { cellData } from './utils.js'
import { QEURY_ITEM_NAMES } from './consts.js'
import THeader from './header.js'
import Filters from './filters.js'
// import cellData from './cellData.js'
const { PAGE, PAGESIZE, SORT, FILTER } = QEURY_ITEM_NAMES

export default {
  data: () => {
    return {
      isBusy: false,
      totalRows: null,
      detail: null,
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
        perPage: this.query[PAGESIZE] || this.cfg.default_pagesize || 10,
        sort: this.query[SORT] 
          ? this.query[SORT].replace(',', ':') 
          : this.cfg.default_sort || 'id:asc'
      }
      if (this.query[FILTER]) {
        const f = _.find(this.cfg.filters, { key: this.query[FILTER] })
        f && Object.assign(params, { filter: JSON.stringify(f.value(this)) })
      }
      try {
        this.isBusy = true
        const url = this.cfg.getListUrl 
          ? this.cfg.getListUrl(this, params) 
          : this.cfg.url
        const res = await this.$store.dispatch('send', { method: 'get', url, params })
        this.totalRows = res.data.pagination
          ? res.data.pagination.total
          : (this.totalRows || res.data.length)
        this.items = res.data.pagination ? res.data.data : res.data
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
      this.detail = 'new'
    },
    doEdit: function (row) {
      this.detail = row
    },
    cellData,
    hide: function () {
      this.detail = null
      this.fetchData()
    }
  },
  components: { THeader, Paginator, Detail, Filters, cellData },
  template
}

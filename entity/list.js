/* global axios, API, _ */
import Detail from './detail.js'
import Paginator from './paginator.js'
import template from './list.html.js'
import { initListData, getFields, cellData } from './utils.js'
import { QEURY_ITEM_NAMES } from './consts.js'
import THeader from './header.js'
const { PAGE, PAGESIZE, SORT } = QEURY_ITEM_NAMES

export default {
  data: () => {
    return {
      formconfig: null,
      isBusy: false,
      totalRows: null,
      ready: false,
      items: []
    }
  },
  props: ['cfg', 'query'],
  created () {
    initListData(this.$props, this.$data)
    this.$watch(
      () => this.$route.query,
      () => {
        this.fetchData()
      },
      // fetch the data when the view is created and the data is already being observed
      { immediate: true }
    )
  },
  computed: {
    fields: function () {
      return getFields(this)
    }
  },
  methods: {
    fetchData: async function () {
      const params = {
        currentPage: this.query[PAGE] || 1,
        perPage: this.query[PAGESIZE] || 10,
        sort: this.query[SORT] ? this.query[SORT].replace(',', ':') : 'id:asc'
      }
      try {
        this.isBusy = true
        const res = await axios.get(this.$props.cfg.url, { params })
        this.totalRows = res.data.pagination.total
          ? res.data.pagination.total
          : this.totalRows
        this.items = res.data.data
      } catch (err) {
        const message = err.response.data
        this.$store.dispatch('toast', { message, type: 'error' })
        this.items = []
      } finally {
        this.isBusy = false
      }
    },
    setPageSize: function (newSize) {
      const query = Object.assign({}, this.query, { [PAGESIZE]: newSize })
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
  components: { THeader, Paginator, Detail },
  template
}

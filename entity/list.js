/* global axios, API, _ */
import Detail from './detail.js'
import Paginator from './paginator.js'
import template from './list.html.js'
import { initListData, getFields } from './utils.js'
import { QEURY_ITEM_NAMES } from './consts.js'
import THeader from './header.js'
const { PAGE, PAGESIZE, SORT } = QEURY_ITEM_NAMES

const DefaultActions = {
  props: ['query', 'row'],
  methods: {
    doEdit: function () {
      const query = Object.assign({}, this.query, { _detail: this.row.id })
      this.$router.replace({ query })
    }
  },
  template: `
  <b-button size="sm" variant="primary" @click="doEdit">
    <i class="fas fa-edit"></i> upravit
  </b-button>
  `
}

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
  props: ['cfg', 'query', 'saveHooks', 'actionsComponent'],
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
    cellData: function (item, field) {
      return item[field.key]
    }
  },
  components: { THeader, Paginator, Detail, DefaultActions },
  template
}

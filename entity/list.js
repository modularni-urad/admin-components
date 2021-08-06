/* global axios, API, _ */
import ItemForm from './form.js'
import Paginator from './paginator.js'
import template from './list.html.js'
import { initListData, getFields } from './utils.js'
import { QEURY_ITEM_NAMES } from './consts.js'
import THeader from './header.js'
const { PAGE, PAGESIZE, SORT } = QEURY_ITEM_NAMES

const DefaultActions = {
  props: ['data', 'doEdit'],
  template: `
  <b-button size="sm" variant="primary" @click="doEdit(data.item)">
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
      curr: null,
      item: {},
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
      // fetch the data when the view is created and the data is
      // already being observed
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
      this.$data.curr = null
      this.$bvModal.show('modal-add')
    },
    edit: function (item) {
      this.$data.curr = item
      this.$bvModal.show('modal-add')
    },
    cellData: function (item, field) {
      return item[field.key]
    },
    onSubmit: async function (item) {
      if (!item) return this.$bvModal.hide('modal-add')
      const p = this.$props
      try {
        const data = p.saveHooks && p.saveHooks.prepare 
          ? await p.saveHooks.prepare(this, item) : item
        const url = this.curr ? `${p.cfg.url}${this.curr.id}` : p.cfg.url
        const method = this.curr ? 'put' : 'post'
        const res = await this.$store.dispatch('send', { method, url, data })
        p.saveHooks && p.saveHooks.finish 
            && await p.saveHooks.finish(this, item, res.data)
        this.$store.dispatch('toast', { message: 'uloženo' })
        this.curr
          ? Object.assign(this.curr, res.data)
          : this.$refs.table.refresh()
        this.$bvModal.hide('modal-add')
      } catch (err) {
        const message = err.response.data
        this.$store.dispatch('toast', { message, type: 'error' })
      }
    }
  },
  components: { THeader, Paginator, ItemForm, DefaultActions },
  template
}

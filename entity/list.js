/* global axios, API, _ */
import ItemForm from './form.js'
import Paginator from './paginator.js'
import template from './list.html.js'
import { initListData } from './utils.js'
import THeader from './header.js'

function formatDate (value) {
  if (value) {
    value = _.isString(value) ? moment(value) : value
    return value.format('DD.MM.YYYY HH:mm')
  }
}

const getOptionsFormatter = (options) => (value) => {
  const o = _.find(options, i => i.value === value)
  return o ? o.text : value
}

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
  props: ['cfg', 'saveHooks', 'actionsComponent'],
  async created () {    
    await initListData(this.$props, this.$data)
    await this.load()
  },
  computed: {
    fields: function () {
      let fields = _.filter(this.$data.formconfig, i => {
        return !_.isUndefined(i.fieldcomponent)
      })
      fields = _.map(fields, i => {
        const f = {
          key: i.name,
          label: i.label,
          sortable: true
        }
        if (i.options) {
          f.formatter = getOptionsFormatter(i.options)
        }
        if (i.type === 'date') {
          f.formatter = formatDate
        }
        return f
      })
      fields.unshift({ key: 'id', label: '#ID', sortable: true })
      fields.push({ key: 'actions', label: '' })
      return fields
    }
  },
  methods: {
    load: async function (ctx) {
      const q = this.$router.currentRoute.query
      const params = {
        currentPage: q.currentPage || 1,
        perPage: q.perPage || 10,
        sort: q.sortBy ? `${q.sortBy}:${q.sortDesc ? 'desc' : 'asc'}` : 'id:asc'
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
      const query = Object.assign({}, this.$router.currentRoute.query, {
        perPage: newSize
      })
      this.$router.push({ query })
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

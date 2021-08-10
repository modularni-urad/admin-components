
export async function initConfig (cfg) {
  // load config if it is URL
  if (_.isString(cfg.conf)) {
    const res = await axios.get(cfg.conf)
    cfg.conf = res.data.attrs
  }
  // load options if they are URLs
  const promises = _.reduce(cfg.conf, (acc, i) => {
    if (i.options && _.isString(i.options)) {
      acc.push(axios.get(i.options).then(res => {
        i.options = i.attrmap ? res.data.map(j => {
          return {
            text: j[i.attrmap.text || 'text'],
            value: j[i.attrmap.value || 'value']
          }
        }) : res.data
      }))
    }
    return acc
  }, [])
  if (promises.length) await Promise.all(promises)
  cfg.fields = getFields(cfg.conf)
}

function formatDate (value) {
  if (value) {
    value = _.isString(value) ? moment(value) : value
    return value.format('DD.MM.YYYY')
  }
}
function formatDatetime (value) {
  if (value) {
    value = _.isString(value) ? moment(value) : value
    return value.format('DD.MM.YYYY HH:mm')
  }
}

const getOptionsFormatter = (options) => (value) => {
  const o = _.find(options, i => i.value === value)
  return o ? o.text : value
}

export function getFields (conf) {
  let fields = _.filter(conf, i => {
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
    if (i.type === 'datetime') {
      f.formatter = formatDatetime
    }
    return f
  })
  fields.unshift({ key: 'id', label: '#ID', sortable: true })
  return fields
}

export function defaultSaveData (data, currItem, props, store) {
  const url = currItem ? `${props.cfg.url}/${currItem.id}` : props.cfg.url
  const method = currItem ? 'put' : 'post'
  return store.dispatch('send', { method, url, data })
}

export function loadData (props, itemId, store) {
  const filter = { id: itemId }
  const url = `${props.cfg.url}?filter=${JSON.stringify(filter)}`
  return store.dispatch('send', { method: 'get', url })
}

export function cellData (item, field) {
  return field.formatter ? field.formatter(item[field.key]) : item[field.key]
}
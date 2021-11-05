
export async function initConfig (cfg) {
  // load config if it is URL or undefined
  if (_.isString(cfg.conf) || _.isUndefined(cfg.conf)) {
    const url = _.isUndefined(cfg.conf) ? `${cfg.url}/config.json` : cfg.conf
    const res = await axios.get(url)
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

export function editableAttrs (formattrs) {
  return _.filter(formattrs, i => {
    return !_.isUndefined(i.component)
  })
}

export function getFields (conf) {
  let fields = _.filter(conf, i => {
    return !_.isUndefined(i.fieldcomponent)
  })
  fields = _.map(fields, i => {
    const f = {
      key: i.name,
      label: i.label || i.name,
      sortable: i.sortable
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
  return fields
}

export function defaultSaveData (data, currItem, self) {
  const url = self.cfg.getSaveUrl
    ? self.cfg.getSaveUrl(currItem, self)
    : currItem ? `${self.cfg.url}${currItem.id}` : self.cfg.url
  const method = currItem ? 'put' : 'post'
  return self.$store.dispatch('send', { method, url, data })
}

export function defaultLoadData (itemId, self) {
  const url = self.cfg.getLoadUrl
    ? self.cfg.getLoadUrl(itemId, self)
    : `${self.cfg.url}?filter=${JSON.stringify({ id: itemId })}`
  return self.$store.dispatch('send', { method: 'get', url })
}

export function cellData (item, field) {
  return field.formatter ? field.formatter(item[field.key]) : item[field.key]
}
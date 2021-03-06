
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
  cfg.fields = getFields(cfg)
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

export function getFields (cfg) {
  return cfg.conf.filter(i => {
    return !_.isUndefined(i.fieldcomponent)
  }).map(i => {
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
    try {
      if (i.fieldcomponent 
        && i.fieldcomponent !== true && i.fieldcomponent !== false
        && !f.formatter) {
        f.component = _.isString(i.fieldcomponent) 
          ? cfg.fieldcomponents[i.fieldcomponent]
          : i.fieldcomponent
      }
    } catch (_) {}
    return f
  })
}

function stringifyJSONs (data, cfg) {
  // tohle je potreba, protoze https://knexjs.org/#Schema-json
  const jsonAttrs = _.filter(cfg.conf, i => i.type === 'json')
  _.each(jsonAttrs, i => {
    data[i.name] = JSON.stringify(data[i.name])
  })
}
function nullEmptyAttrs (data) {
  const empty = _.filter(_.keys(data), k => data[k] === '')
  _.each(empty, k => data[k] = null)
}

export function defaultSaveData (data, currItem, self) {
  const inserting = self.detail === 'new'
  const id = currItem[self.cfg.idattr || 'id']
  const url = self.cfg.getSaveUrl
    ? self.cfg.getSaveUrl(currItem, self)
    : inserting ? self.cfg.url : `${self.cfg.url}/${id}`
  stringifyJSONs(data, self.cfg)
  nullEmptyAttrs(data)
  return self.$store.dispatch('send', { 
    method: inserting ? 'post' : 'put',
    url, 
    data 
  })
}

export function defaultLoadData (item, self) {
  const idattr = self.cfg.idattr || 'id'
  const filter = { [idattr]: item[idattr] }
  const url = self.cfg.getLoadUrl
    ? self.cfg.getLoadUrl(item, self)
    : `${self.cfg.url}?filter=${JSON.stringify(filter)}`
  return self.$store.dispatch('send', { method: 'get', url })
}

export function cellData (item, field) {
  return field.formatter ? field.formatter(item[field.key]) : item[field.key]
}
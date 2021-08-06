
export async function initListData (props, data) {
  // load config if it is URL
  if (_.isString(props.cfg.conf)) {
    const res = await axios.get(props.cfg.conf)
    data.formconfig = res.data.attrs
  } else {
    data.formconfig = props.cfg.conf
  }
  // load options if they are URLs
  const promises = _.reduce(data.formconfig, (acc, i) => {
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
  data.ready = true
}
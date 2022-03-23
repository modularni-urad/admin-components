
export function createNewItem (config) {
  return config.reduce((acc, i) => {
    return i.component
      ? Object.assign(acc, { [i.name]: _getDefault(i) })
      : acc
  }, {})
}

const dateDefaultRegex = /now(([+-]{1})(\d+)(\w{1}))?/i

function _getDate(match) {
  if (match[1] === undefined) return moment()
  switch (match[2]) {
    case '+': return moment().add(match[3], match[4])
    case '-': return moment().subtract(match[3], match[4])
  }
}

function _getDefault (attr) {
  const match = attr.default && attr.default.match(dateDefaultRegex)
  return match ? _getDate(match) : attr.default || ''
}
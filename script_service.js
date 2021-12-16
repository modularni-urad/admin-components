
const loaded = {}

export function unloadScript (src) {
  // TBD
}

export function loadStyle (src) {
  return new Promise((resolve, reject) => {
    var fileref = document.createElement("link")
    fileref.rel = "stylesheet"
    fileref.type = 'text/css'
    fileref.href = src
    if (fileref.readyState) {  //IE
      fileref.onreadystatechange = () => {
        if (fileref.readyState === "loaded" || fileref.readyState === "complete") {
          fileref.onreadystatechange = null
          loaded[src] = { loaded: true, status: 'Loaded' }
          resolve(loaded[src])
        }
      }
    } else {  //Others
      fileref.onload = () => {
        loaded[src] = { loaded: true, status: 'Loaded' }
        resolve(loaded[src])
      }
    }
    document.getElementsByTagName("head")[0].appendChild(fileref)
  })
}

export function loadScript (src) {
  return new Promise((resolve, reject) => {
    if (loaded[src]) {
      return resolve({ loaded: true, status: 'Already Loaded'} )
    }
    
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = src
    if (script.readyState) {  //IE
      script.onreadystatechange = () => {
        if (script.readyState === "loaded" || script.readyState === "complete") {
          script.onreadystatechange = null
          loaded[src] = { loaded: true, status: 'Loaded' }
          resolve(loaded[src])
        }
      }
    } else {  //Others
      script.onload = () => {
        loaded[src] = { loaded: true, status: 'Loaded' }
        resolve(loaded[src])
      }
    }
    script.onerror = (error) => resolve({loaded: false, status: error })
      
    document.getElementsByTagName('head')[0].appendChild(script)
  })
}
import qs from 'qs'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'

function handleComplete (img) {
  img.onload = null
  img.onerror = null
  img = null
}

export function track (data) {
  if (canUseDOM) {
    let img = new Image()
    img.onload = (e) => handleComplete(img)
    img.onerror = (e) => handleComplete(img)
    img.src = `/log/pixel?${qs.stringify(data)}`
  }
}

import qs from 'qs'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'

function handleComplete (img) {
  console.log('tracking img complete : ', img && img.src)
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
  } else {
    console.log('Don\'t track from server')
  }
}

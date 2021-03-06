import Canvas from 'canvas'

exports.getAvatar = function (req, res) {
  res.cache(3600)
  res.set('Content-Type', 'image/jpeg')

  let name = req.params.email || ''
  let type = req.query.type
  let size = 50
  switch (type) {

    case'large':
      size = 200
      break
    case'normal':
      size = 100
      break
    case'square':
    case'small':
    default:
      size = 50
      break
  }

  let colours = [
      '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50',
      '#f1c40f', '#e67e22', '#e74c3c', '#ecf0f1', '#95a5a6', '#f39c12', '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d'
    ],

    nameSplit = String(name).toUpperCase().replace(' ', '.').split('.'),
    initials


  if (nameSplit.length == 1) {
    initials = nameSplit[0] ? nameSplit[0].charAt(0) : '?'
  } else {
    initials = nameSplit[0].charAt(0) + nameSplit[1].charAt(0)
  }

  let charIndex = (initials == '?' ? 72 : initials.charCodeAt(0)) - 64
  let colourIndex = charIndex % 20

  let canvas = new Canvas(size, size)
  let ctx = canvas.getContext('2d')

  ctx.fillStyle = colours[colourIndex - 1]
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.font = Math.round(canvas.width / 2) + 'px Arial'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#FFF'
  ctx.fillText(initials, size / 2, size / 1.5)

  canvas.jpegStream({
    bufsize: 4096 // output buffer size in bytes, default: 4096
    , quality: 100 // JPEG quality (0-100) default: 75
    , progressive: false // true for progressive compression, default: false
  }).pipe(res)
}

import React, { PropTypes } from 'react'
import LoadVideo from '../LoadVideo'
import config from '../../../../config'
import shallowEqual from 'react-pure-render/shallowEqual'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import FavoritesAddButton from '../Favorites/FavoritesAddButton'
import ShareButton from '../Share/ShareButton'
import _ from 'lodash'
import { extractImg } from '../../lib/utils'

const Status = {
  PENDING: 'pending',
  LOADING: 'loading',
  LOADED: 'loaded',
  FAILED: 'failed'
}

class Poster extends LoadVideo {

  constructor (props) {
    super(props)
    this.state = {status: props.data ? Status.LOADING : Status.PENDING, src: '', isNew: false, hover: false}
  }

  componentWillMount () {
    if (this.state.status === Status.LOADING) {
      this.createLoader(true)
    }
  }

  componentDidMount () {
    if (this.state.status === Status.LOADING) {
      this.createLoader()
    }
  }

  componentWillReceiveProps (nextProps) {

    const {
      props: {data}
    } = this

    if (!shallowEqual(nextProps.data, data)) {
      this.createLoader()
    }
  }

  componentWillUnmount () {
    this.destroyLoader()
  }

  getType () {
    const {
      props: {data, type}
    } = this

    let resultType = type || data.get('type')

    switch (resultType) {
      case 'pin':
      case 'image':
      case 'event':
      case 'audio':
      case 'rich':
      case 'video':
      case 'website':
      case 'article':
        resultType = 'pin'
        break
      default:
        break
    }

    return resultType
  }

  extractProfile (image, ratio = '16:31') {
    if (!image) {
      return
    }
    var rect
    var profiles = image.get('profiles')
    let type = this.getType()

    if (type === 'user') {
      return `?type=large`
    }
    if (!profiles || type !== 'spot') {
      return `&crop=${this.props.crop}&fit=${this.props.fit}`
    }
    try {
      rect = profiles.get(ratio)
    } catch (e) {
      console.log(e)
    }
    if (rect) {
      return `&facepad=1.5&rect=${_.values(rect.toJS()).join()}`
    }
    return ''
  }

  createLoader (force = false) {
    const {
      props: {data, thumbW, thumbH}
    } = this


    if (!data) {
      return
    }

    let dateFrom = data.get('dateFrom')
    let forcedNewFlag = data.get('bannerNew')
    if (forcedNewFlag && forcedNewFlag !== this.state.isNew) {
      return this.setState({
        isNew: true
      })
    }
    if (dateFrom) {
      let dateNow = Date.now()
      let compare = dateNow - new Date(dateFrom).getTime()
      const type = this.getType()
      let nbDay = config.movies.isNew[type] || 30
      let isNew = compare <= (nbDay * 24 * 3600 * 1000)
      if (isNew !== this.state.isNew) {
        this.setState({
          isNew: isNew
        })
      }
    }

    const type = this.getType()

    const extractType = (type === 'movie' ? 'thumb' : 'poster')

    const imageUrl = extractImg({
      data,
      keys: [extractType, 'image', 'picture'],
      width: thumbW,
      height: thumbH,
      fit: 'min'
    })

    const thumb = data.get(extractType)
    const rect = this.extractProfile(thumb || data, '16:9')
    const imageStyles = `${imageUrl}${rect}`

    if (this.props.preload && !force) {

      this.destroyLoader()  // We can only have one loader at a time.

      this.img = new Image()
      this.img.onload = ::this.handleLoad
      this.img.onerror = ::this.handleError
      this.img.src = imageStyles
    } else {
      this.setState({status: Status.LOADED, src: imageStyles})
    }
  }

  destroyLoader () {
    let imgSrouce = ''
    if (this.img) {
      imgSrouce = this.img.src
      this.img.onload = null
      this.img.onerror = null
      this.img = null
    }
    return imgSrouce
  }

  handleLoad () {
    let imgSrouce = this.destroyLoader()
    this.setState({status: Status.LOADED, src: imgSrouce})
  }

  handleError () {
    let imgSrouce = this.destroyLoader()
    this.setState({status: Status.FAILED, src: imgSrouce})
  }

  getLazyImageUrl () {
    let imageStyles
    if (canUseDOM) {
      imageStyles = require('../../../assets/images/default/134x200.jpg')
    }
    switch (this.state.status) {
      case Status.LOADED:
        imageStyles = this.state.src
        break
      default:
        break
    }
    return {backgroundImage: `url(${imageStyles})`}
  }

  getShareButton () {
    const {
      props: {data, share}
    } = this

    if (!share) {
      return
    }

    let link = this.getLink()

    return <ShareButton showLabel={false} ref={`share-add-${data.get('_id')}`} link={link} title={data.get('title')}
                        description={data.get('synopsis')}/>
  }

  getFavorite () {
    const {
      props: {
        data,
        favorite
      }
    } = this

    if (!favorite) {
      return
    }

    return (<FavoritesAddButton {...this.props} showLabel={false} ref={`favorite-add-${data.get('_id')}`}/>)
  }

  getNew () {
    if (this.state.isNew) {
      return (<div className="thumb-new__item"></div>)
    }
  }

  /**
   * render two rows of thumbnails for the payment pages
   */
  render () {
    let imageStyles = this.getLazyImageUrl()

    return (
      <div className="payment-page__thumb" style={imageStyles}></div>
    )

  }
}

Poster.propTypes = {
  thumbW: React.PropTypes.number,
  thumbH: React.PropTypes.number,
  preload: React.PropTypes.bool,
  favorite: React.PropTypes.bool,
  share: React.PropTypes.bool,
  type: React.PropTypes.string,
  crop: React.PropTypes.string,
  fit: React.PropTypes.string,
  facepad: React.PropTypes.string
}

Poster.defaultProps = {
  thumbW: 140,
  thumbH: 200,
  preload: false,
  favorite: true,
  share: true,
  type: 'movie',
  crop: 'faces',
  fit: 'min',
  facepad: '1'
}

export default Poster

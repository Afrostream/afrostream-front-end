import ReactDOM from 'react-dom'
import StackBlur from 'stackblur-canvas'
import React, { Component, PropTypes } from 'react'
import URL from 'url'
import config from '../../../../config'

const roundToNearest = (size, precision) => precision * Math.ceil(size / precision)

const defaultMap = {
  width: 'defaultWidth',
  height: 'defaultHeight'
}

const DEFAULT_OPTIONS = Object.freeze({
  auto: 'format', // http://www.imgix.com/docs/reference/automatic#param-auto
  dpr: 1
})


const findSizeForDimension = (dim, props = {}, state = {}) => {
  if (props[dim]) {
    return props[dim]
  } else if (props.fluid && state[dim]) {
    return roundToNearest(state[dim], props.precision)
  } else if (props[defaultMap[dim]]) {
    return props[defaultMap[dim]]
  } else {
    return 1
  }
}

export default class ReactImgix extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    className: PropTypes.string,
    bg: PropTypes.bool,
    component: PropTypes.string,
    fit: PropTypes.string,
    auto: PropTypes.array,
    faces: PropTypes.bool,
    aggressiveLoad: PropTypes.bool,
    fluid: PropTypes.bool,
    children: PropTypes.any,
    customParams: PropTypes.object,
    entropy: PropTypes.bool,
    generateSrcSet: PropTypes.bool
  }
  static defaultProps = {
    precision: 100,
    bg: false,
    fluid: true,
    aggressiveLoad: false,
    faces: true,
    fit: 'crop',
    entropy: false,
    auto: ['format'],
    generateSrcSet: true
  }
  state = {
    width: null,
    height: null,
    mounted: false
  }

  createLoader () {
    this.img = new Image()
    this.img.onload = ::this.handleLoad
    this.img.onerror = ::this.handleError
    this.img.src = this.props.src
  }

  destroyLoader () {
    if (this.img) {
      this.img.onload = null
      this.img.onerror = null
      this.img = null
    }
    const node = ReactDOM.findDOMNode(this)
    this.setState({
      width: node.scrollWidth,
      height: node.scrollHeight,
      mounted: true
    })
  }

  handleLoad () {
    this.destroyLoader()
  }

  handleError () {
    this.destroyLoader()
  }

  componentDidMount () {
    this.createLoader()
  }

  componentWillUnmount () {
    this.destroyLoader()
  }


  _findSizeForDimension = dim => findSizeForDimension(dim, this.props, this.state)

  constructUrl (src, params) {
    var optionKeys = Object.keys(params)
    //var fullUrl = optionKeys.reduce((uri, key) => {
    //  return uri.addQueryParam(key, params[key])
    //}, new URL(src))

    return src.toString()
  }

  processImage (src, longOptions) {
    if (!src) {
      return ''
    }

    var shortOptions = Object.assign({}, DEFAULT_OPTIONS)
    Object.keys(longOptions).forEach((key) => {
      var val = longOptions[key]
      key = encodeURIComponent(key)
      shortOptions[key] = val
    })

    return this.constructUrl(src, shortOptions)
  }

  render () {
    const {
      aggressiveLoad,
      auto,
      bg,
      children,
      component,
      customParams,
      entropy,
      faces,
      fit,
      generateSrcSet,
      src,
      ...other
    } = this.props
    let _src = src

    //_src = _src.replace(/&q=([1-9][0-9]*|0)/g, `&q=30`)
    //_src = _src.replace(/&w=([1-9][0-9]*|0)/g, `&w=20`)
    //_src = _src.replace(/&h=([1-9][0-9]*|0)/g, `&h=20`)
    const url = URL.parse(_src)
    if (~config.images.urlPrefix.indexOf(url.hostname)) {
      _src += '&blur=800'
    }

    let srcSet = ''
    let _component = component

    let width = this._findSizeForDimension('width')
    let height = this._findSizeForDimension('height')

    let crop = false
    if (faces) crop = 'faces'
    if (entropy) crop = 'entropy'

    let _fit = false
    if (entropy) _fit = 'crop'
    if (fit) _fit = fit

    if (this.state.mounted || aggressiveLoad) {
      const srcOptions = {
        auto: auto,
        ...customParams,
        crop,
        fit: _fit,
        width,
        height
      }

      _src = this.processImage(src, srcOptions)
      const dpr2 = this.processImage(src, {...srcOptions, dpr: 2})
      const dpr3 = this.processImage(src, {...srcOptions, dpr: 3})
      srcSet = `${dpr2} 2x, ${dpr3} 3x`
    }

    let childProps = {
      ...this.props.imgProps,
      className: `imgix ${this.props.className}`,
      width: other.width <= 1 ? null : other.width,
      height: other.height <= 1 ? null : other.height
    }

    if (bg) {
      if (!component) {
        _component = 'div'
      }
      childProps.style = {
        ...childProps.style,
        backgroundImage: `url(${_src})`,
        //backgroundSize: 'cover'
      }
    } else {
      if (!component) {
        _component = 'img'
      }

      if (_component === 'img' && generateSrcSet) {
        childProps.srcSet = srcSet
      }

      childProps.src = _src
    }
    return React.createElement(_component,
      childProps,
      children)
  }
}

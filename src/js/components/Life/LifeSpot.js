import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { extractImg } from '../../lib/utils'
import { Link } from '../Utils'
import Immutable from 'immutable'
import ClickablePin from './ClickablePin'

@connect(({Life, User}) => ({Life, User}))
class LifeSpot extends ClickablePin {

  constructor (props, context) {
    super(props, context)
  }

  render () {

    const {
      props: {
        data,
        imageWidth,
        className
      }
    } = this

    const imageUrl = extractImg({data, key: 'image', imageWidth})

    return ( <Link to={data.get('targetUrl')} onClick={
      (e) =>::this.clickHandlerPin(e, data)
    }>
      <img className={`life-spot ${className}`} src={imageUrl} width={data.get('displayWidth')}/>
    </Link>)
  }
}

LifeSpot.propTypes = {
  data: PropTypes.instanceOf(Immutable.Map).isRequired,
  className: PropTypes.string,
  imageWidth: PropTypes.number,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}


LifeSpot.defaultProps = {
  imageWidth: 1080,
  className: 'spot-vertical'
}

export default LifeSpot

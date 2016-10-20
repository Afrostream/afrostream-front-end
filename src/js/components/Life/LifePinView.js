import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import config from '../../../../config'
import moment from 'moment'
import { Link } from '../Utils'
import LifePin from './LifePin'
if (process.env.BROWSER) {
  require('./LifePinView.less')
}

@connect(({Life, User}) => ({Life, User}))
class LifePinView extends LifePin {

  constructor (props, context) {
    super(props, context)
  }

  render () {
    const {
      props: {
        Life,
        params:{
          pinId
        }
      }
    } = this

    const pin = Life.get(`life/pins/${pinId}`)
    if (!pin) {
      return (<div />)
    }

    const pinnedDate = moment(pin.get('date'))

    let image = pin.get('image')
    let bgImg = image ? image.get('path') : ''
    let imageStyles = bgImg ? {backgroundImage: `url(${config.images.urlPrefix}${bgImg}?crop=faces&fit=min&w=1280&h=720&q=70)`} : {}
    return (
      <article className="row no-padding brand-bg life-pin">
        <div className="pin-header">
          <div className="pin-header-background">
            <div className="pin-header-background_image" style={imageStyles}/>
            <div className="pin-header-background_mask"/>

            <div className="bkdate">
              <div className="day">{pinnedDate.format('DD')}</div>
              <div className="month">{pinnedDate.format('MMM')}</div>
            </div>
          </div>
          <div className="pin-header-content">
            <Link to={pin.get('originalUrl')} onClick={
              (e) =>::this.clickHandler(e, pin)
            }>
              <h1> {pin.get('title')}</h1>
            </Link>
          </div>
        </div>
        <div className="container-fluid brand-bg article-content">
          <div className="row no-padding">
            <div className="col-md-8 no-padding ">
              <section dangerouslySetInnerHTML={{__html: pin.get('body')}}/>
            </div>
            <div className="col-md-4 no-padding"/>
          </div>
        </div>
      </article>
    )
  }
}

export default LifePinView

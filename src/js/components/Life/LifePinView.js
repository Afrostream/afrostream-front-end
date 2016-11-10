import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'
import LifePin from './LifePin'
import { extractImg } from '../../lib/utils'
import * as PlayerActionCreators from '../../actions/player'
import LifeSpot from './LifeSpot'
import Immutable from 'immutable'
import AvatarCard from '../User/AvatarCard'
import ModalSocial from '../Modal/ModalSocial'
import document from 'global/document'
import ReactImgix from '../Image/ReactImgix'
import shallowEqual from 'react-pure-render/shallowEqual'

if (process.env.BROWSER) {
  require('./LifePinView.less')
}

@connect(({Life, User}) => ({Life, User}))
class LifePinView extends LifePin {

  constructor (props, context) {
    super(props, context)
  }

  componentWillReceiveProps (nextProps) {
    if (!shallowEqual(nextProps.params, this.props.params)) {
      const players = document.querySelectorAll('.ta-insert-video')
      if (players) {
        _.forEach(players, (element)=> {
          element.addEventListener('click', ::this.videoClickHandler)
        })
      }
    }
  }

  componentWillUnmount () {
    const players = document.querySelectorAll('.ta-insert-video')
    if (players) {
      _.forEach(players, (element)=> {
        element.removeEventListener('click', ::this.videoClickHandler)
      })
    }
  }

  componentDidMount () {
    const players = document.querySelectorAll('.ta-insert-video')
    if (players) {
      _.forEach(players, (element)=> {
        element.addEventListener('click', ::this.videoClickHandler)
      })
    }
  }

  videoClickHandler (e) {
    const {
      props: {
        dispatch
      }
    } = this
    e.preventDefault()

    const target = e.currentTarget || e.target
    const targetUrl = target.getAttribute('ta-insert-video')
    const targetType = target.getAttribute('ta-insert-type')
    dispatch(PlayerActionCreators.loadPlayer({
      data: Immutable.fromJS({
        target,
        autoplay: true,
        sources: [{
          src: targetUrl,
          type: `video/${targetType}`
        }]
      })
    }))
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

    const data = Life.get(`life/pins/${pinId}`)
    if (!data) {
      return (<div />)
    }
    const pinThemesList = data.get('themes')
    const allThemesList = Life.get(`life/themes/`)
    const spots = pinThemesList && pinThemesList.flatMap((theme)=> {
        const themeId = theme.get('_id')
        const themesSpots = allThemesList.find((theme)=> {
          return theme.get('_id') === themeId
        })//Life.get(`life/themes/${themeId}`)
        if (themesSpots) {
          return themesSpots.get('spots')
        }
      })

    const pinnedDate = moment(data.get('date'))
    const pinnedUser = data.get('user')
    let imageUrl = extractImg({data, key: 'image', width: 1280, height: 720, fit: 'min'})

    return (
      <article className="row no-padding brand-bg life-pin">
        <div ref="pinHeader" className="pin-header">
          <div className="pin-header-background">
            <ReactImgix className="pin-header-background_image" src={imageUrl} bg={true}/>
            <div className="pin-header-background_mask"/>

            <div className="bkdate">
              <div className="day">{pinnedDate.format('DD')}</div>
              <div className="month">{pinnedDate.format('MMM')}</div>
            </div>
          </div>
          <div className="pin-header-content">
            <h1> {data.get('title')}</h1>
          </div>
        </div>
        <div className="container-fluid no-padding brand-bg article-content" style={{margin: 0}}>
          <div className="row no-padding">
            <div className="col-md-9 no-padding">
              <section dangerouslySetInnerHTML={{__html: data.get('body')}}/>
              <ModalSocial {...this.props} closable={false} modal={false} showLabel={true}/>
            </div>
            <div className="col-md-3 no-padding col-right">
              {pinnedUser && <AvatarCard user={pinnedUser}/>}
              {spots && spots.map((data, key)=><LifeSpot {...{data, key}} {...this.props} />).toJS()}
            </div>
          </div>
        </div>
      </article>
    )
  }
}

export default LifePinView

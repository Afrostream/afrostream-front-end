import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import config from '../../../../config'
import moment from 'moment'
import _ from 'lodash'
import LifePin from './LifePin'
import { extractImg } from '../../lib/utils'
import * as PlayerActionCreators from '../../actions/player'
import * as ModalActionCreators from '../../actions/modal'
import LifeSpot from './LifeSpot'
import Immutable from 'immutable'
import AvatarCard from '../User/AvatarCard'
import ModalSocial from '../Modal/ModalSocial'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import document from 'global/document'
import ReactImgix from '../Image/ReactImgix'
import shallowEqual from 'react-pure-render/shallowEqual'
import scriptLoader from '../../lib/script-loader'
import { StickyContainer, Sticky } from 'react-sticky'

const {addThisApi, addThis} = config

if (process.env.BROWSER) {
  require('./LifePinView.less')
}

@connect(({Life, User}) => ({Life, User}))
class LifePinView extends LifePin {

  constructor (props, context) {
    super(props, context)
  }

  hasEvent = function (elm, type) {
    var ev = elm.dataset.events
    if (!ev) return false

    return (new RegExp(type)).test(ev)
  }

  addRemoveEvent (add = true) {
    const players = document.querySelectorAll('.ta-insert-video,.life-pin .article-content .col-left img')
    const type = 'click'
    if (players) {
      _.forEach(players, (element) => {
        if (!element.dataset.events) element.dataset.events = ''
        const has = this.hasEvent(element, type)

        if ((add && has) || (!add && !has)) {
          return
        }

        if (add) element.dataset.events += ',' + type
        else element.dataset.events = element.dataset.events.replace(new RegExp(type), '')
        element[`${add ? 'add' : 'remove'}EventListener`]('click', ::this.elementClickHandler)
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!shallowEqual(nextProps.params.pinId, this.props.params.pinId)) {
      this.addRemoveEvent()
    }

    if (nextProps.isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      window['addthis'].init()
    }
  }

  componentWillUnmount () {
    this.addRemoveEvent(false)
  }

  componentDidUpdate () {
    this.addRemoveEvent()
    //this.initAddThis()
  }

  componentDidMount () {
    this.addRemoveEvent()
    this.initAddThis()
  }

  initAddThis () {
    //Detect si le payment via la lib recurly est dispo
    let addLib = window['addthis']
    if (canUseDOM && addLib) {
      window['addthis_config'] = window['addthis_config'] || {}
      window['addthis_config'].pubid = addThis.publicKey

      window['addthis_share'] = window['addthis_share'] || {}
      window['addthis_share'].shorteners = {
        bitly: {}
      }

      addLib.init()
      addLib.toolbox('.addthis_inline_share_toolbox')
    }
  }

  elementClickHandler (e) {
    const {
      props: {
        dispatch
      }
    } = this
    e.preventDefault()

    const target = e.currentTarget || e.target

    const targetUrl = target.getAttribute('ta-insert-video')
    const targetType = target.getAttribute('ta-insert-type')

    if (targetType) {
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
    else {
      dispatch(ModalActionCreators.open({
        className: 'large',
        target: 'image', data: Immutable.fromJS({
          src: e.target.src
        })
      }))
    }
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

    if (!pinThemesList || !allThemesList) {
      return (<div />)
    }

    const spots = pinThemesList && pinThemesList.flatMap((theme) => {
        const themeId = theme.get('_id')
        const themesSpots = allThemesList.find((theme) => {
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
            <div className="col-md-9 col-xs-9 no-padding col-left">
              <section dangerouslySetInnerHTML={{__html: data.get('body')}}/>
              {
                /*<ModalSocial {...this.props} closable={false} modal={false} showLabel={true}/>*/
              }
              <div className="addthis_inline_share_toolbox"/>
            </div>
            <div className="col-md-3 col-xs-3 no-padding col-right">
              {pinnedUser && <AvatarCard user={pinnedUser}/>}
              <StickyContainer>
                <Sticky>
                  {spots && spots.map((data, key) => <LifeSpot {...{
                    data,
                    key
                  }} {...this.props} />).toJS()}
                </Sticky>
              </StickyContainer>
            </div>
          </div>
        </div>
      </article>
    )
  }
}

export default  scriptLoader(
  [addThisApi]
)(LifePinView)

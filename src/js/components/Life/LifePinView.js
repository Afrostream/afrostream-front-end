import React, { Component, PropTypes } from 'react'
import { prepareRoute } from '../../decorators'
import { connect } from 'react-redux'
import config from '../../../../config'
import moment from 'moment'
import _ from 'lodash'
import LifePin from './LifePin'
import { extractImg, hasEvent, addRemoveEvent } from '../../lib/utils'
import * as LifeActionCreators from '../../actions/life'
import * as PlayerActionCreators from '../../actions/player'
import * as ModalActionCreators from '../../actions/modal'
import Spinner from '../Spinner/Spinner'
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

const {addThisApi, addThis, bitly} = config

if (process.env.BROWSER) {
  require('./LifePinView.less')
}

@prepareRoute(async function ({store, params:{pinId}}) {
  if (pinId) {
    return await store.dispatch(LifeActionCreators.fetchPin(pinId))
  }
})
@connect(({Life, User}) => ({Life, User}))
class LifePinView extends LifePin {

  constructor (props, context) {
    super(props, context)
  }

  addEvent (add = true) {
    const players = document.querySelectorAll('.ta-insert-video,.life-pin .article-content .col-left img')
    if (players) {
      _.forEach(players, (element) => {
        addRemoveEvent('click', element, add, ::this.elementClickHandler)
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!shallowEqual(nextProps.params.pinId, this.props.params.pinId)) {
      this.addEvent()
    }

    if (nextProps.isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      window['addthis'].init()
    }
  }

  componentWillUnmount () {
    this.addEvent(false)
  }

  componentDidUpdate () {
    this.addEvent()
  }

  componentDidMount () {
    this.addEvent()
    $(document).ready(() => {
      this.initAddThis()
    })
  }

  initAddThis () {
    //Detect si le payment via la lib recurly est dispo
    let addLib = window['addthis']
    if (canUseDOM && addLib) {
      window['addthis_config'] = window['addthis_config'] || {}
      window['addthis_config'].pubid = addThis.publicKey

      window['addthis_share'] = window['addthis_share'] || {}
      window['addthis_share'].shorteners = {
        bitly: {
          login: bitly.login,
          apiKey: bitly.apiKey
        }
      }

      addLib.toolbox('.addthis_inline_share_toolbox_apql')
      addLib.init()
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
          videoId: targetUrl,
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
      return (<Spinner />)
    }
    const pinThemesList = data.get('themes')
    const allThemesList = Life.get(`life/themes/`)

    const spots = pinThemesList && pinThemesList.flatMap((theme) => {
        const themeId = theme.get('_id')
        const themesSpots = allThemesList && allThemesList.find((theme) => {
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
      <article className="brand-bg life-pin">
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
        <StickyContainer className="container-fluid no-padding brand-bg article-content" style={{margin: 0}}>
          <div className="row no-padding">
            <div className="col-md-9 col-xs-9 no-padding col-left">
              <section dangerouslySetInnerHTML={{__html: data.get('body')}}/>
              {
                /*<ModalSocial {...this.props} closable={false} modal={false} showLabel={true}/>*/
              }
              <div className="addthis_inline_share_toolbox_apql"/>
              <div class="addthis_relatedposts_inline"/>
            </div>
            <div className="col-md-3 col-xs-3 no-padding col-right">
              {pinnedUser && <AvatarCard user={pinnedUser}/>}
              <Sticky bottomOffset={150}>
                <div className="spot-lists">
                  {spots && spots.map((data, key) => <LifeSpot {...{
                    data,
                    key
                  }} {...this.props} />).toJS()}
                </div>
              </Sticky>
            </div>
          </div>
        </StickyContainer>
      </article>
    )
  }
}

export default  scriptLoader(
  [addThisApi]
)(LifePinView)

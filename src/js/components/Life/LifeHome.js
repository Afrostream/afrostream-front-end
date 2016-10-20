import React, { PropTypes, Component } from 'react'
import { prepareRoute } from '../../decorators'
import { connect } from 'react-redux'
import * as LifeActionCreators from '../../actions/life'
import * as EventActionCreators from '../../actions/event'
import LifeNavigation from './LifeNavigation'
import LifeList from './LifeList'
import { withRouter } from 'react-router'
import Immutable from 'immutable'

if (process.env.BROWSER) {
  require('./LifeThemes.less')
}

@prepareRoute(async function ({store, params:{themeId}}) {
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true)),
    store.dispatch(LifeActionCreators.fetchPins({})),
    store.dispatch(LifeActionCreators.fetchThemes(themeId))
  ])
})
@connect(({Life, User}) => ({Life, User}))
class LifeThemes extends Component {

  constructor (props, context) {
    super(props, context)
  }

  renderThemes () {
    const {
      props: {
        Life,
        params:{
          themeId
        }
      }
    } = this

    const themesList = Life.get(`life/themes/${themeId || ''}`)

    if (!themesList) {
      return
    }

    let pins = null

    //if (themesList instanceof Immutable.List) {
    //  pins = themesList.map((theme) => {
    //      return theme.get('pins')
    //    }
    //  ).flatten(true)
    //}
    //else {
    //  pins = themesList.get('pins')
    //}

    pins = themeId ? themesList.get('pins') : Life.get('life/pins/')
    if (!pins || !pins.size) {
      return
    }

    return (<div key="life-themes-list" className="life-theme">
      <LifeList {...{pins, themeId}} virtual={true} key={`life-theme-pins`}/>
    </div>)
  }

  render () {
    const {
      props: {
        children
      }
    } = this

    return (
      <div className="container-fluid container-no-padding life-themes brand-grey">
        <LifeNavigation />
        <div className="row-fluid container-no-padding brand-grey">
          {children || this.renderThemes()}
        </div>
      </div>
    )
  }
}

export default withRouter(LifeThemes)

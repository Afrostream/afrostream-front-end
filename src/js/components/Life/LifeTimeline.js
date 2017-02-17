import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { prepareRoute } from '../../decorators'
import LifeList from './LifeList'
import * as LifeActionCreators from '../../actions/life'
import LifeSticky from './LifeSticky'
import SubNavigation from '../Header/SubNavigation'

@prepareRoute(async function ({store, params:{themeId}}) {
  return await Promise.all([
    store.dispatch(LifeActionCreators.fetchPins({themeId, filterAll: true})),
    store.dispatch(LifeActionCreators.fetchSpots({themeId}))
  ])
})
@connect(({Life, User}) => ({Life, User}))
class LifeTimeline extends Component {

  constructor (props, context) {
    super(props, context)
  }

  render () {
    const {
      props: {
        Life,
        params:{
          themeId
        }
      }
    } = this

    const pins = Life.get(`life/pins/${themeId}`)
    const spots = Life.get(`life/spots/${themeId}`)
    const themesList = Life.get('communityMenu')

    return (<div key="life-themes-list" className="life-theme">
      <SubNavigation {...{themesList}} to="/life/{_id}/{slug}" streaming={true}>
        <LifeSticky {...this.props}/>
      </SubNavigation>
      {pins && <LifeList timelineMode={false} {...this.props} {...{pins, spots, themeId}} key={`life-theme-pins`}/>}
    </div>)
  }
}

LifeTimeline.propTypes = {
  history: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
}

export default withRouter(LifeTimeline)

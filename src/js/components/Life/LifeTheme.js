import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { prepareRoute } from '../../decorators'
import LifeList from './LifeList'
import * as LifeActionCreators from '../../actions/life'

@prepareRoute(async function ({store, params:{themeId}}) {
  if (themeId) {
    //return await store.dispatch(LifeActionCreators.fetchThemes(themeId))
    return await store.dispatch(LifeActionCreators.fetchPins({themeId}))
  }
})
@connect(({Life, User}) => ({Life, User}))
class LifeTheme extends Component {

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
    //const pins = themeId ? themesList && themesList.get('pins') : Life.get('life/pins/')
    //const spots = themeId ? themesList && themesList.get('spots') : Life.get('life/spots/')

    return (<div key="life-themes-list" className="life-theme">
      {pins && <LifeList {...this.props} {...{pins, spots, themeId}} virtual={true} key={`life-theme-pins`}/>}
    </div>)
  }
}

LifeTheme.propTypes = {
  history: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
}

export default withRouter(LifeTheme)

import React, { PropTypes, Component } from 'react'
import { prepareRoute } from '../../decorators'
import { connect } from 'react-redux'
import * as LifeActionCreators from '../../actions/life'
import * as IntercomActionCreators from '../../actions/intercom'
import * as EventActionCreators from '../../actions/event'
import LifeSticky from './LifeSticky'
import LifeTheme from './LifeTheme'
import SubNavigation from '../Header/SubNavigation'
import { withRouter } from 'react-router'
import config from '../../../../config'

const {intercom:{lifeFeature}} = config
if (process.env.BROWSER) {
  require('./LifeHome.less')
}

@prepareRoute(async function ({store}) {
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true))
  ])
})
@connect(({Life}) => ({Life}))
class LifeHome extends Component {

  constructor (props, context) {
    super(props, context)
  }

  render () {
    const {
      props: {
        children,
        Life
      }
    } = this

    const themesList = Life.get('life/themes/')

    return (
      <div className="row-fluid no-padding">
        <SubNavigation {...{themesList}} to="/life/{_id}/{slug}"/>
        <div className="container-fluid no-padding life-home life-themes brand-grey">
          {children}
          <LifeSticky {...this.props}/>
        </div>
      </div>
    )
  }
}

export default withRouter(LifeHome)

import React, { PropTypes, Component } from 'react'
import { prepareRoute } from '../../decorators'
import { connect } from 'react-redux'
import * as LifeActionCreators from '../../actions/life'
import * as EventActionCreators from '../../actions/event'
import LifeNavigation from './LifeNavigation'
import LifeList from './LifeList'
import { withRouter } from 'react-router'

if (process.env.BROWSER) {
  require('./LifeThemes.less')
}

@prepareRoute(async function ({store, params:{themeId}}) {
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true)),
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
        themeId
      }
    } = this

    const themesList = Life.get('life/themes/')

    if (!themesList || !themesList.size) {
      return
    }

    return (<div key="life-themes-list" className="life-theme">
      {
        themesList.map((theme, key) => {
            const pins = theme.get('pins')
            const themeId = theme.get('_id')
            return <LifeList {...{pins, themeId}} virtual={false} key={`life-theme-pins-${key}`}/>
          }
        ).toJS()
      }
    </div>)
  }

  render () {
    const {
      props: {
        children
      }
    } = this

    return (
      <div className="row-fluid life-themes brand-grey">
        <LifeNavigation />
        <div className="container-fluid container-no-padding brand-grey">
          {children || this.renderThemes()}
        </div>
      </div>
    )
  }
}

export default withRouter(LifeThemes)

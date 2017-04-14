import React, { PropTypes, Component } from 'react'
import { prepareRoute } from '../../decorators'
import { connect } from 'react-redux'
import * as LifeActionCreators from '../../actions/life'
import { withRouter } from 'react-router'
import shallowEqual from 'react-pure-render/shallowEqual'

if (process.env.BROWSER) {
  require('./LifeHome.less')
}

@prepareRoute(async function ({store, params: {themeId}}) {
  return await Promise.all([
    store.dispatch(LifeActionCreators.fetchThemes(themeId)),
    store.dispatch(LifeActionCreators.fetchUserLikes()),
    store.dispatch(LifeActionCreators.fetchUsersFollow())
  ])
})
@connect(({Life, User}) => ({Life, User}))
class LifeHome extends Component {

  constructor(props, context) {
    super(props, context)
  }

  componentWillReceiveProps(nextProps) {
    const {
      props: {
        dispatch,
        User
      }
    } = this
    if (!shallowEqual(nextProps.User.get('user'), User.get('user'))) {
      dispatch(LifeActionCreators.fetchUserLikes())
      dispatch(LifeActionCreators.fetchUsersFollow())
    }
  }

  render() {
    const {
      props: {
        children
      }
    } = this

    return (
      <div className="row-fluid no-padding">
        <div className="container-fluid no-padding life-home life-themes brand-grey">
          {children}
        </div>
      </div>
    )
  }
}

export default withRouter(LifeHome)

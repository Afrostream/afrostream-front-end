import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import LifeList from './LifeList'
import { withRouter } from 'react-router'
import AvatarCard from '../User/AvatarCard'
import PinButton from './PinButton'
import { prepareRoute } from '../../decorators'
import * as LifeActionCreators from '../../actions/life'
import shallowEqual from 'react-pure-render/shallowEqual'

@prepareRoute(async function ({store, params:{lifeUserId}}) {
  await Promise.all([
    store.dispatch(LifeActionCreators.fetchUsers({lifeUserId})),
    store.dispatch(LifeActionCreators.fetchUserPins({lifeUserId}))
  ])

})
@connect(({Life, User}) => ({Life, User}))
class LifeUserInfos extends Component {

  constructor (props, context) {
    super(props, context)
  }

  render () {
    const {
      props: {
        Life,
        User,
        params:{lifeUserId}
      }
    } = this

    const gloBalUser = User.get(`user`)
    const user = Life.get(`life/users/${lifeUserId}`)
    //FIXME il n'y a pas le nombre exact de pins uand on charge par la route life/pins
    const pins = Life.get(`life/users/${lifeUserId}/pins`)

    if (!pins) {
      return <div />
    }

    if (!user) {
      return <div />
    }

    const id = user.get('_id')
    const isCurrentUser = gloBalUser && gloBalUser.get('_id') === id

    return (<div key="life-themes-list" className="life-theme">
        <div className="row text-center">
          <div
            className={`col-md-${isCurrentUser ? 8 : 12} col-xs-${isCurrentUser ? 8 : 12}`}>
            <AvatarCard {...{user}} {...this.props} bio={true}/>
          </div>
          {isCurrentUser && <div className="col-md-4 col-xs-4 ">
            <PinButton buttonClass="fa fa-pencil-square-o" label="life.sticky.tooltip" {...this.props} />
          </div>}
        </div>
        <div className="row">
          <div className="addthis_toolbox addthis_inline_share_toolbox_apql"/>
        </div>
        {pins &&
        <div className="col-md-12 no-padding">
          <LifeList {...this.props} {...{pins, userId: lifeUserId, isCurrentUser}} highlightFirst={false}
                    key={`life-theme-pins`}/>
        </div>}
      </div>
    )
  }
}

LifeUserInfos.propTypes = {
  history: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
}

export default withRouter(LifeUserInfos)

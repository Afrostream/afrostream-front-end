import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import LifeList from './LifeList'
import { withRouter } from 'react-router'
import AvatarCard from '../User/AvatarCard'
import PinButton from './PinButton'

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
    const pins = user && user.get('lifePins')


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
            className={`col-md-${isCurrentUser ? 4 : 12} col-xs-${isCurrentUser ? 6 : 12} col-md-offset-${isCurrentUser ? 2 : 0}`}>
            <AvatarCard {...{user}} {...this.props} />
          </div>
          {isCurrentUser && <div className="col-md-4 col-xs-6 ">
            <PinButton buttonClass="fa fa-pencil-square-o" label="life.sticky.tooltip" {...this.props} />
          </div>}
        </div>
        {pins &&
        <div className="col-md-12 no-padding">
          <LifeList {...this.props} {...{pins, isCurrentUser}} virtual={true} highlightFirst={false}
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

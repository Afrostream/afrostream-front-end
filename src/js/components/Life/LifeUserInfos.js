import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import LifeList from './LifeList'
import { withRouter } from 'react-router'
import AvatarCard from '../User/AvatarCard'

@connect(({Life, User}) => ({Life, User}))
class LifeUserInfos extends Component {

  constructor (props, context) {
    super(props, context)
  }

  render () {
    const {
      props: {
        Life,
        params:{lifeUserId}
      }
    } = this

    const user = Life.get(`life/users/${lifeUserId}`)
    const pins = user && user.get('lifePins')

    if (!pins) {
      return <div />
    }
    return (<div key="life-themes-list" className="life-theme">
      <AvatarCard className="avatar-card col-md-3" {...{user}} {...this.props} />
      {pins &&
      <div className="col-md-12 no-padding">
        <LifeList {...this.props} {...{pins}} virtual={true} highlightFirst={false} key={`life-theme-pins`}/>
      </div>}
    </div>)
  }
}

LifeUserInfos.propTypes = {
  history: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
}

export default withRouter(LifeUserInfos)

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import LifeList from './LifeList'
import { withRouter } from 'react-router'

@connect(({Life, User}) => ({Life, User}))
class LifeUserInfos extends Component {

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

    const lifeUser = Life.get(`life/users/${lifeUserId || ''}`)
    const pins = lifeUser && lifeUser.get('pins')

    return (<div key="life-themes-list" className="life-theme">
      {pins && <LifeList {...this.props} {...{pins}} virtual={true} key={`life-theme-pins`}/>}
    </div>)
  }
}

LifeUserInfos.propTypes = {
  history: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
}

export default withRouter(LifeUserInfos)

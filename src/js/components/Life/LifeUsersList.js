import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import classSet from 'classnames'
import AvatarCard from '../User/AvatarCard'

if (process.env.BROWSER) {
  require('./LifeUsersList.less')
}
@connect(({Life, User}) => ({Life, User}))
class LifeUsersList extends Component {

  constructor (props) {
    super(props)
  }

  getUsers () {
    const {
      props: {
        Life,
        lifeUserId
      }
    } = this

    const lifeUsersList = Life.get(`life/users/${lifeUserId ? lifeUserId : ''}`)
    return lifeUsersList
  }

  renderItem ({data, key, index}) {
    const {
      props: {}
    } = this

    const user = data
    return (
      <div className="col-md-3" {...{key}}>
        <AvatarCard className="avatar-card col-md-3" {...{user}} {...this.props} />
      </div>
    )
  }

  render () {
    const {
      props: {}
    } = this

    const lifeUsersList = this.getUsers()

    const classList = {
      'life-community-list': true
    }

    return (<div className={classSet(classList)}>
      {lifeUsersList && lifeUsersList.map((data, index) =>this.renderItem({
        data,
        index,
        key: `life-list-user--${index}`

      })).toJS()}
    </div>)
  }
}

export default LifeUsersList

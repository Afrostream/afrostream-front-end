import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import classSet from 'classnames'
import AvatarCard from '../User/AvatarCard'
import ReactList from 'react-list'
import * as LifeActionCreators from '../../actions/life'

if (process.env.BROWSER) {
  require('./LifeUsersList.less')
}
@connect(({Life, User}) => ({Life, User}))
class LifeUsersList extends Component {

  constructor (props) {
    super(props)
    this.isLoading = false
  }

  getUsers () {
    const {
      props: {
        Life,
        lifeUserId
      }
    } = this

    return Life.get(`life/users/${lifeUserId}`)
  }

  fetchUsers (index) {
    const {
      props: {
        dispatch
      }
    } = this

    if (this.isLoading) return
    this.isLoading = true

    return dispatch(LifeActionCreators.fetchUsers({offset: index}))
      .then(() => {
        this.isLoading = false
      })
  }

  renderItem (index, key) {
    const {
      props: {}
    } = this

    const {
      props: {}
    } = this

    const lifeUsersList = this.getUsers()
    const user = lifeUsersList.get(index)

    if (!user) {
      this.fetchUsers(index)
      return <div className="col-md-3 col-xs-4" {...{key}} />
    }

    return (
      <div className="col-md-3 col-xs-4" {...{key}}>
        <AvatarCard {...{user}} {...this.props} />
      </div>
    )
  }

  render () {
    const {
      props: {}
    } = this

    const lifeUsersList = this.getUsers()

    const classList = {
      'life-community-list': true,
      'row no-padding': true
    }

    return (<div className={classSet(classList)}>
      {lifeUsersList && <ReactList
        ref="react-user-list"
        axis="y"
        itemRenderer={::this.renderItem}
        items={lifeUsersList}
        length={lifeUsersList.size + 1 }
        type={'simple'}
      />}
    </div>)
  }
}

export default LifeUsersList

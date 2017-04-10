import React from 'react'
import { connect } from 'react-redux'
import CircularProgress from 'material-ui/CircularProgress'
import shallowEqual from 'react-pure-render/shallowEqual'
import config from '../../../../config'
import _ from 'lodash'
import { I18n } from '../Utils'
const {userProfile} = config

@connect(({User}) => ({User}))
class AccountProgress extends I18n {

  state = {
    completed: 0
  }

  constructor (props) {
    super(props)
  }

  componentWillReceiveProps (nextProps) {
    const {
      props: {
        User
      }
    } = this

    const user = User.get('user')

    if (!shallowEqual(nextProps, this.props)) {
      const sections = userProfile.keys
      const provileValues = []
      const provileKeys = []
      _.forEach(sections, (section) => {
        return _.forEach(section, (profileSection) => {
          const profileValue = user && user.get(profileSection.key)
          provileKeys.push(profileSection.key)
          if (profileValue) {
            provileValues.push({key: profileSection.key, value: profileValue})
          }
        })
      })

      this.setState({
        completed: provileValues.length * 100 / provileKeys.length
      })
    }
  }


  render () {
    const {
      props: {
        User
      }
    } = this

    const user = User.get('user')
    if (!user) {
      return <div />
    }

    return (
      <div className="account-details__container col-md-12">
        <div className="panel-profil profile-progress">
          <div className="row">
            <div className="col-md-2">
              <CircularProgress
                className="progress-circle"
                mode="determinate"
                value={this.state.completed}
                size={100}
                thickness={20}
              />
            </div>
            <div className="col-md-10 progress-text">
              {` ${this.getTitle('account.profile.progress')} ${this.state.completed} %`}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

AccountProgress.propTypes = {}

AccountProgress.defaultProps = {}

export default AccountProgress

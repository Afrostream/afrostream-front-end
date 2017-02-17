import React from 'react'
import { connect } from 'react-redux'
import Toggle from 'material-ui/Toggle'
import * as OAuthActionCreators from '../../actions/oauth'
import * as UserActionCreators from '../../actions/user'
import config from '../../../../config'
import {
  FormattedMessage,
  FormattedHTMLMessage
} from 'react-intl'

const {oauth2}= config

if (process.env.BROWSER) {
  require('./AccountSocial.less')
}

@connect(({User}) => ({User}))
class AccountSocial extends React.Component {

  constructor (props) {
    super(props)
    this.state = {fetching: false}
  }


  synchroniseHandler ({isSynchro, strategy}) {
    const {
      props: {
        dispatch
      }
    } = this

    this.setState({
      fetching: true
    })

    dispatch(OAuthActionCreators.strategy({strategy, path: isSynchro ? 'unlink' : 'link'}))
      .then(() => {
        dispatch(UserActionCreators.getProfile())
        this.setState({
          fetching: false
        })
      }).catch(() => {
      this.setState({
        fetching: false
      })
    })
  }


  getSocialProvider (user) {


    return _.filter(oauth2.providers, {active: true}).map((strategy) => {
      const providerInfos = user.get(strategy.name)
      const isSynchro = Boolean(providerInfos)
      const inputAttributes = {
        onToggle: (event, payload) => {
          this.synchroniseHandler({isSynchro: !payload, strategy: strategy.name})
        }
      }
      return (<div className="col-md-12" key={`${strategy.name}-synchro`}>
          <div className="row">
            <div className="col-xs-2 col-md-2 text-center">
              <i className={strategy.icon}/>
            </div>
            <div className="col-xs-8 col-md-8">
              <FormattedHTMLMessage
                id={ `account.oauth2.link` } values={{strategy: strategy.name}}/>
            </div>
            <div className="col-xs-2 col-md-2">
              <Toggle
                toggled={isSynchro}
                {...inputAttributes}
              />
            </div>
          </div>
        </div>
      )
    })
  }

  render () {
    const {
      props: {
        User,
        col
      }
    } = this

    const user = User.get('user')
    if (!user) {
      return <div />
    }

    return (
      <div className={`account-details__container col-md-${col}`}>
        <div className="panel-profil">
          <div className="pannel-header"><FormattedMessage id={ `account.profile.synchro` }/></div>
          <div className="row-fluid row-profil">
            {this.getSocialProvider(user)}
          </div>
        </div>
      </div>
    )
  }
}

AccountSocial.propTypes = {
  col: React.PropTypes.number
}

AccountSocial.defaultProps = {
  col: 6
}

export default AccountSocial

import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { getI18n } from '../../../../config/i18n'
import SwitchButton from '../SwitchButton/SwitchButton'
import * as OAuthActionCreators from '../../actions/oauth'
import * as UserActionCreators from '../../actions/user'
import config from '../../../../config'

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

    dispatch(OAuthActionCreators.provider({strategy, path: isSynchro ? 'unlink' : 'link'}))
      .then(()=> {
        dispatch(UserActionCreators.getProfile())
        this.setState({
          fetching: false
        })
      }).catch((err)=> {
      this.setState({
        fetching: false
      })
    })
  }


  getSocialProvider (user) {


    return _.map(oauth2.providers, (strategy)=> {
      const providerInfos = user.get(strategy.name)
      const isSynchro = Boolean(providerInfos)
      const checkLabel = getI18n().account.social[isSynchro ? 'off' : 'on']
      const inputAttributes = {
        onChange: event => ::this.synchroniseHandler({isSynchro, strategy: strategy.name})
      }
      const title = getI18n().account.social.link.replace('{provider}', strategy.name)
      return (<div className="row" key={`${strategy.name}-synchro`}>
          <div className="col-md-2">
            <i className="fa fa-facebook-official"/>
          </div>
          <div className="col-md-6" dangerouslySetInnerHTML={{__html:title}}/>
          <div className="col-md-4">
            <SwitchButton label={checkLabel} name="switch-3" checked={isSynchro}
              {...inputAttributes} disabled={this.state.fetching}/>
          </div>
        </div>
      )
    })
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
      <div className="row account-details">
        <div className="account-details__container col-md-12">
          {this.getSocialProvider(user)}
        </div>
      </div>
    )
  }
}

export default AccountSocial

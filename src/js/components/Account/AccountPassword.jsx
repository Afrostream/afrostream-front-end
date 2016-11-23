import React from 'react'
import { connect } from 'react-redux'
import { Link } from '../Utils'
import RaisedButton from 'material-ui/RaisedButton'
import {
  FormattedMessage,
} from 'react-intl'

@connect(({User, Billing}) => ({User, Billing}))
class AccountPassword extends React.Component {

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
          <div className="pannel-header"><FormattedMessage tagName="h1"
                                                           id={ 'account.user.password'} defaultMessage="******"/>
          </div>
          <div className="row-fluid row-profil">
            <div className="col-md-12">
              <Link to="/reset">
                <RaisedButton label={<FormattedMessage id={ 'account.user.updatePassword' }/>}/></Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


AccountPassword.propTypes = {
  col: React.PropTypes.number
}

AccountPassword.defaultProps = {
  col: 12
}


export default AccountPassword

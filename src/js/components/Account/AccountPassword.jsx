import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { getI18n } from '../../../../config/i18n'
import RaisedButton from 'material-ui/RaisedButton'

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
          <div className="pannel-header">{`${getI18n().account.user.password} : ******`}</div>
          <div className="row-fluid row-profil">
            <div className="col-md-12">
              <Link to="/reset">
                <RaisedButton label={getI18n().account.user.updatePassword}/></Link>
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

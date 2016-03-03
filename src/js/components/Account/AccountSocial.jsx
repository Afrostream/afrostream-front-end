import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {dict} from '../../../../config';
import classSet from 'classnames';
import SwitchButton from '../SwitchButton/SwitchButton';
import * as OAuthActionCreators from '../../actions/oauth';
import * as UserActionCreators from '../../actions/user';

if (process.env.BROWSER) {
  require('./AccountSocial.less');
}

@connect(({ User }) => ({User}))
class AccountSocial extends React.Component {

  constructor(props) {
    super(props);
    this.state = {fetching: false};
  }


  synchroniseHandler(isSynchro) {
    const {
      props: {
        dispatch
        }
      } = this;

    this.setState({
      fetching: true
    });

    dispatch(OAuthActionCreators.facebook(isSynchro))
      .then(()=> {
        dispatch(UserActionCreators.getProfile());
        this.setState({
          fetching: false
        });
      }).catch((err)=> {
      this.setState({
        fetching: false
      });
    });
  }

  render() {
    const {
      props: {
        User
        }
      } = this;

    const user = User.get('user');
    if (!user) {
      return <div />;
    }
    const facebookInfos = user.get('facebook');
    let checkLabel = dict.account.social[facebookInfos ? 'off' : 'on'];
    let checked = Boolean(facebookInfos);

    const inputAttributes = {
      onChange: event => ::this.synchroniseHandler(Boolean(facebookInfos))
    };

    return (
      <div className="row account-details">
        <div className="account-details__header col-md-4">{dict.account.social.header}</div>
        <div className="account-details__container col-md-8">
          <div className="row">
            <div className="col-md-6">
              <i className="fa fa-facebook-official"/>
            </div>
            <div className="col-md-6">
              <SwitchButton label={checkLabel} name="switch-3" checked={checked}
                {...inputAttributes} disabled={this.state.fetching}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AccountSocial;

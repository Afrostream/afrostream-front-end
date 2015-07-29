import React from 'react';
import { connect } from 'react-redux';
import * as UserActionCreators from '../../actions/user';

@connect(({ User }) => ({User})) class UserButton extends React.Component {

  componentDidMount() {
    this.setupAjax();
    this.createLock();
    //this.setState({idToken: this.getIdToken()})
    //dispatch(UserActionCreators.getIdToken(this.props.item.get('slug')));
  }

  createLock() {
    const {
      props: {
        dispatch
        }
      } = this;
    //this.lock = new Auth0Lock(config.auth0.clientId, config.auth0.domain);
    dispatch(UserActionCreators.createLock());
  }

  showLock() {
    // We receive lock from the parent component in this case
    // If you instantiate it in this component, just do this.lock.show()
    this.props.lock.show();
  }

  setupAjax() {
    //$.ajaxSetup({
    //  'beforeSend': function (xhr) {
    //    if (localStorage.getItem('afroToken')) {
    //      xhr.setRequestHeader('Authorization',
    //        'Bearer ' + localStorage.getItem('afroToken'));
    //    }
    //  }
    //});
  }

  render() {
    const {
      props: {
        User
        }
      } = this;

    const user = User.get('current');

    return (
      <div className="btn-group navbar-collapse collapse navbar-left">
        <button type="button" className="btn btn-user btn-default dropdown-toggle" data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false" onClick={::this.showLock}>
          <img src="https://i.cloudup.com/StzWWrY34s.png" alt="50x50" className="icon-user"/>
        </button>
        <ul className="dropdown-menu">
          <li><a href="#">Action</a></li>
          <li><a href="#">Another action</a></li>
          <li><a href="#">Something else here</a></li>
          <li role="separator" className="divider"></li>
          <li><a href="#">Separated link</a></li>
        </ul>
      </div>
    );
  }

  showLock() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(UserActionCreators.showLock());
  }
}

export default UserButton;

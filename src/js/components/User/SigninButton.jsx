import React from 'react';
import { connect } from 'react-redux';
import * as UserActionCreators from '../../actions/user';
import { Link } from 'react-router';

@connect(({ User }) => ({User})) class SigninButton extends React.Component {

	componentDidMount() {
		this.createLock();
	}

	createLock() {
		const {
			props: {
				dispatch
				}
			} = this;
		dispatch(UserActionCreators.createLock());
		dispatch(UserActionCreators.getIdToken());
	}

	render() {
		const {
			props: {
				User,
				dispatch
				}
			} = this;

		const token = User.get('token');
		const user = User.get('user');

		if (token) {
			if (user) {
				return (
					<div className="btn-group navbar-collapse collapse navbar-left">
					  <button type="button" className="btn btn-user btn-default dropdown-toggle" data-toggle="dropdown"
				      aria-haspopup="true"
				      aria-expanded="false">
					    <img src={user.get('picture')} alt="50x50" className="icon-user"/>
				      <span className="label-user">{user.get('nickname')}</span>
		        </button>
		        <ul className="dropdown-menu">
			        <li><Link to="/compte">Mon compte</Link></li>
		          <li role="separator" className="divider"></li>
			        <li><Link to="paiements">Mes paiements</Link></li>
		        </ul>
		      </div>
	      );
	} else {
    dispatch(UserActionCreators.getProfile());
    return (<div className="btn-group navbar-collapse collapse navbar-left">Load user</div>);
}
} else {
	return this.getLoginState();
}
}

getLoginState() {
	return (
		<div className="btn-group navbar-collapse collapse navbar-left">
		<button type="button" className="btn btn-user btn-default dropdown-toggle" data-toggle="dropdown"
	aria-haspopup="true"
	aria-expanded="false" onClick={::this.showLock}>
se connecter
</button>
</div>
);
}

showLock() {
	const {
		props: {
			dispatch
			}
		} = this;

	dispatch(UserActionCreators.showSigninLock());
}
}

export default SigninButton;

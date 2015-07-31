import React from 'react/addons';
import { Link } from 'react-router';
import UserButton from './../User/UserButton';
import SignupButton from './../User/SignupButton';

class Welcome extends React.Component {

	static propTypes = {

	};


	render() {

		const {
			props: { episode }
		} = this;

			return (
				<div>
					<h1>In the Welcome Page!</h1>
					<UserButton />
					<SignupButton />
				</div>
			);
	}
}

export default Welcome;

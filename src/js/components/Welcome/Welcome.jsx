import React from 'react/addons';
import { Link } from 'react-router';
import SignupButton from './../User/SignupButton';
import SigninButton from './../User/SigninButton';

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
					<SignupButton />
					<SigninButton />
				</div>
			);
	}
}

export default Welcome;

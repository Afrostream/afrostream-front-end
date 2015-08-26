import React from 'react/addons';
import { Link } from 'react-router';
import Welcome from './Welcome';
import Browse from './Browse';
import AfrostreamMonthlyMessage from './AfrostreamMonthlyMessage';
import WelcomeFooter from './WelcomeComponents/WelcomeFooter';
import Payment from './Payment';
import Application from '../Application';

var ReturningUser = React.createClass({

  getInitialState: function () {

    return {
      profile: null,
      tokenExpired: null
    }
  },

  componentDidMount: function () {

    this.props.lock.getProfile(this.props.idToken, function (err, profile) {
      if (err) {

        console.log("*** Error loading the profile in ReturningUser.jsx - most likely the token has expired ***", err);
        localStorage.removeItem('afroToken');

        this.setState({
          tokenExpired: true
        });
      }
      this.setState({profile: profile});

    }.bind(this));
  },

  render: function () {

    const {
      props: { episode }
      } = this;

    if (this.state.profile) {

      if ((typeof this.state.profile.paymentStatus !== 'undefined')
        && (this.state.profile.paymentStatus === true)
        && (typeof this.state.profile.planCode !== 'undefined')
        && (this.state.profile.planCode !== 'afrostreammonthly')) {

        //return (<Browse lock={this.props.lock} idToken={this.props.idToken} profile={this.state.profile}  />);
        return (<Application paymentStatus={true} children={this.props.children}/>);

      } else if ((typeof this.state.profile.paymentStatus !== 'undefined')
        && (this.state.profile.paymentStatus === true)
        && (typeof this.state.profile.planCode !== 'undefined')
        && (this.state.profile.planCode === 'afrostreammonthly')) {

        return (
          <div>
            <AfrostreamMonthlyMessage/>
            <WelcomeFooter />
          </div>
        );

      } else {

        return (
          <div>
            <Payment/>
            <WelcomeFooter />
          </div>
        );
      }
    } else if (this.state.tokenExpired === true) {

      return (<Welcome/>);
    } else {

      return (<div></div>);
    }
  }
});

module.exports = ReturningUser;

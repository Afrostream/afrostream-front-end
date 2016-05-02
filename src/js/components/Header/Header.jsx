import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import UserButton from './../User/UserButton'
import GoBack from './../GoBack/GoBack'
import SmartBanner from './SmartBanner'
import classSet from 'classnames'
import { apps } from '../../../../config'
import { withRouter } from 'react-router'

if (process.env.BROWSER) {
  require('./Header.less');
}

@connect(({Event, User}) => ({Event, User}))
class Header extends React.Component {

  state = {
    pinned: this.props.pinned,
    isIOS: false
  };

  componentDidMount () {
    window.addEventListener('scroll', this.updatePin.bind(this));
    this.setState({
      isIOS: window.navigator.userAgent.match(/(iPod|iPhone|iPad)/i)
    });
    this.updatePin();
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.updatePin.bind(this));
  }

  updatePin () {
    let pin = window.pageYOffset;
    if (pin !== this.state.pinned) {
      this.setState({
        pinned: !!(pin)
      });
    }
  }

  render () {

    const {
      props: {
        Event,
        User,
        router,
        location
      }
    } = this;

    const hiddenMode = !Event.get('userActive');
    const pinned = Event.get('pinHeader');
    const user = User.get('user');
    let planCode;
    if (user) {
      planCode = user.get('planCode');
    }

    let hasHistory = !this.state.isIOS && user && (location.pathname.length > 1);

    let sliderClasses = {
      'navbar': true,
      'navbar-default': true,
      'navbar-fixed-top': true,
      'navbar-hidden': hiddenMode,
      'navbar-fixed-color': pinned || this.state.pinned
      || router.isActive('recherche')
      || router.isActive('compte')
      || router.isActive('couponregister')
    };

    return (
      <nav className={classSet(sliderClasses)} role="navigation">
        {planCode ? <SmartBanner {...apps.params}/> : ''}
        < div className="container-fluid">
          <div className="navbar-header">
            { hasHistory ? <GoBack /> : ''}
            <Link className="navbar-brand" to="/">
              <img src="/images/logo.png" alt="Afrostream.tv"/>
            </Link>
            <UserButton />
          </div>
          {/* User Account button */}
        </div>
      </nav>
    );
  }
}

Header.propTypes = {
  location: React.PropTypes.object.isRequired,
  history: React.PropTypes.object.isRequired,
  pinned: React.PropTypes.bool
};

Header.defaultProps = {
  pinned: false
};


export default withRouter(Header)

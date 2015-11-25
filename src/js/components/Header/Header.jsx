import React ,{PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import UserButton from './../User/UserButton';
import GoBack from './../GoBack/GoBack';
import classSet from 'classnames';

if (process.env.BROWSER) {
  require('./Header.less');
}

@connect(({ Event,User }) => ({Event, User}))
class Header extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static defaultProps = {
    pinned: false
  };

  state = {
    pinned: this.props.pinned,
    isIOS: false
  };

  componentDidMount() {
    window.addEventListener('scroll', this.updatePin.bind(this));
    this.setState({
      isIOS: window.navigator.userAgent.match(/(iPod|iPhone|iPad)/i)
    });
    this.updatePin();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.updatePin.bind(this));
  }

  updatePin() {
    let pin = window.pageYOffset;
    if (pin !== this.state.pinned) {
      this.setState({
        pinned: !!(pin)
      });
    }
  }

  render() {

    const {
      props: {
        Event,
        User
        }
      } = this;

    const hiddenMode = !Event.get('userActive');
    const pinned = Event.get('pinHeader');
    const user = User.get('user');
    let hasHistory = !this.state.isIOS && user && (this.context.router.state.location.pathname.length > 1);

    let notPaying = (this.context.router.state.location.pathname.indexOf('select-plan')  > -1) ? false : true;

    let sliderClasses = {
      'navbar': true,
      'navbar-default': true,
      'navbar-fixed-top': true,
      'navbar-hidden': hiddenMode,
      'navbar-fixed-color': pinned || this.state.pinned
      || this.context.router.isActive('compte')
      || this.context.router.isActive('cancel-subscription')
      || this.context.router.isActive('select-plan')
    };

    return (
      <nav className={classSet(sliderClasses)} role="navigation">
        <div className="container-fluid">
          <div className="navbar-header">
            { (hasHistory && notPaying) ? <GoBack /> : ''}
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

export default Header;

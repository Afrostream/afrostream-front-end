import React ,{PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import UserButton from './../User/UserButton';
import classSet from 'classnames';

if (process.env.BROWSER) {
  require('./Header.less');
}

@connect(({ Event }) => ({Event})) class Header extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static defaultProps = {
    pinned: false
  };

  state = {
    pinned: this.props.pinned
  };

  componentDidMount() {
    window.addEventListener('scroll', this.updatePin.bind(this));
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
        Event
        }
      } = this;

    const hiddenMode = !Event.get('userActive');
    const pinned = Event.get('pinHeader');
    const toggled = Event.get('sideBarToggled');

    let sliderClasses = {
      'navbar': true,
      'navbar-default': true,
      'navbar-fixed-top': true,
      'navbar-hidden': toggled && hiddenMode,
      'navbar-fixed-color': this.state.pinned || pinned || this.context.router.isActive('compte')
    };

    return (
      <nav className={classSet(sliderClasses)} role="navigation">
        <div className="container-fluid">
          <div className="navbar-header">
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

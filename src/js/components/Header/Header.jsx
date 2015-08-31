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

    let sliderClasses = {
      'navbar': true,
      'navbar-default': true,
      'navbar-fixed-top': true,
      'navbar-hidden': this.context.router.isActive('player') && hiddenMode,
      'navbar-fixed-color': this.state.pinned || this.context.router.isActive('compte')
    };

    return (
      <nav className={classSet(sliderClasses)} role="navigation">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse"
                    data-target=".navbar-collapse" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link className="navbar-brand" to="/">
              <img src="/images/logo.png" alt="Afrostream.tv"/>
            </Link>
            {/* User Account button */}

            <div className="navbar-collapse collapse navbar-right">
              <UserButton />
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;

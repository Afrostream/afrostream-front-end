import React ,{PropTypes } from 'react';
import { Link } from 'react-router';
import SearchInput from './../Search/SearchBox';
import UserButton from './../User/UserButton';
import classSet from 'classnames';

if (process.env.BROWSER) {
  require('./Header.less');
}

class Header extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentWillMount() {
    console.log(this.context.router.isActive('compte'));
  }

  render() {

    let sliderClasses = {
      'navbar': true,
      'navbar-default': true,
      'navbar-fixed-top': true,
      'navbar-fixed-color': this.context.router.isActive('compte')
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
            <UserButton />

            <div className="navbar-collapse collapse navbar-right">
              <SearchInput/>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;

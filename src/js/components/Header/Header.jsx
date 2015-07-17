import React from 'react';
import { Link } from 'react-router';
import SearchInput from './../Search/SearchBox';
if (process.env.BROWSER) {
  require('./Header.less');
}
class Header extends React.Component {

  render() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top" role="navigation">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                    data-target="#collapsed-button" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link className="navbar-brand" to="/">
              <img src="/assets/images/logo.png" alt="Afrostream.tv"/>
            </Link>

            <div id="collapsed-button" className="navbar-collapse collapse navbar-right">
              <SearchInput/>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;

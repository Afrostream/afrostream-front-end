import React from 'react';
import { Link } from 'react-router';
import SearchInput from './../Search/SearchBox';
if (process.env.BROWSER) {
  require('./Header.less');
}
class Header extends React.Component {

  render() {
    return (
      <nav className="navbar navbar-fixed-top" role="navigation">
        <div className="container-fluid">
          <div class="navbar-header">
            <Link className="navbar-brand" to="/">
              <img src="/images/logo.png" alt="Afrostream.tv"/>
            </Link>
            <button type="button" class="navbar-toggle" data-toggle="collapse"
                    data-target="#bs-example-navbar-collapse-1">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <SearchInput />
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;

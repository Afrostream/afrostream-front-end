import React from 'react';
import { Link } from 'react-router';
import SearchInput from './../Search/SearchBox';
if (process.env.BROWSER) {
  require('./Header.less');
}
class Header extends React.Component {

  render() {
    return (
      <header className="header">
        <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
          <Link className="pure-menu-heading" to="/">
            <img src="/images/logo.png" alt="Afrostream.tv"/>
          </Link>
          <ul className="pure-menu-list">
            <li className="pure-menu-item pure-menu-selected">
              <Link to="/facebook" className="pure-menu-link">Home</Link>
            </li>
          </ul>
          <SearchInput />
        </div>
      </header>
    );
  }
}

export default Header;

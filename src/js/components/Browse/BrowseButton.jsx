import React from 'react';
import BrowseMenu from './BrowseMenu';

if (process.env.BROWSER) {
  require('./BrowseButton.less');
}

class BrowseButton extends React.Component {

  constructor (props) {
    super(props);
  }

  render () {
    return (
      <li className="pull-right dropdown">
        <a href="#" className="btn-xs btn-browse dropdown-toggle" data-toggle="dropdown"
           role="button">
          <span>PARCOURIR </span>
          <b className="caret"/>
        </a>
        <BrowseMenu />
      </li>)
  }
}

export default BrowseButton;

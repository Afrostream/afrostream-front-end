import React ,{ PropTypes } from 'react';
import config from '../../../../config/';
import classSet from 'classnames';
import { Link } from 'react-router';

if (process.env.BROWSER) {
  require('./SearchBox.less');
}
class SearchBox extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <Link className="search-box" to="recherche"/>
    );
  }
}

export default SearchBox;

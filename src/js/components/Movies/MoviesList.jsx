import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'redux/react';
import * as MoviesActionCreators from '../../actions/movies';
import config from '../../../../config';

if (process.env.BROWSER) {
  require('./MoviesList.less');
}

@connect(({ Movies }) => ({Movies})) class MoviesList extends React.Component {

  render() {
    const {
      props: {
        Movies
        }
      } = this;

    const category = Movies.get(`current`);
    const movies = Movies.get(`category/${category}`);
    const page = Movies.get(`page`);

    return (
      <div className="movies-list">
      </div>
    );
  }
}

export default SlideShow;

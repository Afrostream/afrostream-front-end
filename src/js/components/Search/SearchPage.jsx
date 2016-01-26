'use strict';
import React from 'react';
import ReactDOM from'react-dom';
import { connect } from 'react-redux';
import * as SearchActionCreators from '../../actions/search';
import Thumb from '../../components/Movies/Thumb';
import Spinner from '../Spinner/Spinner';
import {search} from '../../../../config';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

if (process.env.BROWSER) {
  require('./SearchPage.less');
}

@connect(({ Search }) => ({Search}))
class SearchPage extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  renderMovies(movies, fetching) {
    if (!movies || !movies.size) {
      return fetching ? '' : search.dict['noData'];
    }
    return movies.map((movie, i) => <Thumb showImage={true}
                                           key={`search-movie-${movie.get('_id')}-${i}`} {...{movie}} />).toJS();
  }

  render() {
    const {
      props: { Search}
      } = this;

    const moviesFetched = Search.get(`search`);
    const moviesFetching = Search.get(`fetching`);

    let hits;
    let movies;
    if (moviesFetched) {
      hits = moviesFetched.get('hits');
      movies = this.renderMovies(hits, moviesFetching);
    }

    return (
      <ReactCSSTransitionGroup transitionName="search" className="row-fluid search-page" transitionEnterTimeout={300}
                               transitionLeaveTimeout={300} component="div">
        <div className="search-result">
          {moviesFetching ? <div className="spinner-search"><Spinner /></div> : ''}
          {movies}
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}

export default SearchPage;

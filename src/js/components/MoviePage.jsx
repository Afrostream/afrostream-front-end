import React from 'react';
import { prepareRoute } from '../decorators';
import * as MovieActionCreators from '../actions/movie';
import { Link } from 'react-router';
import MovieInfo from './Movies/MovieInfo';
import SeasonList from './Seasons/SeasonList.jsx';

@prepareRoute(async function ({ redux, params: { movie } }) {
  return await * [
      redux.dispatch(MovieActionCreators.getMovie(movie)),
      redux.dispatch(MovieActionCreators.getSeason(movie))
    ];
}) class HomePage extends React.Component {

  render() {
    const {
      props: {
        params: { movie }
        }
      } = this;

    return (
      <div className="row-fluid">
        {movie ? <MovieInfo maxLength="600" active="true" {...{movie}}/> : ''}
        {movie ? <SeasonList {...{movie}}/> : ''}
      </div>
    );
  }
}

export default HomePage;
